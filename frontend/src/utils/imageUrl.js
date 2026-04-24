const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const backendBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');

const defaultServiceImageByFilename = {
  'service_wedding.png': '/images/service_wedding.png',
  'service_portrait.png': '/images/service_portrait.png',
  'service_editorial.png': '/images/service_editorial.png',
  'service_event.png': '/images/service_event.png',
  'portfolio_bride.png': '/images/service_wedding.png',
  'portfolio_fashion.png': '/images/service_editorial.png',
  'portfolio_newborn.png': '/images/service_portrait.png',
  'portfolio_corporate.png': '/images/service_event.png',
  'portfolio_architecture.png': '/images/service_editorial.png',
  'portfolio_nature.png': '/images/service_event.png',
};

const toLocalImageUrl = (filename) => {
  if (defaultServiceImageByFilename[filename.toLowerCase()]) {
    return defaultServiceImageByFilename[filename.toLowerCase()];
  }
  return `${backendBaseUrl}/api/images/${filename}`;
};

const serviceCategoryFallbacks = [
  { test: /(wedding|bride|prenup)/i, image: '/images/service_wedding.png' },
  { test: /(portrait|headshot|person|individual)/i, image: '/images/service_portrait.png' },
  { test: /(editorial|fashion|commercial|brand)/i, image: '/images/service_editorial.png' },
  { test: /(event|birthday|party|corporate|gala)/i, image: '/images/service_event.png' },
];

const placeholderSourcePattern = /(placehold|placeholder|dummyimage|via\.placeholder|loremflickr|text=light(?:\+|%20)studio|text=service)/i;

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

  // If it's a full URL
  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);
      const filename = parsed.pathname.split('/').filter(Boolean).pop();
      if (!filename) return raw;

      // Check if it's a known local asset filename even if it has a full URL
      if (defaultServiceImageByFilename[filename.toLowerCase()]) {
        return defaultServiceImageByFilename[filename.toLowerCase()];
      }

      if (/\/api\/images\//i.test(parsed.pathname)) {
        return toLocalImageUrl(filename);
      }

      if (
        parsed.pathname.startsWith('/images/') ||
        parsed.pathname.startsWith('/assets/images/') ||
        parsed.pathname.startsWith('/assests/images/') ||
        parsed.pathname.includes('/public/images/')
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

  // If it's a relative path
  const clean = raw.replace(/^\/+/, '');
  const filename = clean.split('/').filter(Boolean).pop();
  if (!filename) return '';

  if (defaultServiceImageByFilename[filename.toLowerCase()]) {
    return defaultServiceImageByFilename[filename.toLowerCase()];
  }

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
  if (!normalized) return '/images/service_wedding.png';

  const match = serviceCategoryFallbacks.find((rule) => rule.test.test(normalized));
  return match ? match.image : '/images/service_wedding.png';
}

export function resolveServiceImageUrl(serviceOrImagePath, category = '') {
  const imagePath = typeof serviceOrImagePath === 'object'
    ? serviceOrImagePath?.image_path
    : serviceOrImagePath;

  const serviceCategory = typeof serviceOrImagePath === 'object'
    ? serviceOrImagePath?.category
    : category;

  const raw = String(imagePath || '').trim();
  
  // 1. Check for known filenames first (strongest match)
  const filename = getImageFilename(raw).toLowerCase();
  if (filename && defaultServiceImageByFilename[filename]) {
    return defaultServiceImageByFilename[filename];
  }

  // 2. Check for placeholders
  if (!raw || placeholderSourcePattern.test(raw)) {
    return getCategoryFallbackImage(serviceCategory);
  }

  // 3. Resolve normally
  const resolved = resolveImageUrl(raw);
  
  // 4. Double check the resolved URL for placeholders
  if (!resolved || placeholderSourcePattern.test(resolved)) {
    return getCategoryFallbackImage(serviceCategory);
  }

  return resolved;
}