// 广告活动页面组件
import { Button, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import ListPage from '@/components/ListPage';
import { FormOptions } from '@/components/ListPage/interface';

import { campaignData } from '@/bffData/campaign';

interface CampaignItem {
  id: string;
  name: string;
  plan: string;
  status: 'running' | 'paused' | 'completed';
  impressions: number;
  clicks: number;
  ctr: number;
  cost: number;
  startDate: string;
  endDate: string;
}

/**
 * 广告活动页面
 */
export function CampaignPage() {
  const navigate = useNavigate();

  const columns = [
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '所属计划',
      dataIndex: 'plan',
      key: 'plan',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          running: { color: 'green', text: '投放中' },
          paused: { color: 'orange', text: '已暂停' },
          completed: { color: 'blue', text: '已完成' },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '曝光量',
      dataIndex: 'impressions',
      key: 'impressions',
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '点击量',
      dataIndex: 'clicks',
      key: 'clicks',
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '点击率',
      dataIndex: 'ctr',
      key: 'ctr',
      render: (value: number) => `${value}%`,
    },
    {
      title: '消耗',
      dataIndex: 'cost',
      key: 'cost',
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: CampaignItem) => (
        <Space size="small">
          <Button size="small" type="link">
            查看
          </Button>
          <Button size="small" type="link" onClick={handleCreatePlan}>创建广告计划</Button>
          {record.status === 'running' ? (
            <Button size="small" type="link">
              暂停
            </Button>
          ) : (
            <Button size="small" type="link">
              启动
            </Button>
          )}
          <Button size="small" type="link">
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  const searchFormOptions: FormOptions[] = [
    {
      label: '活动名称',
      fieldName: 'name',
      type: 'Input',
    },
    {
      label: '活动ID',
      fieldName: 'campaignId',
      type: 'Input',
    },
    {
      label: '活动类型',
      fieldName: 'campaignType',
      type: 'Select',
      options: [
        { label: '品牌推广', value: 'brand' },
        { label: '效果推广', value: 'effect' },
        { label: '程序化购买', value: 'programmatic' },
      ],
    },
    {
      label: '活动状态',
      fieldName: 'campaignStatus',
      type: 'Select',
      options: [
        { label: '投放中', value: 'running' },
        { label: '已暂停', value: 'paused' },
        { label: '已完成', value: 'completed' },
      ],
    },
  ];

  const queryFn = () => {
    return Promise.resolve({
      data: campaignData,
      total: campaignData.length,
    });
  };

  const handleCreate = () => {
    console.log('创建广告活动');
  };

  const handleCreatePlan = () => {
    console.log('创建广告计划');
    navigate({ to: '/advertising/plan' });
  };

  return (
    <ListPage
      columns={columns}
      queryFn={queryFn}
      formOptions={searchFormOptions}
      operation={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新建广告活动
        </Button>
      }
    />
  );
}

export default CampaignPage;