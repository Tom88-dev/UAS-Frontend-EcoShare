import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import ItemsView from '../views/ItemsView.vue';
import DashboardView from '../views/DashboardView.vue';
import CreateItemView from '../views/CreateItemView.vue';
import MyRentalsView from '../views/MyRentalsView.vue';

const routes = [
  {
    path: '/',
    redirect: '/login' // Otomatis mengarahkan user ke halaman login saat buka web
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/items',
    name: 'Items',
    component: ItemsView,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
  },
  {
    path: '/create-item',
    name: 'CreateItem',
    component: CreateItemView,
  },
  {
    path: '/my-rentals',
    name: 'MyRentals',
    component: MyRentalsView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;