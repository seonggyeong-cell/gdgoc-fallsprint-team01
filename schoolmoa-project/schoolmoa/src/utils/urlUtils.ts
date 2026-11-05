// [공유] 외부 URL 검증 + 공고 링크 해석 유틸리티
import type { NoticeItem } from '@/types';

// ───────── 보안: 외부 URL 검증 (XSS 방지) ─────────
// javascript:, data:, vbscript: 등의 악성 프로토콜을 차단하고 http/https만 허용합니다.
export function sanitizeUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  // http:// 또는 https:// 로 시작하는 정규 URL만 통과
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return '#';
}

export function isValidHttpUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  return /^https?:\/\//i.test(url.trim());
}

// ───────── 공고 링크 해석 ─────────
// 인하대 공지 게시판 목록 (K2Web Wizard 게시판 8번 = 홈페이지 공지사항, 글 주소: /bbs/kr/8/{글번호}/artclView.do)
export const INHA_NOTICE_BOARD_URL = 'https://www.inha.ac.kr/bbs/kr/8/artclList.do';

/** 주소가 '사이트 메인(경로 없음)'인지 판단 */
function isBareHomepage(url: string): boolean {
  try {
    const u = new URL(url);
    return (u.pathname === '/' || u.pathname === '') && !u.search && !u.hash;
  } catch {
    return false;
  }
}

/** 검색용 키워드: 첫 태그 > 세부분야 > 제목 */
function searchKeyword(n: Pick<NoticeItem, 'tags' | 'subcategory' | 'title'>): string {
  return (n.tags?.[0] || n.subcategory || n.title || '').trim();
}

/**
 * 공고 링크 결정:
 * 1) 개별 공고 주소(경로가 있는 주소)는 그대로 사용 — 크롤러/제보/DB에 구체 주소가 있으면 항상 이게 우선
 * 2) 사이트 메인 주소만 있는 공고는 해당 사이트의 '공지 게시판/검색 결과' 화면으로 보냄
 */
export function resolveNoticeUrl(
  n: Pick<NoticeItem, 'officialUrl' | 'source' | 'title' | 'subcategory' | 'tags'>,
): string {
  const safe = sanitizeUrl(n.officialUrl);
  if (safe === '#' || !isBareHomepage(safe)) return safe;

  const q = encodeURIComponent(searchKeyword(n));
  switch (n.source) {
    case 'inha':
      return INHA_NOTICE_BOARD_URL;
    case 'saramin':
      return q ? `https://www.saramin.co.kr/zf_user/search?searchType=search&searchword=${q}` : safe;
    case 'jobkorea':
      return q ? `https://www.jobkorea.co.kr/Search/?stext=${q}` : safe;
    case 'dacon':
      return 'https://dacon.io/competitions';
    case 'wevity':
      return 'https://www.wevity.com/?c=find&s=1&gub=1';
    default:
      return safe;
  }
}