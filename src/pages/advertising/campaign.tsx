// 广告活动页面组件
import { Card, Table, Button, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, PlayCircleOutlined, PauseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnProps } from 'antd/es/table';
import PageTemplate from '@/components/PageTemplate';

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
  // 模拟数据
  const dataSource: CampaignItem[] = [
    {
      id: '1',
      name: '春节首页banner',
      plan: '春节推广计划',
      status: 'running',
      impressions: 125600,
      clicks: 3200,
      ctr: 2.55,
      cost: 15600,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
    },
    {
      id: '2',
      name: '品牌视频广告',
      plan: '品牌曝光计划',
      status: 'paused',
      impressions: 89300,
      clicks: 1800,
      ctr: 2.01,
      cost: 12000,
      startDate: '2024-01-10',
      endDate: '2024-02-10',
    },
    {
      id: '3',
      name: '新用户注册引导',
      plan: '用户拉新计划',
      status: 'completed',
      impressions: 200000,
      clicks: 8500,
      ctr: 4.25,
      cost: 25000,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    },
  ];

  const columns: ColumnProps<CampaignItem>[] = [
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
          <Button size="small" icon={<EyeOutlined />}>
            查看
          </Button>
          {record.status === 'running' ? (
            <Button size="small" icon={<PauseCircleOutlined />}>
              暂停
            </Button>
          ) : (
            <Button size="small" icon={<PlayCircleOutlined />}>
              启动
            </Button>
          )}
          <Button size="small" icon={<EditOutlined />}>
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  const handleCreate = () => {
    console.log('创建广告活动');
  };

  return (
    <PageTemplate 
      title="广告活动" 
      description="管理和监控广告活动的投放效果"
    >
      <Card
        title="活动列表"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建活动
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          pagination={{
            total: dataSource.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </PageTemplate>
  );
}

export default CampaignPage;