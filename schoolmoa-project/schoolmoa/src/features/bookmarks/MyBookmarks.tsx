// [담당: 역할 C] 내 보관함: 지원 단계 관리 + 메모
import React, { useState } from 'react';
import {
  Bookmark,
  Trash2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Edit3,
  Clock,
  Check,
} from 'lucide-react';
import { STAGES } from '@/config/constants';
import type { ApplicationStage, BookmarkRecord, NoticeItem } from '@/types';
import { calculateDDay, formatDeadlineLabel } from '@/utils/dateUtils';

interface MyBookmarksProps {
  bookmarkedItems: NoticeItem[];
  records: Record<string, BookmarkRecord>;
  onUpdateRecord: (id: string, stage: ApplicationStage, memo?: string) => void;
  onRemoveBookmark: (id: string) => void;
  onSelectNotice: (notice: NoticeItem) => void;
  onClose?: () => void;
}

export const MyBookmarks: React.FC<MyBookmarksProps> = ({
  bookmarkedItems,
  records,
  onUpdateRecord,
  onRemoveBookmark,
  onSelectNotice,
}) => {
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);
  const [memoText, setMemoText] = useState('');

  // Calculate total potential funding
  // 미선정(rejected) 공고는 합계에서 제외
  const totalFunding = bookmarkedItems.reduce((acc, item) => {
    return records[item.id]?.stage === 'rejected' ? acc : acc + (item.estimatedValueNumber || 0);
  }, 0);

  const handleStartEditMemo = (id: string, currentMemo?: string) => {
    setEditingMemoId(id);
    setMemoText(currentMemo || '');
  };

  const handleSaveMemo = (id: string, stage: ApplicationStage) => {
    onUpdateRecord(id, stage, memoText);
    setEditingMemoId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Metric: Total Potential Funding */}
      <div className="bg-gradient-to-r from-neutral-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>내 관심 공고 지원 규모 분석</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mt-1 text-white">
            총{' '}
            <span className="text-amber-400 tabular-nums font-extrabold">
              {totalFunding.toLocaleString()}원
            </span>
            의 기회를 담았습니다
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            관심 등록한 {bookmarkedItems.length}건의 급여·장학금·상금 등 추정 혜택의 합계입니다. (미선정 제외)
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-xs text-center border border-white/10">
            <div className="text-[11px] text-neutral-300">보관된 공고</div>
            <div className="text-lg font-bold text-white tabular-nums">
              {bookmarkedItems.length}건
            </div>
          </div>
        </div>
      </div>

      {/* Bookmarked Items List */}
      {bookmarkedItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center text-neutral-500">
          <Bookmark className="w-12 h-12 stroke-1 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-neutral-800">
            보관함에 담긴 공고가 없습니다.
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            공고 목록에서 북마크 버튼을 눌러 관심 있는 근로·인턴·공모전을 보관하고 지원 진행 상태를 관리해보세요.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarkedItems.map((notice) => {
            const rec = records[notice.id] || {
              noticeId: notice.id,
              stage: 'saved',
              savedAt: '',
            };
            const dDay = calculateDDay(notice.deadline, notice.isOngoing);
            const isEditing = editingMemoId === notice.id;

            return (
              <div
                key={notice.id}
                className="bg-white rounded-xl border border-neutral-200/90 p-5 shadow-xs transition-all hover:border-neutral-300"
              >
                {/* Upper Metadata & Title */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    {/* Unboxed Metadata (Zero-Pill) */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
                      <span className="font-semibold text-neutral-900">{notice.subcategory}</span>
                      <span aria-hidden="true" className="text-neutral-300">·</span>
                      <span>{notice.organizer}</span>
                      <span aria-hidden="true" className="text-neutral-300">·</span>
                      <span className={`px-1.5 py-0.2 rounded border text-[11px] tabular-nums ${dDay.badgeColorClass}`}>
                        {dDay.dDayText}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectNotice(notice)}
                      className="text-base font-bold text-neutral-900 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      {notice.title}
                    </h3>

                    <div className="flex items-center gap-1 text-xs text-neutral-700 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{notice.benefit}</span>
                    </div>
                  </div>

                  {/* Top Right Action */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => onSelectNotice(notice)}
                      className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-indigo-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                    >
                      상세보기
                    </button>
                    <button
                      onClick={() => onRemoveBookmark(notice.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="보관함에서 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Application Stage Pipeline Tracker */}
                <div className="mt-4 pt-3 border-t border-neutral-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-neutral-400 text-xs font-medium mr-1">진행 단계:</span>
                      <div className="flex items-center gap-1 bg-neutral-50 p-0.5 rounded-lg border border-neutral-200/60">
                        {STAGES.map((st) => (
                          <button
                            key={st.key}
                            onClick={() => onUpdateRecord(notice.id, st.key, rec.memo)}
                            className={`px-2.5 py-1 text-[11px] rounded font-medium transition-colors cursor-pointer ${
                              rec.stage === st.key
                                ? `${st.color} font-bold shadow-xs`
                                : 'text-neutral-500 hover:text-neutral-900'
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-neutral-400 tabular-nums">
                      마감일: {notice.isOngoing ? '상시' : formatDeadlineLabel(notice.deadline)}
                    </div>
                  </div>

                  {/* Memo Section */}
                  <div className="mt-3 bg-neutral-50 rounded-lg p-2.5 border border-neutral-200/60 text-xs">
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={memoText}
                          onChange={(e) => setMemoText(e.target.value)}
                          placeholder="신청 서류 일정, 준비할 내용, 멘토 메모 등을 자유롭게 남겨보세요..."
                          className="w-full p-2 bg-white border border-neutral-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          rows={2}
                        />
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setEditingMemoId(null)}
                            className="px-2 py-1 text-neutral-500 hover:text-neutral-700 cursor-pointer"
                          >
                            취소
                          </button>
                          <button
                            onClick={() => handleSaveMemo(notice.id, rec.stage)}
                            className="px-2.5 py-1 bg-neutral-900 text-white rounded font-medium cursor-pointer"
                          >
                            메모 저장
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => handleStartEditMemo(notice.id, rec.memo)}
                        className="flex items-center justify-between text-neutral-600 hover:text-neutral-900 cursor-pointer group"
                      >
                        <span className="truncate">
                          {rec.memo ? (
                            <span>📝 {rec.memo}</span>
                          ) : (
                            <span className="text-neutral-400 group-hover:text-neutral-600">
                              + 나만의 서류 준비 메모 추가하기 (클릭)
                            </span>
                          )}
                        </span>
                        <Edit3 className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 shrink-0 ml-2" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
