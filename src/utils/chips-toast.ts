import { createVNode, render } from 'vue'
import ToastComponent from '@/components/chips-toast.vue'

//定义toast参数类型
interface ToastOptions {
  msg: string
  type?: 'info' | 'success' | 'error'|'warning'
  duration?: number
  /* 支持传入选择器或直接传入DOM元素 */
  target?:string|HTMLElement
}
/* 定义锁，防止弹窗出现多次叠加的bug */
let isToastShowing = false

export const showToast = (textOrOptions: string | ToastOptions) => {
  /* 如果存在弹窗，则直接返回，不生成弹窗 */
  if(isToastShowing) return

  isToastShowing = true

  // 统一参数处理
  let options: ToastOptions
  if (typeof textOrOptions === 'string') {
    options = { msg: textOrOptions }
  } else {
    options = textOrOptions
  }

  // 动态获取挂载容器
  let container: Element | null =  null
  
  //支持在外部指定挂载目标
  if(options.target){
    if(typeof options.target === 'string'){
        container = document.querySelector(options.target)
    }else{
        container = options.target
    }
  }
  //如果没指定目标，则默认用mobile-frame
  if(!container){
    container = document.querySelector('.mobile-frame') || document.body
  }

  // 创建div容器挂载节点
  const mountNode = document.createElement('div')
  //给wrapper加个样式，确保不会影响容器布局
  mountNode.style.position = 'absolute'
  mountNode.style.zIndex = '999'

  container.appendChild(mountNode)

  // 利用 Vue 的 createVNode 创建虚拟节点
  // 第二个参数是传递给组件的 props
  const vnode = createVNode(ToastComponent, {
    message: options.msg,
    type: options.type || 'info',
    duration: options.duration || 3000
  })

  // 5. 渲染
  render(vnode, mountNode)

  // 销毁逻辑：时间到了之后，要把 div 从 DOM 中移除，防止内存泄漏
  // 时间要比组件里的 duration 稍微长一点，等待动画结束
const duration = options.duration || 3000
setTimeout(() => {
    //卸载vue组件
    render(null, mountNode)
    //移除dom
    if (container && mountNode.parentNode === container) {
      container.removeChild(mountNode)
      /* 彻底销毁，才能继续使用弹窗 */
      isToastShowing = false
    }
  }, duration + 500)
}