import { createFileRoute } from '@tanstack/react-router';
import { DashboardPage } from '@/pages/dashboard/dashboard';

/**
 * 首页路由定义
 */
export const Route = createFileRoute('/')({
  component: DashboardPage,
});