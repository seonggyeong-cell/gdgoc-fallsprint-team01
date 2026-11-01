// [담당: 역할 A] 인하대 공지 '샘플'. 실제 연동 전까지 fetchInhaNotices()가 이 데이터를 반환합니다.
import type { NoticeItem } from '@/types';
import { build, Seed } from './seed';

const seeds: Seed[] = [
  { id: 'inha-01', title: '수강정정 기간 안내', category: 'academic', subcategory: '수강', organizer: '학사지원팀', source: 'inha',
    benefit: '수강 신청 변경 가능', summary: '수강정정 기간 내 포털에서 과목을 추가·삭제할 수 있습니다.', tags: ['수강정정', '학사'], dueIn: 4, views: 5200, saves: 300, postedAgo: 1 },
  { id: 'inha-02', title: '다음 학기 등록금 납부 및 분할납부 안내', category: 'academic', subcategory: '장학·등록', organizer: '재무회계팀', source: 'inha',
    benefit: '분할납부 신청 가능', summary: '등록금 납부 기간과 분할납부 신청 방법을 안내합니다.', tags: ['등록금', '납부'], dueIn: 15, views: 4300, saves: 250, postedAgo: 2 },
  { id: 'inha-03', title: '졸업 요건 확인 및 졸업 사정 안내', category: 'academic', subcategory: '학사', organizer: '학사지원팀', source: 'inha',
    benefit: '졸업 대상자 필독', summary: '졸업 예정자는 이수 학점과 필수 요건을 반드시 확인하세요.', tags: ['졸업', '학사'], dueIn: 22, views: 2900, saves: 180 },
  { id: 'inha-04', title: '취업 특강: 이력서·면접 컨설팅 데이', category: 'academic', subcategory: '행사·특강', organizer: '진로취업지원팀', source: 'inha',
    benefit: '1:1 컨설팅 제공', summary: '현직자 멘토와 함께하는 서류·면접 컨설팅 행사입니다.', tags: ['특강', '취업', '컨설팅'], careerFields: ['business', 'software', 'engineering'], dueIn: 10, views: 1700, saves: 210 },
];

export const INHA_SAMPLE_NOTICES: NoticeItem[] = seeds.map(build);
