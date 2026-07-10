<template>
  <div class="form-container">
    <div class="modern-card form-card">
      <div class="card-header-form">
        <h2>Tambah Barang Baru</h2>
        <p class="subtitle">Form khusus untuk role OWNER</p>
      </div>
      
      <form @submit.prevent="submitItem" class="card-body">
        <div class="form-group">
          <label for="itemName">Nama Barang:</label>
          <input
            id="itemName"
            v-model="form.name"
            type="text"
            required
            placeholder="Contoh: Tenda Camping Dome"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="itemPrice">Harga Sewa Harian (Rp):</label>
          <input
            id="itemPrice"
            v-model="form.dailyPrice"
            type="number"
            required
            placeholder="Contoh: 50000"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="itemStock">Jumlah Stok:</label>
          <input
            id="itemStock"
            v-model="form.stock"
            type="number"
            required
            placeholder="Contoh: 5"
            class="form-control"
          />
        </div>

        <button type="submit" class="btn-submit">
          🚀 Simpan Barang
        </button>
      </form>

      <!-- Notifikasi Sukses / Gagal yang Elegan -->
      <div v-if="message" :class="['alert-msg', isError ? 'error' : 'success']">
        {{ isError ? '❌' : '✅' }} {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// State untuk menyimpan inputan form
const form = ref({
  name: '',
  dailyPrice: '',
  stock: ''
});

// State untuk notifikasi sukses/error
const message = ref('');
const isError = ref(false);

const submitItem = async () => {
  message.value = 'Menyimpan data...';
  isError.value = false;

  try {
    // AMBIL TOKEN DARI LOCAL STORAGE (Sangat penting karena ini auth)
    const token = localStorage.getItem('token'); 
    
    if (!token) {
      isError.value = true;
      message.value = 'Anda belum login! Silakan login sebagai Owner terlebih dahulu.';
      return;
    }

    // Sesuaikan URL ini dengan endpoint backend kamu (biasanya /api/items atau /items)
    const response = await fetch('http://localhost:3000/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Mengirim token agar backend tahu siapa ownernya
      },
      body: JSON.stringify(form.value)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Gagal menambahkan barang');
    }

    isError.value = false;
    message.value = 'Berhasil! Barang telah ditambahkan ke katalog.';
    
    // Reset form setelah sukses
    form.value = { name: '', dailyPrice: '', stock: '' };

  } catch (error) {
    isError.value = true;
    message.value = error.message;
  }
};
</script>

<style scoped>
.form-container {
  max-width: 550px;
  margin: 40px auto;
  padding: 0 20px;
}

.form-card {
  padding: 30px;
}

.card-header-form {
  margin-bottom: 25px;
  border-bottom: 1px dashed #eee;
  padding-bottom: 15px;
}

.card-header-form h2 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 1.6rem;
}

.subtitle {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #34495e;
  font-size: 0.95rem;
}

.form-control {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #dcdde1;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

/* Efek menyala saat input kolom diklik */
.form-control:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15);
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 10px;
}

/* Efek hover tombol simpan */
.btn-submit:hover {
  background-color: #27ae60;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.2);
}

.btn-submit:active {
  transform: translateY(1px);
}

/* Desain Kotak Pesan Status */
.alert-msg {
  margin-top: 20px;
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
}

.alert-msg.success {
  background-color: #e8f8f5;
  color: #117a65;
  border: 1px solid #a3e4d7;
}

.alert-msg.error {
  background-color: #fce4d6;
  color: #c0392b;
  border: 1px solid #f5b7b1;
}
</style>