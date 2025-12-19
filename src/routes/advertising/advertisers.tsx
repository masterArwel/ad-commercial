import { createFileRoute } from '@tanstack/react-router';
import { AdvertisersPage } from '@/pages/advertising/advertisers';

/**
 * 广告主管理路由定义
 */
export const Route = createFileRoute('/advertising/advertisers')({
  component: AdvertisersPage,
});