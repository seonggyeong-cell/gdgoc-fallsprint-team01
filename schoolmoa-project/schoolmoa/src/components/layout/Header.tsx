// [담당: 역할 D] 상단 헤더 (내비게이션 + 로그인/내 정보)
import React from 'react';
import { Bookmark, Calendar, PlusCircle, Sparkles } from 'lucide-react';
import { APP_NAME, NAV_TABS, SCHOOL_NAME } from '@/config/constants';
import type { AuthUser, TabKey, UserProfile } from '@/types';

interface HeaderProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  bookmarkCount: number;
  user: AuthUser | null;
  profile: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  onOpenNewNotice: () => void;
}

const TAB_ICONS: Partial<Record<TabKey, React.ReactNode>> = {
  calendar: <Calendar className="w-4 h-4 text-neutral-500" />,
  custom: <Sparkles className="w-4 h-4 text-indigo-500" />,
  bookmarks: <Bookmark className="w-4 h-4 text-neutral-500" />,
};

export const Header: React.FC<HeaderProps> = ({
  currentTab, onSelectTab, bookmarkCount, user, profile, onLogin, onLogout, onOpenProfile, onOpenNewNotice,
}) => (
  <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 transition-colors">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <button onClick={() => onSelectTab('browse')} className="text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-indigo-600 rounded">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">스</span>
              <span className="text-xl font-bold tracking-tight text-neutral-900 group-hover:text-indigo-600 transition-colors">{APP_NAME}</span>
            </div>
          </button>
          <span className="hidden lg:inline text-xs text-neutral-400 font-normal">{SCHOOL_NAME} 학생 지원·취업·활동 정보</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          {NAV_TABS.map((tab) => {
            const active = currentTab === tab.key;
            return (
              <button
                key={tab.key} onClick={() => onSelectTab(tab.key)}
                className={`py-1 transition-colors relative flex items-center gap-1.5 hover:text-neutral-900 cursor-pointer ${active ? 'text-neutral-900 font-semibold' : 'text-neutral-600'}`}
              >
                {TAB_ICONS[tab.key]}
                {tab.label}
                {tab.key === 'bookmarks' && bookmarkCount > 0 && (
                  <span className="px-1.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 rounded-full tabular-nums">{bookmarkCount}</span>
                )}
                {active && <span className="absolute bottom-[-18px] left-0 right-0 h-0.5 bg-neutral-900" />}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <button
                onClick={onOpenProfile} title="학과·희망 진로 수정"
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/80 rounded-md transition-colors cursor-pointer"
              >
                {user.picture ? (
                  <img src={user.picture} alt="" referrerPolicy="no-referrer" className="w-4 h-4 rounded-full" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
                <span className="font-medium max-w-[110px] truncate">{profile?.department || user.name}</span>
              </button>
              <button onClick={onLogout} className="hidden sm:inline text-xs text-neutral-500 hover:text-neutral-800 cursor-pointer">로그아웃</button>
            </>
          ) : (
            <button onClick={onLogin} className="px-3.5 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap">로그인</button>
          )}
          <button
            onClick={onOpenNewNotice}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs whitespace-nowrap cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>공고 제보</span>
          </button>
        </div>
      </div>
    </div>

    <div className="md:hidden flex border-t border-neutral-200 divide-x divide-neutral-200 bg-neutral-50 text-xs font-medium">
      {NAV_TABS.map((tab) => (
        <button
          key={tab.key} onClick={() => onSelectTab(tab.key)}
          className={`flex-1 py-2.5 text-center ${currentTab === tab.key ? 'text-indigo-600 font-semibold bg-white' : 'text-neutral-600'}`}
        >
          {tab.mobileLabel}{tab.key === 'bookmarks' ? `(${bookmarkCount})` : ''}
        </button>
      ))}
    </div>
  </header>
);
