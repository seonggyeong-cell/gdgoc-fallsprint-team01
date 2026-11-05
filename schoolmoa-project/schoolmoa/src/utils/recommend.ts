// [담당: 역할 B] 맞춤 추천 로직. 점수 규칙을 바꾸려면 이 파일만 수정하면 됩니다.
//
// 점수 = 희망 진로 + 학과 + 우선 보는 공고 분야 (+ LLM 등 외부 점수)
//  - 희망 진로: 공고에 careerFields가 있으면 확정 일치, 없으면 제목·태그·요약의 키워드로 추정
//  - 점수가 높을수록 '맞춤 추천순' 정렬에서 위로 올라옵니다.
import { CAREER_LABELS, CATEGORY_LABELS, CLOSING_SOON_DAYS } from '@/config/constants';
import type { CareerField, NoticeItem, UserProfile } from '@/types';
import { calculateDDay } from './dateUtils';

export interface Recommendation {
  notice: NoticeItem;
  score: number;
  reasons: string[];
}

/** 외부(예: LLM) 점수. 공고 id → 추가 점수. 팀원이 LLM을 붙이면 이 맵만 만들어서 넘기면 합산됩니다. */
export type ExtraScores = Map<string, { score: number; reason?: string }>;

/** 점수표 — 숫자만 바꾸면 우선순위 비중이 바뀝니다. */
export const SCORE = {
  interestCategory: 4,   // '우선 보고 싶은 공고 분야'와 같은 분야
  careerExplicit: 5,     // 공고에 지정된 진로(careerFields)와 희망 진로가 일치
  careerKeyword: 3,      // 키워드 1개 일치
  careerKeywordMulti: 4, // 키워드 2개 이상 일치
  majorTarget: 3,        // 공고가 지정한 학과 키워드(majors)에 내 학과가 해당
  majorField: 2,         // 내 학과 계열의 키워드와 일치
  closingSoon: 1,        // 마감 7일 이내 (이미 점수가 있는 공고에만 가산)
} as const;

/** 희망 진로별 키워드 (공고의 careerFields가 비어 있어도 추정할 수 있게 함). 영문/숫자는 단어 경계로 비교합니다. */
export const CAREER_KEYWORDS: Record<CareerField, string[]> = {
  software: ['개발', '소프트웨어', 'sw', '프로그래', '코딩', '백엔드', '프론트', '웹', '앱', '해커톤', 'it', '서버', '클라우드', '보안', '정보보호', '개발자'],
  ai: ['ai', '인공지능', '머신러닝', '딥러닝', '데이터', 'llm', '생성형', '빅데이터', '분석'],
  engineering: ['전기', '전자', '기계', '공학', '제조', '반도체', '로봇', '자동차', '건설', '설비', '엔지니어', '산업'],
  science: ['연구', '실험', '과학', '바이오', '화학', '물리', '생명', '수학', 'ra', '대학원'],
  business: ['경영', '마케팅', '기획', '금융', '회계', '영업', '창업', '스타트업', '컨설팅', '재무', '증권'],
  design: ['디자인', '영상', '콘텐츠', 'ux', 'ui', '그래픽', '미디어', '브랜드', '포스터'],
  public: ['공공', '행정', '복지', '봉사', '정책', '공기업', '청년', '비영리', 'ngo', '사회'],
  education: ['교육', '멘토링', '강의', '교사', '튜터', '학습', '과외'],
  global: ['국제', '해외', '글로벌', '무역', '통상', '어학', '영어', '토익', '교환', '외국'],
};

/** 학과명에 포함된 단어 → 관련 진로 분야 */
const DEPT_FIELDS: { words: string[]; fields: CareerField[] }[] = [
  { words: ['컴퓨터', '소프트웨어', '정보통신', '임베디드', '정보'], fields: ['software'] },
  { words: ['인공지능', '데이터', '통계'], fields: ['ai', 'software'] },
  { words: ['전기', '전자', '기계', '건축', '토목', '신소재', '조선', '항공', '산업경영', '화학공학', '환경공학'], fields: ['engineering'] },
  { words: ['수학', '물리', '화학', '생명', '해양', '식품', '과학'], fields: ['science'] },
  { words: ['경영', '경제', '회계', '금융', '관광'], fields: ['business'] },
  { words: ['디자인', '미디어', '영상', '예술'], fields: ['design'] },
  { words: ['행정', '복지', '정책', '정치', '법'], fields: ['public'] },
  { words: ['교육'], fields: ['education'] },
  { words: ['국제', '통상', '영어', '중국', '일본', '불어', '독일'], fields: ['global'] },
];

export const hasProfileInfo = (p: UserProfile | null | undefined) =>
  !!p && (p.department.trim() !== '' || p.careerFields.length > 0 || p.interestCategories.length > 0);

// ───────── 키워드 매칭 ─────────
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function matchesKeyword(text: string, kw: string): boolean {
  if (/^[a-z0-9]+$/.test(kw)) {
    // 'ai'가 'training' 안에서 잡히지 않도록 영문·숫자 키워드는 단어 경계로 검사
    return new RegExp(`(^|[^a-z0-9])${escapeRegExp(kw)}($|[^a-z0-9])`).test(text);
  }
  return text.includes(kw);
}

const countHits = (text: string, keywords: string[]) => keywords.filter((k) => matchesKeyword(text, k)).length;

const haystackOf = (n: NoticeItem) =>
  [n.title, n.subcategory, n.organizer, n.benefit, n.summary, n.description ?? '', ...(n.tags ?? [])].join(' ').toLowerCase();

function fieldsFromDepartment(dept: string): CareerField[] {
  const out = new Set<CareerField>();
  for (const { words, fields } of DEPT_FIELDS) {
    if (words.some((w) => dept.includes(w))) fields.forEach((f) => out.add(f));
  }
  return Array.from(out);
}

// ───────── 점수 계산 ─────────
export function scoreNotice(
  notice: NoticeItem,
  profile: UserProfile,
  extra?: { score: number; reason?: string },
): { score: number; reasons: string[] } {
  const text = haystackOf(notice);
  const dept = profile.department.trim();
  const explicit = new Set(notice.careerFields ?? []);
  let score = 0;
  const reasons: string[] = [];

  // 1) 희망 진로
  for (const field of profile.careerFields) {
    if (explicit.has(field)) {
      score += SCORE.careerExplicit;
      reasons.push(`희망 진로(${CAREER_LABELS[field]})와 관련`);
      continue;
    }
    const hits = countHits(text, CAREER_KEYWORDS[field]);
    if (hits > 0) {
      score += hits >= 2 ? SCORE.careerKeywordMulti : SCORE.careerKeyword;
      reasons.push(`희망 진로(${CAREER_LABELS[field]}) 키워드 일치`);
    }
  }

  // 2) 학과
  if (dept) {
    if (notice.majors?.some((m) => dept.includes(m))) {
      score += SCORE.majorTarget;
      reasons.push(`${dept} 관련 공고`);
    } else if (fieldsFromDepartment(dept).some((f) => explicit.has(f) || countHits(text, CAREER_KEYWORDS[f]) > 0)) {
      score += SCORE.majorField;
      reasons.push(`${dept} 계열과 관련`);
    }
  }

  // 3) 우선 보고 싶은 공고 분야
  if (profile.interestCategories.includes(notice.category)) {
    score += SCORE.interestCategory;
    reasons.push(`관심 분야(${CATEGORY_LABELS[notice.category]})`);
  }

  // 4) 외부 점수 (LLM 등)
  if (extra && extra.score > 0) {
    score += extra.score;
    if (extra.reason) reasons.push(extra.reason);
  }

  return { score, reasons };
}

/** 학과·희망 진로·관심 분야와 맞는 공고를 점수순으로 반환 (마감된 공고·점수 0 공고 제외) */
export function recommendNotices(
  notices: NoticeItem[],
  profile: UserProfile | null,
  extraScores?: ExtraScores,
): Recommendation[] {
  if (!profile || !hasProfileInfo(profile)) return [];

  const result: Recommendation[] = [];
  for (const notice of notices) {
    const dday = calculateDDay(notice.deadline, notice.isOngoing);
    if (dday.status === 'closed') continue;

    const { score: base, reasons } = scoreNotice(notice, profile, extraScores?.get(notice.id));
    if (base === 0) continue;

    let score = base;
    if (!notice.isOngoing && dday.diffDays <= CLOSING_SOON_DAYS) {
      score += SCORE.closingSoon;
      reasons.push('마감 임박');
    }
    result.push({ notice, score, reasons });
  }

  return result.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const dA = a.notice.deadline ?? '9999-12-31';
    const dB = b.notice.deadline ?? '9999-12-31';
    return dA.localeCompare(dB);
  });
}

/** 추천 결과 → 공고 id별 점수 맵 (정렬에 사용) */
export const buildScoreMap = (recs: Recommendation[]): Map<string, number> =>
  new Map(recs.map((r) => [r.notice.id, r.score]));