import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HomeHero } from './components/HomeHero';
import { HomeWidgets } from './components/HomeWidgets';
import { NoticeFilters, FilterState } from './components/NoticeFilters';
import { NoticeCard } from './components/NoticeCard';
import { NoticeTableRow } from './components/NoticeTableRow';
import { CalendarView } from './components/CalendarView';
import { KanbanBoard } from './components/KanbanBoard';
import { NoticeDetailModal } from './components/NoticeDetailModal';
import { NewNoticeModal } from './components/NewNoticeModal';
import { PersonalizedFilterModal } from './components/PersonalizedFilterModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { INITIAL_NOTICES } from './data/mockNotices';
import {
  NoticeItem,
  NoticeCategory,
  NoticeSourceTier,
  StudentProfile,
  BookmarkRecord,
  ApplicationStage,
} from './types/notice';
import { calculateDDay } from './utils/dateUtils';
import { CATEGORIES } from './constants/categories';
import { SOURCE_TIERS, SOURCE_TIER_LIST } from './constants/sourceTiers';
import { INHA_DEPARTMENTS, DEPARTMENT_MAP } from './constants/departments';
import {
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Github,
} from 'lucide-react';

const DEMO_PROFILE: StudentProfile = {
  name: '김인하',
  grade: 3,
  major: '컴퓨터공학과',
  majorTrack: 'software',
  gpa: 3.92,
  incomeDecile: 3,
  careerGoal: 'SW·개발 / AI·데이터',
  interests: ['career', 'competition', 'scholarship', 'work', 'support'],
  isOnboarded: true,
};

const EMPTY_PROFILE: StudentProfile = {
  name: '방문자',
  grade: 1,
  major: '자유전공',
  majorTrack: 'general',
  gpa: 3.5,
  incomeDecile: 5,
  careerGoal: '미정',
  interests: ['scholarship', 'support'],
  isOnboarded: false,
};

const INITIAL_DEMO_BOOKMARKS: string[] = [
  'notice-01',
  'notice-02',
  'notice-05',
  'notice-07',
  'notice-08',
];

const INITIAL_DEMO_RECORDS: Record<string, BookmarkRecord> = {
  'notice-01': {
    noticeId: 'notice-01',
    stage: 'preparing',
    savedAt: '2026-10-29',
    memo: '인공지능 개론 과목 잔여 여석 확인 및 정정 신청하기',
  },
  'notice-02': {
    noticeId: 'notice-02',
    stage: 'preparing',
    savedAt: '2026-10-25',
    memo: '가구원 정보제공 동의 완료 및 학자금 지원구간 확인',
  },
  'notice-05': {
    noticeId: 'notice-05',
    stage: 'submitted',
    savedAt: '2026-10-26',
    memo: '코딩테스트 응시 완료 및 포트폴리오 PDF 제출함',
  },
  'notice-07': {
    noticeId: 'notice-07',
    stage: 'saved',
    savedAt: '2026-10-28',
    memo: '컴공 3학년 동기들과 AI 에이전트 서비스 팀 빌딩 논의 중',
  },
  'notice-08': {
    noticeId: 'notice-08',
    stage: 'accepted',
    savedAt: '2026-10-28',
    memo: '교수님 면담 통과, 11월부터 하이테크관 AI 랩실 출근',
  },
};

export default function App() {
  // Navigation: 'home' | 'browse' | 'calendar' | 'bookmarks'
  const [currentTab, setCurrentTab] = useState<'home' | 'browse' | 'calendar' | 'bookmarks'>('home');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Demo account toggle (P0: ensures reviewer never sees empty page)
  const [isDemoAccount, setIsDemoAccount] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('schoolmoa_is_demo');
      return stored !== null ? JSON.parse(stored) : true;
    } catch {
      return true;
    }
  });

  // Notices
  const [notices, setNotices] = useState<NoticeItem[]>(() => {
    try {
      const stored = localStorage.getItem('schoolmoa_notices');
      if (stored) {
        const parsed: NoticeItem[] = JSON.parse(stored);
        const existingIds = new Set(parsed.map((n) => n.id));
        const missingInitial = INITIAL_NOTICES.filter((n) => !existingIds.has(n.id));
        const initialMap = new Map(INITIAL_NOTICES.map((n) => [n.id, n]));
        const updatedParsed = parsed.map((n) => {
          const init = initialMap.get(n.id);
          if (init) {
            return {
              ...n,
              department: n.department || init.department,
              sourceTier: n.sourceTier || init.sourceTier,
            };
          }
          return n;
        });
        return [...updatedParsed, ...missingInitial];
      }
    } catch {}
    return INITIAL_NOTICES;
  });

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('schoolmoa_bookmarks');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_DEMO_BOOKMARKS;
  });

  // Bookmark Records
  const [records, setRecords] = useState<Record<string, BookmarkRecord>>(() => {
    try {
      const stored = localStorage.getItem('schoolmoa_records');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_DEMO_RECORDS;
  });

  // Profile
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const stored = localStorage.getItem('schoolmoa_profile');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEMO_PROFILE;
  });

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    sourceTier: 'all',
    department: 'all',
    category: 'all',
    subcategory: 'all',
    sourceSite: 'all',
    grade: 0,
    status: 'all',
    sortBy: 'deadline',
    searchQuery: '',
    onlyEligible: false,
    hideSubmitted: false,
  });

  // Modals & UI States
  const [homeSourceTier, setHomeSourceTier] = useState<NoticeSourceTier | 'all'>('all');
  const [homeDepartment, setHomeDepartment] = useState<string>('all');
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [isNewNoticeOpen, setIsNewNoticeOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('schoolmoa_notices', JSON.stringify(notices));
    } catch (e) {
      console.error(e);
    }
  }, [notices]);

  useEffect(() => {
    try {
      localStorage.setItem('schoolmoa_bookmarks', JSON.stringify(bookmarks));
      localStorage.setItem('schoolmoa_records', JSON.stringify(records));
      localStorage.setItem('schoolmoa_profile', JSON.stringify(profile));
      localStorage.setItem('schoolmoa_is_demo', JSON.stringify(isDemoAccount));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarks, records, profile, isDemoAccount]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // URL Hash Routing support (e.g. #/notice/notice-01, #/calendar, #/bookmarks)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/notice/')) {
        const id = hash.replace('#/notice/', '');
        const target = notices.find((n) => n.id === id);
        if (target) {
          setSelectedNotice(target);
        }
      } else if (hash === '#/calendar') {
        setCurrentTab('calendar');
      } else if (hash === '#/bookmarks') {
        setCurrentTab('bookmarks');
      } else if (hash === '#/notices' || hash === '#/browse') {
        setCurrentTab('browse');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [notices]);

  // Urgent Notice Count (D-7 이내)
  const urgentCount = useMemo(() => {
    return notices.filter((n) => {
      if (n.isOngoing) return false;
      const d = calculateDDay(n.deadline);
      return d.diffDays >= 0 && d.diffDays <= 7;
    }).length;
  }, [notices]);

  // Update Dynamic Document Title (as requested in PDF Page 12)
  useEffect(() => {
    document.title = `(${urgentCount}) 스쿨모아 | 인하대 기회 알리미`;
  }, [urgentCount]);

  // Toggle Demo Account
  const handleToggleDemoAccount = () => {
    if (isDemoAccount) {
      setIsDemoAccount(false);
      setProfile(EMPTY_PROFILE);
      setBookmarks([]);
      setRecords({});
      showToast('일반 계정 상태로 전환되었습니다.');
    } else {
      setIsDemoAccount(true);
      setProfile(DEMO_PROFILE);
      setBookmarks(INITIAL_DEMO_BOOKMARKS);
      setRecords(INITIAL_DEMO_RECORDS);
      showToast('체험 계정 (컴공 3학년 김인하) 데이터가 적용되었습니다!');
    }
  };

  // Toggle Bookmark
  const handleToggleBookmark = (id: string) => {
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter((b) => b !== id));
      const nextRecords = { ...records };
      delete nextRecords[id];
      setRecords(nextRecords);
      showToast('보관함에서 공고를 제외했습니다.');
    } else {
      setBookmarks([...bookmarks, id]);
      setRecords({
        ...records,
        [id]: {
          noticeId: id,
          stage: 'saved',
          savedAt: '2026-11-01',
        },
      });
      showToast('⭐ 보관함에 공고를 담았습니다!');
    }
  };

  const handleUpdateRecord = (id: string, stage: ApplicationStage, memo?: string) => {
    setRecords({
      ...records,
      [id]: {
        noticeId: id,
        stage,
        savedAt: records[id]?.savedAt || '2026-11-01',
        memo,
      },
    });
  };

  const handleSubmitNewNotice = (newNotice: NoticeItem) => {
    setNotices([newNotice, ...notices]);
    setSelectedNotice(newNotice);
    showToast('새 공고가 성공적으로 등록되었습니다!');
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: notices.length,
      work: 0,
      career: 0,
      scholarship: 0,
      competition: 0,
      activity: 0,
      support: 0,
      academic: 0,
    };
    for (const n of notices) {
      if (counts[n.category] !== undefined) {
        counts[n.category]++;
      }
    }
    return counts;
  }, [notices]);

  // Source Tier counts (인하대 본교, 학과, 외부 사이트)
  const sourceTierCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: notices.length,
      'inha-main': 0,
      'inha-dept': 0,
      external: 0,
    };
    for (const n of notices) {
      if (counts[n.sourceTier] !== undefined) {
        counts[n.sourceTier]++;
      }
    }
    return counts;
  }, [notices]);

  // Department counts for inha-dept notices
  const departmentCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: notices.filter((n) => n.sourceTier === 'inha-dept').length,
    };
    for (const d of INHA_DEPARTMENTS) {
      counts[d.name] = 0;
    }
    for (const n of notices) {
      if (n.sourceTier === 'inha-dept' && n.department) {
        counts[n.department] = (counts[n.department] || 0) + 1;
      }
    }
    return counts;
  }, [notices]);

  // Source site options
  const sourceSiteOptions = useMemo(() => {
    const set = new Set<string>();
    for (const n of notices) {
      if (n.sourceSiteName) set.add(n.sourceSiteName);
    }
    return Array.from(set);
  }, [notices]);

  // Check eligibility helper
  const checkIsEligible = (notice: NoticeItem, prof: StudentProfile) => {
    for (const c of notice.eligibilityCriteria) {
      if (c.criterionType === 'gpa' && c.minGpa && prof.gpa < c.minGpa) {
        return false;
      }
      if (c.criterionType === 'income' && c.maxIncomeDecile && prof.incomeDecile > c.maxIncomeDecile) {
        return false;
      }
      if (c.criterionType === 'grade' && c.allowedGrades && !c.allowedGrades.includes(prof.grade)) {
        return false;
      }
    }
    return true;
  };

  // Filtered notices
  const filteredNotices = useMemo(() => {
    return notices
      .filter((item) => {
        if (filters.sourceTier !== 'all' && item.sourceTier !== filters.sourceTier) {
          return false;
        }

        if (filters.department !== 'all' && item.department !== filters.department) {
          return false;
        }

        if (filters.category !== 'all' && item.category !== filters.category) {
          return false;
        }

        if (filters.sourceSite !== 'all' && item.sourceSiteName !== filters.sourceSite) {
          return false;
        }

        if (filters.grade !== 0 && !item.targetGrades.includes(filters.grade)) {
          return false;
        }

        if (filters.status !== 'all') {
          const d = calculateDDay(item.deadline, item.isOngoing);
          if (filters.status === 'closing-soon') {
            if (item.isOngoing || d.diffDays < 0 || d.diffDays > 7) return false;
          } else if (filters.status === 'recruiting') {
            if (d.diffDays < 0) return false;
          } else if (filters.status === 'ongoing') {
            if (!item.isOngoing) return false;
          }
        }

        if (filters.searchQuery.trim() !== '') {
          const q = filters.searchQuery.toLowerCase().trim();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchOrg = item.organizer.toLowerCase().includes(q);
          const matchDept = (item.department || '').toLowerCase().includes(q);
          const matchSrc = (item.sourceSiteName || '').toLowerCase().includes(q);
          const matchSub = item.subcategory.toLowerCase().includes(q);
          const matchBenefit = item.benefit.toLowerCase().includes(q);
          const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchOrg && !matchDept && !matchSrc && !matchSub && !matchBenefit && !matchTags) {
            return false;
          }
        }

        if (filters.onlyEligible) {
          if (!checkIsEligible(item, profile)) return false;
        }

        if (filters.hideSubmitted) {
          const stage = records[item.id]?.stage;
          if (stage === 'submitted' || stage === 'accepted') {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'deadline') {
          const dA = calculateDDay(a.deadline, a.isOngoing);
          const dB = calculateDDay(b.deadline, b.isOngoing);

          if (dA.diffDays < 0 && dB.diffDays >= 0) return 1;
          if (dB.diffDays < 0 && dA.diffDays >= 0) return -1;

          if (a.isOngoing && !b.isOngoing) return 1;
          if (!a.isOngoing && b.isOngoing) return -1;

          return dA.diffDays - dB.diffDays;
        }

        if (filters.sortBy === 'latest') {
          return (b.createdAt || '').localeCompare(a.createdAt || '');
        }

        if (filters.sortBy === 'popular') {
          return b.views + b.bookmarkedCount * 5 - (a.views + a.bookmarkedCount * 5);
        }

        if (filters.sortBy === 'benefit') {
          return (b.estimatedValueNumber || 0) - (a.estimatedValueNumber || 0);
        }

        return 0;
      });
  }, [notices, filters, profile, records]);

  // Bookmarked notice objects
  const bookmarkedItems = useMemo(() => {
    return notices.filter((n) => bookmarks.includes(n.id));
  }, [notices, bookmarks]);

  // Recommended notices for sidebar & recommendations
  const recommendedNotices = useMemo(() => {
    return notices
      .filter((n) => {
        const hasRecReason = !!n.recommendationReason;
        const isEligible = checkIsEligible(n, profile);
        const isInterest = profile.interests.includes(n.category);
        return hasRecReason || (isEligible && isInterest);
      })
      .slice(0, 5);
  }, [notices, profile]);

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col text-[#0F172A] font-sans">
      {/* Header (Wordmark, 4 Tabs, Demo Switcher, CTA) */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        bookmarkCount={bookmarks.length}
        onOpenNewNotice={() => setIsNewNoticeOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        profile={profile}
        isDemoAccount={isDemoAccount}
        onToggleDemoAccount={handleToggleDemoAccount}
      />

      {/* Main Viewport Container (1440px max width baseline) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-8">
        {/* TAB 1: HOME (새로 추가된 홈 화면: 히어로 + 스트립 + 2열 그리드 + 오른쪽 사이드바) */}
        {currentTab === 'home' && (
          <div className="space-y-6">
            {/* 1. Inha Hero + Hanging Urgent Strip */}
            <HomeHero
              notices={notices}
              urgentCount={urgentCount}
              sourceCount={7}
              onSelectNotice={setSelectedNotice}
              onViewAllUrgent={() => {
                setCurrentTab('browse');
                setFilters({
                  ...filters,
                  status: 'closing-soon',
                  category: 'all',
                });
              }}
            />

            {/* 2. Main Content + Right Widgets Layout (1440px desktop baseline) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left 2 Columns: Categorized Notice Sections */}
              <div className="lg:col-span-2 space-y-6">
                {/* 1. Source Tier Classification Banner (인하대 본교, 인하대 학과, 외부 사이트 3단계 분류) */}
                <div className="bg-white rounded-[16px] border border-[#E3E8F0] p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-3.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0B2A5B]" />
                        <h3 className="text-[16px] font-extrabold text-[#0F172A]">
                          공고 출처별 분류 모아보기
                        </h3>
                      </div>
                      <p className="text-[12px] text-neutral-500 mt-0.5">
                        인하대 본교 공식 공지, 소속 학과 공지, 국가/외부 사이트 공고를 분리하여 한눈에 확인하세요.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setFilters({ ...filters, sourceTier: 'all' });
                        setCurrentTab('browse');
                      }}
                      className="text-[12px] font-bold text-[#1D5FC4] hover:underline flex items-center gap-0.5 cursor-pointer shrink-0"
                    >
                      <span>전체 {notices.length}건 보기</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 3 Origin Tier Interactive Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {SOURCE_TIER_LIST.map((tier) => {
                      const Icon = tier.icon;
                      const count = sourceTierCounts[tier.key] || 0;
                      return (
                        <button
                          key={tier.key}
                          onClick={() => {
                            setFilters({
                              ...filters,
                              sourceTier: tier.key,
                              category: 'all',
                            });
                            setCurrentTab('browse');
                          }}
                          className="group relative p-3.5 rounded-[12px] border text-left transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
                          style={{
                            borderColor: `${tier.color}33`,
                            backgroundColor: tier.bgColor,
                          }}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1.5 mb-2">
                              <span
                                className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 shadow-xs"
                                style={{ backgroundColor: tier.color, color: '#ffffff' }}
                              >
                                <Icon className="w-4 h-4" />
                              </span>
                              <span
                                className="text-[12px] font-black px-2 py-0.5 rounded-full shadow-xs"
                                style={{ backgroundColor: tier.color, color: '#ffffff' }}
                              >
                                {count}개
                              </span>
                            </div>

                            <h4
                              className="text-[14px] font-extrabold leading-tight"
                              style={{ color: tier.color }}
                            >
                              {tier.label}
                            </h4>
                            <p className="text-[11px] text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                              {tier.description}
                            </p>

                            {/* Department Quick Filter Tags for inha-dept */}
                            {tier.key === 'inha-dept' && (
                              <div className="mt-2 pt-2 border-t border-black/5 flex flex-wrap gap-1">
                                {INHA_DEPARTMENTS.slice(0, 5).map((d) => (
                                  <span
                                    key={d.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFilters({
                                        ...filters,
                                        sourceTier: 'inha-dept',
                                        department: d.name,
                                        category: 'all',
                                      });
                                      setCurrentTab('browse');
                                    }}
                                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] bg-white border border-[#16A34A]/30 text-[#15803D] hover:bg-[#15803D] hover:text-white transition-colors"
                                  >
                                    {d.shortName}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-black/5 flex items-center justify-between text-[11px] font-bold text-neutral-700 group-hover:text-[#1D5FC4]">
                            <span>{tier.shortLabel} 공고 보기</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Category Quick Chips Bar */}
                <div className="bg-white rounded-[16px] border border-[#E3E8F0] p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[15px] font-extrabold text-[#0F172A] flex items-center gap-1.5">
                      <span>분야별 바로보기</span>
                      <span className="text-[12px] font-medium text-neutral-400">
                        (7개 관심 분야)
                      </span>
                    </h3>
                    <button
                      onClick={() => setCurrentTab('browse')}
                      className="text-[12px] font-bold text-[#1D5FC4] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>분야 전체 탐색</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {/* All */}
                    <button
                      onClick={() => {
                        setFilters({ ...filters, category: 'all' });
                        setCurrentTab('browse');
                      }}
                      className="px-3 py-1.5 rounded-full text-[12px] font-bold bg-[#0B2A5B] text-white whitespace-nowrap cursor-pointer shadow-xs"
                    >
                      전체 ({notices.length})
                    </button>

                    {/* 7 Categories */}
                    {Object.values(CATEGORIES).map((cat) => {
                      const Icon = cat.icon;
                      const count = categoryCounts[cat.key] || 0;
                      return (
                        <button
                          key={cat.key}
                          onClick={() => {
                            setFilters({ ...filters, category: cat.key });
                            setCurrentTab('browse');
                          }}
                          className="px-3 py-1.5 rounded-full text-[12px] font-bold bg-white text-neutral-700 hover:bg-neutral-50 border border-[#E3E8F0] whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span>{cat.label}</span>
                          <span className="text-[11px] text-neutral-400 font-semibold tabular-nums">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. 마감 임박 및 지원 마감순 공고 (가로형 카드) with Source Tier Pill Filter */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 px-1">
                    <div>
                      <h3 className="text-[16px] font-extrabold text-[#0F172A] flex items-center gap-1.5">
                        <span>⏰ 마감일 빠른 순 추천 공고</span>
                      </h3>
                      <span className="text-[12px] text-neutral-400 font-medium">
                        마감일 기준 D-Day 우선 정렬
                      </span>
                    </div>

                    {/* Inline Origin Switcher on Home */}
                    <div className="flex flex-col gap-1.5 items-end">
                      <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-[10px] text-[11px] font-bold self-start sm:self-auto overflow-x-auto max-w-full">
                        <button
                          onClick={() => {
                            setHomeSourceTier('all');
                            setHomeDepartment('all');
                          }}
                          className={`px-2.5 py-1 rounded-[7px] transition-all cursor-pointer whitespace-nowrap ${
                            homeSourceTier === 'all'
                              ? 'bg-white text-[#0B2A5B] shadow-xs'
                              : 'text-neutral-500 hover:text-neutral-800'
                          }`}
                        >
                          전체 ({notices.filter((n) => !n.isOngoing).length})
                        </button>
                        {SOURCE_TIER_LIST.map((t) => {
                          const count = notices.filter(
                            (n) => !n.isOngoing && n.sourceTier === t.key
                          ).length;
                          return (
                            <button
                              key={t.key}
                              onClick={() => {
                                setHomeSourceTier(t.key);
                                if (t.key !== 'inha-dept') setHomeDepartment('all');
                              }}
                              className={`px-2 py-1 rounded-[7px] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                                homeSourceTier === t.key
                                  ? 'bg-white font-extrabold shadow-xs'
                                  : 'text-neutral-500 hover:text-neutral-800'
                              }`}
                              style={homeSourceTier === t.key ? { color: t.color } : {}}
                            >
                              <span>{t.badgeLabel}</span>
                              <span className="tabular-nums text-[10px] opacity-75">
                                ({count})
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Inline Department Switcher when inha-dept is selected on Home */}
                      {homeSourceTier === 'inha-dept' && (
                        <div className="flex items-center gap-1 overflow-x-auto max-w-full py-0.5">
                          <button
                            onClick={() => setHomeDepartment('all')}
                            className={`px-2 py-0.5 rounded-[6px] text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                              homeDepartment === 'all'
                                ? 'bg-[#15803D] text-white shadow-xs'
                                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
                            }`}
                          >
                            전체 학과
                          </button>
                          {INHA_DEPARTMENTS.map((d) => (
                            <button
                              key={d.id}
                              onClick={() => setHomeDepartment(d.name)}
                              className={`px-2 py-0.5 rounded-[6px] text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap border ${
                                homeDepartment === d.name
                                  ? 'bg-[#15803D] text-white border-[#15803D] shadow-xs'
                                  : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                              }`}
                            >
                              {d.shortName}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {notices
                      .filter((n) => {
                        if (n.isOngoing) return false;
                        if (homeSourceTier !== 'all' && n.sourceTier !== homeSourceTier) {
                          return false;
                        }
                        if (
                          homeSourceTier === 'inha-dept' &&
                          homeDepartment !== 'all' &&
                          n.department !== homeDepartment
                        ) {
                          return false;
                        }
                        return true;
                      })
                      .slice(0, 6)
                      .map((notice) => (
                        <NoticeCard
                          key={notice.id}
                          notice={notice}
                          isBookmarked={bookmarks.includes(notice.id)}
                          onToggleBookmark={handleToggleBookmark}
                          onSelectNotice={setSelectedNotice}
                          profile={profile}
                          record={records[notice.id]}
                        />
                      ))}
                  </div>

                  <div className="text-center pt-3">
                    <button
                      onClick={() => {
                        setFilters({
                          ...filters,
                          sourceTier: homeSourceTier,
                          department: homeSourceTier === 'inha-dept' ? homeDepartment : 'all',
                        });
                        setCurrentTab('browse');
                      }}
                      className="py-2.5 px-6 rounded-[10px] bg-white border border-[#E3E8F0] hover:bg-neutral-50 text-[13px] font-bold text-[#0B2A5B] transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                    >
                      <span>
                        {homeSourceTier === 'all'
                          ? `모집 중인 ${notices.length}개 공고 전체 보기`
                          : homeSourceTier === 'inha-dept' && homeDepartment !== 'all'
                          ? `${homeDepartment} 공고 전체 보기`
                          : `${SOURCE_TIERS[homeSourceTier].label} 공고 전체 보기`}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right 1 Column: Sidebar Widgets */}
              <div className="space-y-5">
                <HomeWidgets
                  profile={profile}
                  recommendedNotices={recommendedNotices}
                  bookmarkedNotices={bookmarkedItems}
                  records={records}
                  onSelectNotice={setSelectedNotice}
                  onGoToBookmarks={() => setCurrentTab('bookmarks')}
                  onGoToCalendar={() => setCurrentTab('calendar')}
                  onOpenProfile={() => setIsProfileModalOpen(true)}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BROWSE (전체 공고: 필터 모달 + 카테고리 칩 + 가로형 카드 / 테이블 뷰) */}
        {currentTab === 'browse' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
              <div>
                <h2 className="text-[20px] font-extrabold text-[#0F172A]">
                  인하대 교내외 공고 전체 탐색
                </h2>
                <p className="text-[12px] text-neutral-500">
                  학과 공지, 교내 근로, 국가/외부 장학금, 해커톤 공고를 마감일 순으로 탐색하세요.
                </p>
              </div>
            </div>

            {/* Redesigned Clean Filter Component */}
            <NoticeFilters
              filters={filters}
              onChangeFilters={setFilters}
              viewMode={viewMode}
              onChangeViewMode={setViewMode}
              categoryCounts={categoryCounts}
              sourceTierCounts={sourceTierCounts}
              departmentCounts={departmentCounts}
              sourceSiteOptions={sourceSiteOptions}
              totalResultsCount={filteredNotices.length}
            />

            {/* List Results */}
            {filteredNotices.length === 0 ? (
              <div className="bg-white rounded-[16px] border border-[#E3E8F0] p-12 text-center text-neutral-500">
                <Search className="w-10 h-10 stroke-1 text-neutral-300 mx-auto mb-2" />
                <h3 className="text-base font-bold text-[#0F172A]">
                  일치하는 공고가 없습니다.
                </h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
                  선택한 조건이나 검색어를 변경해보세요.
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      sourceTier: 'all',
                      department: 'all',
                      category: 'all',
                      subcategory: 'all',
                      sourceSite: 'all',
                      grade: 0,
                      status: 'all',
                      sortBy: 'deadline',
                      searchQuery: '',
                      onlyEligible: false,
                    })
                  }
                  className="mt-4 px-4 py-2 text-[12px] font-bold bg-[#0B2A5B] text-white rounded-[8px] hover:bg-[#1D5FC4] transition-colors cursor-pointer"
                >
                  필터 초기화
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="space-y-3">
                {filteredNotices.map((notice) => (
                  <NoticeCard
                    key={notice.id}
                    notice={notice}
                    isBookmarked={bookmarks.includes(notice.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onSelectNotice={setSelectedNotice}
                    profile={profile}
                    record={records[notice.id]}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[16px] border border-[#E3E8F0] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E3E8F0] bg-[#F8FAFC] text-[11px] font-extrabold text-neutral-500 tracking-wider">
                        <th className="py-3 pl-4 pr-2">D-Day</th>
                        <th className="py-3 px-3">분야 / 출처</th>
                        <th className="py-3 px-3">공고명</th>
                        <th className="py-3 px-3">지원 혜택</th>
                        <th className="py-3 pl-2 pr-4 text-right">보관 / 상세</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNotices.map((notice) => (
                        <NoticeTableRow
                          key={notice.id}
                          notice={notice}
                          isBookmarked={bookmarks.includes(notice.id)}
                          onToggleBookmark={handleToggleBookmark}
                          onSelectNotice={setSelectedNotice}
                          profile={profile}
                          record={records[notice.id]}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CALENDAR (캘린더: 카테고리별 분야 필터 + 지원 완료 공고 숨김 + .ics 내보내기) */}
        {currentTab === 'calendar' && (
          <CalendarView
            notices={notices}
            bookmarkedItems={bookmarkedItems}
            records={records}
            onUpdateRecord={handleUpdateRecord}
            onToggleBookmark={handleToggleBookmark}
            onSelectNotice={setSelectedNotice}
            onShowToast={showToast}
          />
        )}

        {/* TAB 4: BOOKMARKS (내 보관함: 4단계 칸반 보드 + 요약 지표 교체) */}
        {currentTab === 'bookmarks' && (
          <KanbanBoard
            bookmarkedItems={bookmarkedItems}
            records={records}
            onUpdateRecord={handleUpdateRecord}
            onRemoveBookmark={handleToggleBookmark}
            onSelectNotice={setSelectedNotice}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Footer (Team Info, Source Attribution, GitHub) */}
      <footer className="mt-auto border-t border-[#E3E8F0] bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-neutral-500">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-extrabold text-[#0B2A5B]">스쿨모아 (School Hub)</span>
            <span>·</span>
            <span>GDGoC INHA 가을 스프린트 팀01</span>
            <span>·</span>
            <span className="text-neutral-400">인하대 공지 20건 실시간 수집 및 연동</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNewNoticeOpen(true)}
              className="text-neutral-500 hover:text-[#0B2A5B] underline cursor-pointer"
            >
              공고 제보하기
            </button>
            <span>·</span>
            <a
              href="https://github.com/GDGoC-INHA"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-neutral-500 hover:text-neutral-900"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Animated Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-8 z-50 animate-bounce bg-[#0B2A5B] text-white px-4 py-2.5 rounded-[12px] shadow-xl text-[13px] font-bold flex items-center gap-2 border border-white/20">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Responsive Mobile Bottom Navigation */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        bookmarkCount={bookmarks.length}
      />

      {/* Modals */}
      <NoticeDetailModal
        notice={selectedNotice}
        allNotices={notices}
        onClose={() => {
          setSelectedNotice(null);
          // clear hash if was notice link
          if (window.location.hash.startsWith('#/notice/')) {
            window.history.replaceState(null, '', ' ');
          }
        }}
        isBookmarked={selectedNotice ? bookmarks.includes(selectedNotice.id) : false}
        onToggleBookmark={handleToggleBookmark}
        profile={profile}
        onSelectNotice={setSelectedNotice}
        onShowToast={showToast}
        record={selectedNotice ? records[selectedNotice.id] : undefined}
        onUpdateRecord={handleUpdateRecord}
      />

      <NewNoticeModal
        isOpen={isNewNoticeOpen}
        onClose={() => setIsNewNoticeOpen(false)}
        onSubmitNotice={handleSubmitNewNotice}
      />

      <PersonalizedFilterModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={(prof) => {
          setProfile(prof);
          showToast('맞춤 프로필 조건이 업데이트되었습니다!');
        }}
      />
    </div>
  );
}
