<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  // Memanggil fungsi login dari authStore yang tadi kita buat
  const result = await authStore.login(email.value, password.value);
  isLoading.value = false;

  // Jika berhasil, arahkan sesuai dengan role user
if (result.success) {
  // Ambil data user dari localStorage yang disimpan oleh authStore
  const savedUser = localStorage.getItem('user');
  let userRole = '';
  
  if (savedUser) {
    const userObj = JSON.parse(savedUser);
    userRole = userObj.role ? userObj.role.toUpperCase() : '';
  }

  // Cek role dan arahkan ke halaman yang benar
  if (userRole === 'OWNER') {
    router.push('/dashboard'); // Owner ke Dashboard
  } else {
    router.push('/items');     // Renter ke Katalog Barang
  }
}
};
</script>

<template>
  <div class="login-wrapper">
    <div class="modern-card login-card">
      <div class="card-header-form">
        <h2 class="brand-title">Eco-Share</h2>
        <p class="subtitle">Masuk ke akun Anda untuk mulai menyewa</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="card-body">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="contoh@email.com"
            class="form-control"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Masukkan password Anda"
            class="form-control"
          />
        </div>
        
        <button
          type="submit"
          :disabled="isLoading"
          class="btn-submit"
        >
          {{ isLoading ? '⏳ Memproses...' : 'Masuk 🚀' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Wrapper untuk membuat form berada persis di tengah layar */
.login-wrapper {
  min-height: 75vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 40px 30px;
}

.card-header-form {
  text-align: center;
  margin-bottom: 30px;
}

.brand-title {
  margin: 0 0 8px 0;
  color: #27ae60;
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: 1px;
}

.subtitle {
  color: #7f8c8d;
  font-size: 0.95rem;
  margin: 0;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
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

/* Efek outline hijau saat input aktif */
.form-control:focus {
  border-color: #27ae60;
  outline: none;
  box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.15);
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 15px;
}

.btn-submit:hover:not(:disabled) {
  background-color: #219653;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(1px);
}

/* Warna memudar saat tombol loading diklik */
.btn-submit:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>