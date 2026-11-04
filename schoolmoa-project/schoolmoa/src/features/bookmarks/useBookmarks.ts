// [담당: 역할 C] 보관함(스크랩) 상태 — Supabase bookmarks 테이블 연동 (가이드 4-6)
import { useCallback, useEffect, useState } from 'react';
import { ENV, STORAGE_KEYS } from '@/config/constants';
import { readJSON, writeJSON } from '@/services/storage';
import { supabase } from '@/services/supabase';
import type { ApplicationStage, BookmarkRecord } from '@/types';
import { toISODate } from '@/utils/dateUtils';

export function useBookmarks(userId: string | null) {
  const [ids, setIds] = useState<string[]>([]);
  const [records, setRecords] = useState<Record<string, BookmarkRecord>>({});
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  // 1) 사용자별 북마크 불러오기 (Supabase DB 우선, 실패/미연동 시 localStorage)
  useEffect(() => {
    if (!userId) {
      setIds([]);
      setRecords({});
      setLoadedFor(null);
      return;
    }

    const currentUid = userId;
    let isCancelled = false;

    async function loadBookmarks() {
      if (ENV.supabaseUrl && ENV.supabaseKey) {
        try {
          const { data, error } = await supabase
            .from('bookmarks')
            .select('*');

          if (!error && data && Array.isArray(data)) {
            if (!isCancelled) {
              const loadedIds: string[] = [];
              const loadedRecords: Record<string, BookmarkRecord> = {};
              for (const row of data) {
                loadedIds.push(row.notice_id);
                loadedRecords[row.notice_id] = {
                  noticeId: row.notice_id,
                  stage: (row.stage as ApplicationStage) || 'saved',
                  savedAt: row.saved_at || toISODate(new Date()),
                  memo: row.memo || undefined,
                };
              }
              setIds(loadedIds);
              setRecords(loadedRecords);
              setLoadedFor(currentUid);
              return;
            }
          }
        } catch (e) {
          console.warn('Supabase bookmarks fetch failed, fallback to local storage', e);
        }
      }

      if (!isCancelled) {
        setIds(readJSON(STORAGE_KEYS.bookmarks(currentUid), []));
        setRecords(readJSON(STORAGE_KEYS.records(currentUid), {}));
        setLoadedFor(currentUid);
      }
    }

    loadBookmarks();

    return () => {
      isCancelled = true;
    };
  }, [userId]);

  // 로컬스토리지 백업 저장
  useEffect(() => {
    const currentUid = userId;
    if (currentUid && loadedFor === currentUid) {
      writeJSON(STORAGE_KEYS.bookmarks(currentUid), ids);
    }
  }, [ids, userId, loadedFor]);

  useEffect(() => {
    const currentUid = userId;
    if (currentUid && loadedFor === currentUid) {
      writeJSON(STORAGE_KEYS.records(currentUid), records);
    }
  }, [records, userId, loadedFor]);

  const isBookmarked = useCallback((id: string) => ids.includes(id), [ids]);

  // 낙관적 업데이트 + Supabase 비동기 동기화
  const toggleBookmark = useCallback(
    async (id: string) => {
      if (!userId) return;
      const currentUid = userId;

      const isCurrentlySaved = ids.includes(id);
      const prevIds = [...ids];
      const prevRecords = { ...records };

      if (isCurrentlySaved) {
        // 즉시 삭제 (낙관적)
        setIds((prev) => prev.filter((x) => x !== id));
        setRecords((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });

        // Supabase DB 삭제
        if (ENV.supabaseUrl && ENV.supabaseKey) {
          try {
            const { error } = await supabase
              .from('bookmarks')
              .delete()
              .match({ user_id: currentUid, notice_id: id });
            if (error) throw error;
          } catch (e) {
            console.error('Supabase bookmark delete error', e);
            // 롤백
            setIds(prevIds);
            setRecords(prevRecords);
          }
        }
      } else {
        // 즉시 추가 (낙관적)
        const todayStr = toISODate(new Date());
        setIds((prev) => [...prev, id]);
        setRecords((prev) => ({
          ...prev,
          [id]: { noticeId: id, stage: 'saved', savedAt: todayStr },
        }));

        // Supabase DB 추가
        if (ENV.supabaseUrl && ENV.supabaseKey) {
          try {
            const { error } = await supabase
              .from('bookmarks')
              .insert({ user_id: currentUid, notice_id: id, stage: 'saved', saved_at: todayStr });
            if (error) throw error;
          } catch (e) {
            console.error('Supabase bookmark insert error', e);
            // 롤백
            setIds(prevIds);
            setRecords(prevRecords);
          }
        }
      }
    },
    [ids, records, userId]
  );

  // 단계 및 메모 저장
  const updateRecord = useCallback(
    async (id: string, stage: ApplicationStage, memo?: string) => {
      if (!userId) return;
      const currentUid = userId;

      const prevRecords = { ...records };
      const savedAt = prevRecords[id]?.savedAt ?? toISODate(new Date());

      // 낙관적 반영
      setRecords((prev) => ({
        ...prev,
        [id]: { noticeId: id, stage, savedAt, memo },
      }));

      // Supabase DB 갱신
      if (ENV.supabaseUrl && ENV.supabaseKey) {
        try {
          const { error } = await supabase
            .from('bookmarks')
            .update({ stage, memo })
            .match({ user_id: currentUid, notice_id: id });
          if (error) throw error;
        } catch (e) {
          console.error('Supabase bookmark update error', e);
          setRecords(prevRecords);
        }
      }
    },
    [records, userId]
  );

  return { bookmarkIds: ids, records, isBookmarked, toggleBookmark, updateRecord };
}
