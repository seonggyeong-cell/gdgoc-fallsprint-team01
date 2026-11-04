// [담당: 역할 A] 공고 데이터 로딩: Supabase notices 테이블 + 인하대 공지 + 학생 제보
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ENV, STORAGE_KEYS } from '@/config/constants';
import { MOCK_NOTICES } from '@/data/mockNotices';
import { fetchInhaNotices } from '@/services/inhaNoticeService';
import { readJSON, writeJSON } from '@/services/storage';
import { supabase } from '@/services/supabase';
import type { CareerField, NoticeCategory, NoticeItem, NoticeSource } from '@/types';

// DB 행(snake_case) -> 앱 타입(camelCase) 변환
function fromRow(row: any): NoticeItem {
  return {
    id: String(row.id),
    title: row.title ?? '',
    category: row.category as NoticeCategory,
    subcategory: row.subcategory ?? '',
    organizer: row.organizer ?? '',
    source: (row.source as NoticeSource) ?? 'user',
    officialUrl: row.official_url ?? '',
    benefit: row.benefit ?? '',
    estimatedValueNumber: row.estimated_value_number ? Number(row.estimated_value_number) : undefined,
    startDate: row.start_date ?? undefined,
    deadline: row.deadline ?? undefined,
    isOngoing: !!row.is_ongoing,
    summary: row.summary ?? '',
    description: row.description ?? undefined,
    tags: Array.isArray(row.tags) ? row.tags : [],
    careerFields: Array.isArray(row.career_fields) ? (row.career_fields as CareerField[]) : undefined,
    majors: Array.isArray(row.majors) ? row.majors : undefined,
    views: Number(row.views ?? 0),
    bookmarkedCount: Number(row.bookmarked_count ?? 0),
    createdAt: row.created_at ? String(row.created_at).split('T')[0] : '',
    isUserSubmitted: !!row.is_user_submitted,
  };
}

// 앱 타입(camelCase) -> DB 행(snake_case) 변환
function toRow(n: NoticeItem, userId?: string) {
  return {
    id: n.id,
    title: n.title,
    category: n.category,
    subcategory: n.subcategory,
    organizer: n.organizer,
    source: n.source,
    official_url: n.officialUrl,
    benefit: n.benefit,
    estimated_value_number: n.estimatedValueNumber ?? null,
    start_date: n.startDate ?? null,
    deadline: n.deadline ?? null,
    is_ongoing: n.isOngoing,
    summary: n.summary,
    description: n.description ?? null,
    tags: n.tags,
    career_fields: n.careerFields ?? [],
    majors: n.majors ?? [],
    views: n.views,
    bookmarked_count: n.bookmarkedCount,
    is_user_submitted: true,
    submitted_by: userId ?? null,
  };
}

export function useNotices(currentUserId?: string) {
  const [dbNotices, setDbNotices] = useState<NoticeItem[]>([]);
  const [custom, setCustom] = useState<NoticeItem[]>(() => readJSON(STORAGE_KEYS.customNotices, []));
  const [inha, setInha] = useState<NoticeItem[]>([]);

  // 1) 인하대 공지 불러오기 (서버리스 함수 또는 fallback)
  useEffect(() => {
    let alive = true;
    fetchInhaNotices()
      .then((items) => alive && setInha(items))
      .catch((e) => console.error('[인하대 공지] 불러오기 실패', e));
    return () => {
      alive = false;
    };
  }, []);

  // 2) Supabase notices 테이블 데이터 불러오기
  useEffect(() => {
    if (!ENV.supabaseUrl || !ENV.supabaseKey) return;

    let alive = true;
    async function loadDbNotices() {
      try {
        const { data, error } = await supabase
          .from('notices')
          .select('*')
          .order('deadline', { ascending: true });

        if (!error && data && data.length > 0 && alive) {
          setDbNotices(data.map(fromRow));
        }
      } catch (e) {
        console.warn('Supabase notices fetch failed', e);
      }
    }

    loadDbNotices();
    return () => {
      alive = false;
    };
  }, []);

  // 로컬 제보 저장소 동기화
  useEffect(() => {
    writeJSON(STORAGE_KEYS.customNotices, custom);
  }, [custom]);

  // 공고 합치기: Supabase DB에 공고가 있으면 그것을 우선하고, 없으면 기본 MOCK_NOTICES 사용 + 인하대 + 로컬 제보
  const notices = useMemo(() => {
    const map = new Map<string, NoticeItem>();
    const baseList = dbNotices.length > 0 ? dbNotices : MOCK_NOTICES;

    for (const n of [...custom, ...baseList, ...inha]) {
      map.set(n.id, n);
    }
    return Array.from(map.values());
  }, [custom, inha, dbNotices]);

  // 학생 공고 제보
  const addNotice = useCallback(
    async (n: NoticeItem) => {
      // 1) 로컬 상태 즉시 추가 (낙관적)
      setCustom((prev) => [n, ...prev]);

      // 2) Supabase DB 저장
      if (ENV.supabaseUrl && ENV.supabaseKey) {
        try {
          const row = toRow(n, currentUserId);
          const { error } = await supabase.from('notices').insert(row);
          if (error) {
            console.error('Supabase notice insert error', error);
          }
        } catch (e) {
          console.error('Supabase notice insert failed', e);
        }
      }
    },
    [currentUserId]
  );

  return { notices, addNotice };
}
