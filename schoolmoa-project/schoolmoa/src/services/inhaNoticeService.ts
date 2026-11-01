// [담당: 역할 A] 인하대 공지사항 연동.
// 브라우저에서 학교 사이트를 직접 호출하면 CORS에 막히므로, 실제 연동은 '서버(크롤러/프록시)'가 필요합니다.
//   1) 서버가 학교 공지 게시판을 주기적으로 수집 → JSON(NoticeItem[])으로 제공
//   2) 아래 함수에서 fetch('/api/inha-notices') 로 교체
// 연동 전까지는 샘플 데이터를 반환합니다. 반환 타입(NoticeItem[])만 지키면 화면 코드는 수정할 필요가 없습니다.
import { INHA_SAMPLE_NOTICES } from '@/data/inhaSampleNotices';
import type { NoticeItem } from '@/types';

export async function fetchInhaNotices(): Promise<NoticeItem[]> {
  return INHA_SAMPLE_NOTICES;
}
