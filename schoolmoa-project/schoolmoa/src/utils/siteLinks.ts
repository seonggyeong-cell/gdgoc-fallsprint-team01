// [담당: 역할 A] 사이트 모음 링크 계산 유틸
import type { SiteCost, SiteLink } from '@/types';
import { sanitizeUrl } from './urlUtils';

export const COST_LABELS: Record<SiteCost, string> = {
  gov: '정부·공공 지원',
  sponsored: '기업·재단 지원 무료',
  free: '무료',
  paid: '유료',
  mixed: '유료·무료 혼합',
};

export const COST_STYLES: Record<SiteCost, string> = {
  gov: 'bg-indigo-50 text-indigo-700',
  sponsored: 'bg-sky-50 text-sky-700',
  free: 'bg-emerald-50 text-emerald-700',
  paid: 'bg-amber-50 text-amber-800',
  mixed: 'bg-neutral-100 text-neutral-600',
};

/** 카드의 주 버튼: 구체 화면(entries[0])이 있으면 그곳으로, 없으면 사이트 메인으로 */
export function primaryLink(site: SiteLink): { label: string; url: string } {
  const first = site.entries?.[0];
  return first
    ? { label: first.label, url: sanitizeUrl(first.url) }
    : { label: '사이트 바로가기', url: sanitizeUrl(site.url) };
}

/** 키워드로 해당 사이트의 검색 결과 화면 주소를 만든다. 검색을 지원하지 않거나 검색어가 없으면 null */
export function buildSiteSearchUrl(site: SiteLink, keyword: string): string | null {
  const q = keyword.trim();
  if (!site.searchUrl || !q) return null;
  return sanitizeUrl(site.searchUrl.replace('{q}', encodeURIComponent(q)));
}
