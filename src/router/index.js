import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login/Login.vue'
import AdmReport from '@/views/AdmReport/AdmReport.vue'
import Register from '@/views/Register/Register.vue'
import ForgotPassword from '@/views/ForgotPassword/ForgotPassword.vue'
import ResetPassword from '@/views/ResetPassword/ResetPassword.vue'
import Tabs from '@/views/Tabs/Tabs.vue'

const routes = [

  {
    path: '/relatorios',
    name: 'AdmReport',
    component: AdmReport
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/cadastro',
    name: 'Register',
    component: Register
  },
  {
    path: '/esqueci-senha',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/nova-senha',
    name: 'ResetPassword',
    component: ResetPassword
  },
  {
    path: '/comandas',
    name: 'Tabs',
    component: Tabs
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
