# 🌱 Eco-Share (Frontend)

## Penjelasan
Eco-Share adalah antarmuka platform penyewaan barang berbasis web yang mempertemukan pemilik barang (Owner) dan penyewa (Renter) secara efisien. Aplikasi ini dirancang untuk memberikan pengalaman pengguna yang interaktif dan responsif dalam mengelola katalog maupun transaksi sewa.

## Stack / Teknis
* **Bahasa Pemrograman:** JavaScript 
* **Framework / Library:** Vue.js 3, Vite, Vue Router
* **Styling:** CSS Native (Modern Card UI)
* **Integrasi API:** Axios / Fetch API untuk komunikasi dengan Backend

## Flow Aplikasi
1. Pengguna melakukan login dan sistem akan membedakan akses berdasarkan peran (*Owner* atau *Renter*).
2. **Jika login sebagai Owner:** Pengguna diarahkan ke Dashboard untuk menyetujui/menolak pesanan masuk, serta dapat menambah barang baru ke dalam Katalog Utama.
3. **Jika login sebagai Renter:** Pengguna dapat menelusuri Katalog Barang untuk menyewa, dan memantau status persetujuan sewa mereka di halaman "Sewa Saya".