import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Orders from '../views/Orders.vue'

const routes = [
  {
    path: '/',
    name: 'Orders',
    component: Orders
  },{
    path: '/edit/:id',
    name: 'Edit',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */'../views/Edit.vue')
  },
  {
    path: '/print/:id',
    name: 'Print',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */'../views/Print.vue')
  },{
    path: '/waybill/:id',
    name: 'Waybill',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */'../views/Waybill.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited. () => import(/* webpackChunkName: "about" */'../views/About.vue')
    component: () => import(/* webpackChunkName: "about" */'../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
