const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const backendBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');
const toLocalImageUrl = (filename) => `/images/${filename}`;

const defaultServiceImageByFilename = {
  'service_wedding.png': '/images/featured-work.png',
  'service_portrait.png': '/images/about-photographer.png',
  'service_editorial.png': '/images/studio-hero.png',
  'service_event.png': '/images/featured-work.png',
};

const serviceCategoryFallbacks = [
  { test: /(wedding|bride|prenup)/i, image: '/images/featured-work.png' },
  { test: /(portrait|headshot)/i, image: '/images/about-photographer.png' },
  { test: /(editorial|fashion|commercial)/i, image: '/images/studio-hero.png' },
  { test: /(event|birthday|party|corporate)/i, image: '/images/featured-work.png' },
];

const placeholderSourcePattern = /(placehold|placeholder|dummyimage|via\.placeholder|loremflickr|text=light(?:\+|%20)studio)/i;

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

function getImageFilename(value) {
  if (!value) return '';

  try {
    const raw = String(value).trim();
    if (!raw) return '';

    if (/^https?:\/\//i.test(raw)) {
      const parsed = new URL(raw);
      return parsed.pathname.split('/').filter(Boolean).pop() || '';
    }

    return raw.replace(/^\/+/, '').split('/').filter(Boolean).pop() || '';
  } catch {
    return '';
  }
}

function getCategoryFallbackImage(category) {
  const normalized = String(category || '').trim();
  if (!normalized) return '/images/studio-hero.png';

  const match = serviceCategoryFallbacks.find((rule) => rule.test.test(normalized));
  return match ? match.image : '/images/studio-hero.png';
}

export function resolveServiceImageUrl(serviceOrImagePath, category = '') {
  const imagePath = typeof serviceOrImagePath === 'object'
    ? serviceOrImagePath?.image_path
    : serviceOrImagePath;

  const serviceCategory = typeof serviceOrImagePath === 'object'
    ? serviceOrImagePath?.category
    : category;

  const filename = getImageFilename(imagePath).toLowerCase();
  if (filename && defaultServiceImageByFilename[filename]) {
    return defaultServiceImageByFilename[filename];
  }

  const raw = String(imagePath || '').trim();
  if (!raw || placeholderSourcePattern.test(raw)) {
    return getCategoryFallbackImage(serviceCategory);
  }

  const resolved = resolveImageUrl(raw);
  if (!resolved || placeholderSourcePattern.test(resolved)) {
    return getCategoryFallbackImage(serviceCategory);
  }

  return resolved;
}