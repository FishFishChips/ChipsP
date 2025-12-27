<template>
  <button class="pixel-btn" :class="{ 'is-disabled': disabled }" :style="btnStyle" @click="handleClick">
    <!-- 插槽优先，如果没有插槽内容则显示 label -->
    <slot>
      <span class="btn-text">{{ label }}</span>
    </slot>
  </button>
</template>
<script setup lang="ts">
  import { computed } from 'vue'
/*
可以让调用的用户改变的参数
*/
interface Props {
  // 按钮文字（可选，也可以用插槽）
  label?: string
  // 是否禁用
  disabled?: boolean
  // 按钮背景色，默认白色
  bgColor?: string
  // 文字颜色
  textColor?: string
  //宽度
  width?: string | number
  //高度
  height?: string | number
  //字体大小
  fontSize?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  label:'chips按钮',
  bgColor: '#ffffff',
  textColor: '#000000',
  disabled: false,
  //默认不设宽高，由padding和内容撑开
  width: undefined,
  height: undefined,
  //默认字体大小
  fontSize: '20px'

})

const emit = defineEmits(['click'])

// 辅助函数：处理单位，如果是纯数字则加上 px
const formatUnit = (val: string | number | undefined) => {
  if (val === undefined || val === null) return undefined
  // isNaN 检查是否为纯数字字符串，typeof 检查是否为数字类型
  return !isNaN(Number(val)) ? `${val}px` : String(val)
}

//统一把 Props 转换成 CSS 变量
const btnStyle = computed(() => {
  return {
    '--btn-bg': props.bgColor,
    '--btn-text': props.textColor,
    '--btn-width': formatUnit(props.width),
    '--btn-height': formatUnit(props.height),
    // 这里把字体大小存入变量 --btn-font-size
    '--btn-font-size': formatUnit(props.fontSize),
    // 计算 padding：如果有固定宽高，padding 为 0，否则根据字体大小自适应
    '--btn-padding': (props.width || props.height) ? '0' : '0.6em 1.2em'
  }
})

const handleClick = (event: MouseEvent) => {
  /* 按钮不是禁用状态时才允许继续执行 */
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
/* 
  按钮样式 
  风格：像素风格
*/
.pixel-btn {
  /* 
  布局:居中
  */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  /* 调整内边距 */
  box-sizing: border-box;
  

 /* 
 读取 CSS 变量
 */
  background-color: var(--btn-bg);
  color: var(--btn-text);
  /*调整按钮背景大小*/
  width: var(--btn-width);
  height: var(--btn-height);
  /* 这里的font-size会设定整个按钮的基准尺寸 */
  font-size: var(--btn-font-size);
  padding: var(--btn-padding);

  /* 
  无圆角，粗边框
   */
  border: 2px solid #000;
  border-radius: 0;
  /* 电脑指针移上去变成点击 */
  cursor: pointer;
  /* 不能被用户选中上面的文字 */
  user-select: none;

  /* 硬阴影 (X偏移 Y偏移 模糊半径 扩展半径 颜色) */
  box-shadow: 0.12em 0.12em 0 0 rgba(0, 0, 0,0.8);

  /* 动画过渡 */
  transition: all 0.2s;

  /* 关掉浏览器默认的点击高亮效果 */
  -webkit-tap-highlight-color: transparent;
  /*去除黑边 */
  outline: none;
}

/* 点击/按下状态*/
.pixel-btn:active:not(.is-disabled) {
  /* 向右下角移动，抵消阴影的位移 */
  transform: translate(0.1em, 0.1em);
  /* 阴影变小，产生“压扁”的效果 */
  box-shadow: 0 0 0 0 #000;
  /* 关掉浏览器默认的点击高亮效果 */
  -webkit-tap-highlight-color: transparent;
  /*去除黑边 */
  outline: none;
}

/* 禁用状态 */
.is-disabled { 
  opacity: 0.6;
  cursor: not-allowed;
  /* 禁用时取消按压效果 */
  box-shadow: 0.1em 0.1em 0 0 #000 !important;
  transform: translate(0.15em, 0.15em) !important;
  filter: grayscale(100%);
}

.btn-text {
  /* 确保文字垂直居中 */
  line-height: 1.2;
  font-size: inherit;

}
</style>