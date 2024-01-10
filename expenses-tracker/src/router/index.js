import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import MyExpenses from '@/views/MyExpenses.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/myexpenses',
    name: 'MyExpenses',
    component: MyExpenses
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
