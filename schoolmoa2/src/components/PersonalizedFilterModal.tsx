import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { StudentProfile, NoticeCategory } from '../types/notice';
import { CATEGORY_LIST } from '../constants/categories';

interface PersonalizedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
}

export const PersonalizedFilterModal: React.FC<PersonalizedFilterModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState(profile.name);
  const [grade, setGrade] = useState(profile.grade);
  const [major, setMajor] = useState(profile.major);
  const [majorTrack, setMajorTrack] = useState(profile.majorTrack);
  const [gpa, setGpa] = useState(profile.gpa);
  const [incomeDecile, setIncomeDecile] = useState(profile.incomeDecile);
  const [careerGoal, setCareerGoal] = useState(profile.careerGoal);
  const [interests, setInterests] = useState<NoticeCategory[]>(profile.interests);

  if (!isOpen) return null;

  const handleToggleInterest = (cat: NoticeCategory) => {
    if (interests.includes(cat)) {
      setInterests(interests.filter((c) => c !== cat));
    } else {
      setInterests([...interests, cat]);
    }
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSaveProfile({
      name,
      grade,
      major,
      majorTrack,
      gpa,
      incomeDecile,
      careerGoal,
      interests,
      isOnboarded: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-md rounded-[20px] shadow-2xl border border-[#E3E8F0] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E3E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-[8px] bg-[#EEF4FF] text-[#1D5FC4] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-[15px] font-extrabold text-[#0F172A]">
                인하대 맞춤 추천 조건 설정
              </h2>
              <div className="text-[11px] text-neutral-400">
                단계 {step} / 3: {step === 1 ? '학적 및 기본 정보' : step === 2 ? '성적 및 소득 요건' : '진로 및 관심 공고'}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-neutral-100 h-1">
          <div
            className="bg-[#0B2A5B] h-1 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="p-5 space-y-4 text-[13px]">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-neutral-700 mb-1.5">
                  이름 (또는 닉네임)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-[#E3E8F0] rounded-[10px] text-[#0F172A] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5FC4]"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1.5">
                  학과 / 학부
                </label>
                <select
                  value={major}
                  onChange={(e) => {
                    setMajor(e.target.value);
                    if (e.target.value.includes('컴퓨터') || e.target.value.includes('인공지능') || e.target.value.includes('소프트웨어')) {
                      setMajorTrack('software');
                    } else if (e.target.value.includes('공학')) {
                      setMajorTrack('engineering');
                    } else {
                      setMajorTrack('science');
                    }
                  }}
                  className="w-full p-2.5 bg-neutral-50 border border-[#E3E8F0] rounded-[10px] text-[#0F172A] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5FC4] cursor-pointer"
                >
                  <option value="컴퓨터공학과">소프트웨어융합대학 컴퓨터공학과</option>
                  <option value="인공지능공학과">소프트웨어융합대학 인공지능공학과</option>
                  <option value="데이터사이언스학과">소프트웨어융합대학 데이터사이언스학과</option>
                  <option value="기계공학과">공과대학 기계공학과</option>
                  <option value="전자공학과">공과대학 전자공학과</option>
                  <option value="화학공학과">공과대학 화학공학과</option>
                  <option value="경영학과">경영대학 경영학과</option>
                  <option value="수학과">자연과학대학 수학과</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1.5">
                  현재 재학 학년
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setGrade(g)}
                      className={`py-2 text-center rounded-[10px] border font-bold transition-colors cursor-pointer ${
                        grade === g
                          ? 'bg-[#0B2A5B] text-white border-[#0B2A5B]'
                          : 'bg-neutral-50 text-neutral-700 border-[#E3E8F0] hover:bg-neutral-100'
                      }`}
                    >
                      {g}학년
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-neutral-700">
                    직전학기 평점평균 (GPA)
                  </label>
                  <span className="font-extrabold text-[#0B2A5B] tabular-nums text-[15px]">
                    {gpa.toFixed(2)} / 4.50
                  </span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="4.5"
                  step="0.05"
                  value={gpa}
                  onChange={(e) => setGpa(parseFloat(e.target.value))}
                  className="w-full accent-[#0B2A5B] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-neutral-400 mt-1 tabular-nums font-medium">
                  <span>2.00</span>
                  <span>3.00</span>
                  <span>3.50 (이공계우수)</span>
                  <span>3.80 (성적우수)</span>
                  <span>4.50 (만점)</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-neutral-700">
                    한국장학재단 학자금 지원구간 (소득분위)
                  </label>
                  <span className="font-extrabold text-[#0B2A5B] tabular-nums text-[15px]">
                    {incomeDecile}구간 {incomeDecile <= 4 ? '(중점지원)' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={incomeDecile}
                  onChange={(e) => setIncomeDecile(parseInt(e.target.value, 10))}
                  className="w-full accent-[#0B2A5B] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-neutral-400 mt-1 tabular-nums font-medium">
                  <span>1구간(기초)</span>
                  <span>4구간(삼성꿈)</span>
                  <span>8구간(국가장학)</span>
                  <span>10구간</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-neutral-700 mb-1.5">
                  희망 진로 / 커리어 목표
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    'SW·개발 / AI·데이터',
                    '반도체 / 임베디드',
                    '연구원 / 대학원 진학',
                    '대기업 / 공기업 공채',
                    '스타트업 / 창업',
                    '공직 / 기술고시',
                  ].map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setCareerGoal(goal)}
                      className={`p-2 text-center text-[12px] font-bold rounded-[8px] border transition-colors cursor-pointer ${
                        careerGoal === goal
                          ? 'bg-[#EEF4FF] border-[#1D5FC4] text-[#1D5FC4]'
                          : 'bg-neutral-50 border-[#E3E8F0] text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1.5">
                  우선 관심 공고 분야 (중복 선택)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORY_LIST.map((c) => {
                    const isSelected = interests.includes(c.key);
                    return (
                      <button
                        type="button"
                        key={c.key}
                        onClick={() => handleToggleInterest(c.key)}
                        className={`px-3 py-1.5 rounded-full border text-[12px] font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#0B2A5B] text-white border-[#0B2A5B]'
                            : 'bg-white text-neutral-700 border-[#E3E8F0] hover:bg-neutral-50'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                className="px-3 py-2 text-neutral-500 hover:text-neutral-900 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>이전</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
                className="px-4 py-2 bg-[#0B2A5B] hover:bg-[#1D5FC4] text-white font-bold rounded-[10px] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>다음</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSave()}
                className="px-5 py-2 bg-[#0B2A5B] hover:bg-[#1D5FC4] text-white font-bold rounded-[10px] transition-colors cursor-pointer shadow-xs"
              >
                설정 완료 및 추천 적용
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
