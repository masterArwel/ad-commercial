import { createFileRoute } from '@tanstack/react-router';
import { FlowAnalysisPage } from '@/pages/analytics/flow-analysis';

/**
 * 流量分析路由定义
 */
export const Route = createFileRoute('/analytics/flow-analysis')({
  component: FlowAnalysisPage,
});