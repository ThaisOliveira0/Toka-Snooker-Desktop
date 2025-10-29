import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login/Login.vue'
import AdmReport from '@/views/AdmReport/AdmReport.vue'
import Register from '@/views/Register/Register.vue'
import ForgotPassword from '@/views/ForgotPassword/ForgotPassword.vue'
import ResetPassword from '@/views/ResetPassword/ResetPassword.vue'
import Tabs from '@/views/Tabs/Tabs.vue'
import Karaoke from '@/views/Karaoke/Karaoke.vue'
import OrderLaunch from '@/views/OrderLaunch/OrderLaunch.vue'
import InventoryControl from '@/views/InventoryControl/InventoryControl.vue'
import Home from '@/views/Home/Home.vue'
import Payment from '@/views/Payment/Payment.vue'
import EnterCode from '@/views/EnterCode/EnterCode.vue'
import KitchenOrders from '@/views/KitchenOrders/KitchenOrders.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/relatorios',
    name: 'AdmReport',
    component: AdmReport,
    meta: { roles: ['admin'] } 
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
    path: '/redefinir-senha',
    name: 'ResetPassword',
    component: ResetPassword
  },
  {
    path: '/comandas',
    name: 'Tabs',
    component: Tabs,
    meta: { roles: ['admin', 'funcionario'] }
  },
  {
    path: '/karaoke',
    name: 'Karaoke',
    component: Karaoke,
    meta: { roles: ['funcionario'] }
  },
  {
    path: '/pedidos',
    name: 'OrderLaunch',
    component: OrderLaunch,
    meta: { roles: ['admin', 'funcionario'] }
  },
  {
    path: '/estoque',
    name: 'InventoryControl',
    component: InventoryControl,
    meta: { roles: ['admin'] }
  },
  {
    path: '/pagamento',
    name: 'Payment',
    component: Payment,
    meta: { roles: ['admin'] }
  },
  {
    path: '/inserir-codigo',
    name: 'EnterCode',
    component: EnterCode,
    meta: { roles: ['admin'] }
  },
  {
    path: '/cozinha',
    name: 'KitchenOrders',
    component: KitchenOrders,
    meta: { roles: ['admin'] }
  },
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
