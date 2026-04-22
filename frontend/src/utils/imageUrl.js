const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const backendBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');
const toLocalImageUrl = (filename) => `/images/${filename}`;

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

  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);
      const filename = parsed.pathname.split('/').filter(Boolean).pop();
      if (!filename) return raw;

      if (/\/api\/images\//i.test(parsed.pathname)) {
        return toLocalImageUrl(filename);
      }

      if (
        parsed.pathname.startsWith('/images/') ||
        parsed.pathname.startsWith('/assets/images/') ||
        parsed.pathname.startsWith('/assests/images/')
      ) {
        return toLocalImageUrl(filename);
      }

      if (isLocalHostname(parsed.hostname)) {
        return `${backendBaseUrl}${parsed.pathname}`;
      }

      return raw;
    } catch {
      if (/api\/images\//i.test(raw)) {
        const filename = raw.split('/').filter(Boolean).pop();
        return filename ? toLocalImageUrl(filename) : raw;
      }
      return raw;
    }
  }

  const clean = raw.replace(/^\/+/, '');
  const filename = clean.split('/').filter(Boolean).pop();
  if (!filename) return '';

  if (clean.startsWith('api/images/')) {
    return toLocalImageUrl(filename);
  }

  if (
    clean.startsWith('images/') ||
    clean.startsWith('assets/images/') ||
    clean.startsWith('assests/images/') ||
    !clean.includes('/')
  ) {
    return toLocalImageUrl(filename);
  }

  return `${backendBaseUrl}/${clean}`;
}