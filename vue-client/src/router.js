import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/home/home'
import login from './components/login/login'
import orderItem from './components/order/orderItem'
import changePwd from './components/login/changePwd'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    { name: 'login', path: '/login', component: login },
    { name: 'orderItem', path: '/orderItem', component: orderItem },
    { name: 'changePwd', path: '/changePwd', component: changePwd },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
