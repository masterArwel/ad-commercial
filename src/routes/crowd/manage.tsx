import { createFileRoute } from '@tanstack/react-router';
import { CrowdManagePage } from '@/pages/crowd/manage';

/**
 * 人群管理路由定义
 */
export const Route = createFileRoute('/crowd/manage')({
  component: CrowdManagePage,
});