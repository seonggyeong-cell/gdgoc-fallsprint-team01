// schoolmoa/api/inha-notices.ts (Vercel Serverless Function - Node 런타임)
// [담당: 역할 A] 인하대 공지 크롤러
//
// 수집 대상: 인하대 홈페이지 공지사항 게시판 (K2Web Wizard 게시판)
//   목록 주소: https://www.inha.ac.kr/bbs/kr/8/artclList.do
//   글 주소  : https://www.inha.ac.kr/bbs/kr/8/{글번호}/artclView.do   ← 각 공고는 이 주소로 바로 연결됩니다.
// 게시판 구조가 바뀌어 한 건도 못 읽으면, 기존 주소(kr/952/subview.do)를 한 번 더 시도하고,
// 그래도 안 되면 공지 게시판 목록으로 연결되는 대체 데이터를 반환합니다.

type Category = 'work' | 'career' | 'scholarship' | 'competition' | 'activity' | 'support' | 'academic';

interface InhaNoticeItem {
  id: string;
  title: string;
  category: Category;
  subcategory: string;
  organizer: string;
  source: 'inha';
  officialUrl: string;
  benefit: string;
  startDate: string;
  deadline?: string;
  isOngoing: boolean;
  summary: string;
  tags: string[];
  views: number;
  bookmarkedCount: number;
  createdAt: string;
  isUserSubmitted: boolean;
}

const ORIGIN = 'https://www.inha.ac.kr';
const BOARD_LIST_URL = `${ORIGIN}/bbs/kr/8/artclList.do`;
const LEGACY_LIST_URL = `${ORIGIN}/kr/952/subview.do`;
const MAX_ITEMS = 30;
const FETCH_TIMEOUT_MS = 8000;

const todayISO = () => new Date().toISOString().split('T')[0];

// ───────── 대체(fallback) 데이터: 공지 게시판 목록으로 연결 ─────────
const FALLBACK_NOTICES: InhaNoticeItem[] = [
  { title: '수강정정 기간 및 분반 신청 안내', subcategory: '수강', organizer: '학사지원팀', benefit: '수강 정정 가능', summary: '수강정정 기간 내 포털에서 수강 과목을 정정할 수 있습니다.', tags: ['수강정정', '학사'] },
  { title: '교내·외 장학금 신청 일정 안내', subcategory: '장학·등록', organizer: '학생지원팀', benefit: '장학금 혜택', summary: '교내·외 장학금 신청 및 지급 기준 안내문입니다.', tags: ['장학금', '등록금'] },
  { title: '졸업 사정 및 학위수여식 일정 공지', subcategory: '학사', organizer: '교무처', benefit: '졸업 요건 확인', summary: '졸업 사정 결과 확인 및 졸업 관련 일정 안내입니다.', tags: ['졸업', '학위'] },
].map((n, i) => ({
  id: `inha-fallback-${i + 1}`,
  category: 'academic' as Category,
  source: 'inha' as const,
  officialUrl: BOARD_LIST_URL,
  startDate: todayISO(),
  isOngoing: true,
  views: 0,
  bookmarkedCount: 0,
  createdAt: todayISO(),
  isUserSubmitted: false,
  ...n,
}));

// ───────── HTML 유틸 ─────────
function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/gi, '&');
}

const stripTags = (html: string) => decodeEntities(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

function cellText(row: string, className: string): string {
  const m = row.match(new RegExp(`<td[^>]*class="[^"]*${className}[^"]*"[^>]*>([\\s\\S]*?)</td>`, 'i'));
  return m ? stripTags(m[1]) : '';
}

// ───────── 날짜 ─────────
function parsePostedDate(text: string): string {
  const m = text.match(/(\d{4})\s*[.\-/]\s*(\d{1,2})\s*[.\-/]\s*(\d{1,2})/);
  if (!m) return todayISO();
  return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
}

/** 제목 속 마감일 추출: "(~10/16)", "(10/6-10/16)", "(8. 4 ~ 10)" 등. 못 찾으면 undefined */
function extractDeadline(title: string, postedISO: string): string | undefined {
  const [py, pm] = postedISO.split('-').map(Number);
  let month: number | undefined;
  let day: number | undefined;

  let m = title.match(/(\d{1,2})\s*[./]\s*(\d{1,2})\s*[~\-–]\s*(\d{1,2})\s*[./]\s*(\d{1,2})/); // 10/6-10/16
  if (m) { month = Number(m[3]); day = Number(m[4]); }
  if (!month) {
    m = title.match(/(\d{1,2})\s*[./]\s*(\d{1,2})\s*[~\-–]\s*(\d{1,2})(?![./\d])/); // 8. 4 ~ 10
    if (m) { month = Number(m[1]); day = Number(m[3]); }
  }
  if (!month) {
    m = title.match(/~\s*(\d{1,2})\s*[./]\s*(\d{1,2})/); // ~10/16
    if (m) { month = Number(m[1]); day = Number(m[2]); }
  }
  if (!month || !day || month < 1 || month > 12 || day < 1 || day > 31) return undefined;

  const year = month < pm ? py + 1 : py; // 게시월보다 앞선 달이면 다음 해로 해석
  const d = new Date(year, month - 1, day);
  if (d.getMonth() !== month - 1) return undefined; // 2/30 같은 잘못된 날짜
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// ───────── 분류: 제목 키워드로 우리 사이트 카테고리에 배정 ─────────
function classify(title: string): { category: Category; subcategory: string; tags: string[] } {
  const t = title;
  const tags = ['인하대', '공지'];
  const has = (re: RegExp) => re.test(t);

  if (has(/근로\s*장학|근로학생|교내\s*근로/)) return { category: 'work', subcategory: '교내 근로장학', tags: [...tags, '근로장학'] };
  if (has(/연구보조|행정\s*보조|조교\s*(모집|선발)/)) return { category: 'work', subcategory: '교내 행정·연구 보조', tags: [...tags, '연구보조'] };

  if (has(/인턴|현장실습|채용|취업|일경험|직무/)) {
    if (has(/현장실습/)) return { category: 'career', subcategory: '현장실습', tags: [...tags, '현장실습'] };
    if (has(/설명회|박람회|채용\s*행사/)) return { category: 'career', subcategory: '채용설명회·박람회', tags: [...tags, '취업'] };
    if (has(/특강|멘토/)) return { category: 'career', subcategory: '직무 멘토링', tags: [...tags, '취업'] };
    if (has(/인턴/)) return { category: 'career', subcategory: '인턴십', tags: [...tags, '인턴'] };
    return { category: 'career', subcategory: '채용공고', tags: [...tags, '채용'] };
  }

  if (has(/등록금|납부|분납|고지서|등록\s*안내/)) return { category: 'academic', subcategory: '장학·등록', tags: [...tags, '등록금'] };
  if (has(/장학/)) {
    let sub = '특성화';
    if (has(/국가|소득|한국장학재단/)) sub = '소득연계';
    else if (has(/재단|기업|외부|민간/)) sub = '외부재단·기업';
    else if (has(/성적|우수/)) sub = '성적우수';
    return { category: 'scholarship', subcategory: sub, tags: [...tags, '장학금'] };
  }

  if (has(/공모전|해커톤|경진|대회|콘테스트|창업/)) {
    let sub = '아이디어·기획';
    if (has(/해커톤/)) sub = '해커톤';
    else if (has(/창업/)) sub = '창업';
    else if (has(/AI|인공지능|데이터/i)) sub = 'AI·데이터';
    else if (has(/디자인|영상/)) sub = '디자인·영상';
    return { category: 'competition', subcategory: sub, tags: [...tags, '공모전'] };
  }

  if (has(/봉사/)) return { category: 'activity', subcategory: '봉사활동', tags: [...tags, '봉사'] };
  if (has(/서포터즈|대외활동/)) return { category: 'activity', subcategory: '서포터즈', tags: [...tags, '대외활동'] };
  if (has(/동아리/)) return { category: 'activity', subcategory: '동아리·소모임', tags: [...tags, '동아리'] };
  if (has(/교환학생|해외\s*(파견|연수)|어학연수/)) return { category: 'activity', subcategory: '해외·교환', tags: [...tags, '교환학생'] };

  if (has(/어학|토익|자격증|응시료/)) return { category: 'support', subcategory: '자격증·어학', tags: [...tags, '어학'] };
  if (has(/상담|진로/)) return { category: 'support', subcategory: '상담·진로', tags: [...tags, '진로'] };

  if (has(/수강/)) return { category: 'academic', subcategory: '수강', tags: [...tags, '수강'] };
  if (has(/특강|설명회|세미나|행사|포럼|축제/)) return { category: 'academic', subcategory: '행사·특강', tags: [...tags, '행사'] };
  if (has(/시설|도서관|주차|기숙사|공사|출입/)) return { category: 'academic', subcategory: '시설', tags: [...tags, '시설'] };
  return { category: 'academic', subcategory: '학사', tags };
}

// ───────── 목록 파싱 ─────────
const ARTICLE_HREF = /href\s*=\s*["']([^"']*\/bbs\/([a-z0-9_]+)\/(\d+)\/(\d+)\/artclView\.do[^"']*)["']/i;

function parseNoticeRows(html: string): InhaNoticeItem[] {
  const items: InhaNoticeItem[] = [];
  const seen = new Set<string>();
  const rowRegex = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
  let match: RegExpExecArray | null;

  while ((match = rowRegex.exec(html)) !== null && items.length < MAX_ITEMS) {
    const row = match[1];
    const href = row.match(ARTICLE_HREF);
    if (!href) continue;

    const [, , siteKey, boardNo, articleNo] = href;
    // 쿼리스트링(layout 등)을 떼고 '글 직접 주소'만 사용 → 클릭하면 해당 공지로 바로 이동
    const officialUrl = `${ORIGIN}/bbs/${siteKey}/${boardNo}/${articleNo}/artclView.do`;
    if (seen.has(officialUrl)) continue;

    const anchor = row.match(
      new RegExp(`<a\\b([^>]*href\\s*=\\s*["'][^"']*/bbs/${siteKey}/${boardNo}/${articleNo}/artclView\\.do[^"']*["'][^>]*)>([\\s\\S]*?)</a>`, 'i'),
    );
    const titleAttr = anchor?.[1].match(/title\s*=\s*["']([^"']+)["']/i)?.[1] ?? '';
    const title = (stripTags(anchor?.[2] ?? '') || decodeEntities(titleAttr))
      .replace(/^(새글|NEW)\s+/i, '') // 제목 앞의 '새글' 표시 제거
      .replace(/\s+(새글|NEW)$/i, '') // 제목 뒤의 '새글' 표시 제거
      .trim();
    if (!title) continue;
    seen.add(officialUrl);

    const postedISO = parsePostedDate(cellText(row, '_artclTdRdate'));
    const writer = cellText(row, '_artclTdWriter') || '인하대학교';
    const views = Number(cellText(row, '_artclTdAccess').replace(/[^\d]/g, '')) || 0;
    const deadline = extractDeadline(title, postedISO);
    const { category, subcategory, tags } = classify(title);

    items.push({
      id: `inha-${boardNo}-${articleNo}`, // 같은 공지는 언제나 같은 id → 북마크가 유지됩니다
      title,
      category,
      subcategory,
      organizer: writer,
      source: 'inha',
      officialUrl,
      benefit: '공지 내용 확인',
      startDate: postedISO,
      deadline,
      isOngoing: !deadline,
      summary: `${writer} · ${postedISO.replace(/-/g, '.')} 게시`,
      tags,
      views,
      bookmarkedCount: 0,
      createdAt: postedISO,
      isUserSubmitted: false,
    });
  }
  return items;
}

// ───────── 수집 ─────────
async function fetchText(url: string): Promise<string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9',
      },
      signal: ctrl.signal,
    });
    if (!response.ok) throw new Error(`status ${response.status}`);
    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

async function crawl(): Promise<InhaNoticeItem[]> {
  for (const url of [BOARD_LIST_URL, LEGACY_LIST_URL]) {
    try {
      const items = parseNoticeRows(await fetchText(url));
      if (items.length > 0) return items;
      console.warn(`[inha-notices] ${url}: 공지 글 링크를 찾지 못했습니다(게시판 구조 변경 가능성).`);
    } catch (e) {
      console.warn(`[inha-notices] ${url} 수집 실패`, e);
    }
  }
  return [];
}

export default async function handler(_req: any, res: any) {
  try {
    const notices = await crawl();
    if (notices.length === 0) {
      res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
      return res.status(200).json(FALLBACK_NOTICES);
    }
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // 1시간 캐시
    return res.status(200).json(notices);
  } catch (error) {
    console.error('Crawler failed, serving fallback notices:', error);
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    return res.status(200).json(FALLBACK_NOTICES);
  }
}