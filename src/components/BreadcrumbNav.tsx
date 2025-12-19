import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useRouterState, Link } from '@tanstack/react-router';
import { menuConfig, getMenuPathMap } from '@/config/menuConfig';
import { useMemo } from 'react';

/**
 * 面包屑导航组件
 */
export const BreadcrumbNav: React.FC = () => {
  const routerState = useRouterState();
  const location = { pathname: routerState.location.pathname };
  const pathMap = useMemo(() => getMenuPathMap(menuConfig), []);

  // 生成面包屑项目
  const breadcrumbItems = useMemo(() => {
    const items = [
      {
        title: (
          <Link to="/">
            <HomeOutlined style={{ marginRight: 4 }} />
            首页
          </Link>
        ),
      },
    ];

    // 查找当前路径对应的菜单项
    const currentMenuItem = pathMap[location.pathname];
    if (currentMenuItem) {
      // 查找父级菜单
      const findParentPath = (targetPath: string): string[] => {
        const pathSegments = targetPath.split('/').filter(Boolean);
        const paths: string[] = [];
        
        // 根据路径层级查找菜单项
        for (let i = 1; i <= pathSegments.length; i++) {
          const currentPath = '/' + pathSegments.slice(0, i).join('/');
          const menuItem = pathMap[currentPath];
          if (menuItem) {
            paths.push(currentPath);
          }
        }
        
        return paths;
      };

      const parentPaths = findParentPath(location.pathname);
      
      // 添加父级面包屑
      parentPaths.forEach((path) => {
        const menuItem = pathMap[path];
        if (menuItem && path !== location.pathname) {
          items.push({
            title: <Link to={path}>{menuItem.label}</Link>,
          });
        }
      });

      // 添加当前页面（不可点击）
      if (currentMenuItem) {
        items.push({
          title: <span>{currentMenuItem.label}</span>,
        });
      }
    }

    return items;
  }, [location.pathname, pathMap]);

  // 如果只有首页，不显示面包屑
  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <Breadcrumb 
      items={breadcrumbItems}
      style={{ 
        marginBottom: 16,
        padding: '8px 0',
      }}
    />
  );
};

export default BreadcrumbNav;