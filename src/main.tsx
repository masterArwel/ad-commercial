import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { renderWithQiankun, qiankunWindow, QiankunProps } from 'vite-plugin-qiankun/dist/helper'
import { routeTree } from './routeTree.gen'
import './index.css'
// 导入 Ant Design 样式
import 'antd/dist/reset.css'

// 创建路由实例
const router = createRouter({ 
  routeTree,
  basepath: '/ad-commercial'
})

let root: ReactDOM.Root | null = null

function render(props: any = {}) {
  const { container } = props
  
  // 在微前端环境中，直接使用传入的 container
  // 在独立运行时，使用 document.getElementById('root')
  let containerEl: HTMLElement | null = null
  
  if (container) {
    // 微前端环境：直接使用传入的容器
    containerEl = container
    console.log('Using micro frontend container:', container)
  } else {
    // 独立运行：查找页面中的 #root 元素
    containerEl = document.getElementById('root')
    console.log('Using standalone root element')
  }
  
  if (!containerEl) {
    console.error('Container element not found!')
    return
  }
  
  if (!root) {
    root = ReactDOM.createRoot(containerEl)
  }
  
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}

renderWithQiankun({
  mount(props) {
    console.log('adcommercial mount', props)
    render(props)
  },
  bootstrap() {
    console.log('adcommercial bootstrap')
  },
  unmount() {
    console.log('adcommercial unmount')
    if (root) {
      root.unmount()
      root = null
    }
  },
  update: function (_props: QiankunProps): void | Promise<void> {
    throw new Error('Function not implemented.')
  }
})

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render()
}