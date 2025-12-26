import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    // 路由层级
    index?: number
    // 过渡动画名称
    transition?: string
  }
}