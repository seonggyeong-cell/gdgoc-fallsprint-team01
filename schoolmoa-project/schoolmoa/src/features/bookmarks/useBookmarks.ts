// [담당: 역할 C] 보관함(스크랩) 상태 — 로그인 사용자별로 저장됩니다.
import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/config/constants';
import { readJSON, writeJSON } from '@/services/storage';
import type { ApplicationStage, BookmarkRecord } from '@/types';
import { toISODate } from '@/utils/dateUtils';

export function useBookmarks(userId: string | null) {
  const [ids, setIds] = useState<string[]>([]);
  const [records, setRecords] = useState<Record<string, BookmarkRecord>>({});
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  // 사용자가 바뀌면 해당 사용자의 데이터를 불러옴 (로그아웃이면 비움)
  useEffect(() => {
    if (!userId) { setIds([]); setRecords({}); setLoadedFor(null); return; }
    setIds(readJSON(STORAGE_KEYS.bookmarks(userId), []));
    setRecords(readJSON(STORAGE_KEYS.records(userId), {}));
    setLoadedFor(userId);
  }, [userId]);

  // 불러오기가 끝난 뒤에만 저장 (이전 사용자 데이터를 덮어쓰지 않도록)
  useEffect(() => { if (userId && loadedFor === userId) writeJSON(STORAGE_KEYS.bookmarks(userId), ids); }, [ids, userId, loadedFor]);
  useEffect(() => { if (userId && loadedFor === userId) writeJSON(STORAGE_KEYS.records(userId), records); }, [records, userId, loadedFor]);

  const isBookmarked = useCallback((id: string) => ids.includes(id), [ids]);

  const toggleBookmark = useCallback((id: string) => {
    if (ids.includes(id)) {
      setIds((prev) => prev.filter((x) => x !== id));
      setRecords((prev) => { const next = { ...prev }; delete next[id]; return next; });
    } else {
      setIds((prev) => [...prev, id]);
      setRecords((prev) => ({ ...prev, [id]: { noticeId: id, stage: 'saved', savedAt: toISODate(new Date()) } }));
    }
  }, [ids]);

  const updateRecord = useCallback((id: string, stage: ApplicationStage, memo?: string) => {
    setRecords((prev) => ({
      ...prev,
      [id]: { noticeId: id, stage, savedAt: prev[id]?.savedAt ?? toISODate(new Date()), memo },
    }));
  }, []);

  return { bookmarkIds: ids, records, isBookmarked, toggleBookmark, updateRecord };
}
