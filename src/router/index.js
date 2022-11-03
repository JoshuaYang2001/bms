import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home'
import Welcome from "@/components/Welcome";
import users from "@/components/user/users";
import register from "@/components/register";
import Right from "@/components/power/Right";
import Roles from "@/components/power/Roles";
Vue.use(VueRouter)

const router = new VueRouter({

  routes: [
    {
      path: '/', redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path:'/users',
          component:users
        },
        {
          path: '/rights',
          component: Right
        },
        {
          path: '/roles',
          component: Roles
        }
        ]
    },
    {
      path: '/register',
      component: register
    }


  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
