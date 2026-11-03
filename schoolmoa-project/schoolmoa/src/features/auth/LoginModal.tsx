import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, User } from 'lucide-react';
import { APP_NAME, SHOW_DEMO_LOGIN } from '@/config/constants';
import { useAuth } from './AuthContext';
import { isGoogleConfigured, isNaverConfigured } from './authService';

export const LoginModal: React.FC = () => {
  const { isLoginOpen, closeLogin, login, loginEmail, registerEmail, authError } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoginOpen) return null;

  const btn =
    'w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer';
  const inputStyle =
    'w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await loginEmail(email, password);
      } else {
        await registerEmail(name, email, password);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={closeLogin}
    >
      <div
        className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-neutral-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-neutral-200 bg-neutral-50/50 flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              {APP_NAME} {mode === 'login' ? '로그인' : '회원가입'}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              보관함, 캘린더 일정, 맞춤 추천을 이용하려면 로그인하세요.
            </p>
          </div>
          <button
            onClick={closeLogin}
            className="p-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:text-neutral-800 cursor-pointer"
            title="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-100 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`py-1.5 rounded-md transition-colors cursor-pointer ${mode === 'login' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-500 hover:text-neutral-800'
                }`}
            >
              이메일 로그인
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`py-1.5 rounded-md transition-colors cursor-pointer ${mode === 'register' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-500 hover:text-neutral-800'
                }`}
            >
              회원가입
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2.5">
            {mode === 'register' && (
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="이름 또는 닉네임 (예: 정석희)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputStyle}
                  required
                />
              </div>
            )}
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="email"
                placeholder="학교 또는 개인 이메일 (example@inha.edu)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputStyle}
                required
              />
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="password"
                placeholder="비밀번호 (6자 이상)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputStyle}
                required
                minLength={6}
              />
            </div>

            {authError && (
              <p role="alert" className="text-xs text-rose-600 font-medium pt-0.5">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`${btn} bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50`}
            >
              {mode === 'login' ? '이메일로 로그인' : '계정 만들기'}
            </button>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-neutral-200"></div>
            <span className="shrink mx-3 text-[11px] text-neutral-400">또는 간편 로그인</span>
            <div className="grow border-t border-neutral-200"></div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => login('google')}
              disabled={!isGoogleConfigured()}
              className={`${btn} bg-white border border-neutral-300 text-neutral-800 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              Google로 계속하기
            </button>
            <button
              type="button"
              onClick={() => login('naver')}
              disabled={!isNaverConfigured()}
              className={`${btn} bg-[#03C75A] text-white hover:bg-[#02b350] disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              네이버로 계속하기
            </button>
            {SHOW_DEMO_LOGIN && (
              <button
                type="button"
                onClick={() => login('demo')}
                className={`${btn} bg-neutral-900 text-white hover:bg-neutral-800`}
              >
                체험 계정으로 1초 둘러보기
              </button>
            )}
          </div>
        </div>

        <div className="px-5 pb-5 flex items-start gap-2 text-[11px] text-neutral-500 leading-relaxed">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
          <span>
            수집 항목: 이름·이메일, 학과, 희망 진로. 맞춤 추천과 보관함 기능에만 사용하며 비밀번호는 안전하게 암호화(SHA-256)되어 브라우저에 저장됩니다.
          </span>
        </div>
      </div>
    </div>
  );
};