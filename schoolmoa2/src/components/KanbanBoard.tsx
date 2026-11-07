import React, { useState } from 'react';
import {
  Bookmark,
  Calendar,
  Download,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import { NoticeItem, ApplicationStage, BookmarkRecord } from '../types/notice';
import { DDayBlock } from './DDayBlock';
import { CATEGORIES } from '../constants/categories';
import { calculateDDay, generateAllBookmarksIcs } from '../utils/dateUtils';

interface KanbanBoardProps {
  bookmarkedItems: NoticeItem[];
  records: Record<string, BookmarkRecord>;
  onUpdateRecord: (id: string, stage: ApplicationStage, memo?: string) => void;
  onRemoveBookmark: (id: string) => void;
  onSelectNotice: (notice: NoticeItem) => void;
  onShowToast: (msg: string) => void;
}

const STAGES: {
  key: ApplicationStage;
  label: string;
  countBadgeClass: string;
  headerBorderClass: string;
}[] = [
  {
    key: 'saved',
    label: '관심 등록',
    countBadgeClass: 'bg-neutral-100 text-neutral-700',
    headerBorderClass: 'border-neutral-300',
  },
  {
    key: 'preparing',
    label: '서류 준비중',
    countBadgeClass: 'bg-amber-100 text-amber-800',
    headerBorderClass: 'border-amber-400',
  },
  {
    key: 'submitted',
    label: '지원 완료',
    countBadgeClass: 'bg-blue-100 text-blue-800',
    headerBorderClass: 'border-blue-500',
  },
  {
    key: 'accepted',
    label: '최종 결과 / 합격',
    countBadgeClass: 'bg-emerald-100 text-emerald-800',
    headerBorderClass: 'border-emerald-500',
  },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  bookmarkedItems,
  records,
  onUpdateRecord,
  onRemoveBookmark,
  onSelectNotice,
  onShowToast,
}) => {
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);
  const [memoText, setMemoText] = useState('');

  // Group by stages
  const itemsByStage = React.useMemo(() => {
    const map: Record<ApplicationStage, NoticeItem[]> = {
      saved: [],
      preparing: [],
      submitted: [],
      accepted: [],
      rejected: [],
    };

    for (const item of bookmarkedItems) {
      const rec = records[item.id];
      const stage = rec?.stage || 'saved';
      if (map[stage]) {
        map[stage].push(item);
      } else {
        map.saved.push(item);
      }
    }

    return map;
  }, [bookmarkedItems, records]);

  // Summary Metrics
  const stats = React.useMemo(() => {
    let pendingCount = itemsByStage.saved.length + itemsByStage.preparing.length;
    let urgentCount = 0;
    let acceptedCount = itemsByStage.accepted.length;
    let totalEstVal = 0;

    for (const item of bookmarkedItems) {
      totalEstVal += item.estimatedValueNumber || 0;
      const d = calculateDDay(item.deadline, item.isOngoing);
      if (d.diffDays >= 0 && d.diffDays <= 7) {
        urgentCount++;
      }
    }

    return {
      pendingCount,
      urgentCount,
      acceptedCount,
      totalEstVal,
    };
  }, [bookmarkedItems, itemsByStage]);

  const handleStartEditMemo = (id: string, currentMemo?: string) => {
    setEditingMemoId(id);
    setMemoText(currentMemo || '');
  };

  const handleSaveMemo = (id: string, stage: ApplicationStage) => {
    onUpdateRecord(id, stage, memoText);
    setEditingMemoId(null);
    onShowToast('메모가 저장되었습니다.');
  };

  const handleMoveStage = (id: string, targetStage: ApplicationStage, memo?: string) => {
    onUpdateRecord(id, targetStage, memo);
    const stageName = STAGES.find((s) => s.key === targetStage)?.label;
    onShowToast(`'${stageName}' 단계로 이동했습니다.`);
  };

  const handleExportIcs = () => {
    generateAllBookmarksIcs(
      bookmarkedItems.map((n) => ({
        title: n.title,
        deadline: n.deadline,
        benefit: n.benefit,
      }))
    );
    onShowToast('보관함 전체 일정이 .ics 파일로 다운로드되었습니다.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Action-Oriented Stats as requested in PDF Section 7 & 8 */}
      <div className="bg-white rounded-[16px] border border-[#E3E8F0] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[12px] font-bold text-[#1D5FC4] bg-[#EEF4FF] px-2 py-0.5 rounded-full">
              지원 관리 파이프라인
            </span>
            <span className="text-neutral-300">·</span>
            <span className="text-[12px] text-neutral-500 font-medium">
              인하대생 맞춤 공고 스케줄러
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] flex flex-wrap items-center gap-2">
            <span>지원 예정 <strong className="text-[#1D5FC4] tabular-nums">{stats.pendingCount}건</strong></span>
            <span className="text-neutral-300 font-normal">·</span>
            <span>이번 주 마감 <strong className="text-[#E11D48] tabular-nums">{stats.urgentCount}건</strong></span>
            <span className="text-neutral-300 font-normal">·</span>
            <span>최종 결과 <strong className="text-[#0E9F6E] tabular-nums">{stats.acceptedCount}건</strong></span>
          </h2>

          <div className="text-[12px] text-neutral-400 mt-1 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            <span>
              보관된 기회의 추정 지원 혜택 합계: 약 {stats.totalEstVal.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* Action Button: Export to Calendar (.ics) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportIcs}
            disabled={bookmarkedItems.length === 0}
            className="py-2.5 px-4 rounded-[10px] bg-[#0B2A5B] hover:bg-[#1D5FC4] text-white font-bold text-[13px] flex items-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>.ics로 내 구글 캘린더에 전체 등록</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {bookmarkedItems.length === 0 ? (
        <div className="bg-white rounded-[16px] border border-[#E3E8F0] p-12 text-center text-neutral-500">
          <Bookmark className="w-12 h-12 stroke-1 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0F172A]">
            아직 보관함에 담긴 공고가 없습니다.
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            공고 카드의 별(북마크) 버튼을 클릭하여 관심 있는 장학금과 공모전을 보관하고 칸반 보드에서 지원 준비를 관리해보세요.
          </p>
        </div>
      ) : (
        /* Kanban 4-Columns Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {STAGES.map((st) => {
            const stageItems = itemsByStage[st.key] || [];

            return (
              <div
                key={st.key}
                className="bg-[#F8FAFC] rounded-[16px] border border-[#E3E8F0] p-3.5 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div
                  className={`flex items-center justify-between pb-2.5 mb-3 border-b-2 ${st.headerBorderClass}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[14px] text-[#0F172A]">
                      {st.label}
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full tabular-nums ${st.countBadgeClass}`}
                  >
                    {stageItems.length}
                  </span>
                </div>

                {/* Column Card List */}
                <div className="space-y-3 flex-1">
                  {stageItems.length === 0 ? (
                    <div className="py-8 text-center text-[12px] text-neutral-400 border border-dashed border-neutral-200 rounded-[12px]">
                      공고 없음
                    </div>
                  ) : (
                    stageItems.map((notice) => {
                      const rec = records[notice.id] || {
                        noticeId: notice.id,
                        stage: 'saved',
                        savedAt: '',
                      };
                      const cat = CATEGORIES[notice.category] || CATEGORIES.academic;
                      const Icon = cat.icon;
                      const isEditing = editingMemoId === notice.id;

                      return (
                        <div
                          key={notice.id}
                          className="bg-white rounded-[12px] border border-[#E3E8F0] hover:border-[#1D5FC4]/50 p-3 shadow-xs transition-all flex flex-col justify-between group"
                        >
                          <div>
                            {/* Card Top: D-Day & Category & Delete */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <DDayBlock
                                deadline={notice.deadline}
                                isOngoing={notice.isOngoing}
                                size="sm"
                              />

                              <div className="flex-1 min-w-0">
                                <span
                                  className="inline-flex items-center gap-1 font-bold text-[10px] px-1.5 py-0.5 rounded"
                                  style={{
                                    backgroundColor: cat.bgColorClass
                                      .replace('bg-[', '')
                                      .replace(']', ''),
                                    color: cat.color,
                                  }}
                                >
                                  <Icon className="w-3 h-3 shrink-0" />
                                  <span>{cat.shortLabel}</span>
                                </span>
                                <div className="text-[11px] text-neutral-400 truncate mt-0.5 font-medium">
                                  {notice.sourceSiteName || notice.organizer}
                                </div>
                              </div>

                              <button
                                onClick={() => onRemoveBookmark(notice.id)}
                                className="text-neutral-300 hover:text-rose-500 p-1 rounded hover:bg-neutral-50 transition-colors cursor-pointer"
                                title="보관함에서 삭제"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Title */}
                            <h4
                              onClick={() => onSelectNotice(notice)}
                              className="text-[13px] font-bold text-[#0F172A] group-hover:text-[#1D5FC4] transition-colors leading-snug line-clamp-2 cursor-pointer mb-1.5"
                            >
                              {notice.title}
                            </h4>

                            {/* Benefit */}
                            <div className="text-[12px] font-bold text-[#1D5FC4] truncate mb-2">
                              {notice.benefit}
                            </div>

                            {/* Memo Box */}
                            <div className="bg-neutral-50 rounded-[8px] p-2 border border-neutral-100 text-[11px] mb-2.5">
                              {isEditing ? (
                                <div className="space-y-1.5">
                                  <textarea
                                    value={memoText}
                                    onChange={(e) => setMemoText(e.target.value)}
                                    placeholder="서류 준비 메모, 마감 시간 등..."
                                    className="w-full p-1.5 bg-white border border-neutral-300 rounded text-[11px] focus:outline-none focus:ring-1 focus:ring-[#1D5FC4]"
                                    rows={2}
                                  />
                                  <div className="flex justify-end gap-1">
                                    <button
                                      onClick={() => setEditingMemoId(null)}
                                      className="px-1.5 py-0.5 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                                    >
                                      취소
                                    </button>
                                    <button
                                      onClick={() => handleSaveMemo(notice.id, rec.stage)}
                                      className="px-2 py-0.5 bg-[#0B2A5B] text-white rounded font-bold cursor-pointer"
                                    >
                                      저장
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  onClick={() => handleStartEditMemo(notice.id, rec.memo)}
                                  className="flex items-center justify-between text-neutral-600 hover:text-neutral-900 cursor-pointer"
                                >
                                  <span className="truncate">
                                    {rec.memo ? `📝 ${rec.memo}` : '+ 메모 추가하기'}
                                  </span>
                                  <Edit3 className="w-3 h-3 text-neutral-400 shrink-0 ml-1" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Stage Transition Buttons */}
                          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-1 text-[11px]">
                            {/* Prev stage button */}
                            {st.key !== 'saved' && (
                              <button
                                onClick={() => {
                                  const prev =
                                    st.key === 'preparing'
                                      ? 'saved'
                                      : st.key === 'submitted'
                                        ? 'preparing'
                                        : 'submitted';
                                  handleMoveStage(notice.id, prev, rec.memo);
                                }}
                                className="px-2 py-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded transition-colors cursor-pointer flex items-center gap-0.5"
                                title="이전 단계로"
                              >
                                <ArrowLeft className="w-3 h-3" />
                                <span>이전</span>
                              </button>
                            )}

                            {/* Next stage button */}
                            {st.key !== 'accepted' && (
                              <button
                                onClick={() => {
                                  const next =
                                    st.key === 'saved'
                                      ? 'preparing'
                                      : st.key === 'preparing'
                                        ? 'submitted'
                                        : 'accepted';
                                  handleMoveStage(notice.id, next, rec.memo);
                                }}
                                className="ml-auto px-2 py-1 font-bold text-[#1D5FC4] bg-[#EEF4FF] hover:bg-[#1D5FC4] hover:text-white rounded transition-colors cursor-pointer flex items-center gap-0.5"
                              >
                                <span>
                                  {st.key === 'saved'
                                    ? '서류 준비'
                                    : st.key === 'preparing'
                                      ? '지원 완료'
                                      : '합격 결과'}
                                </span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
