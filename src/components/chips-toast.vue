<template>
    <!--  
      弹窗动画：从屏幕顶端滑入滑出
      transition是Vue内置的过渡动画组件
    -->
  <Transition name="slide-top">
    <div v-if="show" class="chips-toast" :class="type">
      <span class="text">{{ message }}</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

/*
是Vue内置的setup语法糖中用来声明并接收父组件传进来的数据的专用函数
*/
const props = defineProps<{
  message: string
  duration?: number
  type?: 'info' | 'success' | 'error'|'warning'
}>()

const show = ref(false)

// 组件挂载后，自动显示
onMounted(() => {
  show.value = true
  
  // 到时间自动消失
  setTimeout(() => {
    show.value = false
  }, props.duration || 3000)
})
</script>

<style scoped>

/*
弹窗定位
*/
.chips-toast {
  position: fixed;
  /* 距离屏幕顶层边框的最终位置 */
  top: 8%;
  left: 50%;
  /* 水平居中 */
  transform: translate(-50%, -50%);
  
  /* 
  弹窗样式美化 
  */
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 0;
  font-size: 14px;
  max-width: 80%;
  box-shadow: 6px 6px 0px rgba(0,0,0,0.3);
  /* 让鼠标能穿透它点击下面的图标 */
  pointer-events: none; 
  z-index: 999;
  
  /* 弹性布局 */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 类型配色 */
.chips-toast.error { background: rgba(200, 50, 50, 0.7); }
.chips-toast.success { background: rgba(34, 197, 94, 0.7); }
.chips-toast.warning{ background: rgba(255, 193, 7, 0.7) }

/*
定义弹窗进场动画时间
*/
.slide-top-enter-active{
    transition: 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

/*
定义弹窗进场状态
*/
.slide-top-enter-from{
    /* 进场 */
    transform: translate(-50%,-100%);
    opacity: 0;

}
/*
定义弹窗出场动画时间
*/
.slide-top-leave-active{
  transition: all 0.3s ease;
}
/*
定义弹窗出场状态
*/
.slide-top-leave-to{
    /* 直接淡出 */
    opacity: 0;
}
</style>