import { useMemo } from 'react';
// import { useAppStore } from '@/stores';

/**
 * 权限枚举
 */
export enum Permission {
  // 仪表盘
  DASHBOARD_VIEW = 'dashboard:view',
  
  // 广告投放
  ADVERTISING_VIEW = 'advertising:view',
  ADVERTISING_ADVERTISERS = 'advertising:advertisers',
  ADVERTISING_PLAN = 'advertising:plan',
  ADVERTISING_CAMPAIGN = 'advertising:campaign',
  ADVERTISING_AGENT_CHANNEL = 'advertising:agent-channel',
  ADVERTISING_DATA_REPORT = 'advertising:data-report',
  
  // 归因分析
  ATTRIBUTION_VIEW = 'attribution:view',
  ATTRIBUTION_EVENT = 'attribution:event',
  
  // 人群管理
  CROWD_VIEW = 'crowd:view',
  CROWD_MANAGE = 'crowd:manage',
  
  // 程序化广告
  PROGRAMMATIC_VIEW = 'programmatic:view',
  PROGRAMMATIC_PROGRAM_LIST = 'programmatic:program-list',
  PROGRAMMATIC_PROGRAM_DETAIL = 'programmatic:program-detail',
  PROGRAMMATIC_CODE_LIST = 'programmatic:code-list',
  PROGRAMMATIC_CODE_MANAGE = 'programmatic:code-manage',
  
  // 资源管理
  RESOURCE_VIEW = 'resource:view',
  RESOURCE_PLACE = 'resource:place',
  RESOURCE_POSITIONS = 'resource:positions',
  RESOURCE_TEMPLATE = 'resource:template',
  
  // DMP数据管理
  DMP_VIEW = 'dmp:view',
  DMP_CROWD_LIST = 'dmp:crowd-list',
  DMP_TAG_PLAZA = 'dmp:tag-plaza',
  DMP_CROWD_INSIGHTS = 'dmp:crowd-insights',
  
  // 运营配置
  OPERATION_VIEW = 'operation:view',
  OPERATION_PDB_PRIORITY = 'operation:pdb-priority',
  
  // 数据分析
  ANALYTICS_VIEW = 'analytics:view',
  ANALYTICS_FLOW_ANALYSIS = 'analytics:flow-analysis',
  
  // 工具
  TOOLS_VIEW = 'tools:view',
  TOOLS_WHITE_LIST = 'tools:white-list',
}

/**
 * 路径与权限的映射关系
 */
export const PATH_PERMISSION_MAP: Record<string, Permission> = {
  '/': Permission.DASHBOARD_VIEW,
  '/advertising/advertisers': Permission.ADVERTISING_ADVERTISERS,
  '/advertising/plan': Permission.ADVERTISING_PLAN,
  '/advertising/campaign': Permission.ADVERTISING_CAMPAIGN,
  '/advertising/agent-channel': Permission.ADVERTISING_AGENT_CHANNEL,
  '/advertising/data-report': Permission.ADVERTISING_DATA_REPORT,
  '/attribution/advertising-event': Permission.ATTRIBUTION_EVENT,
  '/crowd/manage': Permission.CROWD_MANAGE,
  '/programmatic/program-list': Permission.PROGRAMMATIC_PROGRAM_LIST,
  '/programmatic/program-detail': Permission.PROGRAMMATIC_PROGRAM_DETAIL,
  '/programmatic/code-list': Permission.PROGRAMMATIC_CODE_LIST,
  '/programmatic/code-manage': Permission.PROGRAMMATIC_CODE_MANAGE,
  '/resource/resource-place': Permission.RESOURCE_PLACE,
  '/resource/positions': Permission.RESOURCE_POSITIONS,
  '/resource/template-ins': Permission.RESOURCE_TEMPLATE,
  '/dmp/crowd-list': Permission.DMP_CROWD_LIST,
  '/dmp/tag-plaza': Permission.DMP_TAG_PLAZA,
  '/dmp/crowd-insights': Permission.DMP_CROWD_INSIGHTS,
  '/operation/pdb-priority': Permission.OPERATION_PDB_PRIORITY,
  '/analytics/flow-analysis': Permission.ANALYTICS_FLOW_ANALYSIS,
  '/tools/white-list': Permission.TOOLS_WHITE_LIST,
};

/**
 * 权限管理 Hook
 */
export const usePermissions = () => {
  // TODO: 从全局状态获取用户权限
  // const userPermissions = useAppStore((state) => state.userInfo?.permissions || []);
  
  // 模拟用户权限（开发阶段）
  const userPermissions = useMemo(() => [
    Permission.DASHBOARD_VIEW,
    Permission.ADVERTISING_VIEW,
    Permission.ADVERTISING_ADVERTISERS,
    Permission.ADVERTISING_PLAN,
    Permission.ADVERTISING_CAMPAIGN,
    Permission.ATTRIBUTION_VIEW,
    Permission.ATTRIBUTION_EVENT,
    Permission.CROWD_VIEW,
    Permission.CROWD_MANAGE,
    Permission.DMP_VIEW,
    Permission.DMP_CROWD_LIST,
    Permission.ANALYTICS_VIEW,
    Permission.ANALYTICS_FLOW_ANALYSIS,
    Permission.TOOLS_VIEW,
    Permission.TOOLS_WHITE_LIST,
  ], []);

  /**
   * 检查是否有指定权限
   */
  const hasPermission = (permission: Permission): boolean => {
    return userPermissions.includes(permission);
  };

  /**
   * 检查是否有任意一个权限
   */
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  /**
   * 检查是否有所有权限
   */
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  /**
   * 检查路径权限
   */
  const hasPathPermission = (path: string): boolean => {
    const permission = PATH_PERMISSION_MAP[path];
    return permission ? hasPermission(permission) : true; // 默认允许访问
  };

  /**
   * 过滤有权限的菜单项
   */
  const filterMenuByPermission = <T extends { path?: string; children?: T[] }>(
    menuItems: T[]
  ): T[] => {
    return menuItems.filter(item => {
      // 检查当前项权限
      const hasCurrentPermission = item.path ? hasPathPermission(item.path) : true;
      
      // 如果有子菜单，递归过滤
      if (item.children) {
        const filteredChildren = filterMenuByPermission(item.children);
        // 如果子菜单被过滤后为空，且当前项没有路径，则隐藏整个菜单项
        if (filteredChildren.length === 0 && !item.path) {
          return false;
        }
        // 更新子菜单
        (item as any).children = filteredChildren;
      }
      
      return hasCurrentPermission;
    });
  };

  return {
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasPathPermission,
    filterMenuByPermission,
  };
};

export default usePermissions;