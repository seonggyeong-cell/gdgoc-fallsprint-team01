// schoolmoa/api/inha-notices.ts (Vercel Serverless Function - Node 런타임)
// [담당: 역할 A] 인하대 공지 크롤러

interface InhaNoticeItem {
  id: string;
  title: string;
  category: 'academic';
  subcategory: string;
  organizer: string;
  source: 'inha';
  officialUrl: string;
  benefit: string;
  startDate?: string;
  deadline?: string;
  isOngoing: boolean;
  summary: string;
  tags: string[];
  views: number;
  bookmarkedCount: number;
  createdAt: string;
  isUserSubmitted: boolean;
}

const FALLBACK_NOTICES: InhaNoticeItem[] = [
  {
    id: 'inha-crawler-01',
    title: '수강정정 기간 및 분반 신청 안내',
    category: 'academic',
    subcategory: '수강',
    organizer: '학사지원팀',
    source: 'inha',
    officialUrl: 'https://www.inha.ac.kr/kr/952/subview.do',
    benefit: '수강 정정 가능',
    isOngoing: true,
    summary: '수강정정 기간 내 포털에서 수강 과목을 정정할 수 있습니다.',
    tags: ['수강정정', '학사'],
    views: 4520,
    bookmarkedCount: 310,
    createdAt: new Date().toISOString().split('T')[0],
    isUserSubmitted: false,
  },
  {
    id: 'inha-crawler-02',
    title: '2026학년도 교내·외 장학금 신청 일정 안내',
    category: 'academic',
    subcategory: '장학·등록',
    organizer: '학생지원팀',
    source: 'inha',
    officialUrl: 'https://www.inha.ac.kr/kr/952/subview.do',
    benefit: '장학금 혜택',
    isOngoing: true,
    summary: '교내·외 장학금 신청 및 지급 기준 안내문입니다.',
    tags: ['장학금', '등록금'],
    views: 3890,
    bookmarkedCount: 420,
    createdAt: new Date().toISOString().split('T')[0],
    isUserSubmitted: false,
  },
  {
    id: 'inha-crawler-03',
    title: '졸업 사정 및 학위수여식 일정 공지',
    category: 'academic',
    subcategory: '학사',
    organizer: '교무처',
    source: 'inha',
    officialUrl: 'https://www.inha.ac.kr/kr/952/subview.do',
    benefit: '졸업 요건 확인',
    isOngoing: false,
    summary: '졸업 사정 결과 확인 및 졸업 관련 일정 안내입니다.',
    tags: ['졸업', '학위'],
    views: 2900,
    bookmarkedCount: 150,
    createdAt: new Date().toISOString().split('T')[0],
    isUserSubmitted: false,
  },
];

function parseInhaNotices(html: string): InhaNoticeItem[] {
  const items: InhaNoticeItem[] = [];
  // 인하대 공지 게시판 HTML 패턴 매칭 (제목 및 게시글 ID/링크 추출)
  // 예: <td class="_artclTdTitle"> <a href="..."> <strong>제목</strong> ...
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let match: RegExpExecArray | null;

  while ((match = rowRegex.exec(html)) !== null) {
    const row = match[1];
    if (!row.includes('_artclTdTitle')) continue;

    const titleMatch = row.match(/<strong>([^<]+)<\/strong>/i) || row.match(/<a[^>]*class="[^"]*artclLink[^"]*"[^>]*>([^<]+)<\/a>/i);
    const linkMatch = row.match(/href="([^"]+)"/i);
    const dateMatch = row.match(/<td[^>]*class="_artclTdRdate"[^>]*>([\d\.\-]+)<\/td>/i);
    const writerMatch = row.match(/<td[^>]*class="_artclTdWriter"[^>]*>([^<]+)<\/td>/i);

    if (titleMatch) {
      const title = titleMatch[1].trim();
      const rawLink = linkMatch ? linkMatch[1] : '';
      const officialUrl = rawLink.startsWith('http') ? rawLink : `https://www.inha.ac.kr${rawLink}`;
      const dateStr = dateMatch ? dateMatch[1].trim().replace(/\./g, '-') : new Date().toISOString().split('T')[0];
      const organizer = writerMatch ? writerMatch[1].trim() : '인하대';

      items.push({
        id: `inha-${Date.now()}-${items.length}`,
        title,
        category: 'academic',
        subcategory: '학사',
        organizer,
        source: 'inha',
        officialUrl,
        benefit: '학교 공지사항 확인',
        isOngoing: true,
        summary: title,
        tags: ['인하대', '공지'],
        views: 100 + items.length * 15,
        bookmarkedCount: 10,
        createdAt: dateStr,
        isUserSubmitted: false,
      });
    }
  }

  return items.length > 0 ? items : FALLBACK_NOTICES;
}

export default async function handler(req: any, res: any) {
  try {
    const response = await fetch('https://www.inha.ac.kr/kr/952/subview.do', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Inha notice fetch failed with status ${response.status}`);
    }

    const html = await response.text();
    const notices = parseInhaNotices(html);

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // 1시간 캐시
    return res.status(200).json(notices);
  } catch (error) {
    console.error('Crawler failed, serving fallback notices:', error);
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    return res.status(200).json(FALLBACK_NOTICES);
  }
}

