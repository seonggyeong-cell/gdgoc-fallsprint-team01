import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { NoticeItem, NoticeCategory, NoticeSourceTier } from '../types/notice';
import { CATEGORIES, CATEGORY_LIST } from '../constants/categories';
import { SOURCE_TIERS, SOURCE_TIER_LIST } from '../constants/sourceTiers';
import { INHA_DEPARTMENTS } from '../constants/departments';

interface NewNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitNotice: (notice: NoticeItem) => void;
}

export const NewNoticeModal: React.FC<NewNoticeModalProps> = ({
  isOpen,
  onClose,
  onSubmitNotice,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('scholarship');
  const [subcategory, setSubcategory] = useState('성적우수');
  const [sourceTier, setSourceTier] = useState<NoticeSourceTier>('inha-main');
  const [department, setDepartment] = useState<string>('기계공학과');
  const [organizer, setOrganizer] = useState('');
  const [sourceSiteName, setSourceSiteName] = useState('인하대 포털');
  const [targetAudience, setTargetAudience] = useState('인하대학교 재학생 전원');
  const [selectedGrades, setSelectedGrades] = useState<number[]>([1, 2, 3, 4]);
  const [benefit, setBenefit] = useState('');
  const [estimatedValue, setEstimatedValue] = useState<string>('0');
  const [deadline, setDeadline] = useState('2026-11-20');
  const [startDate, setStartDate] = useState('2026-11-01');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('032-860-7000');
  const [email, setEmail] = useState('support@inha.ac.kr');
  const [officialUrl, setOfficialUrl] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentCategoryConfig = CATEGORIES[category];

  const handleCategoryChange = (cat: NoticeCategory) => {
    setCategory(cat);
    const cfg = CATEGORIES[cat];
    if (cfg && cfg.defaultSubs.length > 0) {
      setSubcategory(cfg.defaultSubs[0]);
    }
  };

  const handleGradeToggle = (g: number) => {
    if (selectedGrades.includes(g)) {
      if (selectedGrades.length > 1) {
        setSelectedGrades(selectedGrades.filter((item) => item !== g));
      }
    } else {
      setSelectedGrades([...selectedGrades, g].sort());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('공고 제목을 입력해주세요.');
      return;
    }
    if (!organizer.trim()) {
      setErrorMsg('주관 부서 또는 단체명을 입력해주세요.');
      return;
    }
    if (!benefit.trim()) {
      setErrorMsg('지원 혜택을 입력해주세요.');
      return;
    }

    const tags = tagInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newNotice: NoticeItem = {
      id: `notice-user-${Date.now()}`,
      title: title.trim(),
      category,
      subcategory,
      sourceTier,
      department: sourceTier === 'inha-dept' ? department : undefined,
      organizer: organizer.trim(),
      organizerType: category === 'activity' ? 'club' : 'school',
      sourceSiteName: sourceSiteName.trim() || '인하대 제보',
      targetAudience: targetAudience.trim(),
      targetGrades: selectedGrades,
      benefit: benefit.trim(),
      estimatedValueNumber: parseInt(estimatedValue, 10) || 0,
      startDate,
      deadline,
      views: 1,
      bookmarkedCount: 0,
      summary: summary.trim() || `${organizer}에서 주관하는 ${subcategory} 공고입니다.`,
      description: description.trim() || `${title}\n\n■ 지원 혜택: ${benefit}\n■ 신청 기한: ${deadline}`,
      eligibilityCriteria: [
        {
          id: 'crit-1',
          title: '지원 대상',
          detail: `${targetAudience} (${selectedGrades.join(', ')}학년)`,
          required: true,
          criterionType: 'grade',
          allowedGrades: selectedGrades,
        },
      ],
      requiredDocuments: ['지원신청서 1부'],
      scheduleSteps: [
        { step: '서류 접수', date: `${startDate} ~ ${deadline}` },
        { step: '선발 결과 발표', date: '마감 후 개별 통보' },
      ],
      contact: {
        department: organizer,
        phone: phone || undefined,
        email: email || undefined,
      },
      officialUrl: officialUrl || 'https://www.inha.ac.kr',
      tags: tags.length > 0 ? tags : [subcategory, '제보공고'],
      createdAt: '2026-11-01',
    };

    onSubmitNotice(newNotice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-xl rounded-[20px] shadow-2xl border border-[#E3E8F0] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E3E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-extrabold text-[#0F172A]">인하대 교내외 공고 제보·등록</h2>
            <p className="text-[12px] text-neutral-400 mt-0.5">
              학과 게시판, 교내외 장학금, 연구실 RA, 동아리 모집 공고를 등록해 동문들과 공유합니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-[13px]">
          {errorMsg && (
            <div className="p-3 rounded-[8px] bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block font-bold text-neutral-700 mb-1.5">
              분야 선택 <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {CATEGORY_LIST.map((c) => (
                <button
                  type="button"
                  key={c.key}
                  onClick={() => handleCategoryChange(c.key)}
                  className={`py-2 px-2 rounded-[8px] border font-bold text-[12px] transition-colors cursor-pointer ${
                    category === c.key
                      ? 'bg-[#0B2A5B] text-white border-[#0B2A5B]'
                      : 'bg-neutral-50 border-[#E3E8F0] text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory */}
          <div>
            <label className="block font-bold text-neutral-700 mb-1">
              세부 분류
            </label>
            <div className="flex flex-wrap gap-1.5">
              {currentCategoryConfig?.defaultSubs.map((sub) => (
                <button
                  type="button"
                  key={sub}
                  onClick={() => setSubcategory(sub)}
                  className={`px-2.5 py-1 rounded-[6px] text-[12px] font-semibold transition-colors cursor-pointer ${
                    subcategory === sub
                      ? 'bg-[#EEF4FF] text-[#1D5FC4] border border-[#1D5FC4]'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-bold text-neutral-700 mb-1">
              공고 제목 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 2026 정석 창업경진대회 참가자 모집"
              className="w-full p-2.5 bg-neutral-50 border border-[#E3E8F0] rounded-[10px] text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5FC4]"
            />
          </div>

          {/* Source Tier Classification */}
          <div>
            <label className="block font-bold text-neutral-700 mb-1.5">
              공고 출처 구분 <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SOURCE_TIER_LIST.map((tier) => (
                <button
                  type="button"
                  key={tier.key}
                  onClick={() => setSourceTier(tier.key)}
                  className={`py-2 px-2.5 rounded-[8px] border text-center text-[12px] font-bold transition-colors cursor-pointer ${
                    sourceTier === tier.key
                      ? 'bg-[#0B2A5B] text-white border-[#0B2A5B] shadow-xs'
                      : 'bg-neutral-50 text-neutral-700 border-[#E3E8F0] hover:bg-neutral-100'
                  }`}
                >
                  <div>{tier.label}</div>
                  <div className={`text-[10px] mt-0.5 font-normal ${sourceTier === tier.key ? 'text-white/80' : 'text-neutral-400'}`}>
                    {tier.shortLabel}
                  </div>
                </button>
              ))}
            </div>

            {/* Department Selector when inha-dept is selected */}
            {sourceTier === 'inha-dept' && (
              <div className="mt-2.5 p-3 rounded-[10px] bg-[#F0FDF4] border border-[#16A34A]/30 space-y-2">
                <label className="block font-bold text-[#15803D] text-[12px]">
                  세부 학과 선택 <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {INHA_DEPARTMENTS.map((dept) => (
                    <button
                      type="button"
                      key={dept.id}
                      onClick={() => setDepartment(dept.name)}
                      className={`px-2 py-1.5 rounded-[6px] text-[11px] font-bold border transition-colors cursor-pointer ${
                        department === dept.name
                          ? 'bg-[#15803D] text-white border-[#15803D] shadow-xs'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      {dept.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Organizer & Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                주관 부서 / 기관 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="예: 인하대 창업지원단, 총학생회"
                className="w-full p-2.5 bg-neutral-50 border border-[#E3E8F0] rounded-[10px] text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5FC4]"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                출처 사이트명
              </label>
              <input
                type="text"
                value={sourceSiteName}
                onChange={(e) => setSourceSiteName(e.target.value)}
                placeholder="예: 인하대 포털, 링크3.0"
                className="w-full p-2.5 bg-neutral-50 border border-[#E3E8F0] rounded-[10px] text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5FC4]"
              />
            </div>
          </div>

          {/* Benefit & Estimated Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                지원 혜택 (핵심 한 줄) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={benefit}
                onChange={(e) => setBenefit(e.target.value)}
                placeholder="예: 총 상금 500만원, 시급 11,000원"
                className="w-full p-2.5 bg-neutral-50 border border-[#E3E8F0] rounded-[10px] text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5FC4]"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                추정 지원금액 (원, 숫자만)
              </label>
              <input
                type="number"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                placeholder="3000000"
                className="w-full p-2.5 bg-neutral-50 border border-[#E3E8F0] rounded-[10px] text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5FC4]"
              />
            </div>
          </div>

          {/* Target Grades */}
          <div>
            <label className="block font-bold text-neutral-700 mb-1">
              대상 학년 (중복 선택)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => handleGradeToggle(g)}
                  className={`px-3 py-1.5 rounded-[8px] border text-[12px] font-bold cursor-pointer transition-colors ${
                    selectedGrades.includes(g)
                      ? 'bg-[#0B2A5B] text-white border-[#0B2A5B]'
                      : 'bg-neutral-50 text-neutral-700 border-[#E3E8F0] hover:bg-neutral-100'
                  }`}
                >
                  {g}학년
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                시작일
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 bg-neutral-50 border border-[#E3E8F0] rounded-[10px] text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                마감일 <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2.5 bg-neutral-50 border border-[#E3E8F0] rounded-[10px] text-[#0F172A]"
              />
            </div>
          </div>

          {/* URL & Description */}
          <div>
            <label className="block font-bold text-neutral-700 mb-1">
              공식 링크 (신청 URL)
            </label>
            <input
              type="url"
              value={officialUrl}
              onChange={(e) => setOfficialUrl(e.target.value)}
              placeholder="https://www.inha.ac.kr/..."
              className="w-full p-2.5 bg-neutral-50 border border-[#E3E8F0] rounded-[10px] text-[#0F172A]"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">
              상세 내용 요약
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="지원 자격, 선발 과정, 세부 안내사항을 입력하세요."
              className="w-full p-2.5 bg-neutral-50 border border-[#E3E8F0] rounded-[10px] text-[#0F172A]"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-neutral-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-500 hover:text-neutral-800 font-semibold cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0B2A5B] hover:bg-[#1D5FC4] text-white font-bold rounded-[10px] transition-colors cursor-pointer shadow-xs"
            >
              공고 등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
