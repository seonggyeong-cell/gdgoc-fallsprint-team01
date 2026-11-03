import { ENV } from '@/config/constants';
import { readJSON, writeJSON } from '@/services/storage';
import type { AuthUser } from '@/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    google?: any;
    naver?: any;
  }
}

const GOOGLE_SDK = 'https://accounts.google.com/gsi/client';
const NAVER_SDK = 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js';

const REGISTERED_USERS_KEY = 'schoolmoa:registered_users';

interface RegisteredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_schoolmoa_salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

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

export async function registerWithEmail(name: string, email: string, password: string): Promise<AuthUser> {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanName) throw new Error('이름(또는 닉네임)을 입력해 주세요.');
  if (!cleanEmail.includes('@')) throw new Error('올바른 이메일 주소를 입력해 주세요.');
  if (password.length < 6) throw new Error('비밀번호는 최소 6자 이상이어야 합니다.');

  const users = readJSON<RegisteredUser[]>(REGISTERED_USERS_KEY, []);

  if (users.some((u) => u.email === cleanEmail)) {
    throw new Error('이미 가입된 이메일입니다. 로그인 탭을 이용해 주세요.');
  }

  const passwordHash = await hashPassword(password);
  const newUser: RegisteredUser = {
    id: `user:${Date.now()}`,
    email: cleanEmail,
    name: cleanName,
    passwordHash,
  };

  writeJSON(REGISTERED_USERS_KEY, [...users, newUser]);

  return {
    id: newUser.id,
    provider: 'demo',
    name: newUser.name,
    email: newUser.email,
  };
}

export async function loginWithEmail(email: string, password: string): Promise<AuthUser> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !password) {
    throw new Error('이메일과 비밀번호를 모두 입력해 주세요.');
  }

  const users = readJSON<RegisteredUser[]>(REGISTERED_USERS_KEY, []);
  const found = users.find((u) => u.email === cleanEmail);

  if (!found) {
    throw new Error('가입되지 않은 이메일입니다. 먼저 회원가입을 진행해 주세요.');
  }

  const passwordHash = await hashPassword(password);
  if (found.passwordHash !== passwordHash) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }

  return {
    id: found.id,
    provider: 'demo',
    name: found.name,
    email: found.email,
  };
}

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
          resolve({
            id: `google:${p.sub}`,
            provider: 'google',
            name: p.name ?? '구글 사용자',
            email: p.email,
            picture: p.picture,
          });
        } catch (e) {
          reject(e);
        }
      },
      error_callback: (err: any) =>
        reject(new Error(err?.type === 'popup_closed' ? '로그인 창이 닫혔습니다.' : '구글 로그인에 실패했습니다.')),
    });
    client.requestAccessToken();
  });
}

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

export async function startNaverLogin(): Promise<void> {
  if (!ENV.naverClientId) throw new Error('VITE_NAVER_CLIENT_ID가 설정되지 않았습니다.');
  await initNaver();
  const btn = document.getElementById('naverIdLogin_loginButton') as HTMLElement | null;
  if (!btn) throw new Error('네이버 로그인 버튼을 만들지 못했습니다.');
  btn.click();
}

export async function completeNaverLogin(): Promise<AuthUser | null> {
  if (!ENV.naverClientId || !window.location.hash.includes('access_token')) return null;
  const naverLogin = await initNaver();
  return new Promise<AuthUser | null>((resolve) => {
    naverLogin.getLoginStatus((ok: boolean) => {
      window.history.replaceState(null, '', window.location.pathname);
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

export const createDemoUser = (): AuthUser => ({
  id: 'demo:guest',
  provider: 'demo',
  name: '체험 사용자',
});