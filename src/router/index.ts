import {createRouter, createWebHistory,type RouteRecordRaw} from 'vue-router'

/*
定义路由规则
使用RouteRecordRaw类型进行类型声明,配合TS提供代码提示
*/
const routes: Array<RouteRecordRaw> = 
[
  //首页路由规则
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },

  //设置页面路由规则
  {
    path:'/settings',
    name:'settings',
    component:() => import('../views/SettingView.vue')
  },

  //组件测试页面
  {
    path:'/componenttest',
    name:'componenttest',
    component:()=>import('../views/Components-test.vue')
  },

  //404路由规则
  {
    path:'/:pathMatch(.*)*',
    name:'NotFound',
    component: () => import('../views/NotFoundView.vue')
  },
]

//创建路由实例
const router = createRouter({
  
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

//导出路由实例
export default router