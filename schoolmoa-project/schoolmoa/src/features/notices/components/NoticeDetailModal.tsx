// [담당: 역할 A] 공고 상세 모달 — 상세 내용은 요약만 보여주고 신청은 원문 사이트로 연결합니다.
import React, { useState } from 'react';
import { Bookmark, Calendar, Check, ExternalLink, Share2, Sparkles, X } from 'lucide-react';
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

export const NoticeDetailModal: React.FC<Props> = ({ notice, onClose, isBookmarked, onToggleBookmark }) => {
  const [copied, setCopied] = useState(false);
  if (!notice) return null;

  const dDay = calculateDDay(notice.deadline, notice.isOngoing);
  const source = SOURCES[notice.source] ?? { label: notice.source, url: '#' };

  const copyLink = () => {
    navigator.clipboard.writeText(notice.officialUrl || window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-neutral-100 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500 mb-2">
              <span className="font-semibold text-neutral-800">{CATEGORY_LABELS[notice.category]}</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span>{notice.subcategory}</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span className="text-neutral-600">{notice.organizer}</span>
              {notice.isUserSubmitted && (
                <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded font-medium border border-sky-200">제보된 공고</span>
              )}
            </div>
            <h2 className="text-xl font-bold text-neutral-900 leading-snug">{notice.title}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors" title="닫기">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-sm">
          {notice.benefit && (
            <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center gap-2 text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="text-xs text-indigo-700 font-medium block">주요 혜택</span>
                <span className="font-semibold">{notice.benefit}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 p-4 bg-neutral-50 rounded-xl">
            <div>
              <span className="text-xs text-neutral-500 block mb-1">접수 현황</span>
              <span className={`inline-block text-xs px-2 py-0.5 rounded border tabular-nums ${dDay.badgeColorClass}`}>{dDay.dDayText}</span>
            </div>
            <div>
              <span className="text-xs text-neutral-500 block mb-1">마감일</span>
              <div className="text-base font-bold tabular-nums">{notice.isOngoing ? '상시모집' : formatDeadlineLabel(notice.deadline)}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => generateIcsCalendar(notice.title, `${notice.organizer} · ${notice.benefit}`, notice.deadline, notice.officialUrl)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-neutral-500" />
              <span>마감일 캘린더에 저장 (.ics)</span>
            </button>
            <button
              onClick={() => onToggleBookmark(notice.id)}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${isBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
              <span>{isBookmarked ? '보관함에 저장됨' : '보관함에 저장'}</span>
            </button>
          </div>

          <div>
            <h4 className="text-xs font-bold text-neutral-700 mb-1.5">요약</h4>
            <p className="text-neutral-600 leading-relaxed text-xs sm:text-sm">{notice.summary}</p>
          </div>

          {notice.description && (
            <div>
              <h4 className="text-xs font-bold text-neutral-700 mb-1.5">상세 내용</h4>
              <p className="text-neutral-600 leading-relaxed text-xs sm:text-sm whitespace-pre-line">{notice.description}</p>
            </div>
          )}

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-3 border-t border-neutral-100">
            <div><dt className="text-neutral-400 mb-0.5">접수 기간</dt><dd className="font-semibold tabular-nums">{notice.startDate ?? '확인 요망'} ~ {notice.isOngoing ? '상시' : (notice.deadline ?? '상시')}</dd></div>
            <div><dt className="text-neutral-400 mb-0.5">공고 출처</dt><dd className="font-semibold">{source.label}</dd></div>
            {notice.careerFields && notice.careerFields.length > 0 && (
              <div className="sm:col-span-2"><dt className="text-neutral-400 mb-0.5">관련 진로</dt><dd className="font-semibold">{notice.careerFields.map((f) => CAREER_LABELS[f]).join(', ')}</dd></div>
            )}
          </dl>

          <div className="flex flex-wrap gap-1.5">
            {notice.tags.map((t) => <span key={t} className="text-[11px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">#{t}</span>)}
          </div>
        </div>

        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button onClick={copyLink} className="inline-flex items-center gap-1.5 px-3 py-2 text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? '링크 복사됨' : '원문 링크 복사'}</span>
          </button>
          <a href={resolveNoticeUrl(notice)} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1.5 px-4 py-2 font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs">
            <span>{source.label}에서 자세히 보기·신청</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};