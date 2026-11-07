import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  Calendar,
  Share2,
  ExternalLink,
  Download,
  Building,
  CheckCircle,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  Check,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { NoticeItem, StudentProfile, BookmarkRecord, ApplicationStage } from '../types/notice';
import { DDayBlock } from './DDayBlock';
import { CATEGORIES } from '../constants/categories';
import { SOURCE_TIERS } from '../constants/sourceTiers';
import { DEPARTMENT_MAP } from '../constants/departments';
import { formatDateKorean, generateIcsCalendar } from '../utils/dateUtils';

interface NoticeDetailModalProps {
  notice: NoticeItem | null;
  allNotices?: NoticeItem[];
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  profile: StudentProfile;
  onSelectNotice?: (notice: NoticeItem) => void;
  onShowToast: (msg: string) => void;
  record?: BookmarkRecord;
  onUpdateRecord?: (id: string, stage: ApplicationStage, memo?: string) => void;
}

export const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({
  notice,
  allNotices = [],
  onClose,
  isBookmarked,
  onToggleBookmark,
  profile,
  onSelectNotice,
  onShowToast,
  record,
  onUpdateRecord,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [preparedDocs, setPreparedDocs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'eligibility' | 'documents'>('details');

  // Load prepared documents from localStorage
  useEffect(() => {
    if (!notice) return;
    try {
      const stored = localStorage.getItem(`schoolhub_docs_${notice.id}`);
      if (stored) {
        setPreparedDocs(JSON.parse(stored));
      } else {
        setPreparedDocs([]);
      }
    } catch {
      setPreparedDocs([]);
    }
  }, [notice]);

  if (!notice) return null;

  const cat = CATEGORIES[notice.category] || CATEGORIES.academic;
  const Icon = cat.icon;

  const handleToggleDoc = (doc: string) => {
    const next = preparedDocs.includes(doc)
      ? preparedDocs.filter((d) => d !== doc)
      : [...preparedDocs, doc];
    setPreparedDocs(next);
    try {
      localStorage.setItem(`schoolhub_docs_${notice.id}`, JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#/notice/${notice.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      onShowToast('공고 공유 링크가 복사되었습니다!');
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const handleAddToCalendar = () => {
    generateIcsCalendar(
      notice.title,
      `[스쿨모아 - 인하대] ${notice.organizer} 주관: ${notice.benefit}\n마감일: ${notice.deadline}`,
      notice.deadline
    );
    onShowToast('마감 일정이 .ics 파일로 다운로드되었습니다.');
  };

  // Eligibility evaluation
  const eligibilityResults = notice.eligibilityCriteria.map((c) => {
    let passed = true;
    let reason = '조건 충족';

    if (c.criterionType === 'gpa' && c.minGpa) {
      if (profile.gpa < c.minGpa) {
        passed = false;
        reason = `현재 학점(${profile.gpa.toFixed(2)})이 기준(${c.minGpa.toFixed(2)}) 미달`;
      } else {
        reason = `현재 학점(${profile.gpa.toFixed(2)}) 충족 (기준: ${c.minGpa.toFixed(2)} 이상)`;
      }
    } else if (c.criterionType === 'income' && c.maxIncomeDecile) {
      if (profile.incomeDecile > c.maxIncomeDecile) {
        passed = false;
        reason = `현재 소득구간(${profile.incomeDecile}구간)이 기준(${c.maxIncomeDecile}구간 이내) 초과`;
      } else {
        reason = `현재 소득구간(${profile.incomeDecile}구간) 충족`;
      }
    } else if (c.criterionType === 'grade' && c.allowedGrades) {
      if (!c.allowedGrades.includes(profile.grade)) {
        passed = false;
        reason = `현재 ${profile.grade}학년은 대상 학년(${c.allowedGrades.join(', ')}학년)에 해당되지 않음`;
      } else {
        reason = `현재 ${profile.grade}학년 대상 포함`;
      }
    }

    return {
      criterion: c,
      passed,
      reason,
    };
  });

  const allPassed = eligibilityResults.every((r) => !r.criterion.required || r.passed);

  // Similar notices (same category or similar subcategory)
  const similarNotices = allNotices
    .filter((n) => n.id !== notice.id && (n.category === notice.category || n.organizer === notice.organizer))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-2xl sm:rounded-[20px] shadow-2xl border border-[#E3E8F0] overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: D-Day Block + Title + Close */}
        <div className="p-5 border-b border-[#E3E8F0] bg-[#F8FAFC] flex items-start gap-4">
          <DDayBlock deadline={notice.deadline} isOngoing={notice.isOngoing} size="lg" />

          <div className="flex-1 min-w-0">
            {/* Category tag & Source Tier Badge & Source */}
            <div className="flex flex-wrap items-center gap-1.5 text-[12px] mb-1.5">
              {/* Source Tier Badge */}
              {notice.sourceTier && SOURCE_TIERS[notice.sourceTier] && (
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-[6px] border ${SOURCE_TIERS[notice.sourceTier].badgeClass}`}
                >
                  {(() => {
                    const TierIcon = SOURCE_TIERS[notice.sourceTier].icon;
                    return <TierIcon className="w-3 h-3 shrink-0" />;
                  })()}
                  <span>{SOURCE_TIERS[notice.sourceTier].badgeLabel}</span>
                </span>
              )}

              {/* Department Badge if applicable */}
              {notice.department && (
                <span
                  className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-[6px] border ${
                    DEPARTMENT_MAP[notice.department]?.badgeClass || 'bg-[#F0FDF4] text-[#15803D] border-[#16A34A]/30'
                  }`}
                >
                  <span>{notice.department}</span>
                </span>
              )}

              <span
                className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-[6px]"
                style={{
                  backgroundColor: cat.bgColorClass.replace('bg-[', '').replace(']', ''),
                  color: cat.color,
                }}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{cat.label}</span>
              </span>
              <span className="text-neutral-300">·</span>
              <span className="text-neutral-600 font-semibold truncate">
                {notice.sourceSiteName || notice.organizer}
              </span>
              <span className="text-neutral-300">·</span>
              <span className="text-neutral-400 tabular-nums">
                {notice.isOngoing ? '상시' : `~${formatDateKorean(notice.deadline)} 마감`}
              </span>
            </div>

            <h2 className="text-[17px] sm:text-[19px] font-extrabold text-[#0F172A] leading-snug">
              {notice.title}
            </h2>

            {/* Benefit Row in brand-2 bold */}
            <div className="text-[14px] font-extrabold text-[#1D5FC4] mt-1 flex items-center gap-1.5">
              <span>{notice.benefit}</span>
              {notice.recommendationReason && (
                <span className="text-[11px] font-semibold text-[#5B4BD1] bg-[#F2EFFF] px-2 py-0.5 rounded-full ml-1">
                  {notice.recommendationReason}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-[8px] text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors cursor-pointer shrink-0"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Priority Actions: Large Primary CTA & 3 Action Buttons Side-by-Side (as requested in PDF Page 10 & 12) */}
        <div className="p-4 bg-white border-b border-[#E3E8F0] space-y-2.5">
          {/* Main Primary CTA */}
          <a
            href={notice.officialUrl || 'https://www.inha.ac.kr'}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 rounded-[10px] bg-[#0B2A5B] hover:bg-[#1D5FC4] text-white font-extrabold text-[14px] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm text-center"
          >
            <span>원문에서 신청하기 ({notice.sourceSiteName || '공식 사이트'})</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* 3 Buttons Side-by-Side: 보관하기 / 캘린더에 추가 / 링크 공유 */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                onToggleBookmark(notice.id);
                onShowToast(isBookmarked ? '보관함에서 제외했습니다.' : '보관함에 담았습니다!');
              }}
              className={`py-2 px-3 rounded-[8px] border text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-white border-[#E3E8F0] text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <Star
                className="w-3.5 h-3.5"
                fill={isBookmarked ? 'currentColor' : 'none'}
              />
              <span>{isBookmarked ? '보관 완료' : '보관하기'}</span>
            </button>

            <button
              onClick={handleAddToCalendar}
              className="py-2 px-3 rounded-[8px] border border-[#E3E8F0] bg-white hover:bg-neutral-50 text-neutral-700 text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#1D5FC4]" />
              <span>캘린더 추가</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="py-2 px-3 rounded-[8px] border border-[#E3E8F0] bg-white hover:bg-neutral-50 text-neutral-700 text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? '복사됨' : '링크 공유'}</span>
            </button>
          </div>

          {/* 내 지원 현황 관리 바 (Application Stage Management) */}
          {onUpdateRecord && (
            <div className="p-3 bg-[#F8FAFC] rounded-[10px] border border-[#E3E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[12px]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-600">내 지원 상태:</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-extrabold text-[11px] ${
                    record?.stage === 'submitted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : record?.stage === 'accepted'
                        ? 'bg-purple-100 text-purple-800'
                        : record?.stage === 'preparing'
                          ? 'bg-amber-100 text-amber-800'
                          : isBookmarked
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {record?.stage === 'submitted'
                    ? '✓ 지원 완료'
                    : record?.stage === 'accepted'
                      ? '★ 최종 합격'
                      : record?.stage === 'preparing'
                        ? '지원 준비 중'
                        : isBookmarked
                          ? '보관됨'
                          : '미신청'}
                </span>
              </div>

              {/* Stage selector buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateRecord(notice.id, 'preparing');
                    onShowToast(`'${notice.title}' 지원 준비 중 상태로 변경했습니다.`);
                  }}
                  className={`px-2.5 py-1 rounded-[6px] text-[11px] font-bold border transition-colors cursor-pointer ${
                    record?.stage === 'preparing'
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  준비 중
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onUpdateRecord(notice.id, 'submitted');
                    onShowToast(`'${notice.title}' 지원 완료로 변경했습니다! (캘린더 숨김 기능 연동)`);
                  }}
                  className={`px-2.5 py-1 rounded-[6px] text-[11px] font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                    record?.stage === 'submitted'
                      ? 'bg-[#0E9F6E] text-white border-[#0E9F6E]'
                      : 'bg-[#EAF8F1] text-[#0E9F6E] border-[#0E9F6E]/40 hover:bg-[#0E9F6E] hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>지원 완료</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onUpdateRecord(notice.id, 'accepted');
                    onShowToast(`'${notice.title}' 최종 합격으로 변경했습니다! 축하합니다.`);
                  }}
                  className={`px-2.5 py-1 rounded-[6px] text-[11px] font-bold border transition-colors cursor-pointer ${
                    record?.stage === 'accepted'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  최종 합격
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tab Header */}
        <div className="flex border-b border-[#E3E8F0] bg-white px-5 gap-6 text-[13px] font-bold">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 relative cursor-pointer transition-colors ${
              activeTab === 'details'
                ? 'text-[#0B2A5B]'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            상세 요강
            {activeTab === 'details' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B2A5B]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('eligibility')}
            className={`py-3 relative flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'eligibility'
                ? 'text-[#0B2A5B]'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            지원 자격 진단
            {allPassed ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
            {activeTab === 'eligibility' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B2A5B]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`py-3 relative flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'documents'
                ? 'text-[#0B2A5B]'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            서류 체크 ({preparedDocs.length}/{notice.requiredDocuments.length})
            {activeTab === 'documents' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B2A5B]" />
            )}
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-[13px] text-neutral-800">
          {activeTab === 'details' && (
            <div className="space-y-5">
              {/* Target & Date Info Box */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-[12px] bg-[#F8FAFC] border border-[#E3E8F0] text-[12px]">
                <div>
                  <span className="text-neutral-400 block mb-1 font-medium">지원 대상 / 학년</span>
                  <span className="font-bold text-[#0F172A]">
                    {notice.targetAudience} ({notice.targetGrades.join(', ')}학년)
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-1 font-medium">접수 기간</span>
                  <span className="font-bold text-[#0F172A] tabular-nums">
                    {notice.startDate} ~ {notice.deadline}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-[12px] font-bold text-neutral-500 mb-2">공고 상세 내용</h4>
                <div className="p-4 bg-white border border-[#E3E8F0] rounded-[12px] leading-relaxed whitespace-pre-line text-neutral-700 text-[13px]">
                  {notice.description}
                </div>
              </div>

              {/* Schedule Steps */}
              {notice.scheduleSteps && notice.scheduleSteps.length > 0 && (
                <div>
                  <h4 className="text-[12px] font-bold text-neutral-500 mb-2">진행 일정</h4>
                  <div className="border border-[#E3E8F0] rounded-[12px] divide-y divide-neutral-100 bg-white">
                    {notice.scheduleSteps.map((step, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between text-[12px]">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-700 font-bold flex items-center justify-center text-[10px] tabular-nums">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-neutral-800">{step.step}</span>
                        </div>
                        <span className="text-neutral-500 font-medium tabular-nums">{step.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact info */}
              <div className="p-3.5 rounded-[12px] border border-[#E3E8F0] bg-[#F8FAFC] text-[12px]">
                <div className="font-bold text-[#0F172A] mb-1">문의 및 접수처</div>
                <div className="text-neutral-600 space-y-0.5">
                  <div>부서: {notice.contact.department}</div>
                  {notice.contact.personName && <div>담당: {notice.contact.personName}</div>}
                  {notice.contact.phone && <div>연락처: {notice.contact.phone}</div>}
                  {notice.contact.email && <div>이메일: {notice.contact.email}</div>}
                </div>
              </div>

              {/* Similar 3 notices as requested by PDF */}
              {similarNotices.length > 0 && (
                <div className="pt-3 border-t border-neutral-100">
                  <h4 className="text-[13px] font-bold text-[#0F172A] mb-2.5">
                    비슷한 추천 공고
                  </h4>
                  <div className="space-y-2">
                    {similarNotices.map((sim) => (
                      <div
                        key={sim.id}
                        onClick={() => onSelectNotice && onSelectNotice(sim)}
                        className="p-3 rounded-[10px] border border-[#E3E8F0] hover:border-[#1D5FC4]/50 hover:bg-[#F8FAFC] flex items-center justify-between transition-colors cursor-pointer group"
                      >
                        <div className="truncate pr-3">
                          <div className="text-[13px] font-bold text-[#0F172A] group-hover:text-[#1D5FC4] truncate">
                            {sim.title}
                          </div>
                          <div className="text-[11px] text-[#1D5FC4] font-medium mt-0.5 truncate">
                            {sim.benefit}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-[#1D5FC4] shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'eligibility' && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-[12px] border flex items-start gap-3 ${
                  allPassed
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50/80 border-amber-200 text-amber-900'
                }`}
              >
                {allPassed ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-[14px]">
                    {allPassed
                      ? '축하합니다! 현재 등록된 프로필 기준 지원 요건을 모두 충족합니다.'
                      : '일부 자격 요건의 확인이 필요합니다.'}
                  </h4>
                  <p className="text-[12px] mt-1 leading-relaxed opacity-90">
                    현재 설정: {profile.major} {profile.grade}학년 · 평점 {profile.gpa.toFixed(2)}/4.5 · 소득 {profile.incomeDecile}구간
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {eligibilityResults.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-[12px] border border-[#E3E8F0] bg-white flex items-start justify-between gap-3 text-[12px]"
                  >
                    <div>
                      <div className="font-bold text-[#0F172A]">{item.criterion.title}</div>
                      <p className="text-neutral-500 mt-0.5">{item.criterion.detail}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[11px] shrink-0 ${
                        item.passed
                          ? 'text-emerald-700 bg-emerald-50'
                          : 'text-amber-800 bg-amber-50'
                      }`}
                    >
                      {item.passed ? '충족' : '확인요망'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-bold text-[#0F172A]">제출 서류 목록</span>
                <span className="font-bold text-[#1D5FC4] tabular-nums">
                  {preparedDocs.length} / {notice.requiredDocuments.length} 준비 완료
                </span>
              </div>

              <div className="space-y-2">
                {notice.requiredDocuments.map((doc, idx) => {
                  const isChecked = preparedDocs.includes(doc);
                  return (
                    <label
                      key={idx}
                      onClick={() => handleToggleDoc(doc)}
                      className={`flex items-start gap-3 p-3 rounded-[10px] border transition-all cursor-pointer ${
                        isChecked
                          ? 'border-[#1D5FC4]/40 bg-[#EEF4FF]/30 text-neutral-900'
                          : 'border-[#E3E8F0] bg-white text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-[#1D5FC4] focus:ring-[#1D5FC4] w-4 h-4 cursor-pointer"
                      />
                      <span className={`text-[12px] font-medium ${isChecked ? 'line-through text-neutral-400' : ''}`}>
                        {doc}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
