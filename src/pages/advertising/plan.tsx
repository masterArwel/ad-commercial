// 广告计划页面组件
import { Card, Table, Button, Space, Typography, Tag, Progress } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import type { ColumnProps } from 'antd/es/table';

const { Title } = Typography;

interface PlanItem {
  id: string;
  name: string;
  advertiser: string;
  status: 'running' | 'paused' | 'completed';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
}

/**
 * 广告计划页面
 */
export function PlanPage() {
  // 模拟数据
  const dataSource: PlanItem[] = [
    {
      id: '1',
      name: '春节推广计划',
      advertiser: '哈啰出行',
      status: 'running',
      budget: 100000,
      spent: 45600,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
    },
    {
      id: '2',
      name: '品牌曝光计划',
      advertiser: '美团外卖',
      status: 'paused',
      budget: 80000,
      spent: 32000,
      startDate: '2024-01-10',
      endDate: '2024-02-10',
    },
    {
      id: '3',
      name: '用户拉新计划',
      advertiser: '滴滴出行',
      status: 'completed',
      budget: 50000,
      spent: 50000,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    },
  ];

  const columns: ColumnProps<PlanItem>[] = [
    {
      title: '计划名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '广告主',
      dataIndex: 'advertiser',
      key: 'advertiser',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
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
      title: '预算/消耗',
      key: 'budget',
      render: (_: any, record: PlanItem) => {
        const percentage = (record.spent / record.budget) * 100;
        return (
          <div>
            <div style={{ marginBottom: 4 }}>
              ¥{record.spent.toLocaleString()} / ¥{record.budget.toLocaleString()}
            </div>
            <Progress percent={Math.round(percentage)} size="small" />
          </div>
        );
      },
    },
    {
      title: '投放时间',
      key: 'dateRange',
      render: (_, record) => `${record.startDate} ~ ${record.endDate}`,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: PlanItem) => (
        <Space size="small">
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
          <Button size="small" danger type="link">
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleCreate = () => {
    console.log('创建广告计划');
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>广告计划</Title>
      </div>

      <Card
        title="计划列表"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建计划
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
    </div>
  );
}

export default PlanPage;