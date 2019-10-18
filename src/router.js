import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/common/Home.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('./views/dashboard.vue')
        },
        {
          path: '/userlist',
          name: 'userlist',
          component: () => import('./views/user/index.vue')
        },
        {
          path: '/transaction',
          name: 'transaction',
          component: () => import('./views/transaction/index.vue')
        },
        {
          path: '/news',
          name: 'news',
          component: () => import('./views/news/index.vue')
        },
        {
          path: '/category',
          name: 'category',
          component: () => import('./views/category/index.vue')
        },
        {
          path: '/advertise/store',
          name: 'advertiseStore',
          component: () => import('./views/advertise/index.vue')
        },
        {
          path: '/advertise/day',
          name: 'advertiseDay',
          component: () => import('./views/advertise/dayDiscount.vue')
        },
        {
          path: '/business/list',
          component: () => import('./views/business/index.vue')
        },
        {
          path: '/business/apply',
          component: () => import('./views/business/apply/index.vue')
        },
        {
          path: '/404',
          name: '404',
          component: () => import('./views/404.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/login.vue')
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
