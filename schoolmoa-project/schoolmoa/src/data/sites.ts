// [담당: 역할 A] 사이트 모음 데이터 — 팀이 체크한 외부 사이트 14곳의 소개·링크
// 공식 API가 있는 곳은 hasApi: true (서버·DB 도입 후 공고 자동 수집 대상). 나머지는 링크 카드로만 연결합니다.
// 모집 시기·참여 조건은 바뀔 수 있으니 발표 전에 각 사이트에서 한 번 확인하세요.
import type { SiteLink } from '@/types';

export const SITE_LINKS: SiteLink[] = [
  // 1. 국비지원 학습
  {
    id: 'hrd', name: '직업훈련포털 HRD-Net', org: '고용노동부·한국산업인력공단', group: 'gov_training',
    url: 'https://www.hrd.go.kr',
    description: '국민내일배움카드로 수강할 수 있는 정부 지원 직업훈련 과정을 검색하고 신청합니다. 현재는 고용24로 통합되어 운영됩니다.',
    tags: ['국비지원', '내일배움카드', '직업훈련'],
    note: '과정 신청 전 국민내일배움카드 발급이 필요합니다.',
  },
  {
    id: 'kisa-academy', name: 'KISA 아카데미', org: '한국인터넷진흥원', group: 'gov_training',
    url: 'https://academy.kisa.or.kr',
    description: '한국인터넷진흥원이 운영하는 정보보호·보안 교육 플랫폼입니다. 보안 분야 온라인·오프라인 교육을 제공합니다.',
    tags: ['보안', '정보보호', '무료교육'],
  },
  {
    id: 'ssafy', name: '삼성 청년 SW·AI 아카데미 SSAFY', org: '삼성', group: 'gov_training',
    url: 'https://www.ssafy.com',
    description: '삼성이 운영하는 청년 SW·AI 교육 프로그램입니다. 교육지원금을 받으며 실무 프로젝트 중심으로 학습합니다.',
    tags: ['SW개발', 'AI', '교육지원금'],
    note: '모집은 연 몇 차례만 진행됩니다. 일정은 공식 사이트 공지를 확인하세요.',
  },
  {
    id: 'codeit-sprint', name: '코드잇 스프린트', org: '코드잇', group: 'gov_training',
    url: 'https://sprint.codeit.kr',
    description: '코드잇이 운영하는 K-디지털 트레이닝(KDT) 부트캠프입니다. 국민내일배움카드로 참여하는 국비지원 과정입니다.',
    tags: ['KDT', '부트캠프', '국비지원'],
  },

  // 2. 강의를 구매해서 듣는 곳
  {
    id: 'inflearn', name: '인프런', org: '인프랩', group: 'paid_course',
    url: 'https://www.inflearn.com',
    description: '개발·데이터·디자인 등 실무 강의를 구매해 수강하는 온라인 강의 플랫폼입니다. 무료 강의도 다수 있습니다.',
    tags: ['개발', '데이터', '온라인강의'],
  },
  {
    id: 'class101', name: '클래스101', org: '클래스101', group: 'paid_course',
    url: 'https://class101.net',
    description: '취미부터 커리어까지 다양한 온라인 클래스를 수강할 수 있는 플랫폼입니다.',
    tags: ['취미', '커리어', '온라인강의'],
  },

  // 3. 국비지원이 아닌 무료 학습
  {
    id: 'kmooc', name: 'K-MOOC', org: '국가평생교육진흥원', group: 'free_study',
    url: 'https://www.kmooc.kr',
    description: '대학 수준의 강좌를 누구나 무료로 수강하는 한국형 온라인 공개강좌입니다. 이수 기준을 충족하면 이수증이 발급됩니다.',
    tags: ['무료강의', '대학강의', '이수증'],
    hasApi: true,
  },
  {
    id: 'kocw', name: 'KOCW', org: '한국교육학술정보원', group: 'free_study',
    url: 'http://www.kocw.net',
    description: '국내 대학의 공개 강의를 무료로 볼 수 있는 서비스입니다. 전공 과목 예습·복습에 활용할 수 있습니다.',
    tags: ['무료강의', '대학강의', '전공'],
    hasApi: true,
  },

  // 4. 인턴십·취업
  {
    id: 'linkareer', name: '링커리어', org: '링커리어', group: 'career',
    url: 'https://linkareer.com',
    description: '대학생을 위한 대외활동·공모전·인턴·신입 공고와 합격 자기소개서를 제공하는 커리어 플랫폼입니다.',
    tags: ['대외활동', '공모전', '인턴', '자소서'],
  },
  {
    id: 'wanted', name: '원티드', org: '원티드랩', group: 'career',
    url: 'https://www.wanted.co.kr',
    description: 'IT·스타트업 채용 공고가 많은 채용 플랫폼입니다.',
    tags: ['스타트업', 'IT', '채용'],
    hasApi: true,
  },
  {
    id: 'theteams', name: '더팀스', org: '더팀스', group: 'career',
    url: 'https://www.theteams.kr',
    description: '스타트업 채용 플랫폼으로, 인턴 공고 게시판을 별도로 운영합니다.',
    tags: ['스타트업', '인턴'],
  },
  {
    id: 'youthcenter', name: '온통청년', org: '국무조정실·한국고용정보원', group: 'career',
    url: 'https://www.youthcenter.go.kr',
    description: '정부와 지자체의 청년정책(일자리·교육·주거·지원금)을 한곳에서 찾을 수 있는 포털입니다.',
    tags: ['청년정책', '지원금', '일자리'],
    hasApi: true,
  },
  {
    id: 'youth-work', name: '청년일경험포털', org: '고용노동부', group: 'career',
    url: 'https://yw.work24.go.kr',
    description: '미래내일 일경험(인턴형·프로젝트형 등) 프로그램을 검색하고 신청할 수 있습니다. 참여 수당이 지급되는 프로그램이 많습니다.',
    tags: ['일경험', '인턴', '수당'],
    note: '만 15~34세 미취업 청년이 대상입니다(군 복무 기간만큼 연장).',
  },
  {
    id: 'kotra', name: 'KOTRA 채용', org: '대한무역투자진흥공사', group: 'career',
    url: 'https://kotra.applyin.co.kr',
    description: '대한무역투자진흥공사의 채용·인턴 공고 페이지입니다.',
    tags: ['공공기관', '무역', '인턴'],
    note: 'KOTRA 공고는 공공기관 채용정보(잡알리오) API로 받을 수 있습니다.',
    hasApi: true,
  },
];
