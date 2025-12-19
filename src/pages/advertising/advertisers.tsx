import { Card, Table, Button, Space, Typography, Tag } from 'antd';
import { PlusOutlined, } from '@ant-design/icons';
import type { ColumnProps } from 'antd/es/table';
import { useNavigate } from '@tanstack/react-router';

const { Title } = Typography;

interface AdvertiserItem {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  createTime: string;
  contactPerson: string;
  phone: string;
}

/**
 * 广告主管理页面
 */
export function AdvertisersPage() {
  const navigate = useNavigate();
  // 模拟数据
  const dataSource: AdvertiserItem[] = [
    {
      id: '1',
      name: '哈啰出行',
      status: 'active',
      createTime: '2024-01-15',
      contactPerson: '张三',
      phone: '13800138000',
    },
    {
      id: '2',
      name: '美团外卖',
      status: 'active',
      createTime: '2024-01-10',
      contactPerson: '李四',
      phone: '13800138001',
    },
    {
      id: '3',
      name: '滴滴出行',
      status: 'inactive',
      createTime: '2024-01-05',
      contactPerson: '王五',
      phone: '13800138002',
    },
  ];

  const columns: ColumnProps<AdvertiserItem>[] = [
    {
      title: '广告主名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: AdvertiserItem) => (
        <Space size="small">
          <Button size="small" type='link'>
            编辑
          </Button>
          <Button size="small" type="link" onClick={handleCreateActivity}>创建广告活动</Button>
          <Button size="small" danger type="link">
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleCreate = () => {
    console.log('创建广告主');
  };

  const handleCreateActivity = () => {
    console.log('创建广告活动');
    navigate({ to: '/advertising/campaign' });
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>广告主管理</Title>
      </div>

      <Card
        title="广告主列表"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建广告主
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

export default AdvertisersPage;