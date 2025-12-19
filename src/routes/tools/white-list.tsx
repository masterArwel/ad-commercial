import { createFileRoute } from '@tanstack/react-router';
import { WhiteListPage } from '@/pages/tools/white-list';

/**
 * 白名单管理路由定义
 */
export const Route = createFileRoute('/tools/white-list')({
  component: WhiteListPage,
});