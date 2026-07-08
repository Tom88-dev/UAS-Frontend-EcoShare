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

  // Jika berhasil, arahkan ke halaman dashboard
  if (result.success) {
    router.push('/dashboard');
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-green-600">EcoShare</h2>
        <p class="text-gray-500 mt-2">Masuk ke akun Anda</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input 
            v-model="email" 
            type="email" 
            required 
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
            placeholder="contoh@email.com" 
          />
        </div>
        
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input 
            v-model="password" 
            type="password" 
            required 
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
            placeholder="Masukkan password Anda" 
          />
        </div>

        <button 
          type="submit" 
          :disabled="isLoading" 
          class="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50"
        >
          {{ isLoading ? 'Memproses...' : 'Masuk' }}
        </button>
      </form>
    </div>
  </div>
</template>