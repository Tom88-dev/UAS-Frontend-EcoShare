<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Dashboard Utama</h1>
        <button 
          @click="handleLogout" 
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          Logout
        </button>
      </div>
      
      <div class="p-4 bg-green-50 border-l-4 border-green-500 rounded text-green-700">
        <p class="font-bold">Selamat Datang!</p>
        <p>Anda berhasil login ke dalam sistem EcoShare.</p>
        <p class="mt-2 text-sm text-gray-600">
          Status Role Anda: <strong>{{ authStore.userRole || 'Tidak diketahui' }}</strong>
        </p>
      </div>
    </div>
  </div>
</template>