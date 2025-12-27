<template>

  <div class="home-screen" :style="{ backgroundImage: `url(${themeStore.background})` }">

    
    <!-- 
    使用VueDraggable实现图标和工具组件拖拽移动
    VueDraggable配置
    v-model:绑定数据
    animation:交换动画时间
    delay:长按多少毫秒触发拖拽，模拟手机长按
    delayOnTouchOnly: 仅在触摸屏启用延时，电脑鼠标直接拖（方便调试，上线可改为false）
    class: 应用 home-screen 的网格布局
    item-key:告诉库哪个字段是唯一键
    -->
    <VueDraggable v-model="layout" class="draggable-screen" :animation="150" :delay="300"
      :delayOnTouchOnly="false" item-key="id">

      <!-- 
      渲染多个格子，用来存储图标
      类名逻辑：渲染多个grid-cell，如果检测到是widget时，这个渲染出的grid-cell又会多一个is-widget的类名。
      所以在写css时，写组件类的grid-cell时只需要在原基础上添加一个状态类：.grid-cell.is-widget
      新增尺寸类标识：动态读取element.size，根据读取到的大小更新类名
      -->
      <div v-for="element in themeStore.layout" :key="element.id" class="grid-cell"
        :class="[{ 'is-widget': element.type === 'widget' },element.size? `size-${element.size}`: '']">

        <!-- 
      判断图标类型
      判断是App图标还是Widget
       -->
        <!-- app -->
        <div v-if="element.type === 'app'" class="app-item" @click="handleItemClick(element)">
          <!-- app包装：如果有element-data，当作图片路径，显示图标；如果没有则显示一个默认文字方块。 -->
          <div class="app-icon-wrapper">
            <img v-if="element.path" :src="element.path" :alt="element.name" class="app-icon" />
            <div v-else class="default-text-icon">{{ element.name }}</div>
          </div>
          <span class="app-name"> {{element.name}} </span>
        </div>

        <!-- widget -->
        <div v-else-if="element.type === 'widget'" class="widget-item" @click="handleItemClick(element)">
          <!-- 
          component是Vue内置的动态组件容器
          resolveWidget(element.componentType):获取组件名
          component会根据is获得的组件名自动渲染组件，如获取到PixelClock,则渲染出<PixelClock></PixelClock>
          -->
          <template v-if="resolveWidget(element.componentType)">
            <component :is="resolveWidget(element.componentType)" :data="element.path" :size="element.size"/>
          </template>
        </div>
      </div>
    </VueDraggable>

  </div>

</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { type Component, markRaw,watch,onMounted,ref} from 'vue';
import { showToast } from '@/utils/chips-toast';//引入chips弹窗组件
import { useThemeStore, type GridItem } from '@/stores/themeStore';
import { VueDraggable } from 'vue-draggable-plus';
import { PixelDialog } from '@/utils/chips-dialog';
import { storeToRefs } from 'pinia';
import { checkAndMigrateLayout } from '@/utils/HomeLayoutMigration'


const router = useRouter()
const themeStore = useThemeStore()
const {layout} = storeToRefs(themeStore)

/*
挂载时检查更新
*/
onMounted(() =>{
  checkAndMigrateLayout()
})

/*
用户添加组件逻辑：view层决定怎么生成数据
*/
const handleAddApp = () =>{
  //构造好数据
  const newWidget = {
         id: `w-${Date.now()}`, // ID 在这里生成
        type: 'widget' as const,
        name: '新应用',
        isSystem: false // 标记为用户自定义
  }
  //丢给store
  themeStore.addItem(newWidget)
}


/*
映射表自动获取组件对象
*/
//创建映射表
const WIDGET_MAP: Record<string, Component> = {}

//将特定目录下的组件一次性批量导入并生成一个对象，动态获取组件
const widgetModules = import.meta.glob('@/components/widgets/*.vue', { eager: true })

//填充映射表（使用Object.keys避免const/for循环报错）
Object.keys(widgetModules).forEach((path) => {
  /*
  取文件名作为键
   */
  //将整个路径分割，取最后一块
  const fileNameWithExt = path.split('/').pop() || ''
  //进行判断，如果文件名结尾不是.vue则直接舍弃，只要vue组件
  if (!fileNameWithExt.endsWith('.vue')) return
  //再将.vue用正则去掉，只留下文件名
  const componentName = fileNameWithExt.replace(/\.vue$/, '')
  /*
增加空值检查与错误提示
*/
  const mod = widgetModules[path] as any
  const componentConfig = mod.default || mod
  if(!componentConfig){
    PixelDialog({
      title:'怎么报错了！',
      message:`TIPS：可以单击复制报错内容一键ai，实在不会可以来discord找我反馈！=w=\n\n报错内容为：[Widget Error] 组件文件 ${componentName} 内容为空或导出异常，检查一下这个组件吧！`,
      confirmButtonText:'OK!',
      showCancelButton:false,
      closeOnOverlayClick:false
    })
    return
  }

  /*
  注册组件
  */
 WIDGET_MAP[componentName] = markRaw(componentConfig)

})
// 调试
console.groupCollapsed('已自动注册 Widgets')
console.table(Object.keys(WIDGET_MAP))
console.groupEnd()

//解析函数
const resolveWidget = (type?: string) => {
  if (!type) return null
  return WIDGET_MAP[type] || null
}


/*
点击应用跳转路由功能
*/
const handleItemClick = (item: GridItem) => {
  console.log('点击了:', item.name, item.type) // 方便调试

  // 如果是 APP
  if (item.type === 'app') {
    if (item.route) {
      router.push(item.route)
    } else {
      //给没有路由的图标一个弹窗
       showToast({
        msg:`你成功点击了${item.name}！但是什么都没发生，因为我还没写完=w=`,
        type:'info',
        duration:2000,
        target:'.home-screen'
       }
       )
      
    }
  }
  // 如果是 Widget 
  // 补充 Widget 的点击逻辑，否则点击时钟没反应
  else if (item.type === 'widget') {
    if (item.route) {
      router.push(item.route)
    } else {
      //给没有路由的图标一个弹窗
       showToast({
        msg:`你成功点击了${item.name}！但是什么都没发生，因为这只是一个没有路由的组件=w=`,
        type:'info',
        duration:2000,
        target:'.home-screen'
       }
       )
      
    }
  }
}
</script>

<style scoped>
@import "@/styles/HomeView.css";
</style>