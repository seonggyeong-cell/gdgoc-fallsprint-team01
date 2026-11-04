// [공유] 보안: 외부 URL 검증 유틸리티 (XSS 방지)
// javascript:, data:, vbscript: 등의 악성 프로토콜을 차단하고 http/https만 허용합니다.

export function sanitizeUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  // http:// 또는 https:// 로 시작하는 정규 URL만 통과
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return '#';
}

export function isValidHttpUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  return /^https?:\/\//i.test(url.trim());
}

