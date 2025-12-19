import { defineStore } from 'pinia'
import { ref } from 'vue'

/*
stores名称：appStore.ts
作用:用来管理全局应用状态
*/

export const useAppStore = defineStore('app',() => {

    /* 全屏状态存储 */
    //初始化定义状态,监听并从localStorage中获取
    const isFullScreen = ref(localStorage.getItem('isFullScreen')=== 'true')
    //定义存储动作，确保屏幕状态改变后能及时存储本地
    const toggleFullScreen = (value: boolean) =>{
        isFullScreen.value = value
        //保存到本地存储
        localStorage.setItem('isFullScreen',String(value))
    }

    /*
    作用：导出
    isFullScree:存储屏幕状态
    toggleFullScreen：存储动作方法
    */
    return {isFullScreen,toggleFullScreen}
})