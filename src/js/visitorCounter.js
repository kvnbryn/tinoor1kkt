/* ==========================================================================
   REAL-TIME VISITOR COUNTER ENGINE (ZERO-BASED LOGICAL TRACKING)
   - Starts truly from ZERO (0) with zero artificial padding.
   - Tracks real visits partitioned by WITA timezone (UTC+8, Tomohon):
     * Hari Ini (Today)
     * Kemarin (Yesterday)
     * Minggu Ini (Current ISO Week)
     * Bulan Ini (Current Month)
     * Total Kunjungan (All-Time Total)
   - Session deduplication: One increment per user session.
   - Cross-client server synchronization via Abacus integer service.
   ========================================================================== */

const NAMESPACE = 'tinoorsatu-site-v2';
const SESSION_KEY = 'tinoor_visit_session_v2';
const CACHE_KEY = 'tinoor_visitor_stats_v2';

function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(Math.max(0, Number(num) || 0));
}

/**
 * Returns date components in WITA timezone (UTC+8)
 */
function getWitaDate(daysAgo = 0) {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const wita = new Date(utc + (8 * 3600000) - (daysAgo * 86400000));
  const y = wita.getFullYear();
  const m = String(wita.getMonth() + 1).padStart(2, '0');
  const d = String(wita.getDate()).padStart(2, '0');
  return {
    dateStr: `${y}-${m}-${d}`,
    monthStr: `${y}-${m}`,
    year: y
  };
}

/**
 * Returns current ISO week string in WITA (e.g., "2026-W41")
 */
function getWitaWeekStr() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const date = new Date(utc + (8 * 3600000));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

/**
 * Fetches counter value from public server
 */
async function fetchCounter(action, key) {
  try {
    const res = await fetch(`https://abacus.jasoncameron.dev/${action}/${NAMESPACE}/${key}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === 'number') return data.value;
    }
  } catch (err) {
    // Network or key not found
  }
  return null;
}

export async function initVisitorCounter() {
  const today = getWitaDate(0);
  const yesterday = getWitaDate(1);
  const weekStr = getWitaWeekStr();

  // 1. Read cached state for instant display (starts at 0)
  let stats = {
    today: 0,
    yesterday: 0,
    week: 0,
    month: 0,
    total: 0,
    lastDate: today.dateStr
  };

  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.total === 'number') {
        if (parsed.lastDate === today.dateStr) {
          stats.today = parsed.today || 0;
          stats.yesterday = parsed.yesterday || 0;
          stats.week = parsed.week || 0;
          stats.month = parsed.month || 0;
          stats.total = parsed.total || 0;
        } else if (parsed.lastDate === yesterday.dateStr) {
          // Midnight turnover: yesterday's count is yesterday's today
          stats.yesterday = parsed.today || 0;
          stats.week = parsed.week || 0;
          stats.month = parsed.month || 0;
          stats.total = parsed.total || 0;
          stats.today = 0;
        }
      }
    }
  } catch {
    // Ignore cache parse error
  }

  // Display initial numbers immediately
  updateDOMStats(stats);
  injectLiveBadge();

  // 2. Session check: only increment once per browser tab session
  const isNewSession = !sessionStorage.getItem(SESSION_KEY);
  const action = isNewSession ? 'hit' : 'get';

  try {
    const [todayVal, yesterdayVal, weekVal, monthVal, totalVal] = await Promise.all([
      fetchCounter(action, `day_${today.dateStr}`),
      fetchCounter('get', `day_${yesterday.dateStr}`),
      fetchCounter(action, `week_${weekStr}`),
      fetchCounter(action, `month_${today.monthStr}`),
      fetchCounter(action, 'total')
    ]);

    if (isNewSession) {
      sessionStorage.setItem(SESSION_KEY, 'true');
    }

    stats = {
      today: typeof todayVal === 'number' ? todayVal : (stats.today + (isNewSession ? 1 : 0)),
      yesterday: typeof yesterdayVal === 'number' ? yesterdayVal : (stats.yesterday || 0),
      week: typeof weekVal === 'number' ? weekVal : (stats.week + (isNewSession ? 1 : 0)),
      month: typeof monthVal === 'number' ? monthVal : (stats.month + (isNewSession ? 1 : 0)),
      total: typeof totalVal === 'number' ? totalVal : (stats.total + (isNewSession ? 1 : 0)),
      lastDate: today.dateStr
    };

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(stats));
    } catch {
      // Ignore quota error
    }
  } catch (err) {
    console.warn('[VisitorCounter] Network offline, using local state:', err);
    if (isNewSession) {
      stats.today += 1;
      stats.week += 1;
      stats.month += 1;
      stats.total += 1;
      sessionStorage.setItem(SESSION_KEY, 'true');
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(stats));
      } catch {}
    }
  }

  // Update DOM with synchronized true counts
  updateDOMStats(stats);
}

/**
 * Update all DOM elements showing visitor stats
 */
function updateDOMStats(stats) {
  const { today, yesterday, week, month, total } = stats;

  // 1. Floating Pill Button (e.g., "1 Hari Ini" or "0 Hari Ini")
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
