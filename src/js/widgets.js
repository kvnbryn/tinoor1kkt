/* ==========================================================================
   FLOATING WIDGETS & MODAL CONTROLLERS (Visitor Stats, Accessibility, Pengaduan)
   ========================================================================== */

export function initWidgets() {
  // 1. Visitor Counter Widget Toggle
  const visitorWidget = document.querySelector('.floating-visitor-widget');
  const visitorBtn = document.querySelector('.visitor-pill-button');

  if (visitorWidget && visitorBtn) {
    visitorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      visitorWidget.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!visitorWidget.contains(e.target)) {
        visitorWidget.classList.remove('open');
      }
    });
  }

  // 2. Accessibility Tool
  const accessibilityBtn = document.querySelector('.btn-accessibility-floating');
  const accessibilityModal = document.getElementById('modal-accessibility');

  if (accessibilityBtn && accessibilityModal) {
    accessibilityBtn.addEventListener('click', () => {
      openModal(accessibilityModal);
    });
  }

  // Accessibility Actions
  const btnFontSmall = document.getElementById('btn-font-small');
  const btnFontNormal = document.getElementById('btn-font-normal');
  const btnFontLarge = document.getElementById('btn-font-large');
  const btnContrastNormal = document.getElementById('btn-contrast-normal');
  const btnContrastHigh = document.getElementById('btn-contrast-high');
  const btnContrastDark = document.getElementById('btn-contrast-dark');
  const btnResetA11y = document.getElementById('btn-reset-a11y');

  // Load saved preferences
  const savedContrast = localStorage.getItem('tinoor_contrast') || 'normal';
  const savedFontSize = localStorage.getItem('tinoor_fontsize') || 'normal';
  applyContrast(savedContrast);
  applyFontSize(savedFontSize);

  if (btnFontSmall) btnFontSmall.addEventListener('click', () => applyFontSize('small'));
  if (btnFontNormal) btnFontNormal.addEventListener('click', () => applyFontSize('normal'));
  if (btnFontLarge) btnFontLarge.addEventListener('click', () => applyFontSize('large'));

  if (btnContrastNormal) btnContrastNormal.addEventListener('click', () => applyContrast('normal'));
  if (btnContrastHigh) btnContrastHigh.addEventListener('click', () => applyContrast('high-contrast'));
  if (btnContrastDark) btnContrastDark.addEventListener('click', () => applyContrast('dark-contrast'));

  if (btnResetA11y) {
    btnResetA11y.addEventListener('click', () => {
      applyFontSize('normal');
      applyContrast('normal');
      localStorage.removeItem('tinoor_contrast');
      localStorage.removeItem('tinoor_fontsize');
    });
  }

  function applyFontSize(size) {
    document.documentElement.classList.remove('font-small', 'font-large');
    if (size === 'small') document.documentElement.classList.add('font-small');
    if (size === 'large') document.documentElement.classList.add('font-large');
    localStorage.setItem('tinoor_fontsize', size);
  }

  function applyContrast(contrast) {
    document.documentElement.classList.remove('high-contrast', 'dark-contrast');
    if (contrast === 'high-contrast') document.documentElement.classList.add('high-contrast');
    if (contrast === 'dark-contrast') document.documentElement.classList.add('high-contrast'); // uses dark/high contrast tokens
    localStorage.setItem('tinoor_contrast', contrast);
  }

  // 3. Pengaduan Modal
  const pengaduanBtn = document.querySelector('.btn-pengaduan-floating');
  const pengaduanModal = document.getElementById('modal-pengaduan');

  if (pengaduanBtn && pengaduanModal) {
    pengaduanBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(pengaduanModal);
    });
  }

  // Generic Modal Close Logic
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    const closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(overlay));
    }
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(closeModal);
    }
  });

  // Pengaduan Form Submit
  const pengaduanForm = document.getElementById('form-pengaduan');
  if (pengaduanForm) {
    pengaduanForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nama = document.getElementById('pengaduan-nama')?.value || '';
      const pesan = document.getElementById('pengaduan-pesan')?.value || '';
      const lingkungan = document.getElementById('pengaduan-lingkungan')?.value || 'Lingkungan 1';

      // Alert success
      alert(`Terima kasih Bapak/Ibu ${nama}. Pengaduan Anda dari ${lingkungan} telah diterima oleh Pusat Layanan Kelurahan/Kelurahan Tinoor Satu dan akan segera ditindaklanjuti.`);
      pengaduanForm.reset();
      if (pengaduanModal) closeModal(pengaduanModal);
    });
  }
}

export function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add('active');
  document.body.style.overflow = 'hidden';
}

export function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove('active');
  document.body.style.overflow = '';
}
