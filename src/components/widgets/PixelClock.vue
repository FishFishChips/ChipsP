<template>
  <!--
  时钟样式组件
  -->
  <div class="widget-card clock-widget" :class="size">
    <div class="time">{{ time }}</div>
    <div class="date">{{ date }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

/*
接收父组件传来的size
*/
defineProps<{size?: string}>()

/*
时钟逻辑
*/
const time = ref('')
const date = ref('')
let timer: any

const updateTime = () => {
  const now = new Date()
  time.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  date.value = `${now.getMonth() + 1}/${now.getDate()}`
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
  /*
  时钟外壳
  */
.widget-card {
  width: 100%;
  height: 100%;
  background: #fff;
  /* 像素紫 */
  color: #311B92;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 4px solid #000;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);

}

/*
针对hero尺寸的样式优化
*/
.widget-card.hero .time {
  font-size: 48px; /* 大尺寸下字体变大 */
}
.widget-card.hero .date {
  font-size: 20px;
}

</style>