export type NoticeCategory =
  | 'work' // 근로·알바
  | 'career' // 인턴·취업
  | 'scholarship' // 장학금
  | 'competition' // 공모전·해커톤
  | 'activity' // 봉사·대외활동
  | 'support' // 학생지원
  | 'academic'; // 인하대 공지

export type NoticeSourceTier = 'inha-main' | 'inha-dept' | 'external';

export type NoticeStatus = 'recruiting' | 'closing-soon' | 'upcoming' | 'closed';

export interface EligibilityCriterion {
  id: string;
  title: string;
  detail: string;
  required: boolean;
  criterionType?: 'gpa' | 'income' | 'grade' | 'major' | 'other';
  minGpa?: number;
  maxIncomeDecile?: number;
  allowedGrades?: number[];
  allowedMajors?: string[];
}

export interface Attachment {
  name: string;
  size: string;
  downloadUrl?: string;
}

export interface ContactInfo {
  department: string;
  personName?: string;
  phone?: string;
  email?: string;
  officeLocation?: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  category: NoticeCategory;
  subcategory: string;
  organizer: string;
  organizerType: 'school' | 'government' | 'foundation' | 'student-council' | 'club' | 'corporate';
  sourceTier: NoticeSourceTier; // 'inha-main' (인하대 본교) | 'inha-dept' (인하대 학과) | 'external' (외부 사이트)
  department?: string; // e.g. '기계공학과', '경영학과', '물리학과', '에너지자원공학과', '컴퓨터공학과', '전자공학과', '학과 공통'
  sourceSiteName?: string; // e.g. '인하대학교 포털', '한국장학재단', 'SW중심대학', '링커리어', '캠퍼스픽'
  targetAudience: string;
  targetGrades: number[]; // e.g. [1, 2, 3, 4]
  benefit: string; // e.g. '시급 11,000원 + 근로장학금', '월 220만원 + 정규직 전환'
  estimatedValueNumber?: number; // for calculating total potential funding in bookmarks
  startDate: string; // YYYY-MM-DD
  deadline: string; // YYYY-MM-DD
  isOngoing?: boolean;
  views: number;
  bookmarkedCount: number;
  recommendationReason?: string; // e.g. '✦ 추천 · SW·개발 진로와 일치'
  summary: string;
  description: string;
  eligibilityCriteria: EligibilityCriterion[];
  requiredDocuments: string[];
  scheduleSteps: { step: string; date: string }[];
  contact: ContactInfo;
  officialUrl?: string;
  attachments?: Attachment[];
  tags: string[];
  createdAt: string;
}

export type ApplicationStage = 'saved' | 'preparing' | 'submitted' | 'accepted' | 'rejected';

export interface BookmarkRecord {
  noticeId: string;
  stage: ApplicationStage;
  savedAt: string;
  memo?: string;
  completedDocuments?: string[];
}

export interface StudentProfile {
  name: string;
  grade: number; // 1, 2, 3, 4
  major: string; // e.g. '컴퓨터공학과'
  majorTrack: 'science' | 'engineering' | 'software' | 'humanities' | 'general';
  gpa: number; // e.g. 4.0 / 4.5
  incomeDecile: number; // 1 to 10
  careerGoal: string; // e.g. 'SW·개발 / AI·데이터'
  interests: NoticeCategory[];
  isOnboarded: boolean;
}
