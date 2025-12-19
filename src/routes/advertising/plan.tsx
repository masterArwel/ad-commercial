import { createFileRoute } from '@tanstack/react-router';
import { PlanPage } from '@/pages/advertising/plan';

/**
 * 广告计划路由定义
 */
export const Route = createFileRoute('/advertising/plan')({
  component: PlanPage,
});