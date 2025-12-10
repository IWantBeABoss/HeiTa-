import { createRouter, createWebHistory} from 'vue-router'
import { useUserStore } from '@/stores'
//createRouter 创建路由实例
//配置 history 模式
//1. history模式: createWebHistory      地址栏不带 #
//2. hash模式:    createWebHashHistory  地址栏带 #

console.log(import.meta.env.DEV)
//vite中的环境变量 import.meta.env.BASE_URL 就是 vite.config.js 中的 base 配置项
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path:'/login',component: () => import('@/views/login/LoginPage.vue')}, //登录页
    {
      path:'/',
      component:()=>import('@/views/layout/LayoutContainer.vue'),
      redirect:'/article/manage',
      children:[
        {
          path:'/article/manage',
          component:()=>import('@/views/article/ActiveManage.vue')
        },
        {
          path:'/article/channel',
          component:()=>import('@/views/article/ActiveChannel.vue')
        },
        {
          path:'/user/profile',
          component:()=>import('@/views/user/UserProfile.vue')
        },
        {
          path:'/user/avatar',
          component:()=>import('@/views/user/UserAvatar.vue')
        },
        {
          path:'/user/password',
          component:()=>import('@/views/user/UserPassword.vue')
        },
      ]
    }
  ]
})

//登陆访问拦截 => 默认是直接放行的
//根据返回值决定,是放行还是拦截
//返回值:
//1. 返回 undefined / true 直接放行
//2. 返回 false 就会拦回 from 的地址页面
//3. 返回一个 “具体地址” 或 “路径对象” ，则会拦截到对应的地址
//    eg: return '/login' 或 { name:'login' }
router.beforeEach((to,from)=>{
  // 如果没有token,且访问的是非登录页,则拦截到登录页, 其他情况正常放行
  const userStore=useUserStore()
  if(!userStore.token && to.path !== '/login'){
    return '/login'
  }
  return true
})

export default router
