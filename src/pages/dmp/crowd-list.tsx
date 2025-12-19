// DMP人群列表页面组件
import { Card, Table, Button, Space, Typography, Tag, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnProps } from 'antd/es/table';

const { Title } = Typography;

interface CrowdItem {
  id: string;
  name: string;
  description: string;
  size: number;
  tags: string[];
  status: 'active' | 'inactive';
  createTime: string;
  updateTime: string;
}

/**
 * 人群列表页面
 */
export function CrowdListPage() {
  // 模拟数据
  const dataSource: CrowdItem[] = [
    {
      id: '1',
      name: '高价值用户群',
      description: '近30天消费金额>1000元的用户',
      size: 125600,
      tags: ['高消费', '活跃用户', '忠实客户'],
      status: 'active',
      createTime: '2024-01-15',
      updateTime: '2024-01-20',
    },
    {
      id: '2',
      name: '潜在流失用户',
      description: '近60天未活跃的老用户',
      size: 89300,
      tags: ['流失风险', '老用户', '待激活'],
      status: 'active',
      createTime: '2024-01-10',
      updateTime: '2024-01-18',
    },
    {
      id: '3',
      name: '新用户群体',
      description: '注册时间<7天的新用户',
      size: 45200,
      tags: ['新用户', '待培养'],
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
      render: (size: number) => size.toLocaleString(),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags: string[]) => (
        <Space size={[0, 4]} wrap>
          {tags.map((tag) => (
            <Tag key={tag} color="blue">
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
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>人群列表</Title>
      </div>

      <Card
        title="DMP人群管理"
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
    </div>
  );
}

export default CrowdListPage;