export interface InhaDepartment {
  id: string;
  name: string;
  college: string;
  shortName: string;
  badgeClass: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export const INHA_COLLEGES = [
  '전체 학과',
  '공과대학',
  '경영대학',
  '자연과학대학',
  '소프트웨어융합대학',
] as const;

export const INHA_DEPARTMENTS: InhaDepartment[] = [
  {
    id: 'mech',
    name: '기계공학과',
    college: '공과대학',
    shortName: '기계공',
    badgeClass: 'bg-[#FFF7ED] text-[#C2410C] border-[#FDBA74]',
    color: '#C2410C',
    bgColor: '#FFF7ED',
    borderColor: '#FDBA74',
    description: '스마트모빌리티, 열유체, 공조냉동, 기계설계, 자율주행 캡스톤',
  },
  {
    id: 'business',
    name: '경영학과',
    college: '경영대학',
    shortName: '경영',
    badgeClass: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#93C5FD]',
    color: '#1D4ED8',
    bgColor: '#EFF6FF',
    borderColor: '#93C5FD',
    description: '블룸버그 터미널, 금융데이터, 경영전략, 비즈니스 분석, 학술제',
  },
  {
    id: 'physics',
    name: '물리학과',
    college: '자연과학대학',
    shortName: '물리',
    badgeClass: 'bg-[#FAF5FF] text-[#7E22CE] border-[#D8B4FE]',
    color: '#7E22CE',
    bgColor: '#FAF5FF',
    borderColor: '#D8B4FE',
    description: '양자물리, 나노광학, 응집물질, 랩 로테이션, 수리물리 튜터링',
  },
  {
    id: 'energy',
    name: '에너지자원공학과',
    college: '공과대학',
    shortName: '에너지자원',
    badgeClass: 'bg-[#FEFCE8] text-[#A16207] border-[#FDE047]',
    color: '#A16207',
    bgColor: '#FEFCE8',
    borderColor: '#FDE047',
    description: '신재생에너지, 지하자원 AI탐사, 탄소중립 CCUS, 자원경제',
  },
  {
    id: 'cse',
    name: '컴퓨터공학과',
    college: '소프트웨어융합대학',
    shortName: '컴공',
    badgeClass: 'bg-[#ECFDF5] text-[#047857] border-[#6EE7B7]',
    color: '#047857',
    bgColor: '#ECFDF5',
    borderColor: '#6EE7B7',
    description: 'AI에이전트, 해커톤, H100 슈퍼컴퓨팅, 멀티모달 연구실, 코딩동아리',
  },
  {
    id: 'ee',
    name: '전자공학과',
    college: '공과대학',
    shortName: '전자공',
    badgeClass: 'bg-[#F0FDFA] text-[#0F766E] border-[#5EEAD4]',
    color: '#0F766E',
    bgColor: '#F0FDFA',
    borderColor: '#5EEAD4',
    description: '반도체 집적회로, 통신시스템, 임베디드, 신호처리 연구실',
  },
  {
    id: 'common',
    name: '학과 공통',
    college: '전체 학과',
    shortName: '공통',
    badgeClass: 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]',
    color: '#475569',
    bgColor: '#F1F5F9',
    borderColor: '#CBD5E1',
    description: '전공 무관 학과 공통 프로젝트, 융합학부 지원 사업, 공통 캡스톤',
  },
];

export const DEPARTMENT_MAP: Record<string, InhaDepartment> = INHA_DEPARTMENTS.reduce(
  (acc, dept) => {
    acc[dept.name] = dept;
    acc[dept.id] = dept;
    return acc;
  },
  {} as Record<string, InhaDepartment>
);
