import axios from 'axios';
import Swal from 'sweetalert2';

// 1. Membuat jembatan (instance) ke URL Backend sesuai file .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor: Otomatis menyisipkan Token jika user sudah login
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: UNIFIED ERROR HANDLING (Syarat UAS)
api.interceptors.response.use(
  (response) => {
    // Jika sukses, kembalikan data seperti biasa
    return response; 
  },
  (error) => {
    // Tangkap semua jenis error di sini
    let errorMessage = 'Terjadi kesalahan pada sistem.';

    if (error.response) {
      // Error dari Backend (misal validasi gagal, stok habis)
      errorMessage = error.response.data.message || errorMessage;

      switch (error.response.status) {
        case 401:
          Swal.fire('Sesi Habis', 'Token tidak valid, silakan login ulang.', 'warning');
          localStorage.removeItem('token');
          // Nanti kita arahkan ke halaman login
          break;
        case 403:
          Swal.fire('Akses Ditolak', 'Role Anda tidak diizinkan mengakses fitur ini.', 'error');
          break;
        case 404:
          Swal.fire('Tidak Ditemukan', 'Data yang dicari tidak ada.', 'info');
          break;
        default:
          Swal.fire('Gagal!', errorMessage, 'error');
      }
    } else {
      // Error jaringan atau Backend sedang mati
      Swal.fire('Koneksi Terputus', 'Gagal terhubung ke server API.', 'error');
    }

    return Promise.reject(error);
  }
);

export default api;