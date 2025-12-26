<template>
  <!-- 外层：负责电脑端的背景和居中 -->
  <div class="pc-background">
    <!-- 
    内层：负责展示手机内容
    动态绑定 class:
    如果 appStore.isFullScreen 为 true，
    则添加 'mode-full-screen' 这个类名 
    -->
    <div class="mobile-frame" :class="{ 'mode-full-screen': appStore.isFullScreen }">
      <!-- 
      状态栏
      使用transition包裹，实现高度变化的动画
      -->
      <transition name="slide-bar">
        <!-- v-if控制状态栏的显示隐藏 -->
       <div class="mobile-status" v-if="appStore.isStatusBarVisible">
        <chips-statusbar/>
        </div>
        </transition>
      <!-- 手机屏幕内部容器 -->
      <div class="mobile-screen">
      <!-- router-view为占位符，会获取匹配条件的组件并展示在此-->
      <router-view/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from './stores/appStore';


//初始化store，以便在template里使用
const appStore = useAppStore()

</script>

<style scoped>
@import "@/styles/App.css";
</style>