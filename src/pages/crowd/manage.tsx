// 人群管理页面组件
import { Card, Table, Button, Space, Typography, Tag, Tooltip, Progress } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnProps } from 'antd/es/table';
import PageTemplate from '@/components/PageTemplate';

interface CrowdItem {
  id: string;
  name: string;
  description: string;
  size: number;
  growth: number;
  accuracy: number;
  tags: string[];
  status: 'active' | 'inactive';
  createTime: string;
  updateTime: string;
}

/**
 * 人群管理页面
 */
export function CrowdManagePage() {
  // 模拟数据
  const dataSource: CrowdItem[] = [
    {
      id: '1',
      name: '高价值用户群',
      description: '近30天消费金额>1000元且活跃度高的用户群体',
      size: 125600,
      growth: 12.5,
      accuracy: 89.2,
      tags: ['高消费', '活跃用户', '忠实客户'],
      status: 'active',
      createTime: '2024-01-15',
      updateTime: '2024-01-20',
    },
    {
      id: '2',
      name: '潜在流失用户',
      description: '近60天活跃度下降，有流失风险的老用户',
      size: 89300,
      growth: -8.3,
      accuracy: 76.8,
      tags: ['流失风险', '老用户', '待激活'],
      status: 'active',
      createTime: '2024-01-10',
      updateTime: '2024-01-18',
    },
    {
      id: '3',
      name: '新用户群体',
      description: '注册时间<7天的新用户，需要重点培养',
      size: 45200,
      growth: 25.6,
      accuracy: 92.1,
      tags: ['新用户', '待培养', '高潜力'],
      status: 'inactive',
      createTime: '2024-01-05',
      updateTime: '2024-01-15',
    },
  ];

  const columns: ColumnProps<CrowdItem>[] = [
    {
      title: '人群名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (name: string) => (
        <Space>
          <UserOutlined />
          {name}
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: false,
      },
      render: (description: string) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
        </Tooltip>
      ),
    },
    {
      title: '人群规模',
      dataIndex: 'size',
      key: 'size',
      width: 120,
      render: (size: number) => (
        <div>
          <div>{size.toLocaleString()}</div>
          <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
            人
          </Typography.Text>
        </div>
      ),
    },
    {
      title: '增长率',
      dataIndex: 'growth',
      key: 'growth',
      width: 100,
      render: (growth: number) => (
        <Tag color={growth > 0 ? 'green' : 'red'}>
          {growth > 0 ? '+' : ''}{growth}%
        </Tag>
      ),
    },
    {
      title: '准确度',
      dataIndex: 'accuracy',
      key: 'accuracy',
      width: 120,
      render: (accuracy: number) => (
        <div>
          <Progress 
            percent={accuracy} 
            size="small" 
            format={(percent) => `${percent}%`}
            strokeColor={accuracy > 85 ? '#52c41a' : accuracy > 70 ? '#faad14' : '#f5222d'}
          />
        </div>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags: string[]) => (
        <Space size={[0, 4]} wrap>
          {tags.map((tag) => (
            <Tag key={tag} color="blue" style={{ fontSize: '12px' }}>
              {tag}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: CrowdItem) => (
        <Space size="small">
          <Button size="small" icon={<EyeOutlined />}>
            查看
          </Button>
          <Button size="small" icon={<EditOutlined />}>
            编辑
          </Button>
          <Button size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleCreate = () => {
    console.log('创建人群');
  };

  return (
    <PageTemplate 
      title="人群管理" 
      description="创建和管理用户人群，用于精准广告投放"
    >
      <Card
        title="人群列表"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建人群
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

export default CrowdManagePage;