import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ENV, STORAGE_KEYS } from '@/config/constants';
import { readJSON, removeKey, writeJSON } from '@/services/storage';
import { supabase } from '@/services/supabase';
import type { AuthProvider, AuthUser, UserProfile } from '@/types';
import {
  completeNaverLogin,
  loginWith,
  loginWithEmail,
  loginWithGoogle,
  logoutWithSupabase,
  registerWithEmail,
  signInDemo,
  startNaverLogin,
  toAuthUser,
} from './authService';

const EMPTY_PROFILE: UserProfile = {
  department: '',
  careerFields: [],
  interestCategories: [],
  onboarded: false,
};

interface AuthContextValue {
  user: AuthUser | null;
  profile: UserProfile | null;
  isLoggedIn: boolean;
  needsOnboarding: boolean;
  isLoginOpen: boolean;
  authError: string;
  openLogin: () => void;
  closeLogin: () => void;
  requireLogin: () => boolean;
  login: (provider: AuthProvider) => Promise<void>;
  loginEmail: (email: string, password: string) => Promise<void>;
  registerEmail: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  saveProfile: (p: UserProfile) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProviderRoot: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() =>
    readJSON<AuthUser | null>(STORAGE_KEYS.authUser, null)
  );
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [authError, setAuthError] = useState('');

  // 1) Supabase 세션 구독 (가이드 9페이지)
  useEffect(() => {
    if (!ENV.supabaseUrl || !ENV.supabaseKey) return;

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(toAuthUser(data.session.user));
      }
    }).catch((e) => console.warn('Supabase getSession error', e));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(toAuthUser(session.user));
      } else {
        // demo/로컬 유저가 아닌 경우만 null 처리
        setUser((prev) => (prev?.provider === 'demo' ? prev : null));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const completeLogin = useCallback((u: AuthUser) => {
    writeJSON(STORAGE_KEYS.authUser, u);
    setUser(u);
    setLoginOpen(false);
    setAuthError('');
  }, []);

  // 기존 네이버 팝업/리디렉트 처리
  useEffect(() => {
    completeNaverLogin()
      .then((u) => u && completeLogin(u))
      .catch((e) => setAuthError(e.message));
  }, [completeLogin]);

  // 2) 프로필 불러오기 (Supabase profiles 테이블 우선, 실패 시 localStorage fallback)
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    let isCancelled = false;

    async function loadProfile() {
      if (ENV.supabaseUrl && ENV.supabaseKey) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user!.id)
            .maybeSingle();

          if (!error && data) {
            if (!isCancelled) {
              setProfile({
                department: data.department ?? '',
                careerFields: data.career_fields ?? [],
                interestCategories: data.interest_categories ?? [],
                onboarded: data.onboarded ?? false,
              });
              return;
            }
          }
        } catch {
          // ignore, fallback below
        }
      }

      if (!isCancelled) {
        setProfile(readJSON<UserProfile>(STORAGE_KEYS.profile(user!.id), EMPTY_PROFILE));
      }
    }

    loadProfile();
    return () => {
      isCancelled = true;
    };
  }, [user]);

  const login = useCallback(
    async (provider: AuthProvider) => {
      setAuthError('');
      try {
        if (ENV.supabaseUrl && ENV.supabaseKey && (provider === 'google' || provider === 'kakao')) {
          await loginWith(provider);
          return;
        }

        if (provider === 'google') {
          completeLogin(await loginWithGoogle());
        } else if (provider === 'naver') {
          await startNaverLogin();
        } else if (provider === 'kakao') {
          await loginWith('kakao');
        } else {
          const demo = await signInDemo();
          completeLogin(demo);
        }
      } catch (e) {
        setAuthError(e instanceof Error ? e.message : '로그인에 실패했습니다.');
      }
    },
    [completeLogin]
  );

  const loginEmail = useCallback(
    async (email: string, password: string) => {
      setAuthError('');
      try {
        const loggedInUser = await loginWithEmail(email, password);
        completeLogin(loggedInUser);
      } catch (e) {
        setAuthError(e instanceof Error ? e.message : '이메일 로그인에 실패했습니다.');
      }
    },
    [completeLogin]
  );

  const registerEmail = useCallback(
    async (name: string, email: string, password: string) => {
      setAuthError('');
      try {
        const newUser = await registerWithEmail(name, email, password);
        completeLogin(newUser);
      } catch (e) {
        setAuthError(e instanceof Error ? e.message : '회원가입에 실패했습니다.');
      }
    },
    [completeLogin]
  );

  const logout = useCallback(() => {
    logoutWithSupabase();
    removeKey(STORAGE_KEYS.authUser);
    setUser(null);
  }, []);

  const saveProfile = useCallback(
    async (p: UserProfile) => {
      if (!user) return;
      // 로컬스토리지 우선 저장 (즉시 반영)
      writeJSON(STORAGE_KEYS.profile(user.id), p);
      setProfile(p);

      // Supabase profiles 테이블 upsert (가이드 9페이지)
      if (ENV.supabaseUrl && ENV.supabaseKey) {
        try {
          await supabase.from('profiles').upsert({
            id: user.id,
            department: p.department,
            career_fields: p.careerFields,
            interest_categories: p.interestCategories,
            onboarded: p.onboarded,
            updated_at: new Date().toISOString(),
          });
        } catch (e) {
          console.warn('Supabase profile upsert error', e);
        }
      }
    },
    [user]
  );

  const requireLogin = useCallback(() => {
    if (user) return true;
    setLoginOpen(true);
    return false;
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isLoggedIn: !!user,
      needsOnboarding: !!user && !!profile && !profile.onboarded,
      isLoginOpen,
      authError,
      openLogin: () => setLoginOpen(true),
      closeLogin: () => {
        setLoginOpen(false);
        setAuthError('');
      },
      requireLogin,
      login,
      loginEmail,
      registerEmail,
      logout,
      saveProfile,
    }),
    [user, profile, isLoginOpen, authError, requireLogin, login, loginEmail, registerEmail, logout, saveProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProviderRoot');
  return ctx;
}