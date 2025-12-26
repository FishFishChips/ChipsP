<template>
    <!--
    一个选项弹窗，用来捕捉报错提示
    -->
  <Transition name="pixel-scale">
    <!-- 遮罩层 -->
    <div v-if="show" class="pixel-overlay" @click.self="handleOverlayClick">
        <!-- 弹窗盒子 -->
      <div class="pixel-window">
        <!-- 标题栏 -->
        <div class="window-header">
          <span class="header-title">{{ title }}</span>
        </div>

        <!-- 
        内容区域
        增加一键复制内容
        -->
        <div class="window-content" @click="handleContentClick" title="点击复制内容" >
          {{ message }}
        </div>
        <!-- 复制按钮气泡 -->
          <Transition name="pixel-pop-tiny">
            <div 
              v-if="showCopyBtn" 
              class="copy-bubble" 
              @click.stop="execCopy"
            >
              {{ copyText }}
            </div>
          </Transition>

        <!-- 底部按钮 -->
        <div class="window-footer">
          <button v-if="showCancelButton" class="pixel-btn cancel" @click="handleCancel">
            {{ cancelButtonText }}
          </button>
          <button class="pixel-btn confirm" @click="handleConfirm">
            {{ confirmButtonText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import {ref,watch} from 'vue'

interface Props {
  show: boolean
  title?: string
  message?: string
  confirmButtonText?: string
  cancelButtonText?: string
  showCancelButton?: boolean
  closeOnOverlayClick?: boolean
}

// 设置默认值
const props = withDefaults(defineProps<Props>(), {
  show: false,
  title: 'SYSTEM MESSAGE',
  message: '',
  confirmButtonText: 'CONFIRM',
  cancelButtonText: 'CANCEL',
  showCancelButton: true,
  closeOnOverlayClick: true
})

const emit = defineEmits(['update:show', 'confirm', 'cancel'])

const handleConfirm = () => {
  emit('confirm')
  /*
  如果是组件模式，用户需要手动处理关闭；如果是函数模式，外部会处理
  这里只发出事件
  */
}

const handleCancel = () => {
  emit('cancel')
  emit('update:show', false)
}

const handleOverlayClick = () => {
  if (props.closeOnOverlayClick) {
    handleCancel()
  }
}

/*
 处理复制内容的逻辑 
 */

const showCopyBtn = ref(false)
// 按钮文字状态
const copyText = ref('COPY') 

// 点击内容区域：切换显示复制按钮
const handleContentClick = () => {
  if (props.message) {
    showCopyBtn.value = !showCopyBtn.value
    // 每次重新打开时，重置文字
    if (showCopyBtn.value) {
      copyText.value = 'COPY'
    }
  }
}

// 执行复制
const execCopy = async () => {
  if (!props.message) return

  try {
    // 写入剪贴板
    await navigator.clipboard.writeText(props.message)
    
    // 成功反馈
    copyText.value = 'COPIED!'
    
    // 0.5秒后自动关闭气泡
    setTimeout(() => {
      showCopyBtn.value = false
    }, 500)
  } catch (err) {
    console.error('复制失败:', err)
    copyText.value = 'ERROR'
  }
}

// 监听弹窗关闭，如果弹窗关了，把复制按钮也重置
watch(() => props.show, (newVal) => {
  if (!newVal) {
    showCopyBtn.value = false
  }
})

</script>

<style scoped>
    /*
    遮罩层
    */
.pixel-overlay {
    /*
    定位与布局
    */
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 2000;
  /*
  位置居中
  */
  display: flex;
  justify-content: center;
  align-items: center;
}

/*
弹窗样式
*/
.pixel-window {
  width: 80%;
  max-width: 350px;
  background-color: #fff;
  border: 3px solid rgba(43, 14, 102,0.9);
  /* 
  像素硬阴影 
  */
  box-shadow: 8px 8px 0px rgba(0, 0, 0,0.3);
  position: relative;
  image-rendering: pixelated;
}

/* 
标题栏样式
*/
.window-header {
    /* 
    标题栏颜色
    */
  background-color: rgba(75, 31, 166,0.8);
  border-bottom: 3px solid rgba(43, 14, 102,0.9);
  color: #fff;
  padding: 14px 12px;
  /* 
  定位与布局
   */
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  /*
  防止用户复制到文字
  */
  user-select: none;
}

/* 
弹窗内容区
 */
.window-content {
  padding: 18px 16px;
  font-size: 14px;
  line-height: 1.5;
  color: #333;

  min-height: 60px;
  /* 限制内容区最大尺寸，防止内容过多撑开内容区 */
  max-height: 60vh;
  /* 只允许上下滚动 */
  overflow-y: auto;
  overflow-x: hidden;

  /* 保留空白符和换行符，并且允许自动换行 */
  white-space: pre-wrap;
  /* 防止超长单词把弹窗撑爆 */
  word-break: break-word;

  /*
  一键复制的相对定位
  */
  /* 让复制气泡的绝对定位以这里为基准 */
  position: relative;
  /* 提示电脑端这里可以点 */
  cursor: pointer;
  /* 防止点击时电脑端选中文件变蓝 */
  user-select: none;
  /* 关掉浏览器默认的点击高亮效果 */
-webkit-tap-highlight-color: transparent;
 outline:none; /*去除黑边 */
}

/*
像素风复制气泡相关逻辑
*/
.copy-bubble {
  /* 固定比例定位 */
  position: absolute;
  top: 1vh;  
  right: 1vh;
  background-color: rgba(75, 31, 166,0.8); 
  color: #fff;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: bold;
  
  /* 像素边框 */
  border: 2px solid rgba(75, 31, 166,0.8); 
  box-shadow: 2px 2px 0px rgba(0,0,0,0.5); 
  
  z-index: 10;
  cursor: pointer;
}
/* 气泡点击动画 */
.copy-bubble:active {
  /* 点击下沉 */
  transform: translateY(2px); 
}
/* 气泡弹出弹出动画 */
.pixel-pop-tiny-enter-active,
.pixel-pop-tiny-leave-active {
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s;
}

.pixel-pop-tiny-enter-from,
.pixel-pop-tiny-leave-to {
  opacity: 0;
  transform: scale(0.5) translateY(10px);
}

/* 
  针对手机框的滚动条美化：设置成透明，滚动条依旧存在
  WebKit内核浏览器：Chrome/Edge/Safari
  不兼容Firefox/IE
*/
/* 滚动条样式 */
.window-content::-webkit-scrollbar {
  width: 6px;
}

/* 
滚动条轨道样式：设置成透明
 */
.window-content::-webkit-scrollbar-track {
  background: transparent;
}

/* 
滚动条滑块样式:设置成透明
 */
.window-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3)
}

/* 
底部按钮区
 */
.window-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 16px;
  /* 顶部虚线边框 */
  background-image: linear-gradient(to right, rgba(43, 14, 102,0.9) 50%, rgba(255,255,255,0) 0%);
  background-position: top;
  background-size: 10px 2px;
  background-repeat: repeat-x;
}

/* 
按钮风格
 */
.pixel-btn {
  border: 2px solid rgba(43, 14, 102,0.9);
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.1s;
  background-color: #fff;
  /* 按钮阴影 */
  box-shadow: 2px 2px 0px #000; 
  /* 关掉浏览器默认的点击高亮效果 */
-webkit-tap-highlight-color: transparent;
/*去除电脑端点击时会出现的黑边 */
outline:none; 
}
/*
点击按钮动画
*/
.pixel-btn:active {
    /* 点击下沉效果 */
  transform: translate(2px, 2px); 
  box-shadow: none;
}
/*
确认按钮
*/
.pixel-btn.confirm {
  background-color: rgba(75, 31, 166,0.8);
  color: #fff;
}

/*
取消按钮
*/
.pixel-btn.cancel {
  background-color: #fff;
  color: #000;
}



</style>