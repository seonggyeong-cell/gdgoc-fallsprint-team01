// [담당: 역할 B] 학과·희망 진로 입력 모달 (첫 로그인 시 자동 표시, '나중에'로 건너뛸 수 있음)
import React, { useState } from 'react';
import { Check, Sparkles, X } from 'lucide-react';
import { CAREER_FIELDS, CATEGORIES, DEPARTMENT_SUGGESTIONS } from '@/config/constants';
import type { CareerField, NoticeCategory, UserProfile } from '@/types';

interface Props {
  profile: UserProfile;
  isOnboarding: boolean;
  onSave: (p: UserProfile) => void;
  onClose: () => void; // 저장 없이 닫기(건너뛰기)
}

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

export const ProfileModal: React.FC<Props> = ({ profile, isOnboarding, onSave, onClose }) => {
  const [department, setDepartment] = useState(profile.department);
  const [careerFields, setCareerFields] = useState<CareerField[]>(profile.careerFields);
  const [interests, setInterests] = useState<NoticeCategory[]>(profile.interestCategories);

  const chip = (on: boolean) =>
    `px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
      on ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
    }`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ department: department.trim(), careerFields, interestCategories: interests, onboarded: true });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-neutral-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-base font-bold text-neutral-900">{isOnboarding ? '맞춤 추천을 위한 정보 입력' : '내 정보 수정'}</h2>
              <p className="text-xs text-neutral-500 mt-0.5">학과와 희망 진로를 알려주면 어울리는 공고를 추천해 드려요.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:text-neutral-800 cursor-pointer" title="닫기">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-5 text-xs">
          <div>
            <label htmlFor="dept" className="block font-semibold text-neutral-700 mb-1.5">학과(본과)</label>
            <input
              id="dept" list="dept-list" value={department} onChange={(e) => setDepartment(e.target.value)}
              placeholder="예: 컴퓨터공학과"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
            <datalist id="dept-list">{DEPARTMENT_SUGGESTIONS.map((d) => <option key={d} value={d} />)}</datalist>
          </div>

          <div>
            <span className="block font-semibold text-neutral-700 mb-1.5">희망 진로 분야 (복수 선택)</span>
            <div className="flex flex-wrap gap-1.5">
              {CAREER_FIELDS.map((c) => {
                const on = careerFields.includes(c.key);
                return (
                  <button type="button" key={c.key} onClick={() => setCareerFields(toggle(careerFields, c.key))} className={chip(on)}>
                    {on && <Check className="w-3 h-3" />}{c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="block font-semibold text-neutral-700 mb-1.5">우선 보고 싶은 공고 분야</span>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => {
                const on = interests.includes(c.key);
                return (
                  <button type="button" key={c.key} onClick={() => setInterests(toggle(interests, c.key))} className={chip(on)}>
                    {on && <Check className="w-3 h-3" />}{c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-200 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-neutral-600 hover:text-neutral-900 bg-neutral-100 rounded-lg font-medium cursor-pointer">
              {isOnboarding ? '나중에' : '취소'}
            </button>
            <button type="submit" className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium cursor-pointer">저장</button>
          </div>
        </form>
      </div>
    </div>
  );
};
