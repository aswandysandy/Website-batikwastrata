// Nomor WhatsApp Admin (+62 882-0206-77022)
const ADMIN_WA_NUMBER = "62882020677022";

/*
 * PENGATURAN PEMBAYARAN RESMI BATIKWASTRATA.ID
 */
const PAYMENT_CONFIG = {
  qrisImage: "qris_batikwastra.id.jpeg",
  bankName: "Bank Seabank",
  bankAccountNumber: "901641802057",
  bankAccountName: "Muhammad Asri Ardilla"
};

const siteHeader = document.getElementById('siteHeader');
const floatingPill = document.getElementById('floatingPill');
const navItems = document.querySelectorAll('#navlinks a, #floatingPill .floating-pill-links a');
const bottomTabItems = document.querySelectorAll('#mobileBottomBar .bottom-tab');

// Menyimpan foto lokal koleksi unggulan (jika dipilih dari 3 kartu utama)
let selectedLocalPhoto = "";

// Menyimpan state nota aktif saat ini
let currentNotaData = null;
let hasDownloadedCurrentNota = false;

// ==========================================
// 1. LENIS SMOOTH SCROLL (Dengan Pengecualian Modal)
// ==========================================
let lenis = null;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof window.Lenis === 'function' && !prefersReducedMotion) {
  lenis = new window.Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.5,
    prevent: (node) => Boolean(node && node.closest && node.closest('.receipt-modal, .lightbox'))
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

function smoothScrollToTarget(targetSelector, offset = -84) {
  const targetEl = typeof targetSelector === 'string'
    ? document.querySelector(targetSelector)
    : targetSelector;

  if (!targetEl) return;

  if (lenis) {
    lenis.scrollTo(targetEl, {
      offset,
      duration: 1.15
    });
  } else {
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      smoothScrollToTarget(target, window.innerWidth <= 768 ? -74 : -84);
    }
  });
});

// ==========================================
// 2. MOTION: ANIMASI MASUK CARD & HOVER
// ==========================================
function initMotionAnimations() {
  if (!window.Motion || prefersReducedMotion) return;

  const { animate, inView } = window.Motion;
  document.documentElement.classList.add('motion-enabled');

  document.querySelectorAll('.motion-section').forEach(section => {
    const cards = section.querySelectorAll('.motion-card');
    if (!cards.length) return;

    inView(section, () => {
      cards.forEach((card, idx) => {
        const order = Number(card.dataset.stagger ?? idx);
        animate(
          card,
          {
            opacity: [0, 1],
            transform: ['translateY(28px) scale(0.985)', 'translateY(0px) scale(1)']
          },
          {
            duration: 0.68,
            delay: order * 0.09,
            easing: [0.22, 1, 0.36, 1]
          }
        );
      });
    }, { amount: 0.12 });
  });

  document.querySelectorAll('.product, .step').forEach(card => {
    card.addEventListener('pointerenter', () => {
      if (window.matchMedia('(hover: hover)').matches) {
        animate(
          card,
          { transform: 'translateY(-8px) scale(1.01)' },
          { duration: 0.32, easing: [0.22, 1, 0.36, 1] }
        );
      }
    });

    card.addEventListener('pointerleave', () => {
      if (window.matchMedia('(hover: hover)').matches) {
        animate(
          card,
          { transform: 'translateY(0px) scale(1)' },
          { duration: 0.36, easing: [0.22, 1, 0.36, 1] }
        );
      }
    });
  });

  document.querySelectorAll('.btn, .bottom-tab').forEach(el => {
    el.addEventListener('pointerdown', () => {
      animate(el, { transform: 'scale(0.96)' }, { duration: 0.12 });
    });
    el.addEventListener('pointerup', () => {
      animate(el, { transform: 'scale(1)' }, { duration: 0.22, easing: [0.22, 1, 0.36, 1] });
    });
    el.addEventListener('pointerleave', () => {
      animate(el, { transform: 'scale(1)' }, { duration: 0.2 });
    });
  });
}

initMotionAnimations();

// ==========================================
// 3. FLOATING PILL, SCROLL SPY & BOTTOM TAB BAR
// ==========================================
const trackedSections = ['beranda', 'koleksi', 'katalog-ig', 'cara-sewa', 'kontak']
  .map(id => document.getElementById(id))
  .filter(Boolean);

function updateNavigationOnScroll() {
  const scrollY = window.scrollY;

  siteHeader.classList.toggle('scrolled', scrollY > 20);

  const showPill = scrollY > 150 && window.innerWidth > 768;
  document.body.classList.toggle('pill-active', showPill);
  if (floatingPill) {
    floatingPill.classList.toggle('visible', showPill);
  }

  const triggerLine = scrollY + (window.innerHeight * 0.32);
  let activeId = 'beranda';

  for (const sec of trackedSections) {
    const top = sec.getBoundingClientRect().top + scrollY;
    if (triggerLine >= top) {
      activeId = sec.id;
    }
  }

  navItems.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
  });

  bottomTabItems.forEach(tab => {
    const isActive = tab.dataset.section === activeId;
    tab.classList.toggle('active', isActive);
    if (isActive) {
      tab.setAttribute('aria-current', 'page');
    } else {
      tab.removeAttribute('aria-current');
    }
  });
}

window.addEventListener('scroll', updateNavigationOnScroll, { passive: true });
window.addEventListener('resize', updateNavigationOnScroll, { passive: true });
updateNavigationOnScroll();

// ==========================================
// 4. HELPER URL GAMBAR & PILIH KOLEKSI
// ==========================================
function getAbsoluteImageUrl(imgPath) {
  if (!imgPath) return "";
  try {
    const fullUrl = new URL(imgPath, window.location.href).href;
    return fullUrl.startsWith('http') ? fullUrl : "";
  } catch {
    return "";
  }
}

const selectedChoiceBanner = document.getElementById('selectedChoiceBanner');
const selectedChoiceText = document.getElementById('selectedChoiceText');

function showSelectedBanner(label) {
  selectedChoiceText.textContent = label;
  selectedChoiceBanner.classList.add('show');
}

document.getElementById('clearChoiceBtn').addEventListener('click', () => {
  selectedChoiceBanner.classList.remove('show');
  document.getElementById('custProduct').value = '';
  document.getElementById('custIgLink').value = '';
  selectedLocalPhoto = '';
});

function selectProductAndScroll(productName, imgPath = "") {
  const selectEl = document.getElementById('custProduct');
  selectEl.value = productName;
  selectedLocalPhoto = imgPath;

  showSelectedBanner(`✓ Koleksi dipilih: ${productName} (siap dikirim ke WhatsApp)`);
  smoothScrollToTarget('#kontak', window.innerWidth <= 768 ? -74 : -84);

  setTimeout(() => {
    document.getElementById('custName').focus({ preventScroll: true });
  }, 600);
}

document.querySelectorAll('.choose-product').forEach(button => {
  button.addEventListener('click', () => {
    selectProductAndScroll(button.dataset.product, button.dataset.img || "");
  });
});

// ==========================================
// 5. LINK FOTO INSTAGRAM -> WHATSAPP / FORM
// ==========================================
const igQuickLink = document.getElementById('igQuickLink');
const igQuickNote = document.getElementById('igQuickNote');
const igPasteBtn = document.getElementById('igPasteBtn');
const igLinkStatus = document.getElementById('igLinkStatus');
const custIgLinkInput = document.getElementById('custIgLink');
const floatingWaBtn = document.getElementById('floatingWaBtn');

const bookingSectionForWa = document.getElementById('kontak');
if (bookingSectionForWa && 'IntersectionObserver' in window) {
  const waVisibilityObserver = new IntersectionObserver(entries => {
    const isBookingVisible = entries.some(entry => entry.isIntersecting);
    floatingWaBtn.classList.toggle('is-hidden', isBookingVisible);
  }, { threshold: 0.12 });
  waVisibilityObserver.observe(bookingSectionForWa);
}

function updateIgLinkFeedback(urlValue) {
  const trimmed = urlValue.trim();
  custIgLinkInput.value = trimmed;

  if (trimmed) {
    const waText = `Halo Admin BatikWastrata.id 👋, saya tertarik menyewa baju yang ada di foto Instagram ini:\n${trimmed}\n\nMohon info ketersediaan & tarif sewanya ya Admin. Terima kasih.`;
    floatingWaBtn.href = `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(waText)}`;
  } else {
    floatingWaBtn.href = `https://wa.me/${ADMIN_WA_NUMBER}`;
  }

  if (!trimmed) {
    igLinkStatus.className = 'ig-link-status';
    igLinkStatus.textContent = '';
    return;
  }

  if (trimmed.includes('instagram.com/')) {
    igLinkStatus.className = 'ig-link-status valid';
    igLinkStatus.textContent = '✓ Link foto Instagram siap! Klik "Langsung Chat Admin" agar link & pratinjau fotonya langsung masuk ke WhatsApp.';
  } else {
    igLinkStatus.className = 'ig-link-status warn';
    igLinkStatus.textContent = 'Pastikan tautan yang ditempel berasal dari postingan/reel Instagram (contoh: https://www.instagram.com/p/...).';
  }
}

igQuickLink.addEventListener('input', () => {
  updateIgLinkFeedback(igQuickLink.value);
});

igPasteBtn.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      igQuickLink.value = text.trim();
      updateIgLinkFeedback(igQuickLink.value);
    } else {
      igQuickLink.focus();
    }
  } catch {
    igQuickLink.focus();
    igLinkStatus.className = 'ig-link-status warn';
    igLinkStatus.textContent = 'Silakan tekan dan tahan pada kotak di atas lalu pilih "Tempel" (Paste).';
  }
});

document.getElementById('igDirectWaBtn').addEventListener('click', () => {
  const linkVal = igQuickLink.value.trim();
  const noteVal = igQuickNote.value.trim();

  if (!linkVal) {
    igLinkStatus.className = 'ig-link-status warn';
    igLinkStatus.textContent = 'Tempelkan dulu link foto baju dari Instagram di atas sebelum mengirim ke WhatsApp Admin.';
    igQuickLink.focus();
    return;
  }

  const message = `Halo Admin BatikWastrata.id 👋, saya tertarik dengan koleksi baju pada foto Instagram berikut:\n\n🔗 *Link Foto IG:*\n${linkVal}${noteVal ? `\n\n📝 *Catatan:* ${noteVal}` : ''}\n\nMohon info ketersediaan, ukuran, dan harga sewanya ya Admin. Terima kasih.`;

  const url = `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
});

document.getElementById('igFillFormBtn').addEventListener('click', () => {
  const linkVal = igQuickLink.value.trim();
  const noteVal = igQuickNote.value.trim();

  if (!linkVal) {
    igLinkStatus.className = 'ig-link-status warn';
    igLinkStatus.textContent = 'Tempelkan dulu link foto baju dari Instagram di atas.';
    igQuickLink.focus();
    return;
  }

  document.getElementById('custProduct').value = 'Koleksi dari Instagram';
  custIgLinkInput.value = linkVal;
  if (noteVal && !document.getElementById('notes').value.trim()) {
    document.getElementById('notes').value = noteVal;
  }
  selectedLocalPhoto = "";

  showSelectedBanner('✓ Link foto Instagram sudah terisi di form & siap dikirim ke WhatsApp');
  smoothScrollToTarget('#kontak', window.innerWidth <= 768 ? -74 : -84);

  setTimeout(() => {
    document.getElementById('custName').focus({ preventScroll: true });
  }, 600);
});

// ==========================================
// 6. FORM KONSULTASI SEWA, QRIS & DETEKSI PEMBAYARAN
// ==========================================
const dateInput = document.getElementById('rentDate');
const today = new Date();
dateInput.min = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, '0'),
  String(today.getDate()).padStart(2, '0')
].join('-');

const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
const paymentDetailsBox = document.getElementById('paymentDetails');
const paymentDetailPanels = document.querySelectorAll('[data-payment-detail]');
const qrisVisual = document.getElementById('qrisVisual');
const qrisMessage = document.getElementById('qrisMessage');
const qrisActionButtons = document.getElementById('qrisActionButtons');
const downloadQrisBtn = document.getElementById('downloadQrisBtn');
const zoomQrisBtn = document.getElementById('zoomQrisBtn');
const bankNameLabel = document.getElementById('bankNameLabel');
const bankNumberLabel = document.getElementById('bankNumberLabel');
const bankOwnerLabel = document.getElementById('bankOwnerLabel');
const bankMessage = document.getElementById('bankMessage');
const copyAccountBtn = document.getElementById('copyAccountBtn');

// State Deteksi Pembayaran Otomatis
const paymentAutoTracker = document.getElementById('paymentAutoTracker');
const trackerWaitingView = paymentAutoTracker.querySelector('.tracker-waiting');
const trackerDetectingView = paymentAutoTracker.querySelector('.tracker-detecting');
const trackerCompletedView = paymentAutoTracker.querySelector('.tracker-completed');
const trackerWaitingHint = document.getElementById('trackerWaitingHint');
const completedTimeText = document.getElementById('completedTimeText');
const confirmPaidBtn = document.getElementById('confirmPaidBtn');
const resetPaidStateBtn = document.getElementById('resetPaidStateBtn');

let paymentStatusState = 'waiting'; // 'waiting' | 'detecting' | 'completed'
let paymentCompletedAt = '';
let hasInteractedWithPayment = false;
let leftPageAtTimestamp = 0;
let detectTimer = null;

function setPaymentTrackerState(newState) {
  paymentStatusState = newState;
  paymentAutoTracker.dataset.state = newState;

  trackerWaitingView.hidden = newState !== 'waiting';
  trackerDetectingView.hidden = newState !== 'detecting';
  trackerCompletedView.hidden = newState !== 'completed';

  if (newState === 'completed') {
    paymentCompletedAt = new Date().toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    completedTimeText.textContent = `Pembayaran dicatat pada ${paymentCompletedAt} · Otomatis terlampir di nota & WhatsApp Admin.`;
  } else {
    paymentCompletedAt = '';
  }
}

function triggerAutoPaymentDetection() {
  if (paymentStatusState !== 'waiting') return;
  clearTimeout(detectTimer);
  setPaymentTrackerState('detecting');

  detectTimer = setTimeout(() => {
    setPaymentTrackerState('completed');
  }, 1900);
}

confirmPaidBtn.addEventListener('click', () => {
  triggerAutoPaymentDetection();
});

resetPaidStateBtn.addEventListener('click', () => {
  clearTimeout(detectTimer);
  hasInteractedWithPayment = false;
  setPaymentTrackerState('waiting');
});

// Deteksi otomatis saat pelanggan berpindah ke aplikasi e-wallet/m-banking lalu kembali ke tab ini
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (hasInteractedWithPayment && paymentStatusState === 'waiting') {
      leftPageAtTimestamp = Date.now();
    }
  } else if (
    hasInteractedWithPayment &&
    paymentStatusState === 'waiting' &&
    leftPageAtTimestamp > 0 &&
    Date.now() - leftPageAtTimestamp >= 2000
  ) {
    leftPageAtTimestamp = 0;
    triggerAutoPaymentDetection();
  }
});

// Download Gambar QRIS untuk Pelanggan (mendukung http/https maupun file:///)
async function downloadQrisForCustomer() {
  if (!PAYMENT_CONFIG.qrisImage) return;
  const fileName = 'QRIS-BatikWastrata.id.jpeg';
  hasInteractedWithPayment = true;

  const originalHtml = downloadQrisBtn.innerHTML;
  downloadQrisBtn.textContent = 'Mengunduh QRIS...';

  try {
    const response = await fetch(PAYMENT_CONFIG.qrisImage);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    triggerFileDownload(blobUrl, fileName);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
  } catch {
    // Fallback langsung jika dibuka via file:///
    triggerFileDownload(PAYMENT_CONFIG.qrisImage, fileName);
  }

  downloadQrisBtn.innerHTML = 'QRIS Terunduh ✓';
  trackerWaitingHint.textContent = 'QRIS terunduh! Buka aplikasi e-wallet/m-banking untuk scan, lalu kembali ke sini.';
  setTimeout(() => {
    downloadQrisBtn.innerHTML = originalHtml;
  }, 2600);
}

function openQrisZoom() {
  if (!PAYMENT_CONFIG.qrisImage) return;
  hasInteractedWithPayment = true;
  openLightbox(
    PAYMENT_CONFIG.qrisImage,
    'QRIS Resmi — BATIKWASTRATA.ID',
    'contain',
    true
  );
}

function updatePaymentDetails(method) {
  paymentDetailsBox.hidden = !method;
  paymentDetailPanels.forEach(panel => {
    panel.hidden = panel.dataset.paymentDetail !== method;
  });

  // Tampilkan tracker deteksi otomatis untuk QRIS dan Transfer Bank
  const needsTracker = method === 'QRIS' || method === 'Transfer Bank';
  paymentAutoTracker.hidden = !needsTracker;
  if (needsTracker && paymentStatusState === 'waiting') {
    trackerWaitingHint.textContent = method === 'QRIS'
      ? 'Unduh QRIS / pindai kode, lalu bayar. Sistem otomatis mendeteksi saat kamu kembali.'
      : 'Salin nomor rekening & transfer, sistem otomatis mendeteksi saat kamu kembali.';
  }

  if (method === 'QRIS') {
    qrisVisual.innerHTML = '';
    if (PAYMENT_CONFIG.qrisImage) {
      const image = document.createElement('img');
      image.src = PAYMENT_CONFIG.qrisImage;
      image.alt = 'Kode QRIS resmi BatikWastrata.id';
      qrisVisual.appendChild(image);

      const zoomBadge = document.createElement('span');
      zoomBadge.className = 'qris-zoom-badge';
      zoomBadge.textContent = '🔍 Perbesar';
      qrisVisual.appendChild(zoomBadge);

      qrisActionButtons.hidden = false;
      qrisMessage.textContent = 'Unduh atau perbesar kode QRIS di samping, lalu pindai melalui aplikasi e-wallet atau mobile banking setelah nominal sewa dikonfirmasi admin.';
    } else {
      const placeholder = document.createElement('span');
      placeholder.className = 'placeholder-qr';
      placeholder.textContent = 'QR';
      qrisVisual.appendChild(placeholder);
      qrisActionButtons.hidden = true;
      qrisMessage.textContent = 'Kode QRIS resmi belum dipasang. Admin akan mengirimkan kode QR setelah pesanan dan nominal pembayaran dikonfirmasi.';
    }
  }

  if (method === 'Transfer Bank') {
    bankNameLabel.textContent = PAYMENT_CONFIG.bankName || 'Dikonfirmasi oleh admin';
    bankNumberLabel.textContent = PAYMENT_CONFIG.bankAccountNumber || 'Belum ditampilkan';
    bankOwnerLabel.textContent = PAYMENT_CONFIG.bankAccountName || 'Dikonfirmasi oleh admin';
    const hasAccount = Boolean(PAYMENT_CONFIG.bankAccountNumber);
    copyAccountBtn.disabled = !hasAccount;
    bankMessage.textContent = hasAccount
      ? 'Periksa kembali nama pemilik rekening sebelum transfer. Simpan bukti transfer dan kirimkan kepada admin.'
      : 'Nomor rekening resmi belum diatur. Hubungi admin melalui WhatsApp untuk mendapatkan detail rekening yang benar.';
  }
}

qrisVisual.addEventListener('click', openQrisZoom);
qrisVisual.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openQrisZoom();
  }
});
zoomQrisBtn.addEventListener('click', openQrisZoom);
downloadQrisBtn.addEventListener('click', downloadQrisForCustomer);

paymentRadios.forEach(radio => {
  radio.addEventListener('change', () => updatePaymentDetails(radio.value));
});

copyAccountBtn.addEventListener('click', async () => {
  if (!PAYMENT_CONFIG.bankAccountNumber) return;
  hasInteractedWithPayment = true;
  try {
    await navigator.clipboard.writeText(PAYMENT_CONFIG.bankAccountNumber);
    copyAccountBtn.textContent = 'Nomor rekening tersalin ✓';
    trackerWaitingHint.textContent = 'Nomor rekening tersalin! Silakan transfer melalui m-banking, lalu kembali ke sini.';
    setTimeout(() => {
      copyAccountBtn.textContent = 'Salin nomor rekening';
    }, 2500);
  } catch {
    bankMessage.textContent = 'Browser tidak mengizinkan salin otomatis. Silakan pilih dan salin nomor rekening secara manual.';
  }
});

// ==========================================
// 7. NOTA KONSULTASI, ENCODE LINK ADMIN & AUTO-DOWNLOAD PNG
// ==========================================
const receiptModal = document.getElementById('receiptModal');
const receiptDialog = receiptModal.querySelector('.receipt-dialog');
const receiptClose = document.getElementById('receiptClose');
const downloadReceiptPngBtn = document.getElementById('downloadReceiptPngBtn');
const printReceiptBtn = document.getElementById('printReceiptBtn');
const receiptWhatsAppBtn = document.getElementById('receiptWhatsAppBtn');
const receiptDownloadToast = document.getElementById('receiptDownloadToast');
let currentReceiptWhatsAppUrl = '';

function formatIndonesianDate(dateValue) {
  return new Date(dateValue + 'T00:00:00').toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

function closeReceipt() {
  receiptModal.classList.remove('show');
  receiptModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (lenis) lenis.start();
}

function openReceipt() {
  receiptModal.classList.add('show');
  receiptModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  receiptModal.scrollTop = 0;
  if (receiptDialog) receiptDialog.scrollTop = 0;
  if (lenis) lenis.stop();
  receiptClose.focus({ preventScroll: true });
}

function makeBookingCode() {
  const now = new Date();
  const datePart = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `BW-${datePart}-${randomPart}`;
}

// Encode & Decode Data Nota ke URL Query untuk Auto-Download Admin BatikWastrata
function encodeNotaPayload(data) {
  try {
    const compact = {
      c: data.bookingCode,
      t: data.createdAt,
      n: data.name,
      p: data.product,
      d: data.formattedDate,
      a: data.area,
      m: data.paymentMethod,
      i: data.igLink || '',
      o: data.notes || '',
      s: data.paidAt || ''
    };
    const json = JSON.stringify(compact);
    const bytes = new TextEncoder().encode(json);
    let bin = '';
    bytes.forEach(b => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch {
    return '';
  }
}

function decodeNotaPayload(token) {
  try {
    let b64 = token.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const obj = JSON.parse(new TextDecoder().decode(bytes));
    if (!obj || !obj.c || !obj.n) return null;
    return {
      bookingCode: String(obj.c),
      createdAt: String(obj.t || '-'),
      name: String(obj.n),
      product: String(obj.p || '-'),
      formattedDate: String(obj.d || '-'),
      area: String(obj.a || '-'),
      paymentMethod: String(obj.m || '-'),
      igLink: String(obj.i || ''),
      notes: String(obj.o || ''),
      paidAt: String(obj.s || '')
    };
  } catch {
    return null;
  }
}

function buildAdminAutoDownloadUrl(data) {
  const token = encodeNotaPayload(data);
  if (!token) return '';
  try {
    const url = new URL(window.location.href.split('#')[0].split('?')[0]);
    url.searchParams.set('nota', token);
    url.searchParams.set('autodownload', '1');
    return url.toString();
  } catch {
    return '';
  }
}

function populateReceiptDOM(data) {
  currentNotaData = data;
  hasDownloadedCurrentNota = false;

  const receiptStatusRow = document.getElementById('receiptStatusRow');
  const receiptStatusBadge = document.getElementById('receiptStatusBadge');
  const receiptPaidTimeRow = document.getElementById('receiptPaidTimeRow');
  const receiptPaidTime = document.getElementById('receiptPaidTime');

  const isPaid = Boolean(data.paidAt);
  receiptStatusRow.classList.toggle('is-paid', isPaid);
  receiptStatusBadge.textContent = isPaid
    ? '✓ PEMBAYARAN SELESAI (VERIFIKASI ADMIN)'
    : 'MENUNGGU KONFIRMASI ADMIN';

  receiptPaidTimeRow.hidden = !isPaid;
  receiptPaidTime.textContent = isPaid ? `Sudah dibayar (${data.paidAt})` : '-';

  document.getElementById('receiptCode').textContent = data.bookingCode;
  document.getElementById('receiptCreated').textContent = data.createdAt;
  document.getElementById('receiptCustomer').textContent = data.name;
  document.getElementById('receiptProduct').textContent = data.product;
  document.getElementById('receiptDate').textContent = data.formattedDate;
  document.getElementById('receiptArea').textContent = data.area;
  document.getElementById('receiptPayment').textContent = data.paymentMethod;

  const receiptNotesRow = document.getElementById('receiptNotesRow');
  const receiptIgRow = document.getElementById('receiptIgRow');
  receiptNotesRow.hidden = !data.notes;
  receiptIgRow.hidden = !data.igLink;
  document.getElementById('receiptNotes').textContent = data.notes;
  document.getElementById('receiptIGLink').textContent = data.igLink;

  receiptDownloadToast.hidden = true;
  receiptDownloadToast.textContent = '';
}

function showDownloadToast(message) {
  receiptDownloadToast.textContent = message;
  receiptDownloadToast.hidden = false;
}

// Renderer Canvas 2D Resolusi Tinggi (100% bebas error CORS/file://)
function renderReceiptToCanvas2D(data) {
  const scale = 2;
  const width = 640;
  const isPaid = Boolean(data.paidAt);
  const rows = [
    ['Tanggal dibuat', data.createdAt, 'Nama pelanggan', data.name],
    ['Koleksi pilihan', data.product, 'Tanggal penggunaan', data.formattedDate],
    ['Lokasi', data.area, 'Metode pembayaran', data.paymentMethod]
  ];

  const extraHeight = (isPaid ? 52 : 0) + (data.igLink ? 52 : 0) + (data.notes ? 52 : 0);
  const height = 650 + extraHeight;

  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  // Latar belakang putih bersih
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Border luar
  ctx.strokeStyle = '#E8DED8';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, width - 2, height - 2);

  // Garis aksen atas
  const grad = ctx.createLinearGradient(0, 0, width, 0);
  grad.addColorStop(0, '#6B1724');
  grad.addColorStop(0.55, '#B73A3A');
  grad.addColorStop(1, '#C7A46B');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, 8);

  // Emblem Geometris BatikWastrata
  ctx.fillStyle = '#6B1724';
  ctx.beginPath();
  ctx.moveTo(46, 30);
  ctx.lineTo(66, 40);
  ctx.lineTo(66, 66);
  ctx.lineTo(44, 74);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#B73A3A';
  ctx.beginPath();
  ctx.moveTo(40, 34);
  ctx.lineTo(60, 44);
  ctx.lineTo(60, 68);
  ctx.lineTo(38, 76);
  ctx.closePath();
  ctx.fill();

  // Nama Brand
  ctx.fillStyle = '#6B1724';
  ctx.font = 'bold 17px "DM Sans", Arial, sans-serif';
  ctx.fillText('BATIKWASTRATA.ID', 80, 50);
  ctx.fillStyle = '#87777A';
  ctx.font = '13px Georgia, serif';
  ctx.fillText('Busana tradisi, gaya masa kini', 80, 69);

  // Garis pemisah header
  ctx.strokeStyle = '#EEE4DF';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(36, 92);
  ctx.lineTo(width - 36, 92);
  ctx.stroke();

  // Judul Nota
  ctx.textAlign = 'center';
  ctx.fillStyle = '#A15A54';
  ctx.font = 'bold 11px "DM Sans", Arial, sans-serif';
  ctx.fillText('RINGKASAN PEMESANAN', width / 2, 122);

  ctx.fillStyle = '#6B1724';
  ctx.font = 'bold 28px Georgia, serif';
  ctx.fillText('Nota Konsultasi Sewa', width / 2, 154);

  ctx.fillStyle = '#827276';
  ctx.font = '13px "DM Sans", Arial, sans-serif';
  ctx.fillText('Dokumen ringkasan permintaan sewa pelanggan', width / 2, 176);

  // Kotak Status & Kode Booking
  ctx.textAlign = 'left';
  ctx.fillStyle = isPaid ? '#F0FDF4' : '#FBF5EF';
  ctx.fillRect(36, 196, width - 72, 42);
  ctx.strokeStyle = isPaid ? '#86EFAC' : '#EDDCCE';
  ctx.strokeRect(36, 196, width - 72, 42);

  ctx.fillStyle = isPaid ? '#15803D' : '#87552A';
  ctx.font = 'bold 11px "DM Sans", Arial, sans-serif';
  ctx.fillText(isPaid ? '✓ PEMBAYARAN SELESAI (VERIFIKASI ADMIN)' : 'MENUNGGU KONFIRMASI ADMIN', 52, 221);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#6B1724';
  ctx.font = 'bold 13px monospace';
  ctx.fillText(data.bookingCode, width - 52, 222);

  // Grid Informasi 2 Kolom
  ctx.textAlign = 'left';
  let y = 272;
  rows.forEach(([l1, v1, l2, v2]) => {
    ctx.fillStyle = '#958589';
    ctx.font = '12px "DM Sans", Arial, sans-serif';
    ctx.fillText(l1, 38, y);
    ctx.fillText(l2, width / 2 + 12, y);

    ctx.fillStyle = '#3B292E';
    ctx.font = 'bold 14px "DM Sans", Arial, sans-serif';
    ctx.fillText(v1.slice(0, 34), 38, y + 20);
    ctx.fillText(v2.slice(0, 34), width / 2 + 12, y + 20);
    y += 58;
  });

  if (isPaid) {
    ctx.fillStyle = '#958589';
    ctx.font = '12px "DM Sans", Arial, sans-serif';
    ctx.fillText('Status pembayaran pelanggan', 38, y);
    ctx.fillStyle = '#15803D';
    ctx.font = 'bold 13px "DM Sans", Arial, sans-serif';
    ctx.fillText(`Sudah dibayar (${data.paidAt})`, 38, y + 20);
    y += 52;
  }

  if (data.igLink) {
    ctx.fillStyle = '#958589';
    ctx.font = '12px "DM Sans", Arial, sans-serif';
    ctx.fillText('Link koleksi Instagram', 38, y);
    ctx.fillStyle = '#3B292E';
    ctx.font = 'bold 13px "DM Sans", Arial, sans-serif';
    ctx.fillText(data.igLink.slice(0, 68), 38, y + 20);
    y += 52;
  }

  if (data.notes) {
    ctx.fillStyle = '#958589';
    ctx.font = '12px "DM Sans", Arial, sans-serif';
    ctx.fillText('Catatan', 38, y);
    ctx.fillStyle = '#3B292E';
    ctx.font = 'bold 13px "DM Sans", Arial, sans-serif';
    ctx.fillText(data.notes.slice(0, 68), 38, y + 20);
    y += 52;
  }

  // Baris Total Biaya
  ctx.fillStyle = '#FDFBF9';
  ctx.fillRect(36, y + 4, width - 72, 54);
  ctx.strokeStyle = '#EEE4DF';
  ctx.strokeRect(36, y + 4, width - 72, 54);

  ctx.fillStyle = '#4A353A';
  ctx.font = 'bold 13px "DM Sans", Arial, sans-serif';
  ctx.fillText('Total biaya sewa', 52, y + 27);
  ctx.fillStyle = '#97878A';
  ctx.font = '11px "DM Sans", Arial, sans-serif';
  ctx.fillText('Menunggu konfirmasi tarif dari admin', 52, y + 45);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#6B1724';
  ctx.font = 'bold 17px Georgia, serif';
  ctx.fillText('Belum ditetapkan', width - 52, y + 36);

  // Kotak Catatan Penting
  y += 74;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FBF7F0';
  ctx.fillRect(36, y, width - 72, 74);
  ctx.fillStyle = '#C6A16C';
  ctx.fillRect(36, y, 4, 74);

  ctx.fillStyle = '#76552E';
  ctx.font = 'bold 12px "DM Sans", Arial, sans-serif';
  ctx.fillText('Catatan penting', 52, y + 20);
  ctx.fillStyle = '#75696B';
  ctx.font = '11px "DM Sans", Arial, sans-serif';
  ctx.fillText('Nota ini merupakan ringkasan konsultasi/pemesanan sementara, bukan invoice final.', 52, y + 38);
  ctx.fillText('Pesanan dan nominal biaya dinyatakan final setelah dikonfirmasi Admin BatikWastrata.id.', 52, y + 55);

  // Footer Nota
  y += 96;
  ctx.fillStyle = '#8D7F82';
  ctx.font = '11px "DM Sans", Arial, sans-serif';
  ctx.fillText('Jam operasional: 08.00–22.00', 38, y);
  ctx.textAlign = 'right';
  ctx.fillText('WhatsApp Admin: 0882-0206-77022', width - 38, y);

  return canvas.toDataURL('image/png');
}

function triggerFileDownload(dataUrl, fileName) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function downloadReceiptAsPng(data = currentNotaData, toastLabel = '') {
  if (!data) return;
  const fileName = `Nota-${data.bookingCode}.png`;
  const receiptEl = document.getElementById('receiptPrintArea');

  try {
    // Gunakan html2canvas jika berjalan di http/https, atau fallback ke Canvas 2D jika file:///
    if (typeof window.html2canvas === 'function' && window.location.protocol.startsWith('http')) {
      const canvas = await window.html2canvas(receiptEl, {
        scale: 2,
        backgroundColor: '#FFFFFF',
        useCORS: true,
        allowTaint: false
      });
      const dataUrl = canvas.toDataURL('image/png');
      triggerFileDownload(dataUrl, fileName);
    } else {
      const dataUrl = renderReceiptToCanvas2D(data);
      triggerFileDownload(dataUrl, fileName);
    }
  } catch {
    const dataUrl = renderReceiptToCanvas2D(data);
    triggerFileDownload(dataUrl, fileName);
  }

  hasDownloadedCurrentNota = true;
  showDownloadToast(toastLabel || `✓ File nota "${fileName}" berhasil diunduh otomatis.`);
}

document.getElementById('rentForm').addEventListener('submit', event => {
  event.preventDefault();

  const name = document.getElementById('custName').value.trim();
  const product = document.getElementById('custProduct').value;
  const igLink = custIgLinkInput.value.trim();
  const date = document.getElementById('rentDate').value;
  const area = document.getElementById('rentArea').value;
  const notes = document.getElementById('notes').value.trim();
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || '';

  if (!name || !product || !date || !area || !paymentMethod) return;

  const formattedDate = formatIndonesianDate(date);
  const bookingCode = makeBookingCode();
  const createdAt = new Date().toLocaleString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const paidAt = (paymentMethod === 'QRIS' || paymentMethod === 'Transfer Bank') && paymentStatusState === 'completed'
    ? paymentCompletedAt
    : '';

  const notaData = {
    bookingCode,
    createdAt,
    name,
    product,
    formattedDate,
    area,
    paymentMethod,
    igLink,
    notes,
    paidAt
  };

  populateReceiptDOM(notaData);

  const absPhotoUrl = getAbsoluteImageUrl(selectedLocalPhoto);
  const photoAttachment = igLink
    ? `\nLink Foto Instagram: ${igLink}`
    : (absPhotoUrl ? `\nFoto Koleksi: ${absPhotoUrl}` : '');

  const adminAutoLink = buildAdminAutoDownloadUrl(notaData);
  const adminLinkLine = adminAutoLink && adminAutoLink.startsWith('http')
    ? `\n\n📥 *Unduh Otomatis Nota Admin:*\n${adminAutoLink}`
    : '';

  let paymentRequest = '';
  if (paidAt) {
    paymentRequest = `✅ *Status Pembayaran:* Sudah dibayar via ${paymentMethod} pada ${paidAt}. Mohon verifikasi bukti/mutasi pembayaran.`;
  } else if (paymentMethod === 'Tunai') {
    paymentRequest = 'Saya memilih pembayaran tunai saat pengambilan, sesuai kesepakatan dengan admin.';
  } else {
    paymentRequest = `Saya memilih pembayaran ${paymentMethod}. Mohon kirimkan detail/total biaya resmi untuk dikonfirmasi.`;
  }

  const message = `Halo Admin BatikWastrata.id, saya ingin mengonfirmasi permintaan sewa berikut.\n\nKode booking: ${bookingCode}\nNama: ${name}\nKoleksi: ${product}${photoAttachment}\nTanggal penggunaan: ${formattedDate}\nLokasi: ${area}\nMetode pembayaran: ${paymentMethod}${notes ? `\nCatatan: ${notes}` : ''}\n\n${paymentRequest}\nMohon konfirmasi ketersediaan, total biaya, dan ketentuan sewanya. Terima kasih.${adminLinkLine}`;

  currentReceiptWhatsAppUrl = `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(message)}`;

  const notice = document.getElementById('notice');
  notice.style.display = 'block';
  notice.textContent = `Nota konsultasi ${bookingCode} berhasil dibuat. Periksa detailnya, lalu unduh atau kirim ke WhatsApp Admin.`;

  openReceipt();
});

// Tombol Unduh Nota (PNG) Manual
downloadReceiptPngBtn.addEventListener('click', () => {
  downloadReceiptAsPng(currentNotaData);
});

// Tombol Kirim ke WhatsApp Admin -> Otomatis Download File Nota PNG + Buka WA
receiptWhatsAppBtn.addEventListener('click', async () => {
  if (!hasDownloadedCurrentNota && currentNotaData) {
    await downloadReceiptAsPng(
      currentNotaData,
      `✓ File Nota-${currentNotaData.bookingCode}.png otomatis terunduh (siap dilampirkan di WhatsApp Admin).`
    );
  }
  if (currentReceiptWhatsAppUrl) {
    window.open(currentReceiptWhatsAppUrl, '_blank', 'noopener,noreferrer');
  }
});

receiptClose.addEventListener('click', closeReceipt);
receiptModal.addEventListener('click', event => {
  if (event.target === receiptModal) closeReceipt();
});
printReceiptBtn.addEventListener('click', () => window.print());
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && receiptModal.classList.contains('show')) closeReceipt();
});

// ==========================================
// 8. AUTO-DOWNLOAD NOTA SAAT ADMIN MEMBUKA TAUTAN (?nota=...&autodownload=1)
// ==========================================
function checkIncomingAdminNotaFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const notaToken = params.get('nota');
  if (!notaToken) return;

  const decodedNota = decodeNotaPayload(notaToken);
  if (!decodedNota) return;

  populateReceiptDOM(decodedNota);

  const confirmMsg = `Halo kak ${decodedNota.name} 👋, pesanan sewa BatikWastrata.id dengan kode *${decodedNota.bookingCode}* (${decodedNota.product} - ${decodedNota.formattedDate}) sudah kami terima dan sedang kami cek ketersediaannya.`;
  currentReceiptWhatsAppUrl = `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(confirmMsg)}`;

  openReceipt();

  if (params.get('autodownload') === '1') {
    setTimeout(() => {
      downloadReceiptAsPng(
        decodedNota,
        `✓ Mode Admin: Nota-${decodedNota.bookingCode}.png berhasil diunduh otomatis ke perangkat Admin.`
      );
    }, 450);
  }
}

window.addEventListener('DOMContentLoaded', checkIncomingAdminNotaFromUrl);

// ==========================================
// 9. LIGHTBOX PRATINJAU GAMBAR (Koleksi & QRIS)
// ==========================================
const lightbox = document.getElementById('imageLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxDownloadBtn = document.getElementById('lightboxDownloadBtn');

function openLightbox(src, caption, fit = 'cover', showDownload = false) {
  lightboxImg.src = src;
  lightboxImg.alt = caption || 'Pratinjau Koleksi';
  lightboxImg.style.objectFit = fit;
  lightboxImg.style.background = fit === 'contain' ? '#ffffff' : 'transparent';
  lightboxCaption.textContent = caption || '';
  lightboxDownloadBtn.hidden = !showDownload;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  if (lenis) lenis.stop();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  if (lenis) lenis.start();
}

lightboxDownloadBtn.addEventListener('click', () => {
  downloadQrisForCustomer();
});

document.querySelectorAll('.product-visual').forEach(box => {
  box.addEventListener('click', () => {
    openLightbox(box.dataset.zoomSrc, box.dataset.zoomTitle, 'cover', false);
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) {
    closeLightbox();
  }
});
