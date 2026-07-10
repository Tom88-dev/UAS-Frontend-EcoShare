<template>
  <div id="app">
    <!-- Navbar (Hanya muncul jika user sudah login) -->
  <nav v-if="isLoggedIn && $route.path !== '/login'" class="main-navbar">
      <!-- Bagian Logo Brand -->
      <div class="navbar-brand">
        <router-link to="/" class="brand-link">
          <span class="brand-icon">🌱</span>
          <span class="brand-eco">Eco</span><span class="brand-share">-Share</span>
        </router-link>
      </div>

      <!-- Bagian Menu Navigasi -->
      <div class="navbar-menu">
        <!-- Menu Khusus OWNER -->
        <router-link v-if="userRole === 'OWNER'" to="/dashboard" class="nav-item">Dashboard</router-link>
        <router-link v-if="userRole === 'OWNER'" to="/create-item" class="nav-item">Tambah Barang</router-link>

        <!-- Menu Khusus RENTER -->
        <router-link v-if="userRole === 'RENTER'" to="/my-rentals" class="nav-item">Sewa Saya</router-link>

        <!-- Menu Global (Bisa dilihat Owner & Renter) -->
        <router-link to="/items" class="nav-item">Katalog Barang</router-link>
        
        <!-- Tombol Logout yang lebih rapi -->
        <button @click="logout" class="btn-logout-nav">Logout 🚪</button>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      userRole: '' // Menyimpan role user (OWNER / RENTER)
    };
  },
  watch: {
    $route() {
      this.checkLoginStatus();
    }
  },
  mounted() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      this.isLoggedIn = !!localStorage.getItem('token');
      
      // Mengambil data user/role dari localStorage secara aman
      const savedRole = localStorage.getItem('role');
      const savedUser = localStorage.getItem('user');
      
      if (savedRole) {
        this.userRole = savedRole.toUpperCase();
      } else if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          this.userRole = user.role ? user.role.toUpperCase() : '';
        } catch (e) {
          this.userRole = '';
        }
      }
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      this.isLoggedIn = false;
      this.userRole = '';
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
#app { font-family: Arial, sans-serif; margin: 0; padding: 0; }

/* Container Utama Navbar */
.main-navbar {
  background: #1a252f; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-bottom: 3px solid #2ecc71; 
  position: sticky;
  top: 0;
  z-index: 1000;
}

/* Styling Link Brand/Logo */
.brand-link {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  transition: transform 0.2s ease;
}

.brand-link:hover {
  transform: scale(1.02);
}

.brand-icon { font-size: 1.8rem; }
.brand-eco { color: #2ecc71; }
.brand-share { color: #ffffff; }

/* Menu Navigasi Kanan */
.navbar-menu {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Item Link Menu */
.nav-item {
  color: #b2bec3;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

/* Efek Hover & Link Aktif */
.nav-item:hover, 
.router-link-active.nav-item {
  color: #2ecc71;
  background: rgba(46, 204, 113, 0.1); 
}

/* Tombol Logout Baru */
.btn-logout-nav {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 10px;
}

.btn-logout-nav:hover {
  background-color: #c0392b;
  transform: translateY(-1px);
}

.btn-logout-nav:active {
  transform: translateY(1px);
}

.main-content { padding: 20px; }

/* --- Aturan Khusus untuk Layar HP (Mobile) --- */
@media (max-width: 768px) {
  .main-navbar {
    flex-direction: column; /* Mengubah susunan menjadi atas-bawah */
    padding: 15px;
    gap: 15px;
  }
  
  .navbar-menu {
    flex-wrap: wrap; /* Membiarkan menu turun ke baris baru jika sempit */
    justify-content: center;
    gap: 8px;
  }
  
  .nav-item {
    font-size: 0.9rem;
    padding: 6px 10px;
  }
  
  .btn-logout-nav {
    margin-left: 0;
    margin-top: 5px;
    width: 100%; /* Membuat tombol logout memanjang penuh agar mudah di-tap */
  }
}
</style>