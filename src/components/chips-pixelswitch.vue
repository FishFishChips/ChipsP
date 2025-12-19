<template>
    <!--
    自定义像素风格的切换开关组件
    -->
  <!-- 外壳：轨道 -->
  <div 
    class="pixel-switch-track" 
    :class="{ 'is-active': modelValue }"
    @click="toggle"
  >
    <!-- 内部：滑块 -->
    <div class="pixel-switch-handle"></div>
  </div>
</template>

<script setup lang="ts">
//定义 Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  //允许父组件自定义颜色
  activeColor: {
    type: String,
    default: '#000' // 默认黑色
  },
  inactiveColor: {
    type: String,
    default: '#fff' // 默认白色
  }
})

//定义 Emits
const emit = defineEmits(['update:modelValue', 'change'])

//切换逻辑
const toggle = () => {
  const newValue = !props.modelValue
  emit('update:modelValue', newValue)
  emit('change', newValue)
}
</script>

<style scoped>
/* 轨道样式 */
.pixel-switch-track {
  width: 52px;
  height: 28px;
  background-color: v-bind(inactiveColor); /* 动态绑定 CSS 变量 */

  border: 3px solid #000;/* 粗边框 */ 
  border-radius: 0; /* 直角 */ 
  
  box-shadow: 4px 4px 0px rgba(0,0,0,1);/* 硬阴影 */
  
  position: relative;
  cursor: pointer;
  transition: background-color 0.1s;
  
  /* 布局：让滑块垂直居中 */
  display: flex;
  align-items: center;
  padding: 0 4px; /* 左右留点空隙 */
  box-sizing: border-box;
}

/* 激活状态的轨道 */
.pixel-switch-track.is-active {
  background-color: v-bind(activeColor);
  
  /* 按下效果：阴影变小，整体下移 */
  box-shadow: 2px 2px 0px rgba(0,0,0,0);
  transform: translate(2px, 2px);
}

/* 滑块样式*/
.pixel-switch-handle {
  width: 14px;
  height: 14px;
  background-color: #000; /* 滑块是黑色的方块 */
  
  position: absolute;
  left: 4px; /* 初始位置 */
  
  /* 切换动画速度调整 */
  transition: left 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28); 
}

/* 激活状态的滑块位置 */
.is-active .pixel-switch-handle {
  /* 移动到右边：总宽度(52) - 边框(8) - 滑块宽(14) - 右间距(4) = 26px 左右 */
  left: 30px; 
  
  /* 激活时滑块变白 */
  background-color: #fff;
  box-sizing: border-box;
}
</style>