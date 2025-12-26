/*
stores名称：themeStore.ts
作用:用来管理全局美化
管理的状态如下：
1. 支持渲染手机页面的图标与背景
2. 支持渲染自定义组件
*/
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DEFAULT_LAYOUT, CURRENT_LAYOUT_VERSION } from '@/config/defaultHomeLayout'

/*
定义两种类型：App或Widget
*/ 
export type ItemType = 'app'|'widget'

/* 
App参数管理
*/
export interface GridItem {
    //UUID
    id: string
    type:ItemType
    name: string
    //如果是App，这里存图标URL；如果是相框，这里存照片URL
    path?: string 
    //点击跳转的路由（或许可以添加到组件上进行自定义跳转？）
    route?: string 
    //仅限组件设置L组件类型标识，如'Clock','PhotoFrame'
    componentType?:string
    //仅限组件设置：组件大小标识，范围为中号medium，大号large，横幅banner，巨型hero
    size?:'medium' | 'large' | 'banner' | 'hero'
    //标记是否是系统应用或组件，还L是用户自己加的
    isSystem?:boolean
}

export const useThemeStore = defineStore('theme',()=>{

    //默认背景图
    const background = ref<string>('123')
    /*
    使用深拷贝初始化布局
    */
   const layout = ref<GridItem[]>([...DEFAULT_LAYOUT])
   /*
   存储在用户本地的版本号
   */
  const version = ref<number>(CURRENT_LAYOUT_VERSION)
   

   /*
   修改背景
   */
  function setBackground(url:string){
    background.value=url
  }

  /*
  全量替换：给迁移逻辑和拖拽用
  */
 function setLayout(newLayout:GridItem[]){
    layout.value = [...newLayout]
 }

 /*
 更新版本号
 */
function setVersion(v:number){
    version.value = v
}

/*
添加应用/组件
*/
function addItem(item:GridItem){
    layout.value = [...layout.value,item]
}

/*
删除应用/组件
*/
function removeItem(id:string){
    layout.value = layout.value.filter(i => i.id != id)
}




 return {
    background,//背景图
    layout,//App/组件列表
    version,//用户版本号
    setBackground,//设置背景图方法
    removeItem,//移除App/组件方法
    setLayout,//全量替换方法：给迁移逻辑和拖拽用
    setVersion,//更新版本号方法
    addItem,//添加应用/组件
 }
},
//配置pinia持久化管理插件
{
    persist:true
}
)