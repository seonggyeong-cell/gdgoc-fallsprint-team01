// [담당: 역할 A] 사이트 모음 탭 — 외부 사이트 소개 + 링크 카드 (분류 탭·검색)
import React, { useMemo, useState } from 'react';
import { BookOpen, Briefcase, ExternalLink, GraduationCap, Search, SlidersHorizontal, Wallet } from 'lucide-react';
import { SITE_GROUPS, SITE_GROUP_LABELS } from '@/config/constants';
import { SITE_LINKS } from '@/data/sites';
import type { SiteGroup, SiteLink } from '@/types';

const GROUP_ICONS: Record<SiteGroup | 'all', React.ComponentType<{ className?: string }>> = {
  all: SlidersHorizontal, gov_training: GraduationCap, paid_course: Wallet, free_study: BookOpen, career: Briefcase,
};

export const SiteDirectory: React.FC = () => {
  const [group, setGroup] = useState<SiteGroup | 'all'>('all');
  const [query, setQuery] = useState('');

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">사이트 모음</h2>
        <p className="text-xs text-neutral-500 mt-0.5">국비지원 교육부터 인턴·취업까지, 학생에게 도움이 되는 사이트를 모았어요. '사이트 바로가기'를 누르면 새 탭으로 열려요.</p>
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
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  selected ? 'bg-neutral-900 text-white shadow-xs' : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/80 hover:bg-neutral-50'
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

        <div className="relative max-w-md">
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
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center text-neutral-500">
          <Search className="w-10 h-10 stroke-1 text-neutral-300 mx-auto mb-2" />
          <h3 className="text-base font-semibold text-neutral-800">검색 결과가 없어요.</h3>
          <p className="text-xs mt-1">다른 단어로 검색하거나 전체 탭에서 확인해 보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((s) => <SiteCard key={s.id} site={s} />)}
        </div>
      )}
    </div>
  );
};

const SiteCard: React.FC<{ site: SiteLink }> = ({ site }) => (
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
        {site.hasApi && (
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium shrink-0" title="공식 API가 있어 서버 연결 후 공고를 자동으로 가져올 수 있어요">
            API 연동 예정
          </span>
        )}
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
    </div>

    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2 mt-1">
      <span className="text-[11px] text-neutral-400 truncate">{site.url.replace(/^https?:\/\//, '')}</span>
      <a
        href={site.url} target="_blank" rel="noreferrer noopener"
        className="inline-flex items-center gap-1 text-xs font-medium text-neutral-700 hover:text-indigo-600 py-1 px-2 rounded hover:bg-neutral-100 transition-colors shrink-0"
      >
        <span>사이트 바로가기</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  </article>
);
