import React from 'react';
import {
  Bookmark,
  Calendar,
  Sparkles,
  PlusCircle,
  User,
  CheckCircle2,
} from 'lucide-react';
import { StudentProfile } from '../types/notice';

interface HeaderProps {
  currentTab: 'home' | 'browse' | 'calendar' | 'bookmarks';
  onSelectTab: (tab: 'home' | 'browse' | 'calendar' | 'bookmarks') => void;
  bookmarkCount: number;
  onOpenNewNotice: () => void;
  onOpenProfile: () => void;
  profile: StudentProfile;
  isDemoAccount: boolean;
  onToggleDemoAccount: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  bookmarkCount,
  onOpenNewNotice,
  onOpenProfile,
  profile,
  isDemoAccount,
  onToggleDemoAccount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E3E8F0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Inha Identity Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('home')}
              className="text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1D5FC4] rounded"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-[#0B2A5B] to-[#1D5FC4] text-white flex items-center justify-center font-extrabold text-[17px] shadow-xs">
                  스
                </span>
                <div>
                  <div className="text-[18px] font-extrabold tracking-tight text-[#0B2A5B] group-hover:text-[#1D5FC4] transition-colors leading-none">
                    스쿨모아
                  </div>
                  <div className="text-[10px] text-neutral-400 font-semibold tracking-tight mt-0.5">
                    인하대학교 학생 전용
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Zone 2: 4 Clean Navigation Tabs (홈 / 전체 공고 / 캘린더 / 내 보관함) */}
          <nav className="hidden md:flex items-center gap-8 text-[14px] font-semibold text-neutral-500">
            <button
              onClick={() => onSelectTab('home')}
              className={`py-1 transition-colors relative cursor-pointer ${
                currentTab === 'home'
                  ? 'text-[#0B2A5B] font-extrabold'
                  : 'hover:text-neutral-900'
              }`}
            >
              홈
              {currentTab === 'home' && (
                <span className="absolute bottom-[-20px] left-0 right-0 h-[2.5px] bg-[#0B2A5B]" />
              )}
            </button>

            <button
              onClick={() => onSelectTab('browse')}
              className={`py-1 transition-colors relative cursor-pointer ${
                currentTab === 'browse'
                  ? 'text-[#0B2A5B] font-extrabold'
                  : 'hover:text-neutral-900'
              }`}
            >
              전체 공고
              {currentTab === 'browse' && (
                <span className="absolute bottom-[-20px] left-0 right-0 h-[2.5px] bg-[#0B2A5B]" />
              )}
            </button>

            <button
              onClick={() => onSelectTab('calendar')}
              className={`py-1 transition-colors relative flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'calendar'
                  ? 'text-[#0B2A5B] font-extrabold'
                  : 'hover:text-neutral-900'
              }`}
            >
              <Calendar className="w-4 h-4 text-neutral-400" />
              <span>캘린더</span>
              {currentTab === 'calendar' && (
                <span className="absolute bottom-[-20px] left-0 right-0 h-[2.5px] bg-[#0B2A5B]" />
              )}
            </button>

            <button
              onClick={() => onSelectTab('bookmarks')}
              className={`py-1 transition-colors relative flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'bookmarks'
                  ? 'text-[#0B2A5B] font-extrabold'
                  : 'hover:text-neutral-900'
              }`}
            >
              <Bookmark className="w-4 h-4 text-neutral-400" />
              <span>내 보관함</span>
              {bookmarkCount > 0 && (
                <span className="px-1.5 py-0.2 text-[11px] font-bold bg-[#E11D48] text-white rounded-full tabular-nums">
                  {bookmarkCount}
                </span>
              )}
              {currentTab === 'bookmarks' && (
                <span className="absolute bottom-[-20px] left-0 right-0 h-[2.5px] bg-[#0B2A5B]" />
              )}
            </button>
          </nav>

          {/* Zone 3: Actions (Demo Account Toggle + New Notice + Profile) */}
          <div className="flex items-center gap-2.5">
            {/* Demo Account Indicator Button as requested by PDF Section 8 & 10 */}
            <button
              onClick={onToggleDemoAccount}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold rounded-[8px] border transition-colors cursor-pointer ${
                isDemoAccount
                  ? 'bg-[#EEF4FF] border-[#1D5FC4]/40 text-[#1D5FC4]'
                  : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:bg-neutral-200'
              }`}
              title="시연용 체험 계정 데이터 활성화"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>체험 계정 (컴공 3학년)</span>
            </button>

            <button
              onClick={onOpenProfile}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-[8px] transition-colors cursor-pointer"
              title="내 조건(학과/학년/학점) 설정"
            >
              <User className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenNewNotice}
              className="inline-flex items-center gap-1 px-3.5 py-2 text-[12px] font-bold text-white bg-[#0B2A5B] hover:bg-[#1D5FC4] rounded-[10px] transition-colors shadow-xs whitespace-nowrap cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>공고 제보</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
