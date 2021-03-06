import Vue from 'vue'
import VueRouter from 'vue-router'
// 登录
import Login from '@/views/login'
import Home from '@/views/home'
import Layout from '@/views/layout'
import Article from '@/views/article'
import Publish from '@/views/publish'
import Image from '@/views/image'
import Comment from '@/views/comment'
import Setting from '@/views/setting'
import Fans from '@/views/fans'
Vue.use(VueRouter)

const routes = [

  {
    path: '/login',
    // redirect: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // name: 'layout',
    component: Layout,
    children: [{
      path: '',
      name: 'home',
      component: Home
    }, {
      path: '/article',
      name: 'article',
      component: Article
    },
    {
      path: '/publish',
      name: 'publish',
      component: Publish
    },
    {
      path: '/image',
      name: 'image',
      component: Image
    },
    {
      path: '/comment',
      name: 'comment',
      component: Comment
    },
    {
      path: '/setting',
      name: 'setting',
      component: Setting
    },
    {
      path: '/fans',
      name: 'fans',
      component: Fans
    }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  const user = JSON.parse(window.localStorage.getItem('user'))
  if (to.path !== '/login') {
    if (user) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
