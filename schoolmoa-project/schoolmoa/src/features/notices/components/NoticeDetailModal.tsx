// [담당: 역할 A] 공고 상세 모달 — 상세 내용은 요약만 보여주고 신청은 원문 사이트로 연결합니다.
import React, { useState } from 'react';
import { Bookmark, Calendar, Check, ExternalLink, Share2, Sparkles, X } from 'lucide-react';
import { CAREER_LABELS, CATEGORY_LABELS, SOURCES } from '@/config/constants';
import type { NoticeItem } from '@/types';
import { calculateDDay, formatDeadlineLabel, generateIcsCalendar } from '@/utils/dateUtils';

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
  const source = SOURCES[notice.source];

  const copyLink = () => {
    navigator.clipboard.writeText(notice.officialUrl || window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh]" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-neutral-200 bg-neutral-50/50 flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
              <span className="font-semibold text-neutral-900">{CATEGORY_LABELS[notice.category]}</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span>{notice.subcategory}</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span>{notice.organizer}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 leading-tight">{notice.title}</h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleBookmark(notice.id)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${isBookmarked ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-neutral-200 text-neutral-500 hover:text-neutral-800'}`}
              title={isBookmarked ? '보관함에서 제거' : '관심 공고 보관'}
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
            <button onClick={onClose} className="p-2 rounded-lg border border-neutral-200 bg-white text-neutral-500 hover:text-neutral-800 cursor-pointer" title="닫기">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 마감일(due date)을 가장 눈에 띄게 */}
        <div className="px-5 py-3 bg-neutral-900 text-white flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-neutral-400">마감일</div>
              <div className="text-base font-bold tabular-nums">{notice.isOngoing ? '상시모집' : formatDeadlineLabel(notice.deadline)}</div>
            </div>
            <span className={`px-2 py-0.5 rounded text-xs tabular-nums ${dDay.badgeColorClass}`}>{dDay.dDayText}</span>
          </div>
          {!notice.isOngoing && (
            <button
              onClick={() => generateIcsCalendar(notice.title, `${notice.organizer} · ${notice.benefit}`, notice.deadline, notice.officialUrl)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>내 캘린더에 추가 (.ics)</span>
            </button>
          )}
        </div>

        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-sm text-neutral-800">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs font-medium text-neutral-900">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-neutral-500">지원 혜택</span>
            <span className="font-bold">{notice.benefit}</span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-neutral-400 mb-2">공고 요약</h4>
            <p className="text-xs sm:text-sm leading-relaxed text-neutral-700 whitespace-pre-line">{notice.description || notice.summary}</p>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs p-4 rounded-xl border border-neutral-200">
            <div><dt className="text-neutral-400 mb-0.5">접수 기간</dt><dd className="font-semibold tabular-nums">{notice.startDate} ~ {notice.isOngoing ? '상시' : notice.deadline}</dd></div>
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
          <a href={notice.officialUrl} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1.5 px-4 py-2 font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs">
            <span>{source.label}에서 자세히 보기·신청</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
