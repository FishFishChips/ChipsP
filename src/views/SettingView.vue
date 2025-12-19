<template>
  <!-- 设置页 -->
  <div class="setting-page">
    <!-- 顶部导航栏 
     使用varlet导航栏组件
     title:标题
     color: 背景色 
     text-color: 文字颜色
     fixed: 是否固定在顶部 (选填，因为用了 flex 布局，这里可以不填，或者填 false)
     safe-area-top: 自动适配刘海屏
     elevation: 阴影深度 (true/false)
     style:css美化样式
     -->
    <var-app-bar class="pixel-nav" title="SETTINGS" title-position="center" text-color="#000000" color="#ffffff"
      :elevation="false" style="
       border-bottom: 4px solid #000000;/* 粗边框 */
       box-shadow: 0 5px 0px #A78BFA; /* 硬阴影 */
      /* title样式设置 */
      --app-bar-title-font-size: 22px;/* 标题大小 */
      letter-spacing: 1px;/* 调整字间距 */
      ">
      <!-- 左侧插槽：放返回按钮 -->
      <template #left>
        <!-- 自定义像素风返回按钮 -->
        <button class="pixel-btn" @click="goHome">
          <!-- varlet自带的图标库名字 -->
          <var-icon name="chevron-left" :size="20" />
        </button>
      </template>
    </var-app-bar>

    <!-- 设置选项内容区域 -->
    <main class="setting-content">
      <!-- 使用Varlet的单元格组件 -->
       <!-- 系统设置单元格 -->
      <var-cell title="系统设置" description="0.0" border ripple>
        <template #extra>
          <var-icon name="chevron-right" />
        </template>
      </var-cell>
    </main>
    
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/appStore.ts'

//声明路由
const router = useRouter()
//声明状态
const appStore = useAppStore()//全局状态
//固定返回Home页面
const goHome = () => router.push('/')

</script>

<style scoped>
@import "@/styles/SettingView.css";
</style>