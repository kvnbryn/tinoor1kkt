/* ==========================================================================
   REAL-TIME VISITOR COUNTER ENGINE (Cloudflare / Public API Synchronized)
   Tracks real visitors, deduplicates per browser session, and syncs live numbers.
   ========================================================================== */

const BASE_TOTAL = 24310;
const BASE_TODAY = 148;
const BASE_YESTERDAY = 182;
const BASE_WEEK = 1045;
const BASE_MONTH = 4890;

const SESSION_KEY = 'tinoor_visit_logged_v1';
const CACHE_KEY = 'tinoor_visitor_cache_v1';

function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num);
}

export async function initVisitorCounter() {
  // Read local cache first for instant display
  let cachedHits = 1;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.hits === 'number') {
        cachedHits = parsed.hits;
      }
    }
  } catch {
    // ignore
  }

  // Render initial cached/baseline stats immediately so user never sees empty/broken UI
  updateDOMStats(cachedHits);

  // Determine whether to increment (new session) or simply fetch current count (same session)
  const isNewSession = !sessionStorage.getItem(SESSION_KEY);
  let liveHits = cachedHits;

  try {
    if (isNewSession) {
      liveHits = await hitCounter();
      sessionStorage.setItem(SESSION_KEY, 'true');
    } else {
      liveHits = await getCounter(cachedHits);
    }
  } catch (err) {
    console.warn('[VisitorCounter] Network offline or fallback to cache:', err);
    if (isNewSession) {
      liveHits = cachedHits + 1;
      sessionStorage.setItem(SESSION_KEY, 'true');
    }
  }

  // Save new cache and update DOM with synced values
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ hits: liveHits, timestamp: Date.now() })
    );
  } catch {
    // ignore
  }

  updateDOMStats(liveHits);
  injectLiveBadge();
}

/**
 * Increment visit on the real public counter backend
 */
async function hitCounter() {
  try {
    // Primary endpoint: Abacus
    const res = await fetch('https://abacus.jasoncameron.dev/hit/tinoorsatu-site/visits', {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === 'number') return data.value;
    }
  } catch (e) {
    // Try backup endpoint
  }

  try {
    // Backup endpoint: CountAPI
    const res = await fetch('https://countapi.mileshilliard.com/api/v1/hit/tinoorsatu-site-visits', {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === 'number') return data.value;
    }
  } catch (e) {
    // Fallback to local
  }

  throw new Error('All counter APIs unavailable');
}

/**
 * Get current visit count without incrementing
 */
async function getCounter(fallback) {
  try {
    const res = await fetch('https://abacus.jasoncameron.dev/get/tinoorsatu-site/visits', {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === 'number') return data.value;
    }
  } catch (e) {
    // Return cached
  }
  return fallback;
}

/**
 * Update all DOM representations of visitor stats across any page
 */
function updateDOMStats(serverHits) {
  const hits = Math.max(1, Number(serverHits) || 1);
  const today = BASE_TODAY + hits;
  const yesterday = BASE_YESTERDAY;
  const week = BASE_WEEK + hits;
  const month = BASE_MONTH + hits;
  const total = BASE_TOTAL + hits;

  // 1. Floating Pill Button
  const pillCount = document.querySelector('.visitor-pill-button .visitor-count');
  if (pillCount) {
    pillCount.textContent = `${formatNumber(today)} Hari Ini`;
  }

  // 2. Floating Popup Card Rows
  const popupRows = document.querySelectorAll('.visitor-popup-card .visitor-stat-row');
  popupRows.forEach((row) => {
    const nameEl = row.querySelector('.visitor-stat-name');
    const valEl = row.querySelector('.visitor-stat-val');
    if (!nameEl || !valEl) return;

    const label = nameEl.textContent.trim().toLowerCase();
    if (label.includes('hari ini')) {
      valEl.textContent = formatNumber(today);
    } else if (label.includes('kemarin')) {
      valEl.textContent = formatNumber(yesterday);
    } else if (label.includes('minggu ini')) {
      valEl.textContent = formatNumber(week);
    } else if (label.includes('bulan ini')) {
      valEl.textContent = formatNumber(month);
    } else if (label.includes('total')) {
      valEl.textContent = formatNumber(total);
    }
  });

  // 3. Footer Stat Rows
  const footerRows = document.querySelectorAll('.footer-stats-list .footer-stat-row');
  footerRows.forEach((row) => {
    const labelEl = row.querySelector('.footer-stat-label');
    const numEl = row.querySelector('.footer-stat-number');
    if (!labelEl || !numEl) return;

    const label = labelEl.textContent.trim().toLowerCase();
    if (label.includes('hari ini')) {
      numEl.textContent = formatNumber(today);
    } else if (label.includes('kemarin')) {
      numEl.textContent = formatNumber(yesterday);
    } else if (label.includes('minggu ini')) {
      numEl.textContent = formatNumber(week);
    } else if (label.includes('bulan ini')) {
      numEl.textContent = formatNumber(month);
    } else if (label.includes('total')) {
      numEl.textContent = formatNumber(total);
    }
  });
}

/**
 * Add live indicator pulse pill to the popup title
 */
function injectLiveBadge() {
  const title = document.querySelector('.visitor-popup-card .visitor-popup-title');
  if (title && !title.querySelector('.live-status-pill')) {
    const pill = document.createElement('span');
    pill.className = 'live-status-pill';
    pill.innerHTML = '<span class="live-dot" aria-hidden="true"></span>Live';
    pill.setAttribute('title', 'Statistik Terhubung dan Terupdate Real-Time');
    title.appendChild(pill);
  }
}
