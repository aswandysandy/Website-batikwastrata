BATIKWASTRATA.ID — WEBSITE UPDATE
=================================

ISI FOLDER
- index.html  : halaman website
- style.css   : tampilan dan responsif desktop/mobile
- script.js   : interaksi formulir, pilihan pembayaran, nota, dan WhatsApp
- logo.png    : logo BatikWastrata.id
- Screenshot ...png : foto koleksi yang dipakai pada katalog

CARA MENJALANKAN
1. Ekstrak seluruh isi ZIP ke satu folder.
2. Pastikan index.html, style.css, script.js, logo.png, dan tiga foto koleksi tetap berada dalam folder yang sama.
3. Klik dua kali index.html untuk melihat website, atau buka folder melalui VS Code dan jalankan dengan ekstensi Live Server.

MENGISI DATA QRIS DAN REKENING RESMI
Karena gambar QRIS, nama bank, nomor rekening, dan nama pemilik rekening belum diberikan, website sengaja tidak menampilkan data pembayaran contoh.

Buka script.js, cari bagian PAYMENT_CONFIG di bagian paling atas, lalu isi dengan data resmi:

const PAYMENT_CONFIG = {
  qrisImage: "qris-batikwastrata.png",
  bankName: "Nama Bank",
  bankAccountNumber: "Nomor Rekening Resmi",
  bankAccountName: "Nama Pemilik Rekening"
};

Simpan file gambar QRIS resmi dengan nama qris-batikwastrata.png di folder yang sama. Pastikan QRIS dan rekening benar-benar milik usaha sebelum website dipublikasikan.

CARA KERJA FITUR PEMBAYARAN DAN NOTA
- Pelanggan memilih QRIS, Transfer Bank, atau Tunai pada formulir.
- Keterangan pembayaran berubah mengikuti metode yang dipilih.
- Setelah formulir valid dikirim, website membuat nota konsultasi/pemesanan sementara dengan kode booking.
- Pelanggan dapat mencetak nota atau menyimpannya sebagai PDF melalui menu Print pada browser.
- Tombol WhatsApp mengirim ringkasan pesanan dan metode pembayaran yang dipilih ke Admin BatikWastrata.id.

CATATAN PENTING
1. Website ini masih berupa website statis berbasis HTML, CSS, dan JavaScript. Belum ada database, dashboard admin, payment gateway, atau penyimpanan transaksi di server.
2. Nota yang dibuat adalah ringkasan konsultasi/pemesanan sementara, bukan invoice final dan bukan bukti pembayaran.
3. Nominal sewa belum dihitung otomatis karena tarif dan aturan biaya belum tersedia. Admin perlu mengonfirmasi stok, harga, total biaya, dan pembayaran.
4. Pilihan metode pembayaran pada website adalah preferensi pelanggan. QRIS/rekening resmi perlu dikonfigurasi terlebih dahulu sebelum digunakan untuk menerima pembayaran.
5. Jam operasional ditampilkan sesuai informasi yang diberikan: 08.00–22.00.
