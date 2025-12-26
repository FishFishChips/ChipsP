/*
负责处理 HomeView页面布局的逻辑
*/
import { useThemeStore } from "@/stores/themeStore";
import { DEFAULT_LAYOUT, CURRENT_LAYOUT_VERSION } from '@/config/defaultHomeLayout'

export function checkAndMigrateLayout(){

    const store = useThemeStore()
    const userVersion = store.version || 0

    //如果版本没变，则什么都不做
    if (userVersion === CURRENT_LAYOUT_VERSION) return

    //调试
    console.log(`布局更新 v${userVersion} -> v${CURRENT_LAYOUT_VERSION}`)

    //拿到用户的布局，防止更新新功能时
    const userCurrentList = [...store.layout]

    /*
    布局合并逻辑
    */
   /*
   更新逻辑：
   遍历用户现在的列表：
    1. 如果是系统应用 -> 原地更新属性（改名、改图标），位置不动。
    2. 如果是用户应用 -> 原地保留。
    3. 如果是已废弃的系统应用（Default里没了）-> 删掉。
    */
   const updatedUserList = userCurrentList.map(item => {
        // 在新的默认列表里找找看，这个 ID 还在不在？
        const officialDef = DEFAULT_LAYOUT.find(def => def.id === item.id)

        if (officialDef) {
            // A:找到了：说明是有效的系统应用
            // 动作：保留用户的 item.id (位置不动)，但同步最新的 name/path/route/isSystem
            return {
                ...item, // 保留原属性,如位置信息
                ...officialDef, // 覆盖新属性,如新图标、新名字
                isSystem: true  // 确保标记为系统应用
            }
        }
        
        // B:没找到：说明可能是“用户自定义应用”或者“已废弃的旧系统应用”
        return item
    }).filter(item => {
        // 再次过滤：决定 B 类应用是留还是删
        
        // 如果它在最新的 Default 里存在，肯定留
        const existsInDefault = DEFAULT_LAYOUT.some(def => def.id === item.id)
        if (existsInDefault) return true

        // 如果不在 Default 里：
        // 如果它被标记为 isSystem，说明它是“被官方删除的旧应用” -> 删掉 (return false)
        // 否则，它是“用户自己加的” -> 保留 (return true)
        if (item.isSystem) return false
        
        return true
    })

    /*
    追加新功能：找出那些在 DEFAULT_LAYOUT 里有，但用户列表里还没有的 ID
    */
   const newOfficialItems = DEFAULT_LAYOUT.filter(def => {
        const exists = userCurrentList.some(userItem => userItem.id === def.id)
        return !exists // 用户没有，就是新功能
    })

    if (newOfficialItems.length > 0) {
        console.log('追加新功能:', newOfficialItems.map(i => i.name))
    }

    /*
    合并：用户原来的顺序+新出的功能
    */
   const finalLayout = [
        ...updatedUserList,
        ...newOfficialItems
    ]

  //写入store
  store.setLayout(finalLayout)
  store.setVersion(CURRENT_LAYOUT_VERSION)

  console.log("布局迁移完成")
}