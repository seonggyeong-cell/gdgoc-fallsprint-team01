// [담당: 역할 D] 앱 조립(화면 전환·모달). 기능별 로직은 각 feature의 hook/컴포넌트에 있습니다.
import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { APP_NAME, DEFAULT_FILTERS, SCHOOL_NAME } from '@/config/constants';
import { Header } from '@/components/layout/Header';
import { UrgentTickerBanner } from '@/components/layout/UrgentTickerBanner';
import { useAuth } from '@/features/auth/AuthContext';
import { LoginModal } from '@/features/auth/LoginModal';
import { ProfileModal } from '@/features/auth/ProfileModal';
import { MyBookmarks } from '@/features/bookmarks/MyBookmarks';
import { useBookmarks } from '@/features/bookmarks/useBookmarks';
import { CalendarView } from '@/features/calendar/CalendarView';
import { NewNoticeModal } from '@/features/notices/components/NewNoticeModal';
import { NoticeCard } from '@/features/notices/components/NoticeCard';
import { NoticeDetailModal } from '@/features/notices/components/NoticeDetailModal';
import { NoticeFilters } from '@/features/notices/components/NoticeFilters';
import { NoticeTableRow } from '@/features/notices/components/NoticeTableRow';
import { useNoticeFilters } from '@/features/notices/hooks/useNoticeFilters';
import { useNotices } from '@/features/notices/hooks/useNotices';
import type { NoticeItem, TabKey, ViewMode } from '@/types';
import { calculateDDay } from '@/utils/dateUtils';
import { hasProfileInfo, recommendNotices } from '@/utils/recommend';

const LoginPrompt: React.FC<{ message: string; onLogin: () => void }> = ({ message, onLogin }) => (
  <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center text-neutral-500">
    <h3 className="text-base font-semibold text-neutral-800">로그인이 필요한 기능입니다.</h3>
    <p className="text-xs mt-1 max-w-md mx-auto">{message}</p>
    <button onClick={onLogin} className="mt-4 px-4 py-2 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 cursor-pointer">로그인하기</button>
  </div>
);

export default function App() {
  const auth = useAuth();
  const { user, profile, isLoggedIn, needsOnboarding, requireLogin, openLogin, logout, saveProfile } = auth;

  const { notices, addNotice } = useNotices();
  const { bookmarkIds, records, isBookmarked, toggleBookmark, updateRecord } = useBookmarks(user?.id ?? null);

  const [currentTab, setCurrentTab] = useState<TabKey>('browse');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [calendarScope, setCalendarScope] = useState<'mine' | 'all'>('mine');
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [isNewNoticeOpen, setNewNoticeOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

  // 첫 로그인 시 정보 입력창 자동 표시
  useEffect(() => { if (needsOnboarding) setProfileOpen(true); }, [needsOnboarding]);

  // 추천
  const recommendations = useMemo(() => recommendNotices(notices, profile), [notices, profile]);
  const recommendedIds = useMemo(() => (isLoggedIn ? new Set(recommendations.map((r) => r.notice.id)) : null), [recommendations, isLoggedIn]);
  const reasonMap = useMemo(() => new Map(recommendations.map((r) => [r.notice.id, r.reasons])), [recommendations]);

  const { filters, setFilters, resetFilters, filtered, categoryCounts, availableSubcategories } = useNoticeFilters(notices, recommendedIds);

  // 보관함 공고 (마감 임박순, 마감된 공고는 뒤로)
  const bookmarkedItems = useMemo(
    () => notices.filter((n) => bookmarkIds.includes(n.id)).sort((a, b) => {
      const dA = calculateDDay(a.deadline, a.isOngoing).diffDays;
      const dB = calculateDDay(b.deadline, b.isOngoing).diffDays;
      return (dA < 0 ? 1e6 : dA) - (dB < 0 ? 1e6 : dB);
    }),
    [notices, bookmarkIds],
  );

  // 북마크: 로그인 필요
  const handleToggleBookmark = (id: string) => { if (requireLogin()) toggleBookmark(id); };
  const handleOpenNewNotice = () => { if (requireLogin()) setNewNoticeOpen(true); };

  const selectTab = (tab: TabKey) => {
    setCurrentTab(tab);
    if (tab === 'browse' && viewMode === 'calendar') setViewMode('grid');
  };

  const closeProfile = () => {
    if (needsOnboarding && profile) saveProfile({ ...profile, onboarded: true }); // 건너뛰기: 다시 자동으로 뜨지 않게
    setProfileOpen(false);
  };

  const cardProps = (n: NoticeItem) => ({
    notice: n,
    isBookmarked: isBookmarked(n.id),
    onToggleBookmark: handleToggleBookmark,
    onSelectNotice: setSelectedNotice,
  });

  const useCalendarMine = isLoggedIn && calendarScope === 'mine';

  return (
    <div className="min-h-screen bg-neutral-50/60 flex flex-col text-neutral-900">
      <Header
        currentTab={currentTab}
        onSelectTab={selectTab}
        bookmarkCount={bookmarkIds.length}
        user={user}
        profile={profile}
        onLogin={openLogin}
        onLogout={logout}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenNewNotice={handleOpenNewNotice}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <UrgentTickerBanner
          notices={notices}
          onFilterClosingSoon={() => {
            setCurrentTab('browse');
            setViewMode('grid');
            setFilters({ ...DEFAULT_FILTERS, status: 'closing-soon' });
          }}
        />

        {/* 탭 1: 공고 둘러보기 */}
        {currentTab === 'browse' && (
          <div className="space-y-6">
            <NoticeFilters
              filters={filters}
              onChangeFilters={setFilters}
              onReset={resetFilters}
              viewMode={viewMode}
              onChangeViewMode={(mode) => { if (mode === 'calendar') setCurrentTab('calendar'); else setViewMode(mode); }}
              categoryCounts={categoryCounts}
              availableSubcategories={availableSubcategories}
              totalResultsCount={filtered.length}
              isLoggedIn={isLoggedIn}
              onRequireLogin={openLogin}
            />

            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center text-neutral-500">
                <Search className="w-10 h-10 stroke-1 text-neutral-300 mx-auto mb-2" />
                <h3 className="text-base font-semibold text-neutral-800">조건에 일치하는 공고가 없습니다.</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">필터나 검색어를 바꾸거나 초기화해서 전체 공고를 확인하세요.</p>
                <button onClick={resetFilters} className="mt-4 px-4 py-2 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 cursor-pointer">필터 초기화</button>
              </div>
            ) : viewMode === 'table' ? (
              <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-200 bg-neutral-50/80 text-[11px] font-semibold text-neutral-500">
                        <th className="py-3 pl-4 pr-3">분야</th>
                        <th className="py-3 px-3">공고 제목 · 출처</th>
                        <th className="py-3 px-3">지원 혜택</th>
                        <th className="py-3 px-3">마감일</th>
                        <th className="py-3 pl-3 pr-4 text-right">보관/원문/상세</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((n) => <NoticeTableRow key={n.id} {...cardProps(n)} />)}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filtered.map((n) => <NoticeCard key={n.id} {...cardProps(n)} />)}
              </div>
            )}
          </div>
        )}

        {/* 탭 2: 캘린더 (로그인 시 기본으로 내 보관함 공고만 표시) */}
        {currentTab === 'calendar' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">마감일 캘린더</h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {useCalendarMine ? '내 관심 보관함에 담은 공고의 마감일을 보여줍니다.' : '전체 공고의 마감일을 보여줍니다.'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isLoggedIn ? (
                  <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200/80 text-xs">
                    {([['mine', '내 보관함'], ['all', '전체 공고']] as const).map(([key, label]) => (
                      <button key={key} onClick={() => setCalendarScope(key)}
                        className={`px-3 py-1.5 rounded-md cursor-pointer ${calendarScope === key ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-500 hover:text-neutral-800'}`}>{label}</button>
                    ))}
                  </div>
                ) : (
                  <button onClick={openLogin} className="px-3 py-1.5 text-xs text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 font-medium cursor-pointer">로그인하고 내 일정만 보기</button>
                )}
                <button onClick={() => { setCurrentTab('browse'); setViewMode('grid'); }}
                  className="px-3 py-1.5 text-xs text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 font-medium cursor-pointer">카드 목록으로 보기</button>
              </div>
            </div>

            {useCalendarMine && bookmarkedItems.length === 0 && (
              <p className="text-xs text-neutral-500 bg-white border border-neutral-200 rounded-lg p-3">
                아직 보관한 공고가 없습니다. 공고의 북마크 버튼을 누르면 마감일이 캘린더에 표시됩니다.
              </p>
            )}
            <CalendarView notices={useCalendarMine ? bookmarkedItems : notices} onSelectNotice={setSelectedNotice} />
          </div>
        )}

        {/* 탭 3: 맞춤 추천 */}
        {currentTab === 'custom' && (
          !isLoggedIn ? (
            <LoginPrompt message="로그인 후 학과와 희망 진로를 입력하면 어울리는 공고를 추천해 드립니다." onLogin={openLogin} />
          ) : !hasProfileInfo(profile) ? (
            <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center text-neutral-500">
              <h3 className="text-base font-semibold text-neutral-800">추천을 위한 정보가 아직 없어요.</h3>
              <p className="text-xs mt-1">학과와 희망 진로를 입력하면 맞춤 공고를 보여드립니다.</p>
              <button onClick={() => setProfileOpen(true)} className="mt-4 px-4 py-2 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 cursor-pointer">정보 입력하기</button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-neutral-900">{user?.name} 님을 위한 추천 공고 {recommendations.length}건</h2>
                  <p className="text-xs text-neutral-600">
                    {profile?.department && `${profile.department} · `}설정한 희망 진로와 관심 분야를 기준으로 고른 공고입니다. 마감된 공고는 제외됩니다.
                  </p>
                </div>
                <button onClick={() => setProfileOpen(true)} className="px-4 py-2 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 cursor-pointer shrink-0 self-start md:self-auto">내 정보 수정</button>
              </div>
              {recommendations.length === 0 ? (
                <p className="text-sm text-neutral-500">조건에 맞는 공고가 아직 없습니다. 진로·관심 분야를 더 추가해 보세요.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recommendations.map((r) => <NoticeCard key={r.notice.id} {...cardProps(r.notice)} reasons={reasonMap.get(r.notice.id)} />)}
                </div>
              )}
            </div>
          )
        )}

        {/* 탭 4: 보관함 */}
        {currentTab === 'bookmarks' && (
          !isLoggedIn ? (
            <LoginPrompt message="로그인하면 관심 공고를 보관하고 지원 진행 상황과 메모를 관리할 수 있습니다." onLogin={openLogin} />
          ) : (
            <MyBookmarks
              bookmarkedItems={bookmarkedItems}
              records={records}
              onUpdateRecord={updateRecord}
              onRemoveBookmark={toggleBookmark}
              onSelectNotice={setSelectedNotice}
            />
          )
        )}
      </main>

      <footer className="mt-auto border-t border-neutral-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-800">{APP_NAME}</span>
            <span>·</span>
            <span>{SCHOOL_NAME} 학생 지원·근로·인턴·공모전·봉사 정보 모음</span>
          </div>
          <span>공고 정보는 각 출처 사이트 기준이며, 신청 전 원문에서 확인하세요.</span>
        </div>
      </footer>

      <NoticeDetailModal
        notice={selectedNotice}
        onClose={() => setSelectedNotice(null)}
        isBookmarked={selectedNotice ? isBookmarked(selectedNotice.id) : false}
        onToggleBookmark={handleToggleBookmark}
      />
      {isNewNoticeOpen && <NewNoticeModal onSubmitNotice={(n) => { addNotice(n); setSelectedNotice(n); }} onClose={() => setNewNoticeOpen(false)} />}
      {isProfileOpen && profile && <ProfileModal profile={profile} isOnboarding={needsOnboarding} onSave={saveProfile} onClose={closeProfile} />}
      <LoginModal />
    </div>
  );
}
