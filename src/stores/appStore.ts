/*
stores名称：appStore.ts
作用:用来管理全局应用状态
管理的状态如下：
1. 是否全屏
2. 真实的手机系统状态（电池、时间）获取/模拟
3. 状态栏状态管理：显示与隐藏
*/

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {

    /* 全屏状态存储 */
    //初始化定义状态,监听并从localStorage中获取
    const isFullScreen = ref(localStorage.getItem('isFullScreen') === 'true')
    //定义存储动作，确保屏幕状态改变后能及时存储本地
    const toggleFullScreen = (value: boolean) => {
        isFullScreen.value = value
        //保存到本地存储
        localStorage.setItem('isFullScreen', String(value))
    }

    /* 
    系统状态管理（电池/时间）
    获取不到系统状态则转为模拟状态
     */
    /* 真实电池状态响应式函数  */
    const batteryLevel = ref(100) //电量
    const isCharging = ref(false) //充电状态
    const isBatterySupported = ref(false) //标记设备是否支持电池API

    /* 时间状态响应式函数  */
    const currentTime = ref('')//当前时间（格式化字符串 HH:mm）

    /* 辅助函数：模拟数据模式下使用，用来加载模拟数据 */
    const loadSimulationData = () => {
        const savedLevel = localStorage.getItem('sim_batteryLevel')
        const savedCharging = localStorage.getItem('sim_isCharging')

        // 如果本地有存，就用本地的；否则默认 100 和 false
        if (savedLevel !== null) {
            batteryLevel.value = Number(savedLevel)
        } else {
            batteryLevel.value = 100
        }

        if (savedCharging !== null) {
            isCharging.value = savedCharging === 'true'
        } else {
            isCharging.value = false
        }
    }

    //时间监听锁
    let timeIntervalId:number|null = null;
    //电池监听锁
    let isBatteryListenerAdded:boolean|null = null;

    /*
    初始化系统监听
    在App入口挂载后运行
    */
    const initSystemListeners = async () => {
        /* 
        获取时间逻辑
        使用浏览器提供的计时器函数
        每隔一秒更新当前时间
        */
        //更新时间逻辑
        if(!timeIntervalId){
        const updateClock = () =>{
            const now = new Date()//创建一个当前时间对象（包含年月日时分秒）
            const hours = String(now.getHours()).padStart(2, '0')//获取小时，不满两位数则用0补足
            const minutes = String(now.getMinutes()).padStart(2, '0')//获取分钟
            currentTime.value = `${hours}:${minutes}`//使用模板字符串拼接，格式为：HH:mm
        }
        //立即执行一次,防止刷新页面出现的1s空白
        updateClock()
        console.log("更新时间")

        setInterval(updateClock,1000)
        timeIntervalId= setInterval(updateClock,1000)
    }

        /* 
        电池监听
        处理ios不支持的情况
        @ts-ignore:getBattery可能不识别，无视报错
        */
       if(!isBatteryListenerAdded){
       //@ts-ignore
        if (navigator.getBattery) {
            try {
                //@ts-ignore
                const battery = await navigator.getBattery()//获取电池对象（内容：当前电量，是否在充电）
                isBatterySupported.value = true//成功获取到对象，说明电池功能被支持，标记支持
                //封装更新函数，用以更新电量与充电状态
                const updateBattery = () => {
                    batteryLevel.value = Math.floor(battery.level * 100)
                    isCharging.value = battery.charging
                }
                //立即执行一次更新状态
                updateBattery()
                battery.addEventListener('levelchange', updateBattery)//监听电池变化
                battery.addEventListener('chargingchange', updateBattery)//监听充电状态
                isBatteryListenerAdded = true 
            } catch (error) {
                //捕捉获取状态失败的错误信息
                isBatterySupported.value = false
                //调用辅助函数，读取本地存储的设置
                loadSimulationData()
            }
        } else {
            //兼容ios设备
            isBatterySupported.value = false
            //调用辅助函数，读取本地存储的设置
            loadSimulationData()
        }
    }}

    /*
    模拟设置：手动设置模拟电量，供settings页面调用
    */
    const setSimulationBattery = (level: number, charging: boolean) => {
        // 只有在不支持真实电池时，才允许手动覆盖
        if (!isBatterySupported.value) {
            batteryLevel.value = level
            isCharging.value = charging

            // 写入本地存储，保证刷新后还在
            localStorage.setItem('sim_batteryLevel', String(level))
            localStorage.setItem('sim_isCharging', String(charging))
        }
    }

    /*
    状态栏显示隐藏切换状态保存
    默认是true
    */
   const isStatusBarVisible = ref(localStorage.getItem('isStatusBarVisible')==='true')
   //切换状态栏显示
   const toggleStatusBarVisible = (value:boolean) =>{
    isStatusBarVisible.value=value
    localStorage.setItem('isStatusBarVisible',String(value))
   }

    /*
    作用：导出
    */
    return {
        isFullScreen, //存储屏幕状态
        toggleFullScreen,//存储动作方法
        batteryLevel,//电量状态
        isCharging,//充电状态
        isBatterySupported, //是否支持电池读取
        currentTime,//当前时间
        initSystemListeners,//初始化监听系统，监听电池与时间
        setSimulationBattery,//手动设置模拟电量
        isStatusBarVisible,//状态栏状态
        toggleStatusBarVisible,//状态栏切换方法
    }
})