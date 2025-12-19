import { createFileRoute } from '@tanstack/react-router';
import { AdvertisingPage } from '@/pages/advertising';

/**
 * 广告投放模块路由定义
 */
export const Route = createFileRoute('/advertising/')({
  component: AdvertisingPage,
});