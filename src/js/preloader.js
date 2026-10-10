/* ==========================================================================
   PRELOADER & TOP NAVIGATION PROGRESS BAR CONTROLLER
   Mountain Lottie Animation + Top Green Route Progress Bar
   ========================================================================== */

export function initPreloaderAndTopBar() {
  initTopProgressBar();
  initMountainPreloader();
}

/**
 * 1. Top Page Navigation Progress Bar
 * Simulates YouTube / Next.js / GitHub style glowing green line on internal page navigation.
 */
function initTopProgressBar() {
  let topBar = document.getElementById('top-page-progressbar');
  if (!topBar) {
    topBar = document.createElement('div');
    topBar.id = 'top-page-progressbar';
    document.body.prepend(topBar);
  }

  // Flash complete bar on initial page load
  topBar.classList.add('active');
  topBar.style.width = '70%';
  setTimeout(() => {
    topBar.style.width = '100%';
    setTimeout(() => {
      topBar.classList.add('done');
      setTimeout(() => {
        topBar.classList.remove('active', 'done');
        topBar.style.width = '0%';
      }, 400);
    }, 150);
  }, 100);

  // Intercept internal link navigation
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Ignore anchors, external links, special protocols, and new tab keys
    if (
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:') ||
      link.target === '_blank' ||
      link.hasAttribute('download') ||
      e.ctrlKey || e.metaKey || e.shiftKey || e.altKey
    ) {
      return;
    }

    // Check if it's pointing to the same page hash
    try {
      const targetUrl = new URL(link.href, window.location.href);
      if (
        targetUrl.origin === window.location.origin &&
        targetUrl.pathname === window.location.pathname &&
        targetUrl.search === window.location.search
      ) {
        return; // Same page anchor navigation
      }
    } catch {
      // Ignore URL parse error
    }

    // Trigger instant glowing top bar
    topBar.classList.remove('done');
    topBar.classList.add('active');
    topBar.style.width = '0%';

    requestAnimationFrame(() => {
      topBar.style.width = '35%';
      setTimeout(() => {
        topBar.style.width = '72%';
        setTimeout(() => {
          topBar.style.width = '88%';
        }, 200);
      }, 100);
    });
  });

  // Handle browser back/forward cache
  window.addEventListener('pageshow', (event) => {
    if (event.persisted && topBar) {
      topBar.classList.add('done');
      setTimeout(() => {
        topBar.classList.remove('active', 'done');
        topBar.style.width = '0%';
      }, 300);
    }
  });
}

/**
 * 2. Fullscreen Mountain Lottie-Style Preloader
 * Renders on page entry, displays mountain vector animation with smooth progress fill,
 * waits for critical assets, and swiftly fades out without unnecessary delays.
 */
function initMountainPreloader() {
  const preloader = document.getElementById('app-preloader');
  if (!preloader) return;

  const fill = preloader.querySelector('.preloader-fill');
  const startTime = Date.now();
  const MIN_DISPLAY_TIME = 850; // Smooth visual experience (under 1s)
  const MAX_TIMEOUT = 1400; // Failsafe cap

  let currentProgress = 15;
  if (fill) fill.style.width = `${currentProgress}%`;

  // Animate progress smoothly
  const progressInterval = setInterval(() => {
    if (currentProgress < 85) {
      currentProgress += Math.floor(Math.random() * 18) + 8;
      if (currentProgress > 85) currentProgress = 85;
      if (fill) fill.style.width = `${currentProgress}%`;
    }
  }, 120);

  function dismissPreloader() {
    clearInterval(progressInterval);
    if (fill) fill.style.width = '100%';

    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsed);

    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.remove(); // Clean up from DOM
      }, 450);
    }, remainingTime);
  }

  // Dismiss when window load finishes or timeout expires
  if (document.readyState === 'complete') {
    dismissPreloader();
  } else {
    window.addEventListener('load', dismissPreloader);
    setTimeout(dismissPreloader, MAX_TIMEOUT);
  }
}
