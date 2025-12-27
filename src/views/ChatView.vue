<template>
    <!--
    聊天页
    -->
    <div class="chat-page">
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
    <var-app-bar class="chatview-pixel-nav" :title="currentTitle" title-position="center"
      style="--app-bar-title-font-size: 20px;/* 标题字体大小 */" :elevation="false">
      <!-- 左侧插槽：放返回按钮 -->
      <template #left>
        <!-- 自定义像素风返回按钮 -->
        <chips-pixelbtn style="margin-left: 6px;" width="36px" height="26px" bgColor="#a98bd3" textColor="#fff" @click="goHome">
          <!-- varlet自带的图标库名字 -->
          <var-icon name="chevron-left" :size="20" />
        </chips-pixelbtn>
      </template>
      <!-- 右侧插槽：添加角色功能 -->
       <template #right>
        <chips-pixelbtn style="margin-right: 6px;" width="36px" height="26px" bgColor="#a98bd3" textColor="#fff" >
          <var-icon name="plus" :size="20" />
        </chips-pixelbtn>
        </template>
    </var-app-bar>
    <!-- 
    中间内容区域:
     使用v-if进行简单区域切换
    -->
     <div class="chat-content" >
      <div v-if="activeTab === 0" class="tab-pane">
        <!-- 这里放消息列表组件 -->
        <p v-for="i in 20" :key="i">模拟消息记录 {{ i }}...</p>
      </div>

      <div v-if="activeTab === 1" class="tab-pane">
        <!-- 这里放好友列表组件 -->
        <p>好友列表内容...</p>
        <var-cell v-for="i in 10" :key="i" :title="`好友 ${i}`" border />
      </div>

      <div v-if="activeTab === 2" class="tab-pane">
        <!-- 这里放动态组件 -->
        <p>这里是动态/朋友圈...</p>
        <var-card title="某人的动态" description="今天天气不错" />
      </div>
      </div>

      <!-- 
      底部导航栏
       -->
      <var-bottom-navigation 
      v-model:active="activeTab" 
      class="chatview-pixel-footer"
      active-color="#a98bd3" 
      :fixed="false"
    
    >
      <!-- 
        icon: 默认图标
        namespace: 如果你用了自定义图标库
        label: 文字
      -->
      <var-bottom-navigation-item label="消息" icon="message-outline" namespace="mdi" :ripple="false" />
      <var-bottom-navigation-item label="好友" icon="account-box-multiple" namespace="mdi" :ripple="false" />
      <var-bottom-navigation-item label="动态" icon="image-multiple" namespace="mdi" :ripple="false"/>
     </var-bottom-navigation>

    </div>

</template>

<script setup lang="ts">
import {ref,computed} from 'vue'
import { useRouter } from 'vue-router'

//声明路由
const router = useRouter()
//固定返回Home页面
const goHome = () => router.push('/')

/*
底部导航栏当前选中的索引 
0: 消息, 
1: 好友, 
2: 动态
*/
const activeTab = ref<number>(0)

  const currentTitle = computed(() => {
  switch (activeTab.value) {
    case 0: return '消息'
    case 1: return '通讯录'
    case 2: return '朋友圈'
    default: return 'CHAT'
  }
})

</script>

<style scoped>
@import "@/styles/ChatView.css";
</style>

<style>
    /*
自定义导航栏样式
风格：像素风
*/
.chatview-pixel-nav {
  /* 背景：白色 */
  --app-bar-color: #ffffff;
  /* 文字：黑色 */
  --app-bar-text-color: #000000;
  /* 字间距 */
  letter-spacing: 1px;

  /*
  像素风样式
  */
  /* 边框：4px宽 黑色 */
  border-bottom: 4px solid #000000;
  /* 硬阴影 */
  box-shadow: 0 5px 0px #A78BFA;
  /* 底下间距，仿制遮挡其他内容 */
  margin-bottom: 10px;

  /* 禁止用户选择文字 */
  user-select: none;
}

/* 
底部导航样式 
*/
.chatview-pixel-footer {
  flex-shrink: 0; /* 防止被压缩 */
  border-top: 4px solid #000; /* 像素风粗边框 */
  
  /* 如果你的像素风主题需要特定背景色 */
  --bottom-navigation-background-color: #fff; 
  outline: none;
  -webkit-tap-highlight-color: transparent;
  border: none;
}
/*强行去掉 Varlet 聚焦时的默认轮廓线 */
.var-bottom-navigation-item:focus{
    /*去掉那个橙色/蓝色框 */
    outline: none !important; 
    /*去掉手机点击高亮 */
    -webkit-tap-highlight-color: transparent !important; 
}


    </style>