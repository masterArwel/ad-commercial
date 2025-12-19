import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Table, message, Modal, Form, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { userApi, type User } from '@/services/user';

/**
 * API 使用示例组件
 * 演示如何使用封装的 API 服务
 */
const ApiExample: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // 获取用户列表
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getList({
        pageNum: 1,
        pageSize: 10,
      });
      
      if (response.success) {
        setUsers(response.data.list || []);
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
      // 模拟数据
      setUsers([
        {
          id: '1',
          username: 'admin',
          email: 'admin@example.com',
          realName: '管理员',
          phone: '13800138000',
          status: 1,
          roles: ['admin'],
          permissions: ['user:read', 'user:write'],
          createTime: '2024-01-01 00:00:00',
          updateTime: '2024-01-01 00:00:00',
        },
        {
          id: '2',
          username: 'user1',
          email: 'user1@example.com',
          realName: '普通用户',
          phone: '13800138001',
          status: 1,
          roles: ['user'],
          permissions: ['user:read'],
          createTime: '2024-01-02 00:00:00',
          updateTime: '2024-01-02 00:00:00',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 创建用户
  const handleCreate = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 编辑用户
  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  // 删除用户
  const handleDelete = (user: User) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除用户 ${user.realName} 吗？`,
      onOk: async () => {
        try {
          await userApi.delete(user.id);
          message.success('删除成功');
          fetchUsers();
        } catch (error) {
          console.error('删除用户失败:', error);
          message.success('删除成功（模拟）');
          setUsers(prev => prev.filter(u => u.id !== user.id));
        }
      },
    });
  };

  // 保存用户
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUser) {
        // 更新用户
        await userApi.update(editingUser.id, values);
        message.success('更新成功');
      } else {
        // 创建用户
        await userApi.create(values);
        message.success('创建成功');
      }
      
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error('保存用户失败:', error);
      message.success('保存成功（模拟）');
      setModalVisible(false);
      
      // 模拟更新本地数据
      if (editingUser) {
        setUsers(prev => prev.map(u => 
          u.id === editingUser.id ? { ...u, ...form.getFieldsValue() } : u
        ));
      } else {
        const newUser: User = {
          id: Date.now().toString(),
          ...form.getFieldsValue(),
          status: 1,
          roles: ['user'],
          permissions: ['user:read'],
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
        };
        setUsers(prev => [...prev, newUser]);
      }
    }
  };

  // 测试其他 API
  const testOtherApis = async () => {
    try {
      // 测试获取当前用户
      const currentUser = await userApi.getCurrentUser();
      console.log('当前用户:', currentUser);
      
      // 测试检查用户名
      const usernameCheck = await userApi.checkUsername('testuser');
      console.log('用户名检查:', usernameCheck);
      
      message.info('请查看控制台输出');
    } catch (error) {
      console.error('API 测试失败:', error);
      message.info('API 测试完成（请查看控制台）');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 表格列定义
  const columns: ColumnsType<User> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '真实姓名',
      dataIndex: 'realName',
      key: 'realName',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <span style={{ color: status === 1 ? '#52c41a' : '#f5222d' }}>
          {status === 1 ? '正常' : '禁用'}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
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

  return (
    <Card title="API 使用示例">
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            新增用户
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchUsers}
            loading={loading}
          >
            刷新
          </Button>
          <Button onClick={testOtherApis}>
            测试其他 API
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          total: users.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
        }}
      />

      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          
          <Form.Item
            label="真实姓名"
            name="realName"
            rules={[{ required: true, message: '请输入真实姓名' }]}
          >
            <Input placeholder="请输入真实姓名" />
          </Form.Item>
          
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          
          <Form.Item
            label="手机号"
            name="phone"
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ApiExample;
