// [담당: 역할 B] AI 맞춤 추천 훅 — 규칙 추천을 먼저 보여주고, 뒤에서 /api/recommend 로 AI 결과를 받아 순서·이유를 교체합니다.
// AI를 쓸 수 없으면(체험 로그인, Supabase 키 없음, 서버 오류, 5초 초과) 규칙 추천을 그대로 유지합니다.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ENV } from '@/config/constants';
import { supabase } from '@/services/supabase';
import type { UserProfile } from '@/types';
import type { Recommendation } from '@/utils/recommend';

export type AiItem = { id: string; reason: string };
/** idle: 아직 요청 안 함 / loading: AI가 고르는 중 / done: AI 결과 표시 / fallback: 규칙 추천 유지 / limit: 오늘 횟수 소진 / unavailable: AI 사용 불가(체험 로그인 등) */
export type AiStatus = 'idle' | 'loading' | 'done' | 'fallback' | 'limit' | 'unavailable';

const TIMEOUT_MS = 5000;
const MAX_CANDIDATES = 30;

export function useAiRecommendations(ruleRecs: Recommendation[], profile: UserProfile | null, enabled: boolean) {
  const [ai, setAi] = useState<AiItem[] | null>(null);
  const [status, setStatus] = useState<AiStatus>('idle');
  const [remaining, setRemaining] = useState<number | null>(null);
  const reqId = useRef(0); // 늦게 도착한 이전 응답이 최신 결과를 덮어쓰지 않게

  const candidates = useMemo(
    () =>
      ruleRecs.slice(0, MAX_CANDIDATES).map(({ notice: n }) => ({
        id: n.id,
        title: n.title,
        category: n.category,
        subcategory: n.subcategory,
        benefit: n.benefit,
        deadline: n.deadline,
        isOngoing: !!n.isOngoing,
        tags: n.tags,
        summary: n.summary,
      })),
    [ruleRecs],
  );
  const key = candidates.map((c) => c.id).join(',') + '|' + JSON.stringify(profile ?? {});

  const run = useCallback(
    async (refresh = false) => {
      if (!enabled || candidates.length === 0) return;
      if (!ENV.supabaseUrl || !ENV.supabaseKey) return setStatus('unavailable');

      const my = ++reqId.current;
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return my === reqId.current && setStatus('unavailable'); // 체험 로그인 등 Supabase 세션 없음

      setStatus('loading');
      try {
        const r = await fetch('/api/recommend', {
          method: 'POST',
          signal: AbortSignal.timeout(TIMEOUT_MS),
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            candidates,
            profile: profile
              ? { department: profile.department, careerFields: profile.careerFields, interestCategories: profile.interestCategories }
              : undefined,
            refresh,
          }),
        });
        if (my !== reqId.current) return;
        if (r.status === 429) {
          setRemaining(0);
          return setStatus('limit');
        }
        if (!r.ok) return setStatus('fallback');
        const j = await r.json();
        if (my !== reqId.current) return;
        if (typeof j.remaining === 'number') setRemaining(j.remaining);
        if (Array.isArray(j.items) && j.items.length > 0) {
          setAi(j.items);
          setStatus('done');
        } else {
          setStatus('fallback');
        }
      } catch (e) {
        if (import.meta.env.DEV) console.warn('[AI 추천] 규칙 추천 유지', e);
        if (my === reqId.current) setStatus('fallback');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enabled, key],
  );

  useEffect(() => {
    setAi(null);
    run();
  }, [run]);

  return { ai, status, remaining, refresh: () => run(true) };
}

/** AI 결과 순서대로 규칙 추천을 재배열하고 이유를 AI 문장으로 바꿈 (AI 결과가 없으면 규칙 추천 그대로) */
export function mergeAiOrder(ruleRecs: Recommendation[], ai: AiItem[] | null): Recommendation[] {
  if (!ai?.length) return ruleRecs;
  const byId = new Map(ruleRecs.map((r) => [r.notice.id, r]));
  const merged: Recommendation[] = [];
  for (const a of ai) {
    const r = byId.get(a.id);
    if (r) merged.push({ ...r, reasons: [a.reason] });
  }
  return merged.length > 0 ? merged : ruleRecs;
}
