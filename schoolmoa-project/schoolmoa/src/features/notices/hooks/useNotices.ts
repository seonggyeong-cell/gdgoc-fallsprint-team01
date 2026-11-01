// [담당: 역할 A] 공고 데이터 로딩: 기본 데이터 + 인하대 공지 + 학생 제보(localStorage)
import { useCallback, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '@/config/constants';
import { MOCK_NOTICES } from '@/data/mockNotices';
import { fetchInhaNotices } from '@/services/inhaNoticeService';
import { readJSON, writeJSON } from '@/services/storage';
import type { NoticeItem } from '@/types';

export function useNotices() {
  const [custom, setCustom] = useState<NoticeItem[]>(() => readJSON(STORAGE_KEYS.customNotices, []));
  const [inha, setInha] = useState<NoticeItem[]>([]);

  useEffect(() => {
    let alive = true;
    fetchInhaNotices().then((items) => alive && setInha(items)).catch((e) => console.error('[인하대 공지] 불러오기 실패', e));
    return () => { alive = false; };
  }, []);

  useEffect(() => { writeJSON(STORAGE_KEYS.customNotices, custom); }, [custom]);

  // 제보 공고만 저장하므로, 기본 데이터가 업데이트되면 그대로 반영됩니다.
  const notices = useMemo(() => {
    const map = new Map<string, NoticeItem>();
    for (const n of [...custom, ...MOCK_NOTICES, ...inha]) map.set(n.id, n);
    return Array.from(map.values());
  }, [custom, inha]);

  const addNotice = useCallback((n: NoticeItem) => setCustom((prev) => [n, ...prev]), []);

  return { notices, addNotice };
}
