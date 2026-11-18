// [담당: 역할 D] 상단 헤더 (내비게이션 + 로그인/내 정보)
import React from 'react';
import { Bookmark, Calendar, Globe, PlusCircle, Sparkles } from 'lucide-react';
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
  sites: <Globe className="w-4 h-4" />,
  calendar: <Calendar className="w-4 h-4" />,
  custom: <Sparkles className="w-4 h-4" />,
  bookmarks: <Bookmark className="w-4 h-4" />,
};

export const Header: React.FC<HeaderProps> = ({
  currentTab, onSelectTab, bookmarkCount, user, profile, onLogin, onLogout, onOpenProfile, onOpenNewNotice,
}) => (
  <header className="sticky top-0 z-40 bg-white/97 backdrop-blur-md border-b border-neutral-200 shadow-sm transition-colors">
    {/* 인하대 브랜드 그라데이션 바 */}
    <div className="inha-gradient-bar h-[3px] w-full" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-15">
        {/* 로고 */}
        <div className="flex items-center gap-3">
          <button onClick={() => onSelectTab('browse')} className="text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-700 rounded">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md overflow-hidden"
                   style={{ background: 'linear-gradient(135deg, #003087 0%, #0050c8 100%)' }}>
                <span className="text-white font-black text-base tracking-tight">스</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-black tracking-tight text-neutral-900 group-hover:text-blue-800 transition-colors"
                      style={{ letterSpacing: '-0.02em' }}>
                  {APP_NAME}
                </span>
                <span className="text-[9px] font-semibold tracking-widest uppercase hidden sm:block"
                      style={{ color: 'var(--inha-gold)' }}>
                  INHA UNIV.
                </span>
              </div>
            </div>
          </button>
          <span className="hidden lg:inline text-xs text-neutral-400 font-normal pl-1 border-l border-neutral-200 ml-1">
            {SCHOOL_NAME} 학생 지원·취업·활동 정보
          </span>
        </div>

        {/* 데스크톱 내비게이션 */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-neutral-600">
          {NAV_TABS.map((tab) => {
            const active = currentTab === tab.key;
            return (
              <button
                key={tab.key} onClick={() => onSelectTab(tab.key)}
                className={`py-1.5 px-3 rounded-lg transition-all relative flex items-center gap-1.5 cursor-pointer
                  ${active
                    ? 'text-white font-semibold shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                style={active ? { background: 'linear-gradient(135deg, #003087, #0050c8)' } : {}}
              >
                {TAB_ICONS[tab.key]}
                {tab.label}
                {tab.key === 'bookmarks' && bookmarkCount > 0 && (
                  <span className="px-1.5 text-[11px] font-bold bg-white/25 text-white rounded-full tabular-nums">
                    {bookmarkCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* 우측 액션 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <button
                onClick={onOpenProfile} title="학과·희망 진로 수정"
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-700 hover:text-blue-800 bg-neutral-100 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-blue-200"
              >
                {user.picture ? (
                  <img src={user.picture} alt="" referrerPolicy="no-referrer" className="w-5 h-5 rounded-full ring-1 ring-blue-200" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
                <span className="font-medium max-w-[110px] truncate">{profile?.department || user.name}</span>
              </button>
              <button onClick={onLogout} className="hidden sm:inline text-xs text-neutral-500 hover:text-neutral-800 cursor-pointer">로그아웃</button>
            </>
          ) : (
            <button
              onClick={onLogin}
              className="px-4 py-2 text-xs font-semibold text-white rounded-lg transition-all shadow-sm hover:shadow-md cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #003087, #0050c8)' }}
            >
              로그인
            </button>
          )}
          <button
            onClick={onOpenNewNotice}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white rounded-lg transition-all shadow-sm hover:shadow-md whitespace-nowrap cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #c8a200, #e8b800)' }}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>공고 제보</span>
          </button>
        </div>
      </div>
    </div>

    {/* 모바일 하단 탭 */}
    <div className="md:hidden flex border-t border-neutral-200 divide-x divide-neutral-200 bg-neutral-50 text-xs font-medium">
      {NAV_TABS.map((tab) => {
        const active = currentTab === tab.key;
        return (
          <button
            key={tab.key} onClick={() => onSelectTab(tab.key)}
            className={`flex-1 py-2.5 text-center flex flex-col items-center gap-0.5 transition-colors
              ${active ? 'font-bold bg-white' : 'text-neutral-600'}`}
            style={active ? { color: 'var(--inha-blue)' } : {}}
          >
            <span className="text-[10px]">{tab.mobileLabel}{tab.key === 'bookmarks' && bookmarkCount > 0 ? `(${bookmarkCount})` : ''}</span>
          </button>
        );
      })}
    </div>
  </header>
);
