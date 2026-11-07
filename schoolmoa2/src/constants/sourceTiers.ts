import React from 'react';
import { School, GraduationCap, Globe2, Building2 } from 'lucide-react';
import { NoticeSourceTier } from '../types/notice';

export interface SourceTierMeta {
  key: NoticeSourceTier;
  label: string;
  shortLabel: string;
  badgeLabel: string;
  description: string;
  badgeClass: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

export const SOURCE_TIERS: Record<NoticeSourceTier, SourceTierMeta> = {
  'inha-main': {
    key: 'inha-main',
    label: '인하대 본교',
    shortLabel: '본교',
    badgeLabel: '인하대 본교',
    description: '교무처, 학생지원처, 장학복지팀, 정석도서관, 대학일자리센터',
    badgeClass: 'bg-[#EEF4FF] text-[#0B2A5B] border-[#1D5FC4]/30',
    color: '#0B2A5B',
    bgColor: '#EEF4FF',
    borderColor: '#1D5FC4',
    icon: School,
  },
  'inha-dept': {
    key: 'inha-dept',
    label: '인하대 학과',
    shortLabel: '학과/연구실',
    badgeLabel: '인하대 학과',
    description: '소프트웨어융합대학, 컴퓨터공학과, AI융합연구원, 학과 RA/TA',
    badgeClass: 'bg-[#F0FDF4] text-[#15803D] border-[#16A34A]/30',
    color: '#15803D',
    bgColor: '#F0FDF4',
    borderColor: '#16A34A',
    icon: GraduationCap,
  },
  'external': {
    key: 'external',
    label: '외부 사이트',
    shortLabel: '외부/대외',
    badgeLabel: '외부 공고',
    description: '한국장학재단, 삼성꿈장학, IT기업 인턴, 잡코리아, 캠퍼스픽',
    badgeClass: 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]',
    color: '#475569',
    bgColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    icon: Globe2,
  },
};

export const SOURCE_TIER_LIST = Object.values(SOURCE_TIERS);
