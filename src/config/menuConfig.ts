import type { MenuProps } from 'antd';

export interface MenuItem {
  key: string;
  label: string;
  icon?: string; // 改为字符串类型
  children?: MenuItem[];
  path?: string;
}

/**
 * 菜单配置 - 基于广告投放管理系统的业务模块
 */
export const menuConfig: MenuItem[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    icon: 'DashboardOutlined',
    path: '/',
  },
  {
    key: 'advertising',
    label: '广告投放',
    icon: 'BulbOutlined',
    children: [
      {
        key: 'advertisers',
        label: '广告主管理',
        path: '/advertising/advertisers',
      },
      {
        key: 'advertising-plan',
        label: '广告计划',
        path: '/advertising/plan',
      },
      {
        key: 'campaign',
        label: '广告活动',
        path: '/advertising/campaign',
      },
    ],
  },
  // 暂时注释掉没有对应路由的菜单项
  // {
  //   key: 'attribution',
  //   label: '归因分析',
  //   icon: 'ShareAltOutlined',
  //   children: [
  //     {
  //       key: 'advertising-event',
  //       label: '广告事件',
  //       path: '/attribution/advertising-event',
  //     },
  //   ],
  // },
  {
    key: 'crowd',
    label: '人群管理',
    icon: 'TeamOutlined',
    children: [
      {
        key: 'crowd-manage',
        label: '人群管理',
        path: '/crowd/manage',
      },
    ],
  },
  // 暂时注释掉没有对应路由的菜单项
  // {
  //   key: 'programmatic',
  //   label: '程序化广告',
  //   icon: 'RobotOutlined',
  //   children: [
  //     {
  //       key: 'program-list',
  //       label: '程序列表',
  //       path: '/programmatic/program-list',
  //     },
  //   ],
  // },
  {
    key: 'dmp',
    label: 'DMP数据管理',
    icon: 'DatabaseOutlined',
    children: [
      {
        key: 'crowd-list',
        label: '人群列表',
        path: '/dmp/crowd-list',
      },
    ],
  },
  {
    key: 'analytics',
    label: '数据分析',
    icon: 'BarChartOutlined',
    children: [
      {
        key: 'flow-analysis',
        label: '流量分析',
        path: '/analytics/flow-analysis',
      },
    ],
  },
  {
    key: 'tools',
    label: '工具',
    icon: 'ToolOutlined',
    children: [
      {
        key: 'white-list',
        label: '白名单管理',
        path: '/tools/white-list',
      },
    ],
  },
];

/**
 * 将菜单配置转换为 Ant Design Menu 组件所需的格式
 * 根据 Ant Design 文档，确保格式完全符合 ItemType 要求
 */
export const convertToAntdMenuItems = (items: MenuItem[], getIcon?: (iconName?: string) => React.ReactNode): MenuProps['items'] => {
  return items.map((item) => {
    // 基础菜单项属性
    const baseItem = {
      key: item.key,
      label: item.label,
      icon: getIcon ? getIcon(item.icon) : undefined,
    };

    // 如果有子菜单，按照 SubMenuType 格式处理
    if (item.children && item.children.length > 0) {
      return {
        ...baseItem,
        children: convertToAntdMenuItems(item.children, getIcon),
        type: 'submenu' as const, // 明确指定为子菜单类型
      };
    }

    // 普通菜单项，按照 MenuItemType 格式处理
    return {
      ...baseItem,
      type: 'item' as const, // 明确指定为普通菜单项类型
    };
  });
};

/**
 * 获取所有菜单项的路径映射
 */
export const getMenuPathMap = (items: MenuItem[]): Record<string, MenuItem> => {
  const pathMap: Record<string, MenuItem> = {};
  
  const traverse = (menuItems: MenuItem[]) => {
    menuItems.forEach((item) => {
      if (item.path) {
        pathMap[item.path] = item;
      }
      if (item.children) {
        traverse(item.children);
      }
    });
  };
  
  traverse(items);
  return pathMap;
};

/**
 * 根据路径获取当前选中的菜单项
 */
export const getSelectedMenuKeys = (pathname: string, items: MenuItem[]): string[] => {
  const selectedKeys: string[] = [];
  
  const findSelectedKeys = (menuItems: MenuItem[]): boolean => {
    for (const item of menuItems) {
      if (item.path === pathname) {
        selectedKeys.push(item.key);
        return true;
      }
      
      if (item.children && findSelectedKeys(item.children)) {
        return true;
      }
    }
    return false;
  };
  
  findSelectedKeys(items);
  return selectedKeys;
};

/**
 * 获取展开的菜单项
 */
export const getOpenMenuKeys = (pathname: string, items: MenuItem[]): string[] => {
  const openKeys: string[] = [];
  
  const findOpenKeys = (menuItems: MenuItem[]): boolean => {
    for (const item of menuItems) {
      if (item.children) {
        // 检查当前路径是否在这个子菜单中
        const hasMatchingChild = item.children.some(child => {
          if (child.path === pathname) return true;
          if (child.children) return findOpenKeys(child.children);
          return false;
        });
        
        if (hasMatchingChild) {
          openKeys.push(item.key);
          return true;
        }
      }
    }
    return false;
  };
  
  findOpenKeys(items);
  return openKeys;
};