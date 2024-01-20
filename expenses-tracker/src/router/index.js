import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import MyExpenses from '@/views/MyExpenses.vue'
import AddTransaction from '@/views/AddTransaction.vue'
import MyGroups from '@/views/MyGroups.vue'
import CreateGroup from '@/views/CreateGroup.vue'
import SingleGroup from '@/views/SingleGroup.vue'
import AddGroupTransactions from '@/views/AddGroupTransactions.vue'


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
  },
  {
    path: '/addtransaction',
    name: 'AddTransaction',
    component: AddTransaction
  },
  {
    path: '/mygroups',
    name: 'MyGroups',
    component: MyGroups
  },
  {
    path: '/create',
    name: 'CreateGroup',
    component: CreateGroup
  },
  {
    path: '/mygroups/:id',
    name: 'SingleGroup',
    component: SingleGroup,
    props: true
  },
  {
    path: '/addgrouptr/:id',
    name: 'AddGroupTransactions',
    component: AddGroupTransactions,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
