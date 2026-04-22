const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const backendBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');

function isLocalHostname(hostname) {
  if (!hostname) return false;
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname.endsWith('.local')
  );
}

export function resolveImageUrl(value) {
  if (!value) return '';

  const raw = String(value).trim();
  if (!raw) return '';

  const toApiImageUrl = (filename) => `${backendBaseUrl}/api/images/${filename}`;

  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);
      const filename = parsed.pathname.split('/').filter(Boolean).pop();
      if (!filename) return raw;

      if (parsed.pathname.startsWith('/api/images/')) {
        if (!isLocalHostname(parsed.hostname)) {
          return raw;
        }
        return toApiImageUrl(filename);
      }

      if (
        parsed.pathname.startsWith('/images/') ||
        parsed.pathname.startsWith('/assets/images/') ||
        parsed.pathname.startsWith('/assests/images/')
      ) {
        return toApiImageUrl(filename);
      }

      return raw;
    } catch {
      return raw;
    }
  }

  const clean = raw.replace(/^\/+/, '');
  const filename = clean.split('/').filter(Boolean).pop();
  if (!filename) return '';

  if (clean.startsWith('api/images/')) {
    return `${backendBaseUrl}/${clean}`;
  }

  if (
    clean.startsWith('images/') ||
    clean.startsWith('assets/images/') ||
    clean.startsWith('assests/images/') ||
    !clean.includes('/')
  ) {
    return toApiImageUrl(filename);
  }

  return `${backendBaseUrl}/${clean}`;
}