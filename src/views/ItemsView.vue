<template>
  <div class="items-container">
    <h2>Katalog Barang</h2>
    <p>Daftar barang yang tersedia untuk disewa di Eco-Share.</p>

    <!-- Tampilkan loading jika data sedang diambil -->
    <div v-if="loading" class="loading">Memuat data barang...</div>

    <!-- Tampilkan error jika ada -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Grid Barang -->
    <div v-if="!loading && !error" class="items-grid">
     <div v-for="item in items" :key="item.id" class="item-card modern-card">
        <div class="card-header">
          <h3>{{ item.name }}</h3>
          <!-- Bisa tambahkan badge stok jika mau -->
          <span v-if="item.stock > 0" class="status-badge approved" style="font-size: 0.7rem;">Tersedia</span>
          <span v-else class="status-badge error-msg" style="font-size: 0.7rem;">Habis</span>
        </div>
        
        <div class="card-body">
          <p class="desc" style="margin-bottom: 15px; color: #666;">📝 {{ item.description }}</p>
          <p class="stock">📦 Stok Tersedia: <strong>{{ item.stock }}</strong> unit</p>
          
          <div class="divider"></div>
          
          <div class="cost-section">
            <span>Harga Sewa:</span>
            <span class="total-cost">Rp {{ item.dailyPrice }} <span style="font-size: 0.8rem; font-weight: normal; color: #555;">/hari</span></span>
          </div>

          <!-- Tombol hanya muncul untuk RENTER -->
          <button
            v-if="userRole === 'RENTER'"
            @click="rentItem(item.id)"
            :disabled="item.stock < 1"
            class="btn-rent"
            style="margin-top: 20px;"
          >
            {{ item.stock > 0 ? 'Sewa Sekarang' : 'Stok Habis' }}
          </button>
        </div>
      </div>

      <!-- Jika data kosong -->
      <div v-if="items.length === 0" class="empty">
        Belum ada barang yang tersedia.
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      items: [],
      loading: true,
      error: null,
      userRole: '' // <--- Tambahkan koma di atas, lalu masukkan baris ini
    };
  },
  mounted() {
    this.fetchItems();
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userObj = JSON.parse(savedUser);
      this.userRole = userObj.role ? userObj.role.toUpperCase() : '';
    }
  },
  methods: {
    async fetchItems() {
      try {
        const token = localStorage.getItem('token');
        // Panggil API Backend (pastikan port backend kamu 3000)
        const response = await axios.get('http://localhost:3000/api/items', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Sesuaikan dengan struktur response dari backend-mu
        this.items = response.data.data || response.data; 
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        this.error = "Gagal memuat daftar barang. Pastikan server backend menyala.";
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Koneksi ke server gagal atau sesi Anda habis.'
        });
      } finally {
        this.loading = false;
      }
    },
    async rentItem(itemId) {
      try {
        // 1. Minta input durasi sewa menggunakan SweetAlert
        const { value: days } = await Swal.fire({
          title: 'Sewa Barang',
          input: 'number',
          inputLabel: 'Berapa hari Anda ingin menyewa barang ini?',
          inputValue: 1, // Default 1 hari
          showCancelButton: true,
          confirmButtonText: 'Sewa Sekarang',
          cancelButtonText: 'Batal',
          inputValidator: (value) => {
            if (!value || value <= 0) {
              return 'Jumlah hari minimal 1!';
            }
          }
        });

        // Jika user klik batal/close pop-up
        if (!days) return;

        // 2. Ambil token untuk otorisasi RENTER
        const token = localStorage.getItem('token');

        // 3. Tembak API Backend
        const response = await axios.post('http://localhost:3000/api/rentals', {
          itemId: itemId,
          quantity: 1, // Kita set default 1 barang per sewa agar simpel
          days: parseInt(days)
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // 4. Tampilkan pesan sukses
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Barang berhasil disewa.'
        });

        // 5. Segarkan daftar barang agar stok langsung berkurang di layar
        this.fetchItems();

      } catch (error) {
        console.error("Transaksi gagal:", error);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menyewa',
          text: error.response?.data?.message || 'Terjadi kesalahan pada sistem.'
        });
      }
    }
  }
};
</script>

<style scoped>
.items-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.btn-rent {
  width: 100%;
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: bold;
}
.btn-rent:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}
.btn-rent:hover:not(:disabled) {
  background-color: #2980b9;
}
</style>