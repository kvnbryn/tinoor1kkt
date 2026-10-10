/* ==========================================================================
   MAIN ENTRYPOINT & PAGE CONTROLLER
   ========================================================================== */

import { initCarousel } from './carousel.js';
import { initWidgets, openModal, closeModal } from './widgets.js';
import { initMap } from './map.js';
import { initCharts } from './charts.js';
import { initPreloaderAndTopBar } from './preloader.js';

// Initialize top bar & preloader as early as possible
initPreloaderAndTopBar();

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Drawer Navigation
  const burgerBtn = document.querySelector('.burger-button');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerBackdrop = document.querySelector('.drawer-backdrop');

  if (burgerBtn && mobileDrawer && drawerBackdrop) {
    burgerBtn.addEventListener('click', () => {
      burgerBtn.classList.toggle('active');
      mobileDrawer.classList.toggle('open');
      drawerBackdrop.classList.toggle('open');
    });

    drawerBackdrop.addEventListener('click', () => {
      burgerBtn.classList.remove('active');
      mobileDrawer.classList.remove('open');
      drawerBackdrop.classList.remove('open');
    });
  }

  // 2. Header Scroll Transition
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // 3. SOTK Detail Modal
  const sotkCards = document.querySelectorAll('.sotk-card[data-sotk]');
  const sotkModal = document.getElementById('modal-sotk-detail');
  if (sotkCards.length && sotkModal) {
    sotkCards.forEach((card) => {
      card.addEventListener('click', () => {
        const name = card.dataset.name || '';
        const role = card.dataset.role || '';
        const nip = card.dataset.nip || '';
        const bio = card.dataset.bio || '';
        const tupoksi = card.dataset.tupoksi || '';
        const img = card.querySelector('.sotk-avatar')?.getAttribute('src') || '';

        document.getElementById('sotk-modal-name').textContent = name;
        document.getElementById('sotk-modal-role').textContent = role;
        document.getElementById('sotk-modal-nip').textContent = nip ? `NIP: ${nip}` : 'Aparatur Pemerintahan Kelurahan';
        document.getElementById('sotk-modal-bio').textContent = bio;
        document.getElementById('sotk-modal-tupoksi').textContent = tupoksi;
        document.getElementById('sotk-modal-img').src = img;

        openModal(sotkModal);
      });
    });
  }

  // 4. Lightbox Image Gallery (Hanya Galeri Foto Beranda)
  const lightboxTriggers = document.querySelectorAll('.galeri-item');
  const lightboxModal = document.getElementById('modal-lightbox');
  if (lightboxTriggers.length && lightboxModal) {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    lightboxTriggers.forEach((item) => {
      item.addEventListener('click', () => {
        const src = item.querySelector('img')?.getAttribute('src');
        const caption = item.dataset.caption || '';
        if (src && lightboxImg) {
          lightboxImg.src = src;
          if (lightboxCaption) lightboxCaption.textContent = caption;
          openModal(lightboxModal);
        }
      });
    });
  }

  // 5. Roster Filter Tabs (kkt.html)
  const filterBtns = document.querySelectorAll('.kkt-filter-btn');
  const rosterCards = document.querySelectorAll('.kkt-card-framed[data-category], .polaroid-card[data-category]');
  if (filterBtns.length && rosterCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter || 'all';

        rosterCards.forEach((card) => {
          const category = card.dataset.category || '';
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            card.style.animation = 'fadeInCard 0.35s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 6. Subnav Scrollspy & Active Pill Sync (profil.html)
  const subnavLinks = document.querySelectorAll('.profil-subnav-link');
  if (subnavLinks.length) {
    const sections = Array.from(subnavLinks)
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 140;
      let currentSectionId = '';

      sections.forEach(section => {
        if (section.offsetTop <= scrollPos) {
          currentSectionId = section.getAttribute('id');
        }
      });

      if (currentSectionId) {
        subnavLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${currentSectionId}`;
          link.classList.toggle('active', isActive);
        });
      }
    }, { passive: true });
  }

  // 7. Initialize Components
  initCarousel();
  initWidgets();
  initMap();
  initCharts();

  // 6. Developer Console Easter Egg
  console.log(
    '%c🏛️ PORTAL RESMI Kelurahan TINOOR SATU %c\n' +
    '📍 Kecamatan Tomohon Utara, Kota Tomohon, Sulawesi Utara\n\n' +
    '✦ Dikembangkan oleh Tim Posko KKT 149 UNSRAT (Universitas Sam Ratulangi)\n' +
    '✦ Web Engineering & IT: Kevin Bryan Kalengkongan (NIM: 220211060166)\n' +
    '✦ Koordinator Posko: Samuel Abraham Kamasi | Sekretaris: Yesia Runtuwene | Bendahara: Eufrasia Mokili\n' +
    '✦ Motto: "Si Tou Timou Tumou Tou" — Unsrat Berdampak Bagi Negeri ✨',
    'background: #173809; color: #87DE57; font-weight: bold; font-size: 13px; padding: 6px 12px; border-radius: 4px; border: 1px solid #87DE57;',
    'color: #334155; font-size: 11px; line-height: 1.6;'
  );
});
