-- [담당: 역할 B] AI 맞춤 추천용 테이블 — Supabase → SQL Editor 에서 한 번 실행 (여러 번 실행해도 안전)
-- 서버 함수(api/recommend.ts)만 SUPABASE_SECRET_KEY 로 읽고 씁니다. 브라우저에서는 접근할 수 없게 정책을 만들지 않습니다.

-- 1) 추천 결과 캐시: 같은 날 · 같은 프로필 · 같은 후보면 LLM을 다시 부르지 않음
create table if not exists public.recommendation_cache (
  user_id    uuid not null references auth.users(id) on delete cascade,
  cache_key  text not null,          -- 날짜 + 프로필 + 후보 공고 id 목록의 해시
  result     jsonb not null,         -- [{ "id": "career-01", "reason": "..." }]
  model      text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, cache_key)
);

-- 2) AI 사용량: 하루 호출 횟수 제한 + 비용 확인
create table if not exists public.ai_usage (
  id            bigserial primary key,
  user_id       uuid references auth.users(id) on delete cascade,
  kind          text not null default 'recommend',
  model         text,
  input_tokens  int,
  output_tokens int,
  created_at    timestamptz not null default now()
);
create index if not exists ai_usage_user_kind_created_idx on public.ai_usage (user_id, kind, created_at);

-- RLS 를 켜고 정책을 만들지 않음 → publishable 키(브라우저)로는 읽기·쓰기 불가, secret 키(서버)만 가능
alter table public.recommendation_cache enable row level security;
alter table public.ai_usage            enable row level security;

-- 오래된 캐시 정리 (원할 때 실행)
-- delete from public.recommendation_cache where created_at < now() - interval '7 days';

-- 이번 달 사용량 확인 (원할 때 실행)
-- select date_trunc('day', created_at) as day, count(*) as calls,
--        sum(input_tokens) as input_tok, sum(output_tokens) as output_tok
-- from public.ai_usage where created_at >= date_trunc('month', now())
-- group by 1 order by 1;
