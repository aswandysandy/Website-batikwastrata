// Nomor WhatsApp Admin (+62 882-0206-77022)
const ADMIN_WA_NUMBER = "62882020677022";

/*
 * PENGATURAN PEMBAYARAN BATIKWASTRATA.ID
 * Isi setelah mendapatkan detail resmi dari pemilik usaha.
 * qrisImage: nama file gambar QRIS (contoh: "qris-batikwastrata.png")
 * Jangan memakai QRIS/rekening milik orang lain atau data contoh.
 */
const PAYMENT_CONFIG = {
  qrisImage: "",
  bankName: "",
  bankAccountNumber: "",
  bankAccountName: ""
};
const nav = document.getElementById('navlinks');
const menuToggle = document.getElementById('menuToggle');
const siteHeader = document.getElementById('siteHeader');

// Menyimpan foto lokal koleksi unggulan (jika dipilih dari 3 kartu utama)
let selectedLocalPhoto = "";

// Toggle Menu Mobile
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.innerHTML = open 
    ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>' 
    : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
});

// Tutup menu saat link diklik
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
  });
});

// Efek Shadow Header & Penyorotan Menu Aktif Saat Scroll
const sections = document.querySelectorAll('section[id]');
const navItems = nav.querySelectorAll('a');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }

  let currentId = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 140;
    if (window.scrollY >= top) {
      currentId = sec.getAttribute('id');
    }
  });

  navItems.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
  });
}, { passive: true });

// Animasi Scroll Reveal dengan IntersectionObserver
const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => observer.observe(el));
} else {
  revealElements.forEach(el => el.classList.add('active'));
}

// Helper untuk mendapatkan URL lengkap foto saat website sudah online
function getAbsoluteImageUrl(imgPath) {
  if (!imgPath) return "";
  try {
    const fullUrl = new URL(imgPath, window.location.href).href;
    return fullUrl.startsWith('http') ? fullUrl : "";
  } catch {
    return "";
  }
}

// Indikator visual pilihan busana di dalam form
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

// ==========================================
// PILIH KOLEKSI UNGGULAN -> FORM SEWA
// ==========================================
function selectProductAndScroll(productName, imgPath = "") {
  const selectEl = document.getElementById('custProduct');
  selectEl.value = productName;
  selectedLocalPhoto = imgPath;

  showSelectedBanner(`✓ Koleksi dipilih: ${productName} (siap dikirim ke WhatsApp)`);

  document.getElementById('kontak').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    document.getElementById('custName').focus({ preventScroll: true });
  }, 450);
}

document.querySelectorAll('.choose-product').forEach(button => {
  button.addEventListener('click', () => {
    selectProductAndScroll(button.dataset.product, button.dataset.img || "");
  });
});

// ==========================================
// BAGIAN LINK FOTO INSTAGRAM -> LANGSUNG KE WHATSAPP
// ==========================================
const igQuickLink = document.getElementById('igQuickLink');
const igQuickNote = document.getElementById('igQuickNote');
const igPasteBtn = document.getElementById('igPasteBtn');
const igLinkStatus = document.getElementById('igLinkStatus');
const custIgLinkInput = document.getElementById('custIgLink');
const floatingWaBtn = document.getElementById('floatingWaBtn');

// Sembunyikan tombol WhatsApp melayang saat pelanggan sedang mengisi formulir,
// agar tidak menutupi opsi pembayaran pada layar ponsel.
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

  // Sinkronkan juga ke tombol WA melayang di pojok kanan bawah
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

// Tombol "Tempel Link" 1-klik dari clipboard
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

// Tombol 1: Langsung Chat Admin + Kirim Link Foto Instagram ke WhatsApp
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

// Tombol 2: Masukkan Link Foto IG ke Form Konsultasi Sewa
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

  document.getElementById('kontak').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    document.getElementById('custName').focus({ preventScroll: true });
  }, 450);
});

// ==========================================
// FORM KONSULTASI SEWA -> WHATSAPP ADMIN
// ==========================================
const dateInput = document.getElementById('rentDate');
const today = new Date();
dateInput.min = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, '0'),
  String(today.getDate()).padStart(2, '0')
].join('-');

// ==========================================
// PILIHAN PEMBAYARAN & DETAIL QRIS / REKENING
// ==========================================
const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
const paymentDetailsBox = document.getElementById('paymentDetails');
const paymentDetailPanels = document.querySelectorAll('[data-payment-detail]');
const qrisVisual = document.getElementById('qrisVisual');
const qrisMessage = document.getElementById('qrisMessage');
const bankNameLabel = document.getElementById('bankNameLabel');
const bankNumberLabel = document.getElementById('bankNumberLabel');
const bankOwnerLabel = document.getElementById('bankOwnerLabel');
const bankMessage = document.getElementById('bankMessage');
const copyAccountBtn = document.getElementById('copyAccountBtn');

function updatePaymentDetails(method) {
  paymentDetailsBox.hidden = !method;
  paymentDetailPanels.forEach(panel => {
    panel.hidden = panel.dataset.paymentDetail !== method;
  });

  if (method === 'QRIS') {
    qrisVisual.innerHTML = '';
    if (PAYMENT_CONFIG.qrisImage) {
      const image = document.createElement('img');
      image.src = PAYMENT_CONFIG.qrisImage;
      image.alt = 'Kode QRIS resmi BatikWastrata.id';
      qrisVisual.appendChild(image);
      qrisMessage.textContent = 'Scan kode QRIS resmi di atas setelah admin mengonfirmasi total pembayaran.';
    } else {
      const placeholder = document.createElement('span');
      placeholder.className = 'placeholder-qr';
      placeholder.textContent = 'QR';
      qrisVisual.appendChild(placeholder);
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

paymentRadios.forEach(radio => {
  radio.addEventListener('change', () => updatePaymentDetails(radio.value));
});

copyAccountBtn.addEventListener('click', async () => {
  if (!PAYMENT_CONFIG.bankAccountNumber) return;
  try {
    await navigator.clipboard.writeText(PAYMENT_CONFIG.bankAccountNumber);
    copyAccountBtn.textContent = 'Nomor rekening tersalin ✓';
  } catch {
    bankMessage.textContent = 'Browser tidak mengizinkan salin otomatis. Silakan pilih dan salin nomor rekening secara manual.';
  }
});

// ==========================================
// NOTA KONSULTASI / PEMESANAN SEMENTARA
// ==========================================
const receiptModal = document.getElementById('receiptModal');
const receiptClose = document.getElementById('receiptClose');
const printReceiptBtn = document.getElementById('printReceiptBtn');
const receiptWhatsAppBtn = document.getElementById('receiptWhatsAppBtn');
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
}

function openReceipt() {
  receiptModal.classList.add('show');
  receiptModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  receiptClose.focus();
}

function makeBookingCode() {
  const now = new Date();
  const datePart = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `BW-${datePart}-${randomPart}`;
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
  const absPhotoUrl = getAbsoluteImageUrl(selectedLocalPhoto);
  const photoAttachment = igLink
    ? `\nLink Foto Instagram: ${igLink}`
    : (absPhotoUrl ? `\nFoto Koleksi: ${absPhotoUrl}` : '');

  document.getElementById('receiptCode').textContent = bookingCode;
  document.getElementById('receiptCreated').textContent = createdAt;
  document.getElementById('receiptCustomer').textContent = name;
  document.getElementById('receiptProduct').textContent = product;
  document.getElementById('receiptDate').textContent = formattedDate;
  document.getElementById('receiptArea').textContent = area;
  document.getElementById('receiptPayment').textContent = paymentMethod;

  const receiptNotesRow = document.getElementById('receiptNotesRow');
  const receiptIgRow = document.getElementById('receiptIgRow');
  receiptNotesRow.hidden = !notes;
  receiptIgRow.hidden = !igLink;
  document.getElementById('receiptNotes').textContent = notes;
  document.getElementById('receiptIGLink').textContent = igLink;

  const paymentRequest = paymentMethod === 'Tunai'
    ? 'Saya memilih pembayaran tunai saat pengambilan, sesuai kesepakatan dengan admin.'
    : `Saya memilih pembayaran ${paymentMethod}. Mohon kirimkan detail pembayaran resmi setelah total biaya dikonfirmasi.`;
  const message = `Halo Admin BatikWastrata.id, saya ingin mengonfirmasi permintaan sewa berikut.\n\nKode booking: ${bookingCode}\nNama: ${name}\nKoleksi: ${product}${photoAttachment}\nTanggal penggunaan: ${formattedDate}\nLokasi: ${area}\nMetode pembayaran: ${paymentMethod}${notes ? `\nCatatan: ${notes}` : ''}\n\n${paymentRequest}\nMohon konfirmasi ketersediaan, total biaya, dan ketentuan sewanya. Terima kasih.`;
  currentReceiptWhatsAppUrl = `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(message)}`;

  const notice = document.getElementById('notice');
  notice.style.display = 'block';
  notice.textContent = `Nota konsultasi ${bookingCode} berhasil dibuat. Periksa detailnya, lalu kirim ke WhatsApp Admin untuk konfirmasi.`;

  openReceipt();
});

receiptClose.addEventListener('click', closeReceipt);
receiptModal.addEventListener('click', event => {
  if (event.target === receiptModal) closeReceipt();
});
printReceiptBtn.addEventListener('click', () => window.print());
receiptWhatsAppBtn.addEventListener('click', () => {
  if (currentReceiptWhatsAppUrl) window.open(currentReceiptWhatsAppUrl, '_blank', 'noopener,noreferrer');
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && receiptModal.classList.contains('show')) closeReceipt();
});

// ==========================================
// LIGHTBOX PRATINJAU GAMBAR
// ==========================================
const lightbox = document.getElementById('imageLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src, caption) {
  lightboxImg.src = src;
  lightboxImg.alt = caption || 'Pratinjau Koleksi';
  lightboxCaption.textContent = caption || '';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('.product-visual').forEach(box => {
  box.addEventListener('click', () => {
    openLightbox(box.dataset.zoomSrc, box.dataset.zoomTitle);
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