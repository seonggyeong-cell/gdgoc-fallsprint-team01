// [담당: 역할 A] 공고 상세 모달 — 슬라이드-업 + 섹션별 순차 애니메이션
import React, { useState } from 'react';
import { Bookmark, Calendar, Check, ExternalLink, Share2, Sparkles, Tag, User, X } from 'lucide-react';
import { CAREER_LABELS, CATEGORY_LABELS, SOURCES } from '@/config/constants';
import type { NoticeItem } from '@/types';
import { calculateDDay, formatDeadlineLabel, generateIcsCalendar } from '@/utils/dateUtils';
import { resolveNoticeUrl } from '@/utils/urlUtils';

interface Props {
  notice: NoticeItem | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  work:        { bg: '#ecfdf5', text: '#065f46', border: '#6ee7b7' },
  career:      { bg: '#eff6ff', text: '#1e3a8a', border: '#93c5fd' },
  scholarship: { bg: '#fffbeb', text: '#78350f', border: '#fcd34d' },
  competition: { bg: '#f5f3ff', text: '#4c1d95', border: '#c4b5fd' },
  activity:    { bg: '#fdf2f8', text: '#831843', border: '#f9a8d4' },
  support:     { bg: '#f0fdfa', text: '#134e4a', border: '#5eead4' },
  academic:    { bg: '#eef2ff', text: '#1e1b4b', border: '#a5b4fc' },
};

export const NoticeDetailModal: React.FC<Props> = ({ notice, onClose, isBookmarked, onToggleBookmark }) => {
  const [copied, setCopied] = useState(false);
  if (!notice) return null;

  const dDay = calculateDDay(notice.deadline, notice.isOngoing);
  const source = SOURCES[notice.source] ?? { label: notice.source, url: '#' };
  const catColor = CATEGORY_COLORS[notice.category] ?? { bg: '#f9fafb', text: '#374151', border: '#d1d5db' };

  const copyLink = () => {
    navigator.clipboard.writeText(notice.officialUrl || window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="modal-slide-up bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── 헤더: 카테고리 컬러 배너 ── */}
        <div className="fade-in-up-1 relative px-6 pt-5 pb-4"
             style={{ background: `linear-gradient(135deg, ${catColor.bg} 0%, #fff 100%)`, borderBottom: `2px solid ${catColor.border}` }}>
          {/* 인하대 그라데이션 바 */}
          <div className="inha-gradient-bar absolute top-0 left-0 right-0 h-[3px]" />

          <div className="flex items-start justify-between gap-4 mt-1">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-1.5 text-xs mb-2">
                <span className="font-bold px-2.5 py-1 rounded-full text-xs"
                      style={{ background: catColor.bg, color: catColor.text, border: `1px solid ${catColor.border}` }}>
                  {CATEGORY_LABELS[notice.category]}
                </span>
                <span className="text-neutral-400">·</span>
                <span className="text-neutral-600">{notice.subcategory}</span>
                <span className="text-neutral-400">·</span>
                <span className="inline-flex items-center gap-1 text-neutral-500">
                  <User className="w-3 h-3" /> {notice.organizer}
                </span>
                {notice.isUserSubmitted && (
                  <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded-full font-medium border border-sky-200">제보된 공고</span>
                )}
              </div>
              <h2 className="text-xl font-black text-neutral-900 leading-snug" style={{ letterSpacing: '-0.02em' }}>
                {notice.title}
              </h2>
            </div>
            <button onClick={onClose}
                    className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors shrink-0"
                    title="닫기">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── 본문 ── */}
        <div className="p-6 space-y-5 text-sm max-h-[65vh] overflow-y-auto">

          {/* 혜택 배너 */}
          {notice.benefit && (
            <div className="fade-in-up-2 p-4 rounded-xl flex items-center gap-3"
                 style={{ background: 'linear-gradient(135deg, var(--inha-blue-light), #fff)', border: '1px solid #c7d9ff' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                   style={{ background: 'linear-gradient(135deg, #003087, #0050c8)' }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase block mb-0.5"
                      style={{ color: 'var(--inha-blue)' }}>주요 혜택</span>
                <span className="font-bold text-neutral-900">{notice.benefit}</span>
              </div>
            </div>
          )}

          {/* D-Day + 마감일 */}
          <div className="fade-in-up-3 grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
              <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-widest block mb-1.5">접수 현황</span>
              <span className={`inline-block text-sm font-bold px-3 py-1 rounded-full border tabular-nums ${dDay.badgeColorClass}`}>
                {dDay.dDayText}
              </span>
            </div>
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
              <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-widest block mb-1.5">마감일</span>
              <div className="text-lg font-black tabular-nums text-neutral-900" style={{ letterSpacing: '-0.02em' }}>
                {notice.isOngoing ? '상시모집' : formatDeadlineLabel(notice.deadline)}
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="fade-in-up-3 flex gap-2">
            <button
              onClick={() => generateIcsCalendar(notice.title, `${notice.organizer} · ${notice.benefit}`, notice.deadline, notice.officialUrl)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-neutral-500" />
              <span>캘린더에 저장</span>
            </button>
            <button
              onClick={() => onToggleBookmark(notice.id)}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${isBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-sm'
                : 'border-neutral-200 text-neutral-700 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-800'}`}
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
              <span>{isBookmarked ? '보관함에 저장됨 ✓' : '보관함에 저장'}</span>
            </button>
          </div>

          {/* 요약 */}
          {notice.summary && (
            <div className="fade-in-up-4">
              <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">요약</h4>
              <p className="text-neutral-700 leading-relaxed text-sm bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                {notice.summary}
              </p>
            </div>
          )}

          {/* 상세 내용 */}
          {notice.description && (
            <div className="fade-in-up-4">
              <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">상세 내용</h4>
              <p className="text-neutral-600 leading-relaxed text-xs sm:text-sm whitespace-pre-line bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                {notice.description}
              </p>
            </div>
          )}

          {/* 메타 정보 */}
          <div className="fade-in-up-5 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-neutral-100 text-xs">
            <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100">
              <dt className="text-neutral-400 mb-1 font-semibold">접수 기간</dt>
              <dd className="font-bold tabular-nums text-neutral-800">
                {notice.startDate ?? '확인 요망'} ~ {notice.isOngoing ? '상시' : (notice.deadline ?? '상시')}
              </dd>
            </div>
            <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100">
              <dt className="text-neutral-400 mb-1 font-semibold">공고 출처</dt>
              <dd className="font-bold text-neutral-800">{source.label}</dd>
            </div>
            {notice.careerFields && notice.careerFields.length > 0 && (
              <div className="sm:col-span-2 bg-neutral-50 rounded-xl p-3 border border-neutral-100">
                <dt className="text-neutral-400 mb-1 font-semibold">관련 진로</dt>
                <dd className="font-bold text-neutral-800">{notice.careerFields.map((f) => CAREER_LABELS[f]).join(' · ')}</dd>
              </div>
            )}
          </div>

          {/* 태그 */}
          {notice.tags.length > 0 && (
            <div className="fade-in-up-5 flex flex-wrap gap-1.5">
              <Tag className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
              {notice.tags.map((t) => (
                <span key={t} className="text-[11px] text-neutral-500 bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded-full transition-colors">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── 하단 액션 바 ── */}
        <div className="px-5 py-4 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs"
             style={{ background: 'linear-gradient(to right, var(--inha-blue-light), #fff)' }}>
          <button onClick={copyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-xl transition-colors cursor-pointer shadow-sm">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? '링크 복사됨 ✓' : '원문 링크 복사'}</span>
          </button>
          <a
            href={resolveNoticeUrl(notice)} target="_blank" rel="noreferrer noopener"
            className="inline-flex items-center gap-2 px-5 py-2.5 font-bold text-white rounded-xl transition-all shadow-md hover:shadow-lg text-xs"
            style={{ background: 'linear-gradient(135deg, #003087 0%, #0050c8 100%)' }}
          >
            <span>{source.label}에서 자세히 보기·신청</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
