// [담당: 역할 A] 공고 시드 데이터 생성 헬퍼. 마감일은 '오늘 기준 N일 후'로 지정해서 데이터가 낡지 않게 합니다.
import { SOURCES } from '@/config/constants';
import type { NoticeItem } from '@/types';
import { daysFromToday } from '@/utils/dateUtils';

export interface Seed extends Omit<NoticeItem, 'officialUrl' | 'deadline' | 'startDate' | 'createdAt' | 'views' | 'bookmarkedCount'> {
  officialUrl?: string; // 생략하면 출처 사이트 메인 주소
  dueIn?: number;       // 오늘로부터 마감까지 남은 일수 (상시모집이면 생략)
  postedAgo?: number;   // 등록 후 지난 일수
  views?: number;
  saves?: number;
}

export function build(s: Seed): NoticeItem {
  const { dueIn, postedAgo = 3, views = 300, saves = 20, officialUrl, ...rest } = s;
  return {
    ...rest,
    officialUrl: officialUrl ?? SOURCES[s.source].url,
    startDate: daysFromToday(-postedAgo),
    createdAt: daysFromToday(-postedAgo),
    deadline: daysFromToday(dueIn ?? 365),
    views,
    bookmarkedCount: saves,
  };
}
