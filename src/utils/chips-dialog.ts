import { createVNode, render } from 'vue'
import PixelDialogComponent from '@/components/chips-dialog.vue'

// 定义dialog调用参数
interface DialogOptions {
    /* 弹窗标题 */
  title?: string
  /* 弹窗内容 */
  message?: string
  /* 确认选项 */
  confirmButtonText?: string
  /* 取消选项 */
  cancelButtonText?: string
  /* 决定是否显示取消按钮，有些弹窗只需要确认就行 */
  showCancelButton?: boolean
  /* 决定点击弹窗外部的遮罩层时，是否回自动关闭弹窗 */
  closeOnOverlayClick?: boolean
}


export const PixelDialog = (options: DialogOptions) => {


  // 返回一个 Promise，让外部可以使用 await
  return new Promise<void>((resolve, reject) => {
    
   

    //确保dialog的css里面 .pixel-overlay 是fixed定位的，默认显示在整个页面
    const container = document.createElement('div')
    document.body.appendChild(container)


    /*
    销毁函数部分
    */
    const closeDialog = () => {
      render(null, container)
      document.body.removeChild(container)
    }

    //定义组件的 Props和事件
    const props = {
      ...options,
      //一上来就显示
      show: true, 
      
      // 监听组件内部的 'update:show' (点击遮罩层或取消时)
      'onUpdate:show': (val: boolean) => {
        if (!val) {
          closeDialog()
          // 点击遮罩层算取消
          reject('cancel') 
        }
      },

      // 监听 Confirm
      onConfirm: () => {
        closeDialog()
        //Promise成功
        resolve() 
      },

      // 监听 Cancel
      onCancel: () => {
        closeDialog()
         //Promise失败
        reject('cancel')
      }
    }

    //创建虚拟节点
    const vnode = createVNode(PixelDialogComponent, props)

    //渲染
    render(vnode, container)
  })
}