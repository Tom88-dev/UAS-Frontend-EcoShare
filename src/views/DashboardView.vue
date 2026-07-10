<template>
  <div class="dashboard-container">
    <h2>Dashboard Pemilik Barang</h2>
    <p>Kelola pesanan sewa yang masuk untuk barang-barang Anda.</p>

    <div v-if="loading">Memuat data pesanan...</div>
    <div v-else-if="error" class="error-msg">{{ error }}</div>
    <div v-else-if="rentals.length === 0">Belum ada pesanan masuk untuk barang Anda.</div>

    <div v-else class="rental-grid">
      <div v-for="rental in rentals" :key="rental.id" class="rental-card modern-card">
        <div class="card-header">
          <h3>Transaksi #{{ rental.id }}</h3>
          <span :class="['status-badge', rental.status ? rental.status.toLowerCase() : '']">
            {{ rental.status }}
          </span>
        </div>
        
        <div class="card-body">
          <p class="item-name"><strong>📦 Barang:</strong> {{ rental.item ? rental.item.name : 'Barang #' + (rental.item_id || rental.itemId) }}</p>
          <p><strong>👤 ID Penyewa:</strong> {{ rental.renter_id || rental.renterId }}</p>
          <p><strong>🕒 Durasi:</strong> {{ rental.days }} hari</p>
          
          <div class="divider"></div>
          
          <div class="cost-section">
            <span>Total Pendapatan:</span>
            <span class="total-cost">Rp {{ rental.total_cost || rental.totalCost }}</span>
          </div>

          <!-- Tombol Aksi hanya muncul jika status masih CREATED -->
          <div class="action-buttons" v-if="rental.status === 'CREATED'" style="margin-top: 15px;">
            <button @click="updateStatus(rental.id, 'APPROVED')" class="btn-approve">Setujui</button>
            <button @click="updateStatus(rental.id, 'REJECTED')" class="btn-reject">Tolak</button>
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
    this.fetchOwnerRentals();
  },
  methods: {
    async fetchOwnerRentals() {
      try {
        const token = localStorage.getItem('token');
        
        // Memanggil route backend untuk pesanan milik Owner
        const response = await axios.get('http://localhost:3000/api/rentals/owner', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        this.rentals = response.data.data || response.data;
      } catch (err) {
        console.error("Gagal mengambil pesanan masuk:", err);
        this.error = "Gagal memuat pesanan masuk.";
      } finally {
        this.loading = false;
      }
    },
    async updateStatus(rentalId, newStatus) {
      try {
        const token = localStorage.getItem('token');
        
        // Memanggil route backend untuk update status (Approve / Reject)
        await axios.patch(`http://localhost:3000/api/rentals/${rentalId}/status`, 
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        Swal.fire('Berhasil!', `Pesanan telah di-${newStatus.toLowerCase()}.`, 'success');
        this.fetchOwnerRentals(); // Refresh ulang data setelah diupdate
      } catch (err) {
        console.error("Gagal update status:", err);
        Swal.fire('Error', 'Gagal memperbarui status pesanan.', 'error');
      }
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}
.rental-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
button {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  color: white;
  transition: opacity 0.2s;
}
button:hover { opacity: 0.8; }
.btn-approve { background-color: #27ae60; }
.btn-reject { background-color: #c0392b; }
.error-msg { color: red; }
</style>