import { createFileRoute } from '@tanstack/react-router';
import { CrowdListPage } from '@/pages/dmp/crowd-list';

/**
 * DMP人群列表路由定义
 */
export const Route = createFileRoute('/dmp/crowd-list')({
  component: CrowdListPage,
});