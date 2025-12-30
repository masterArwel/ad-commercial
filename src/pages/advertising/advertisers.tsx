import { Button, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useNavigate } from '@tanstack/react-router';
import ListPage from '@/components/ListPage';
import type { ColumnsType } from 'antd/es/table';
import type { FormOptions } from '@/components/ListPage/interface';

import { advertisersData } from '@/bffData/advertising';

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

  const columns = [
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

  const searchFormOptions: FormOptions[] = [
    {
      label: '广告主名称',
      fieldName: 'name',
      type: 'Input',
    },
    {
      label: '状态',
      fieldName: 'status',
      type: 'Select',
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' },
      ],
    },
  ];

  const queryFn = () => {
    return Promise.resolve({
      data: advertisersData,
      total: advertisersData.length,
    });
  };

  const handleCreate = () => {
    console.log('创建广告主');
  };

  const handleSearch = () => {
    console.log('搜索');
  };

  const handleReset = () => {
    console.log('重置');
  };

  const handleCreateActivity = () => {
    console.log('创建广告活动');
    navigate({ to: '/advertising/campaign' });
  };

  return (
    <div>
      <ListPage
        columns={columns}
        queryFn={queryFn}
        formOptions={searchFormOptions}
        operation={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建广告主
          </Button>
        }
      />
    </div>
  );
}

export default AdvertisersPage;