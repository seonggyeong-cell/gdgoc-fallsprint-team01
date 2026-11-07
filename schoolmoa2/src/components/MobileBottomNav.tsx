import React from 'react';
import { Home, Layers, Calendar, Bookmark } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: 'home' | 'browse' | 'calendar' | 'bookmarks';
  onSelectTab: (tab: 'home' | 'browse' | 'calendar' | 'bookmarks') => void;
  bookmarkCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  bookmarkCount,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E3E8F0] shadow-lg flex items-center justify-around h-14 px-2">
      <button
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
          currentTab === 'home' ? 'text-[#0B2A5B] font-extrabold' : 'text-neutral-400 font-medium'
        }`}
      >
        <Home className="w-4 h-4" />
        <span className="text-[11px] mt-0.5">홈</span>
      </button>

      <button
        onClick={() => onSelectTab('browse')}
        className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
          currentTab === 'browse' ? 'text-[#0B2A5B] font-extrabold' : 'text-neutral-400 font-medium'
        }`}
      >
        <Layers className="w-4 h-4" />
        <span className="text-[11px] mt-0.5">전체 공고</span>
      </button>

      <button
        onClick={() => onSelectTab('calendar')}
        className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
          currentTab === 'calendar' ? 'text-[#0B2A5B] font-extrabold' : 'text-neutral-400 font-medium'
        }`}
      >
        <Calendar className="w-4 h-4" />
        <span className="text-[11px] mt-0.5">캘린더</span>
      </button>

      <button
        onClick={() => onSelectTab('bookmarks')}
        className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors relative ${
          currentTab === 'bookmarks' ? 'text-[#0B2A5B] font-extrabold' : 'text-neutral-400 font-medium'
        }`}
      >
        <Bookmark className="w-4 h-4" />
        <span className="text-[11px] mt-0.5">내 보관함</span>
        {bookmarkCount > 0 && (
          <span className="absolute top-1 right-5 w-4 h-4 rounded-full bg-[#E11D48] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
            {bookmarkCount}
          </span>
        )}
      </button>
    </nav>
  );
};
