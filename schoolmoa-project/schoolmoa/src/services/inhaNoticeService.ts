// [담당: 역할 A] 인하대 공지사항 연동.
import { INHA_SAMPLE_NOTICES } from '@/data/inhaSampleNotices';
import type { NoticeItem } from '@/types';

export async function fetchInhaNotices(): Promise<NoticeItem[]> {
  try {
    const res = await fetch('/api/inha-notices');
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : INHA_SAMPLE_NOTICES;
  } catch (error) {
    console.warn('인하대 공지 API 호출 실패, 샘플 데이터로 대체합니다.', error);
    return INHA_SAMPLE_NOTICES;
  }
}
