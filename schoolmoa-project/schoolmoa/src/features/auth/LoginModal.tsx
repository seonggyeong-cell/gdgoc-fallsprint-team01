// [담당: 역할 B] 로그인 모달 (구글 / 네이버 / 체험)
import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { APP_NAME, SHOW_DEMO_LOGIN } from '@/config/constants';
import { useAuth } from './AuthContext';
import { isGoogleConfigured, isNaverConfigured } from './authService';

export const LoginModal: React.FC = () => {
  const { isLoginOpen, closeLogin, login, authError } = useAuth();
  if (!isLoginOpen) return null;

  const btn = 'w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6" onClick={closeLogin}>
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-neutral-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-neutral-200 bg-neutral-50/50 flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900">{APP_NAME} 로그인</h2>
            <p className="text-xs text-neutral-500 mt-0.5">보관함, 캘린더 일정, 맞춤 추천을 이용하려면 로그인하세요.</p>
          </div>
          <button onClick={closeLogin} className="p-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:text-neutral-800 cursor-pointer" title="닫기">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-2.5">
          <button onClick={() => login('google')} disabled={!isGoogleConfigured()} className={`${btn} bg-white border border-neutral-300 text-neutral-800 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed`}>
            Google로 계속하기
          </button>
          <button onClick={() => login('naver')} disabled={!isNaverConfigured()} className={`${btn} bg-[#03C75A] text-white hover:bg-[#02b350] disabled:opacity-40 disabled:cursor-not-allowed`}>
            네이버로 계속하기
          </button>
          {SHOW_DEMO_LOGIN && (
            <button onClick={() => login('demo')} className={`${btn} bg-neutral-900 text-white hover:bg-neutral-800`}>
              체험 계정으로 둘러보기
            </button>
          )}
          {(!isGoogleConfigured() || !isNaverConfigured()) && (
            <p className="text-[11px] text-neutral-400">비활성 버튼은 .env.local에 클라이언트 ID가 없는 경우입니다. (docs/AUTH_SETUP.md)</p>
          )}
          {authError && <p role="alert" className="text-xs text-rose-600">{authError}</p>}
        </div>

        <div className="px-5 pb-5 flex items-start gap-2 text-[11px] text-neutral-500 leading-relaxed">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
          <span>수집 항목: 이름·이메일(소셜 계정 제공), 학과, 희망 진로. 맞춤 추천과 보관함 기능에만 사용하며 현재는 이 브라우저에 저장됩니다.</span>
        </div>
      </div>
    </div>
  );
};
