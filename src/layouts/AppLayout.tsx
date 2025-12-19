import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Button,
  Layout,
  Menu,
  Typography,
} from 'antd';

import { useNavigate, useRouterState } from '@tanstack/react-router';
import { 
  menuConfig, 
  convertToAntdMenuItems, 
  getSelectedMenuKeys, 
  getOpenMenuKeys
} from '@/config/menuConfig';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import { usePermissions } from '@/hooks/usePermissions';
import { getIcon } from '@/utils/iconMap';
import { Header } from 'antd/es/layout/layout';
import { MenuOutlined } from '@ant-design/icons';
// import { useAppStore } from '@/stores';

const { Content, Sider } = Layout;
const AppLayout = (props: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const location = { pathname: routerState.location.pathname };
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const { filterMenuByPermission } = usePermissions();

  // 根据权限过滤菜单配置
  const filteredMenuConfig = useMemo(() => {
    return filterMenuByPermission(menuConfig);
  }, []); // 暂时移除依赖，因为权限通常在应用启动时就确定了

  // 转换菜单配置为 Ant Design 格式
  const menuItems = useMemo(() => {
    const items = convertToAntdMenuItems(filteredMenuConfig, getIcon);
    return items;
  }, [filteredMenuConfig]);
  
  // 获取路径映射 - 暂时不使用，但保留以备后用
  // const pathMap = useMemo(() => getMenuPathMap(menuConfig), []);
  
  // 获取当前选中的菜单项
  const selectedKeys = useMemo(() => {
    const keys = getSelectedMenuKeys(location.pathname, filteredMenuConfig);
    return keys;
  }, [location.pathname]); // 移除 filteredMenuConfig 依赖，因为菜单配置通常不会频繁变化

  // 初始化展开的菜单项
  useEffect(() => {
    // 只有在菜单未折叠时才设置展开的菜单项
    if (!collapsed) {
      const initialOpenKeys = getOpenMenuKeys(location.pathname, filteredMenuConfig);
      setOpenKeys(initialOpenKeys);
    } else {
      setOpenKeys([]);
    }
  }, [location.pathname, collapsed]); // 移除 filteredMenuConfig 依赖

  // 处理菜单点击
  const handleMenuClick = useCallback(({ key }: { key: string }) => {
    // 查找对应的菜单项
    const findMenuItem = (items: typeof filteredMenuConfig, targetKey: string): any => {
      for (const item of items) {
        if (item.key === targetKey) {
          return item;
        }
        if (item.children) {
          const found = findMenuItem(item.children, targetKey);
          if (found) return found;
        }
      }
      return null;
    };

    const menuItem = findMenuItem(filteredMenuConfig, key);
    
    if (menuItem && menuItem.path) {
      try {
        navigate({ to: menuItem.path });
      } catch (error) {
        console.error('导航失败:', error);
      }
    }
  }, [navigate, filteredMenuConfig]);

  // 处理子菜单展开/收起
  const handleOpenChange = useCallback((keys: string[]) => {
    // 当菜单折叠时，不允许展开子菜单
    if (collapsed) {
      setOpenKeys([]);
      return;
    }
    setOpenKeys(keys);
  }, [collapsed]);

  
  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #E5F0FC, #E7EFF9 21%, #E5E7EF)',
      }}
    >
      {/* 顶部导航栏 */}
      <Header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          height: '64px',
        }}
      >
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            width: 40,
            height: 40,
          }}
        />
        <Typography.Title 
          level={4} 
          style={{ 
            margin: '0 0 0 16px', 
            color: '#1890ff',
            flex: 1,
          }}
        >
          广告投放管理平台
        </Typography.Title>
      </Header>

      <Layout style={{ marginTop: '64px' }}>
        {/* 左侧菜单 */}
        <Sider 
          collapsed={collapsed}
          width={240}
          collapsedWidth={80}
          trigger={null}
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRight: '1px solid rgba(0, 0, 0, 0.06)',
            position: 'fixed',
            left: 0,
            top: '64px',
            bottom: 0,
            zIndex: 999,
          }}
        >
          
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            openKeys={collapsed ? [] : openKeys}
            onOpenChange={handleOpenChange}
            items={menuItems}
            onClick={handleMenuClick}
            inlineCollapsed={collapsed}
            style={{
              background: 'transparent',
              border: 'none',
              height: 'calc(100vh - 64px)', // 只减去顶部导航栏高度
              overflowY: 'auto',
            }}
            inlineIndent={20}
          />
        </Sider>

        {/* 主要内容区域 */}
        <Layout 
          style={{ 
            background: 'transparent',
            marginLeft: collapsed ? '80px' : '240px',
            transition: 'margin-left 0.2s',
          }}
        >
          <Content
            style={{
              minHeight: 'calc(100vh - 64px)',
              padding: '24px',
              background: 'transparent',
              transition: 'all 0.2s',
            }}
          >
            <BreadcrumbNav />
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
