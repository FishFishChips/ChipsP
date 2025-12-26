/*
默认Home页面布局配置
更新修改默认菜单时在这里更新
*/

import type { GridItem } from "@/stores/themeStore";

/*
版本号更新
每次版本更新要更新版本号！强制更新！
*/

export const CURRENT_LAYOUT_VERSION = 1

    /*
    默认布局
    混合列表：App,Widget
    id命名方式：应用：'a-1','a-2';组件：'w-1','w-2'
    */
export const DEFAULT_LAYOUT: GridItem[] = [
    /* 
    app列表
     */
    {
        id: 'a-1',
        type: 'app',
        name: '设置',
        path: '',
        route: '/settings',
        isSystem: true
    },
    {
        id: 'a-2',
        type: 'app',
        name: 'chat',
        path: '',
        route: '/chat',
        isSystem: true
    },
    {
        id: 'a-3',
        type: 'app',
        name: '世界书',
        path: '',
        route: '',
        isSystem: true
    },
    {
        id: 'a-4',
        type: 'app',
        name: '关于你',
        path: '',
        route: '',
        isSystem: true
    },
    {
        id: 'a-5',
        type: 'app',
        name: '正则',
        path: '',
        route: '',
        isSystem: true
    },
    {
        id: 'a-6',
        type: 'app',
        name: '组件',
        path: '',
        route: '',
        isSystem: true
    },





    /*
    widget列表
    */
    {
        id: 'w-1',
        type: 'widget',
        name: '时钟',
        componentType: 'PixelClock',
        size:'hero',
        isSystem: true
    }

]