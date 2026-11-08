// [담당: 역할 A] 사이트 모음 탭 — 외부 사이트 소개 + 링크 카드 (분류 구역·검색·사이트 안 키워드 검색)
import React, { useMemo, useState } from 'react';
import { BookOpen, Briefcase, ExternalLink, GraduationCap, Search, SlidersHorizontal, Wallet } from 'lucide-react';
import { SITE_GROUPS, SITE_GROUP_LABELS } from '@/config/constants';
import { SITE_LINKS } from '@/data/sites';
import type { SiteGroup, SiteLink } from '@/types';
import { COST_LABELS, COST_STYLES, buildSiteSearchUrl, primaryLink } from '@/utils/siteLinks';
import { sanitizeUrl } from '@/utils/urlUtils';

const GROUP_ICONS: Record<SiteGroup | 'all', React.ComponentType<{ className?: string }>> = {
  all: SlidersHorizontal, gov_training: GraduationCap, paid_course: Wallet, free_study: BookOpen, career: Briefcase,
};

export const SiteDirectory: React.FC = () => {
  const [group, setGroup] = useState<SiteGroup | 'all'>('all');
  const [query, setQuery] = useState('');     // 사이트 목록 거르기 (이름·태그)
  const [keyword, setKeyword] = useState(''); // 각 사이트 안에서 바로 검색할 키워드 (예: 파이썬, 백엔드 인턴)

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: SITE_LINKS.length };
    for (const s of SITE_LINKS) c[s.group] = (c[s.group] ?? 0) + 1;
    return c;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SITE_LINKS.filter(
      (s) =>
        (group === 'all' || s.group === group) &&
        (!q || [s.name, s.org, s.description, ...s.tags].join(' ').toLowerCase().includes(q)),
    );
  }, [group, query]);

  const groups = [{ key: 'all' as const, label: '전체' }, ...SITE_GROUPS];
  // '전체' 탭에서 검색어가 없으면 분류별 구역으로 나누어 보여줍니다
  const showSections = group === 'all' && !query.trim();
  const searchableCount = filtered.filter((s) => !!s.searchUrl).length;

  const grid = (items: SiteLink[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {items.map((s) => <SiteCard key={s.id} site={s} keyword={keyword} />)}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">사이트 모음</h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          국비지원 교육, 강의, 무료 학습, 인턴·취업 사이트 {SITE_LINKS.length}곳을 모았습니다. 가능한 곳은 메인이 아닌 공고·강의 목록 화면으로 바로 연결됩니다. 링크는 새 탭에서 열립니다.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {groups.map((g) => {
            const Icon = GROUP_ICONS[g.key];
            const selected = group === g.key;
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => setGroup(g.key)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 ${selected ? 'bg-neutral-900 text-white shadow-xs' : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/80 hover:bg-neutral-50'
                  }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{g.label}</span>
                <span className={`tabular-nums text-[11px] px-1.5 rounded-full ${selected ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-100 text-neutral-500'}`}>
                  {counts[g.key] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="site-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="사이트 이름·태그 검색 (예: 부트캠프, 인턴)"
              aria-label="사이트 검색"
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
            />
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="site-keyword"
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="강의·공고를 사이트 안에서 바로 검색 (예: 파이썬, 백엔드 인턴)"
              aria-label="사이트 안에서 검색할 키워드"
              className="w-full pl-9 pr-3 py-2 text-xs bg-indigo-50/40 border border-indigo-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
            />
          </div>
        </div>
        {keyword.trim() && (
          <p className="text-[11px] text-indigo-700">
            "{keyword.trim()}" — 검색을 지원하는 {searchableCount}곳의 카드에 <strong>검색 결과 바로가기</strong>가 표시됩니다.
          </p>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center text-neutral-500">
          <Search className="w-10 h-10 stroke-1 text-neutral-300 mx-auto mb-2" />
          <h3 className="text-base font-semibold text-neutral-800">검색 결과가 없습니다.</h3>
          <p className="text-xs mt-1">다른 검색어를 입력하거나 전체 탭에서 확인하세요.</p>
        </div>
      ) : showSections ? (
        <div className="space-y-8">
          {SITE_GROUPS.map((g) => {
            const items = filtered.filter((s) => s.group === g.key);
            if (items.length === 0) return null;
            return (
              <section key={g.key} aria-label={g.label} className="space-y-3">
                <h3 className="text-sm font-bold text-neutral-800">
                  {g.label} <span className="tabular-nums text-xs font-medium text-neutral-400">{items.length}</span>
                </h3>
                {grid(items)}
              </section>
            );
          })}
        </div>
      ) : (
        grid(filtered)
      )}
    </div>
  );
};

const SiteCard: React.FC<{ site: SiteLink; keyword: string }> = ({ site, keyword }) => {
  const primary = primaryLink(site);
  const extraEntries = (site.entries ?? []).slice(1);
  const searchHref = buildSiteSearchUrl(site, keyword);

  return (
    <article className="group bg-white rounded-xl border border-neutral-200/90 hover:border-neutral-300 p-5 flex flex-col justify-between transition-all hover:shadow-sm">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0" aria-hidden="true">
              {site.name.slice(0, 1)}
            </span>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-neutral-900 group-hover:text-indigo-600 transition-colors leading-snug truncate">
                {site.name}
              </h3>
              <p className="text-xs text-neutral-500 truncate">{site.org} · {SITE_GROUP_LABELS[site.group]}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            {site.cost && (
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${COST_STYLES[site.cost]}`}>{COST_LABELS[site.cost]}</span>
            )}
            {site.hasApi && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium" title="공식 API가 있어 서버 연결 후 공고를 자동으로 가져올 수 있습니다">
                API 연동 예정
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed mb-3">{site.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {site.tags.map((t) => (
            <span key={t} className="text-[11px] text-indigo-700">#{t}</span>
          ))}
        </div>

        {site.note && (
          <p className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-100 mb-3 text-[11px] text-neutral-600 leading-relaxed">{site.note}</p>
        )}

        {searchHref && (
          <a
            href={searchHref} target="_blank" rel="noreferrer noopener"
            className="inline-flex items-center gap-1 mb-3 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="truncate max-w-[220px]">"{keyword.trim()}" 검색 결과 바로가기</span>
          </a>
        )}

        {extraEntries.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-1">
            {extraEntries.map((e) => (
              <a
                key={e.url} href={sanitizeUrl(e.url)} target="_blank" rel="noreferrer noopener"
                className="text-[11px] text-neutral-600 hover:text-indigo-700 border border-neutral-200 hover:border-indigo-200 px-2 py-0.5 rounded-full transition-colors"
              >
                {e.label}
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2 mt-1">
        <span className="text-[11px] text-neutral-400 truncate">{primary.url.replace(/^https?:\/\//, '')}</span>
        <a
          href={primary.url} target="_blank" rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-xs font-medium text-neutral-700 hover:text-indigo-600 py-1 px-2 rounded hover:bg-neutral-100 transition-colors shrink-0"
        >
          <span className="truncate max-w-[180px]">{primary.label}</span>
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
        </a>
      </div>
    </article>
  );
};
