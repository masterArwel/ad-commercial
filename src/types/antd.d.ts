/**
 * Ant Design 相关类型声明
 */

declare module 'antd/locale/zh_CN' {
  const zhCN: any;
  export default zhCN;
}

declare module 'antd/dist/reset.css' {
  const content: any;
  export default content;
}

// 扩展全局类型
declare global {
  interface Window {
    // 可以在这里添加全局的 window 属性类型
  }
}

export {};
