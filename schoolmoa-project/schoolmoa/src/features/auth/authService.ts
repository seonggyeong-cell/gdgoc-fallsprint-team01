// [담당: 역할 B] 소셜 로그인(구글·네이버) 연동. 키 발급 방법은 docs/AUTH_SETUP.md 참고.
// ※ 현재는 서버가 없어 브라우저에서 직접 처리합니다. 서버/DB(Firebase·Supabase 등)를 붙이면
//    이 파일에서 받은 토큰을 서버에 보내 검증하는 방식으로 바꾸세요.
import { ENV } from '@/config/constants';
import type { AuthUser } from '@/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window { google?: any; naver?: any }
}

const GOOGLE_SDK = 'https://accounts.google.com/gsi/client';
const NAVER_SDK = 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js';

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('로그인 스크립트를 불러오지 못했습니다. 네트워크를 확인하세요.'));
    document.head.appendChild(s);
  });
}

export const isGoogleConfigured = () => !!ENV.googleClientId;
export const isNaverConfigured = () => !!ENV.naverClientId;

// ───────── Google (팝업, 클라이언트 전용) ─────────
export async function loginWithGoogle(): Promise<AuthUser> {
  if (!ENV.googleClientId) throw new Error('VITE_GOOGLE_CLIENT_ID가 설정되지 않았습니다.');
  await loadScript(GOOGLE_SDK);
  return new Promise<AuthUser>((resolve, reject) => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: ENV.googleClientId,
      scope: 'openid email profile',
      callback: async (res: any) => {
        if (res.error) return reject(new Error(res.error));
        try {
          const r = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${res.access_token}` },
          });
          const p = await r.json();
          resolve({ id: `google:${p.sub}`, provider: 'google', name: p.name ?? '구글 사용자', email: p.email, picture: p.picture });
        } catch (e) {
          reject(e);
        }
      },
      error_callback: (err: any) => reject(new Error(err?.type === 'popup_closed' ? '로그인 창이 닫혔습니다.' : '구글 로그인에 실패했습니다.')),
    });
    client.requestAccessToken();
  });
}

// ───────── Naver (페이지 이동 방식) ─────────
async function initNaver(): Promise<any> {
  await loadScript(NAVER_SDK);
  let box = document.getElementById('naverIdLogin');
  if (!box) {
    box = document.createElement('div');
    box.id = 'naverIdLogin';
    box.style.display = 'none';
    document.body.appendChild(box);
  }
  const naverLogin = new window.naver.LoginWithNaverId({
    clientId: ENV.naverClientId,
    callbackUrl: ENV.naverCallbackUrl,
    isPopup: false,
    loginButton: { color: 'green', type: 1, height: 40 },
  });
  naverLogin.init();
  return naverLogin;
}

/** 네이버 로그인 화면으로 이동 (돌아오면 completeNaverLogin()이 사용자 정보를 읽음) */
export async function startNaverLogin(): Promise<void> {
  if (!ENV.naverClientId) throw new Error('VITE_NAVER_CLIENT_ID가 설정되지 않았습니다.');
  await initNaver();
  const btn = document.getElementById('naverIdLogin_loginButton') as HTMLElement | null;
  if (!btn) throw new Error('네이버 로그인 버튼을 만들지 못했습니다.');
  btn.click();
}

/** 네이버에서 돌아온 직후(URL에 access_token이 있을 때) 사용자 정보를 읽어 반환 */
export async function completeNaverLogin(): Promise<AuthUser | null> {
  if (!ENV.naverClientId || !window.location.hash.includes('access_token')) return null;
  const naverLogin = await initNaver();
  return new Promise<AuthUser | null>((resolve) => {
    naverLogin.getLoginStatus((ok: boolean) => {
      window.history.replaceState(null, '', window.location.pathname); // 주소창의 토큰 제거
      if (!ok) return resolve(null);
      const u = naverLogin.user;
      resolve({
        id: `naver:${u.getId()}`,
        provider: 'naver',
        name: u.getName() || u.getNickName() || '네이버 사용자',
        email: u.getEmail() || undefined,
        picture: u.getProfileImage() || undefined,
      });
    });
  });
}

// ───────── 체험 로그인 (개발·시연용) ─────────
export const createDemoUser = (): AuthUser => ({ id: 'demo:guest', provider: 'demo', name: '체험 사용자' });
