-- ============================================================================
-- 스쿨모아 Supabase 전체 테이블 설정
-- Supabase → SQL Editor 에 이 파일 내용만 통째로 붙여넣고 Run
--
-- · 여러 번 실행해도 안전합니다 (이미 있는 테이블·정책은 덮어쓰기만 함, 데이터는 지우지 않음)
-- · ⚠ SQL 이외의 설명 문장을 같이 붙여넣으면 'syntax error' 가 납니다. SQL 만 붙여넣으세요.
-- · 경고("Potential issue detected - destructive operations") 가 뜨면 그냥 Run 하면 됩니다.
--   drop constraint / drop policy 는 제약·정책 규칙만 삭제하며 데이터 행은 건드리지 않습니다.
-- ============================================================================

-- ── 1) profiles ──────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  department          text        not null default '',
  career_fields       text[]      not null default '{}',
  interest_categories text[]      not null default '{}',
  onboarded           boolean     not null default false,
  updated_at          timestamptz not null default now()
);

-- ── 2) bookmarks ─────────────────────────────────────────────────────────────
create table if not exists public.bookmarks (
  user_id   uuid not null references auth.users(id) on delete cascade,
  notice_id text not null,
  stage     text not null default 'saved'
            check (stage in ('saved','preparing','submitted','accepted','rejected')),
  memo      text,
  saved_at  date not null default current_date,
  primary key (user_id, notice_id)
);

-- ── 3) notices ───────────────────────────────────────────────────────────────
create table if not exists public.notices (
  id                     text        primary key,
  title                  text        not null,
  category               text        not null,
  subcategory            text        not null default '',
  organizer              text        not null default '',
  source                 text        not null default 'user',
  official_url           text        not null,
  benefit                text        not null default '',
  estimated_value_number bigint,
  start_date             date,
  deadline               date,
  is_ongoing             boolean     not null default false,
  summary                text        not null default '',
  description            text,
  tags                   text[]      not null default '{}',
  career_fields          text[]      not null default '{}',
  majors                 text[]      not null default '{}',
  views                  int         not null default 0,
  bookmarked_count       int         not null default 0,
  created_at             timestamptz not null default now(),
  is_user_submitted      boolean     not null default false,
  submitted_by           uuid references auth.users(id)
);

-- official_url 은 http(s)만 허용 — javascript: 같은 위험한 주소 차단 (2차 안전장치)
alter table public.notices drop constraint if exists notices_official_url_http_chk;
alter table public.notices add  constraint notices_official_url_http_chk
  check (official_url ~* '^https?://');

-- ── 4) RLS 활성화 + 정책 ────────────────────────────────────────────────────
alter table public.profiles  enable row level security;
alter table public.bookmarks enable row level security;
alter table public.notices   enable row level security;

-- profiles: 본인만 읽기/쓰기/수정/삭제
drop policy if exists "내 프로필만" on public.profiles;
create policy "내 프로필만" on public.profiles
  for all to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- bookmarks: 본인만 읽기/쓰기/수정/삭제
drop policy if exists "내 보관함만" on public.bookmarks;
create policy "내 보관함만" on public.bookmarks
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- notices: 비로그인 포함 누구나 읽기 가능
drop policy if exists "공고는 누구나 읽기" on public.notices;
create policy "공고는 누구나 읽기" on public.notices
  for select to anon, authenticated using (true);

-- notices: 로그인 사용자는 본인 제보 공고만 추가 가능
--          (views=0, bookmarked_count=0 조건으로 조회수·인기를 부풀려 넣는 것도 방지)
drop policy if exists "로그인 사용자는 제보 가능" on public.notices;
create policy "로그인 사용자는 제보 가능" on public.notices
  for insert to authenticated
  with check (
    is_user_submitted = true
    and submitted_by = auth.uid()
    and views = 0
    and bookmarked_count = 0
  );

-- ── 5) AI 맞춤 추천용 테이블 ─────────────────────────────────────────────────
-- 서버 함수(api/recommend.ts)가 SUPABASE_SECRET_KEY 로만 읽고 씁니다.
-- 브라우저(publishable 키)로는 접근 불가 — 정책을 의도적으로 만들지 않습니다.

-- 추천 결과 캐시: 같은 날·같은 프로필·같은 후보면 LLM을 다시 호출하지 않음
create table if not exists public.recommendation_cache (
  user_id    uuid        not null references auth.users(id) on delete cascade,
  cache_key  text        not null,  -- 날짜 + 프로필 + 후보 공고 id 목록의 해시
  result     jsonb       not null,  -- [{ "id": "career-01", "reason": "..." }]
  model      text        not null,
  created_at timestamptz not null default now(),
  primary key (user_id, cache_key)
);

-- AI 사용량: 하루 호출 횟수 제한 + 비용 모니터링
create table if not exists public.ai_usage (
  id            bigserial   primary key,
  user_id       uuid        references auth.users(id) on delete cascade,
  kind          text        not null default 'recommend',
  model         text,
  input_tokens  int,
  output_tokens int,
  created_at    timestamptz not null default now()
);
create index if not exists ai_usage_user_kind_created_idx
  on public.ai_usage (user_id, kind, created_at);

-- RLS 켜기 (정책 없음 → 브라우저 접근 불가, 서버 secret 키만 가능)
alter table public.recommendation_cache enable row level security;
alter table public.ai_usage             enable row level security;

-- ── 6) 설정 확인 (실행 후 결과로 테이블·정책 목록이 보임) ────────────────────
select tablename, rowsecurity from pg_tables where schemaname = 'public' order by 1;
select tablename, policyname, cmd from pg_policies where schemaname = 'public' order by 1, 2;
