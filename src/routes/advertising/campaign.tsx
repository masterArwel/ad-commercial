import { createFileRoute } from '@tanstack/react-router';
import { CampaignPage } from '@/pages/advertising/campaign';

/**
 * 广告活动路由定义
 */
export const Route = createFileRoute('/advertising/campaign')({
  component: CampaignPage,
});