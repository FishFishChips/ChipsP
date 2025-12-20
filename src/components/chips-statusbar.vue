<template>
    <header class="status-bar">

        <!-- 左侧：时间 -->
        <div class="status-left" style="font-size: 16px;">
            {{ appStore.currentTime }}
        </div>

        <!-- 右侧：电池 -->
        <div class="status-right">
            <span class="battery-text" style="font-size: 16px;">{{ appStore.batteryLevel }}%</span>
            <div class="battery-container">
                <div class="battery-body">
                    <div class="battery-fill" :style="{
                        width: appStore.batteryLevel + '%',
                        backgroundColor: appStore.isCharging ? '#00E676' : '#6200EA'
                    }">
                    </div>
                </div>
                <div class="battery-tip"></div>
            </div>
            <span v-if="appStore.isCharging" class="charging-icon"></span>
        </div>
    </header>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAppStore } from '@/stores/appStore'
const appStore = useAppStore()

/* onMounted作用：用于组件加载完成后，初始化系统监听，即启动时钟和电池监听 */
onMounted(() => {
    appStore.initSystemListeners()
})
</script>

<style scoped>
.status-bar {
    height: 30px;
    /* 固定高度 */
    flex-shrink: 0;
    /*防止在状态栏被挤压变小 */
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    /* 左右两端对齐，中间自动拉开距离 */
    align-items: center;
    /* 垂直居中，避免文字上下不齐 */
    padding: 0 12px;
    font-size: 20px;
    color: #311B92;
    user-select: none;
    /* 禁止文字被选中 */
    z-index: 10;
    /* 保证在最上层 */
}

.status-left,
.status-right {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100px;
}

.status-left {
    justify-content: flex-start;
}

.status-right {
    justify-content: flex-end;
}

/* 电池样式 */
.battery-container {
    display: flex;
    align-items: center;
}

.battery-body {
    width: 28px;
    height: 14px;
    border: 2px solid #311B92;
    padding: 1px;
    background: #fff;
    display: flex;
}

.battery-fill {
    height: 100%;
    transition: width 0.3s steps(5);
}

.battery-tip {
    width: 3px;
    height: 6px;
    background: #311B92;
    margin-left: 1px;
}
</style>