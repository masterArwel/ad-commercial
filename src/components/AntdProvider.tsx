import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';

// 设置 dayjs 为中文
dayjs.locale('zh-cn');

interface AntdProviderProps {
  children: React.ReactNode;
}

/**
 * Ant Design 配置提供者
 * 提供全局的主题配置和国际化设置
 */
const AntdProvider: React.FC<AntdProviderProps> = ({ children }) => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          // 自定义主题 token
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
        components: {
          // 组件级别的主题定制
          Button: {
            colorPrimary: '#1890ff',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdProvider;
