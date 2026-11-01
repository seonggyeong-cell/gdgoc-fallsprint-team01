// [담당: 역할 A] 공고 제보 모달 — 로그인 사용자가 발견한 공고를 링크와 함께 등록
import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { CAREER_FIELDS, CATEGORIES } from '@/config/constants';
import type { CareerField, NoticeCategory, NoticeItem } from '@/types';
import { daysFromToday } from '@/utils/dateUtils';

interface Props {
  onSubmitNotice: (notice: NoticeItem) => void;
  onClose: () => void;
}

export const NewNoticeModal: React.FC<Props> = ({ onSubmitNotice, onClose }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('career');
  const [subcategory, setSubcategory] = useState(CATEGORIES.find((c) => c.key === 'career')!.subcategories[0]);
  const [organizer, setOrganizer] = useState('');
  const [officialUrl, setOfficialUrl] = useState('');
  const [benefit, setBenefit] = useState('');
  const [isOngoing, setIsOngoing] = useState(false);
  const [deadline, setDeadline] = useState(daysFromToday(14));
  const [summary, setSummary] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [careerFields, setCareerFields] = useState<CareerField[]>([]);
  const [error, setError] = useState('');

  const subs = CATEGORIES.find((c) => c.key === category)!.subcategories;
  const input = 'w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs';

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return setError('공고 제목을 입력해주세요.');
    if (!organizer.trim()) return setError('주관 기관(또는 회사)을 입력해주세요.');
    if (!/^https?:\/\//i.test(officialUrl.trim())) return setError('원문 링크는 http:// 또는 https://로 시작해야 합니다.');
    if (!benefit.trim()) return setError('지원 혜택(급여·상금 등)을 입력해주세요.');
    if (!isOngoing && !deadline) return setError('마감일을 입력해주세요.');

    const today = daysFromToday(0);
    onSubmitNotice({
      id: `user-${Date.now()}`,
      title: title.trim(), category, subcategory, organizer: organizer.trim(),
      source: 'user', officialUrl: officialUrl.trim(), benefit: benefit.trim(),
      startDate: today, deadline: isOngoing ? daysFromToday(365) : deadline, isOngoing,
      summary: summary.trim() || `${organizer.trim()}에서 올린 ${subcategory} 공고입니다.`,
      tags: tagInput.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean),
      careerFields, views: 0, bookmarkedCount: 0, createdAt: today, isUserSubmitted: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh]" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">공고 제보하기</h2>
            <p className="text-xs text-neutral-500 mt-0.5">다른 학생에게 도움이 될 공고를 원문 링크와 함께 등록해 주세요.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg border border-neutral-200 text-neutral-500 hover:text-neutral-800 cursor-pointer" title="닫기"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={submit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div role="alert" className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span>
            </div>
          )}
          <div><label className="block font-semibold text-neutral-700 mb-1.5">공고 제목 *</label>
            <input className={input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: OO기업 하계 인턴 모집" /></div>

          <div className="grid grid-cols-2 gap-3">
            <div><label className="block font-semibold text-neutral-700 mb-1.5">분야 *</label>
              <select className={input} value={category} onChange={(e) => { const c = e.target.value as NoticeCategory; setCategory(c); setSubcategory(CATEGORIES.find((x) => x.key === c)!.subcategories[0]); }}>
                {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select></div>
            <div><label className="block font-semibold text-neutral-700 mb-1.5">세부분야 *</label>
              <select className={input} value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
                {subs.map((s) => <option key={s} value={s}>{s}</option>)}
              </select></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div><label className="block font-semibold text-neutral-700 mb-1.5">주관 기관/회사 *</label>
              <input className={input} value={organizer} onChange={(e) => setOrganizer(e.target.value)} /></div>
            <div><label className="block font-semibold text-neutral-700 mb-1.5">지원 혜택 *</label>
              <input className={input} value={benefit} onChange={(e) => setBenefit(e.target.value)} placeholder="예: 월 200만원, 총 상금 500만원" /></div>
          </div>

          <div><label className="block font-semibold text-neutral-700 mb-1.5">원문 링크 *</label>
            <input className={input} value={officialUrl} onChange={(e) => setOfficialUrl(e.target.value)} placeholder="https://..." /></div>

          <div className="grid grid-cols-2 gap-3 items-end">
            <div><label className="block font-semibold text-neutral-700 mb-1.5">마감일 *</label>
              <input type="date" className={`${input} disabled:opacity-40`} value={deadline} disabled={isOngoing} onChange={(e) => setDeadline(e.target.value)} /></div>
            <label className="flex items-center gap-2 pb-2 cursor-pointer">
              <input type="checkbox" checked={isOngoing} onChange={(e) => setIsOngoing(e.target.checked)} className="w-3.5 h-3.5 rounded border-neutral-300 text-indigo-600" />
              <span className="font-medium text-neutral-700">상시모집 (마감일 없음)</span>
            </label>
          </div>

          <div><label className="block font-semibold text-neutral-700 mb-1.5">한 줄 요약</label>
            <textarea className={input} rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} /></div>

          <div><label className="block font-semibold text-neutral-700 mb-1.5">태그 (쉼표로 구분)</label>
            <input className={input} value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="인턴, 개발자, 정규직전환" /></div>

          <div><span className="block font-semibold text-neutral-700 mb-1.5">관련 진로 (추천에 사용)</span>
            <div className="flex flex-wrap gap-1.5">
              {CAREER_FIELDS.map((c) => {
                const on = careerFields.includes(c.key);
                return (
                  <button type="button" key={c.key} onClick={() => setCareerFields(on ? careerFields.filter((x) => x !== c.key) : [...careerFields, c.key])}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium cursor-pointer ${on ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'}`}>{c.label}</button>
                );
              })}
            </div></div>

          <div className="pt-3 border-t border-neutral-200 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-neutral-600 bg-neutral-100 rounded-lg font-medium cursor-pointer">취소</button>
            <button type="submit" className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium cursor-pointer">제보 등록</button>
          </div>
        </form>
      </div>
    </div>
  );
};
