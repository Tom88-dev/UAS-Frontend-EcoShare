<template>
  <div class="rentals-container">
    <h2>Daftar Sewa Saya</h2>
    <p>Berikut adalah riwayat barang yang telah Anda sewa di Eco-Share.</p>

    <div v-if="loading">Memuat data...</div>
    <div v-else-if="error" class="error-msg">{{ error }}</div>
    <div v-else-if="rentals.length === 0">Anda belum memiliki riwayat sewa sama sekali.</div>

   <div v-else class="rental-grid">
      <div v-for="rental in rentals" :key="rental.id" class="rental-card modern-card">
        <div class="card-header">
          <h3>Transaksi #{{ rental.id }}</h3>
          <!-- Posisi Badge kita pindah ke atas kanan agar elegan -->
          <span v-if="rental.status" :class="['status-badge', rental.status.toLowerCase()]">
            {{ rental.status }}
          </span>
        </div>
        
        <div class="card-body">
          <!-- Sekarang kita panggil nama barangnya! -->
          <p class="item-name"><strong>📦 Barang:</strong> {{ rental.item ? rental.item.name : 'Barang #' + (rental.item_id || rental.itemId) }}</p>
          <p><strong>🕒 Durasi:</strong> {{ rental.days }} hari</p>
          <p><strong>🔢 Jumlah:</strong> {{ rental.quantity }} item</p>
          
          <div class="divider"></div>
          
          <div class="cost-section">
            <span>Total Biaya:</span>
            <span class="total-cost">Rp {{ rental.totalCost || rental.total_cost }}</span>
          </div>
        </div>
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
      rentals: [],
      loading: true,
      error: null
    };
  },
  mounted() {
    this.fetchMyRentals();
  },
  methods: {
    async fetchMyRentals() {
      try {
        const token = localStorage.getItem('token');
        
        // Memanggil route /me yang ada di rentalRoutes.js backend
        const response = await axios.get('http://localhost:3000/api/rentals/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Menangkap data dari backend
        this.rentals = response.data.data || response.data;
      } catch (err) {
        console.error("Gagal mengambil data sewa:", err);
        this.error = "Gagal memuat riwayat sewa.";
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Koneksi ke server gagal atau sesi Anda habis.'
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
