import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '@/config/constants';
import { readJSON, removeKey, writeJSON } from '@/services/storage';
import type { AuthProvider, AuthUser, UserProfile } from '@/types';
import {
  completeNaverLogin,
  createDemoUser,
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
  startNaverLogin,
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

  const completeLogin = useCallback((u: AuthUser) => {
    writeJSON(STORAGE_KEYS.authUser, u);
    setUser(u);
    setLoginOpen(false);
    setAuthError('');
  }, []);

  useEffect(() => {
    completeNaverLogin()
      .then((u) => u && completeLogin(u))
      .catch((e) => setAuthError(e.message));
  }, [completeLogin]);

  useEffect(() => {
    setProfile(user ? readJSON<UserProfile>(STORAGE_KEYS.profile(user.id), EMPTY_PROFILE) : null);
  }, [user]);

  const login = useCallback(
    async (provider: AuthProvider) => {
      setAuthError('');
      try {
        if (provider === 'google') completeLogin(await loginWithGoogle());
        else if (provider === 'naver') await startNaverLogin();
        else completeLogin(createDemoUser());
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
    removeKey(STORAGE_KEYS.authUser);
    setUser(null);
  }, []);

  const saveProfile = useCallback(
    (p: UserProfile) => {
      if (!user) return;
      writeJSON(STORAGE_KEYS.profile(user.id), p);
      setProfile(p);
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