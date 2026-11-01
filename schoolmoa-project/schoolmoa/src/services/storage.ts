// [공유] localStorage 래퍼. 백엔드(Firebase/Supabase 등) 도입 시 이 파일의 구현만 교체합니다.
export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('[storage] 저장 실패', e);
  }
}
export function removeKey(key: string): void {
  try { localStorage.removeItem(key); } catch { /* noop */ }
}
