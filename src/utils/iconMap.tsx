import React from 'react';
import {
  DashboardOutlined,
  BulbOutlined,
  ShareAltOutlined,
  TeamOutlined,
  RobotOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  SettingOutlined,
  BarChartOutlined,
  ToolOutlined,
} from '@ant-design/icons';

/**
 * 图标映射表
 */
export const iconMap: Record<string, React.ReactNode> = {
  DashboardOutlined: <DashboardOutlined />,
  BulbOutlined: <BulbOutlined />,
  ShareAltOutlined: <ShareAltOutlined />,
  TeamOutlined: <TeamOutlined />,
  RobotOutlined: <RobotOutlined />,
  AppstoreOutlined: <AppstoreOutlined />,
  DatabaseOutlined: <DatabaseOutlined />,
  SettingOutlined: <SettingOutlined />,
  BarChartOutlined: <BarChartOutlined />,
  ToolOutlined: <ToolOutlined />,
};

/**
 * 根据字符串获取图标组件
 */
export const getIcon = (iconName?: string): React.ReactNode => {
  if (!iconName) return null;
  return iconMap[iconName] || null;
};

export default getIcon;