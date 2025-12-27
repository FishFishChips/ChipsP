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
     style:css美化样式设置设置
     -->
    <var-app-bar class="settingview-pixel-nav" title="SETTINGS" title-position="center"
      style="--app-bar-title-font-size: 20px;/* 标题字体大小 */" :elevation="false">
      <!-- 左侧插槽：放返回按钮 -->
      <template #left>
        <!-- 自定义像素风返回按钮 -->
        <chips-pixelbtn  style="margin-left: 6px;" width="36px" height="26px" bgColor="#a98bd3" textColor="#fff" @click="goHome">
          <!-- varlet自带的图标库名字 -->
          <var-icon name="chevron-left" :size="20" />
        </chips-pixelbtn>
      </template>
    </var-app-bar>

    <!-- 设置选项内容区域 -->
    <main class="setting-content">
      <!-- 使用Varlet的单元格组件 -->
      <!-- 系统设置单元格 -->
      <var-cell title="系统设置" description="0.0" class="pixel-cell" border @click="openSystemSettings">
        <template #extra>
          <var-icon name="chevron-right" />
        </template>
      </var-cell>
      <var-cell title="美化设置" description="0.0" class="pixel-cell" border>
        <template #extra>
          <var-icon name="chevron-right" />
        </template>
      </var-cell>
      <var-cell title="API设置" description="0.0" class="pixel-cell" border>
        <template #extra>
          <var-icon name="chevron-right" />
        </template>
      </var-cell>
    </main>

    <!-- 点击系统设置显示的子菜单 -->
    <!-- 使用Varlet组件的popup模拟 -->
    <var-popup v-model:show="showSystemSettings" position="right" :overlay="true" class="subpage-popup"
      teleport=".mobile-screen">
      <!-- 系统设置子页面的容器 -->
      <div class="systemdetails">

        <!-- 系统设置子页面的导航栏 -->
        <var-app-bar title="系统设置" title-position="center" class="settingview-pixel-nav"
          style="--app-bar-title-font-size: 20px;/* 标题字体大小 */">
          <!-- 返回按钮插槽，用于关闭popup，不操作路由 -->
          <template #left>
            <chips-pixelbtn style="margin-left: 6px;" width="36px" height="26px" bgColor="#a98bd3" textColor="#fff" class="pixel-btn" @click="showSystemSettings = false">
              <var-icon name="chevron-left" :size="20" />
            </chips-pixelbtn>
          </template>
        </var-app-bar>

        <!-- 系统设置子页面的内容区域 -->
        <main class="systemsub-content">
          <var-cell title="屏幕切换" description="一键切换全屏/带边框！" class="sub-content" border>
            <template #extra>
              <!-- 自定义像素风组件 -->
              <chips-pixelswitch v-model="isFullScreenOn" class="settingview-pixel-switch" ripple="false" />
            </template>
          </var-cell>
          <var-cell title="状态栏切换" description="一键隐藏/显示状态栏！" class="sub-content" border>
            <template #extra>
              <!-- 自定义像素风组件 -->
              <chips-pixelswitch v-model="isStatusBarVisibleOn" class="settingview-pixel-switch" ripple="false" />
            </template>
          </var-cell>

        </main>

      </div>
    </var-popup>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import { computed } from 'vue'//引入computed
import { ref } from 'vue'
import { storeToRefs } from 'pinia' //引入storeToRefs保持响应性

//声明路由
const router = useRouter()
//声明状态
const appStore = useAppStore()//全局状态
//固定返回Home页面
const goHome = () => router.push('/')

/* 
控制系统设置页面的显示/隐藏
*/
const showSystemSettings = ref(false)//绑定响应式，默认值为false，即默认关闭
const openSystemSettings = () => {
  showSystemSettings.value = true
}

/*
控制应用全屏切换
*/
//使用 storeToRefs 解构状态，保持响应式
const { isFullScreen } = storeToRefs(appStore)
//创建一个可读写的计算属性
const isFullScreenOn = computed({
  //获取值时：读取store里的状态
  get: () => isFullScreen.value,
  //修改值时，即点开开关：调用store的action
  set: (val: boolean) => appStore.toggleFullScreen(val)
})

/*
控制状态栏的显示与隐藏
*/
const { isStatusBarVisible } = storeToRefs(appStore)
const isStatusBarVisibleOn = computed({
  get: () => isStatusBarVisible.value,
  set: (val: boolean) => appStore.toggleStatusBarVisible(val)

})

</script>

<style scoped>
@import "@/styles/SettingView.css";
</style>

<style>
/*
自定义导航栏样式
风格：像素风
*/
.settingview-pixel-nav {
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

/* 自定义子页面弹窗样式 */
.subpage-popup {
  /* 
  定位与布局
  保证弹窗从mobile-screen处弹出
  */
  width: 100%;
  height: 100%;
  z-index: 10;
  background: #ffffff;
  box-shadow: none;
  /*
  动画
  */
  transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>