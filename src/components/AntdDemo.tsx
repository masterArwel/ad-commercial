import React, { useState } from 'react';
import {
  Button,
  Card,
  Space,
  Typography,
  Divider,
  Input,
  DatePicker,
  Select,
  Table,
  Tag,
  message,
  Modal,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Paragraph } = Typography;
const { Option } = Select;

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

/**
 * Ant Design 组件演示
 * 展示常用组件的使用方法
 */
const AntdDemo: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [modalOpen, setModalOpen] = useState(false);

  // 表格数据
  const dataSource: DataType[] = [
    {
      key: '1',
      name: '张三',
      age: 32,
      address: '北京市朝阳区',
      tags: ['开发者', 'React'],
    },
    {
      key: '2',
      name: '李四',
      age: 28,
      address: '上海市浦东新区',
      tags: ['设计师', 'UI/UX'],
    },
    {
      key: '3',
      name: '王五',
      age: 35,
      address: '广州市天河区',
      tags: ['产品经理'],
    },
  ];

  // 表格列定义
  const columns: ColumnsType<DataType> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '标签',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags: string[]) => (
        <>
          {tags.map((tag) => {
            const color = tag === '开发者' ? 'geekblue' : tag === '设计师' ? 'green' : 'volcano';
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 处理编辑
  const handleEdit = (record: DataType) => {
    messageApi.info(`编辑用户: ${record.name}`);
  };

  // 处理删除
  const handleDelete = (record: DataType) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除用户 ${record.name} 吗？`,
      onOk() {
        messageApi.success(`已删除用户: ${record.name}`);
      },
    });
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    messageApi.info(`搜索: ${value}`);
  };

  return (
    <div style={{ padding: '24px' }}>
      {contextHolder}
      
      <Title level={2}>Ant Design 组件演示</Title>
      <Paragraph>
        这是一个 Ant Design 组件库的演示页面，展示了常用组件的使用方法。
      </Paragraph>

      <Divider />

      {/* 按钮组件 */}
      <Card title="按钮组件" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Button type="primary">主要按钮</Button>
          <Button>默认按钮</Button>
          <Button type="dashed">虚线按钮</Button>
          <Button type="text">文本按钮</Button>
          <Button type="link">链接按钮</Button>
          <Button type="primary" danger>
            危险按钮
          </Button>
          <Button type="primary" icon={<PlusOutlined />}>
            带图标按钮
          </Button>
          <Button loading>加载中</Button>
        </Space>
      </Card>

      {/* 表单组件 */}
      <Card title="表单组件" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space wrap>
            <Input placeholder="请输入内容" style={{ width: 200 }} />
            <Input.Search
              placeholder="搜索内容"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              style={{ width: 200 }}
            />
            <DatePicker placeholder="选择日期" />
            <Select defaultValue="option1" style={{ width: 120 }}>
              <Option value="option1">选项1</Option>
              <Option value="option2">选项2</Option>
              <Option value="option3">选项3</Option>
            </Select>
          </Space>
        </Space>
      </Card>

      {/* 数据展示组件 */}
      <Card title="数据表格" style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
          >
            新增用户
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{
            total: dataSource.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
          }}
        />
      </Card>

      {/* 弹窗组件 */}
      <Modal
        title="新增用户"
        open={modalOpen}
        onOk={() => {
          messageApi.success('用户创建成功！');
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input placeholder="请输入姓名" />
          <Input placeholder="请输入年龄" />
          <Input placeholder="请输入地址" />
          <Select placeholder="请选择标签" style={{ width: '100%' }}>
            <Option value="developer">开发者</Option>
            <Option value="designer">设计师</Option>
            <Option value="pm">产品经理</Option>
          </Select>
        </Space>
      </Modal>
    </div>
  );
};

export default AntdDemo;
