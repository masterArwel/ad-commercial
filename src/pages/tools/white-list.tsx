// 白名单管理页面组件
import { Card, Table, Button, Input, Select, Form } from 'antd';
import { PlusOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnProps } from 'antd/es/table';
import PageTemplate from '@/components/PageTemplate';

const { Option } = Select;

interface WhiteListItem {
  id: string;
  domain: string;
  type: 'domain' | 'ip' | 'user';
  description: string;
  createTime: string;
  creator: string;
}

/**
 * 白名单管理页面
 */
export function WhiteListPage() {
  // 模拟数据
  const dataSource: WhiteListItem[] = [
    {
      id: '1',
      domain: 'hellobike.com',
      type: 'domain',
      description: '官方域名，用于广告投放',
      createTime: '2024-01-15',
      creator: '管理员',
    },
    {
      id: '2',
      domain: '192.168.1.100',
      type: 'ip',
      description: '内网测试服务器',
      createTime: '2024-01-10',
      creator: '张三',
    },
    {
      id: '3',
      domain: 'test@hellobike.com',
      type: 'user',
      description: '测试账号',
      createTime: '2024-01-05',
      creator: '李四',
    },
  ];

  const columns: ColumnProps<WhiteListItem>[] = [
    {
      title: '白名单内容',
      dataIndex: 'domain',
      key: 'domain',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          domain: '域名',
          ip: 'IP地址',
          user: '用户',
        };
        return typeMap[type as keyof typeof typeMap];
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: WhiteListItem) => (
        <Button size="small" danger icon={<DeleteOutlined />}>
          删除
        </Button>
      ),
    },
  ];

  const handleSearch = (values: any) => {
    console.log('搜索条件:', values);
  };

  const handleCreate = () => {
    console.log('新建白名单');
  };

  return (
    <PageTemplate 
      title="白名单管理" 
      description="管理系统访问白名单，包括域名、IP地址和用户白名单"
    >
      <Card style={{ marginBottom: 16 }}>
        <Form layout="inline" onFinish={handleSearch}>
          <Form.Item name="keyword">
            <Input placeholder="请输入搜索关键词" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="type">
            <Select placeholder="选择类型" style={{ width: 120 }} allowClear>
              <Option value="domain">域名</Option>
              <Option value="ip">IP地址</Option>
              <Option value="user">用户</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              搜索
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card
        title="白名单列表"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建白名单
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

export default WhiteListPage;