<script setup lang="ts">
// 这里不需要写什么逻辑
</script>

<template>
  <!-- 外层：负责电脑端的背景和居中 -->
  <div class="pc-background">
    <!-- 内层：负责展示手机内容 -->
    <div class="mobile-frame">
      <!-- router-view为占位符，会获取匹配条件的组件并展示在此-->
      <router-view />
    </div>
  </div>
</template>

<style scoped>
  @import "@/styles/App.css";
</style>