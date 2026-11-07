import React from 'react';
import {
  Briefcase,
  Rocket,
  GraduationCap,
  Trophy,
  HeartHandshake,
  LifeBuoy,
  Megaphone,
  SlidersHorizontal,
} from 'lucide-react';
import { NoticeCategory } from '../types/notice';

export interface CategoryMeta {
  key: NoticeCategory;
  label: string;
  shortLabel: string;
  color: string;
  textColorClass: string;
  bgColorClass: string;
  borderColorClass: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  defaultSubs: string[];
}

export const CATEGORIES: Record<NoticeCategory, CategoryMeta> = {
  work: {
    key: 'work',
    label: '근로·알바',
    shortLabel: '근로',
    color: '#0E9F6E',
    textColorClass: 'text-[#0E9F6E]',
    bgColorClass: 'bg-[#EAF8F1]',
    borderColorClass: 'border-[#0E9F6E]/30',
    icon: Briefcase,
    defaultSubs: ['교내 근로장학', '학과 RA/TA', '연구보조원', '단기 근로'],
  },
  career: {
    key: 'career',
    label: '인턴·취업',
    shortLabel: '취업',
    color: '#2563EB',
    textColorClass: 'text-[#2563EB]',
    bgColorClass: 'bg-[#EFF6FF]',
    borderColorClass: 'border-[#2563EB]/30',
    icon: Rocket,
    defaultSubs: ['체험형 인턴', '전환형 인턴', '신입 채용', '취업 멘토링'],
  },
  scholarship: {
    key: 'scholarship',
    label: '장학금',
    shortLabel: '장학',
    color: '#D97706',
    textColorClass: 'text-[#D97706]',
    bgColorClass: 'bg-[#FFFBEB]',
    borderColorClass: 'border-[#D97706]/30',
    icon: GraduationCap,
    defaultSubs: ['성적우수', '소득연계', '외부재단·기업', '동문장학금', '특성화장학'],
  },
  competition: {
    key: 'competition',
    label: '공모전·해커톤',
    shortLabel: '공모전',
    color: '#7C3AED',
    textColorClass: 'text-[#7C3AED]',
    bgColorClass: 'bg-[#F5F3FF]',
    borderColorClass: 'border-[#7C3AED]/30',
    icon: Trophy,
    defaultSubs: ['SW/AI 해커톤', '아이디어/기획', '데이터 분석', '창업 경진대회'],
  },
  activity: {
    key: 'activity',
    label: '봉사·대외활동',
    shortLabel: '대외활동',
    color: '#DB2777',
    textColorClass: 'text-[#DB2777]',
    bgColorClass: 'bg-[#FDF2F8]',
    borderColorClass: 'border-[#DB2777]/30',
    icon: HeartHandshake,
    defaultSubs: ['서포터즈', '멘토링 봉사', '동아리', '기자단', '학생회'],
  },
  support: {
    key: 'support',
    label: '학생지원',
    shortLabel: '지원',
    color: '#0891B2',
    textColorClass: 'text-[#0891B2]',
    bgColorClass: 'bg-[#ECFEFF]',
    borderColorClass: 'border-[#0891B2]/30',
    icon: LifeBuoy,
    defaultSubs: ['어학/자격증 응시료', '연구지원금(URP)', 'GPU/클라우드', '학습 튜터링'],
  },
  academic: {
    key: 'academic',
    label: '인하대 공지',
    shortLabel: '학사',
    color: '#475569',
    textColorClass: 'text-[#475569]',
    bgColorClass: 'bg-[#F1F5F9]',
    borderColorClass: 'border-[#475569]/30',
    icon: Megaphone,
    defaultSubs: ['학사일정', '수강정정/신청', '졸업요건', '도서관/시설'],
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);
