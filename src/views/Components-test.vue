<template>
  <div class="home-screen">
    <button @click="handleClick">123test</button>
    </div>
</template>

<script setup lang="ts">
import { PixelDialog } from '@/utils/chips-dialog'

const handleClick = async () => {

    // 这行代码会暂停往下执行，直到用户点确定
    await PixelDialog({
      title: '怎么报错了！',
      message: `TIPS：可以单击复制报错内容一键ai，实在不会可以来discord找我反馈！=w=\n\n是否删除该桌面组件？该操作不可逆！`,
      cancelButtonText: '算了',
      closeOnOverlayClick: false,
    })
}
</script>

<style scoped>
.home-screen {
    /* 
  优化部分
  */
  /* 看起来尺寸不变，但会触发GPU加速，优化弹窗功能 */
  transform: translateZ(0);
  /*
  布局与尺寸
  */
  width:100%;
  height: 100%;
  /* grid布局*/
  display: grid;
  /* 列设置：固定4列，每列等宽 */
  grid-template-columns: repeat(4, 1fr); 
  /* 行设置：固定6行 */
  grid-template-rows: repeat(8, 1fr);
  box-sizing: border-box;
  position: relative;
  /* 溢出margin防止出滚动条 */
  margin:0;
  gap: 15px;
  padding: 40px 10px;

  /*
  背景图片优化
  */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  /* 禁止滑动 */
  overflow: hidden;
  
  /*
  图标处理：像素化，不模糊
  */
  image-rendering: pixelated; 
  /* 关掉浏览器默认的点击高亮效果 */
-webkit-tap-highlight-color: transparent;
}
</style>