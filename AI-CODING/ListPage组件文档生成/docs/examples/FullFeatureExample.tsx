/**
 * ListPage 完整功能示例
 * 
 * 这个示例展示了 ListPage 组件的完整功能：
 * - 搜索表单配置
 * - 复杂的表格列定义
 * - 操作区域配置
 * - 自定义分页设置
 */

import React from 'react';
import { Button, Space, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ListPage from '@/components/ListPage';
import type { ColumnsType } from 'antd/es/table';
import type { FormOptions } from '@/components/ListPage/interface';

// 定义数据类型
interface FullFeatureDataItem {
  id: string /** 数据ID */;
  name: string /** 名称 */;
  status: 'active' | 'inactive' /** 状态 */;
  type: string /** 类型 */;
  createTime: string /** 创建时间 */;
  updateTime: string /** 更新时间 */;
  description?: string /** 描述 */;
}

// 定义查询参数类型
interface QueryParams {
  name?: string;
  status?: string;
  type?: string;
  createTimeStartTime?: string;
  createTimeEndTime?: string;
  pageIndex?: number;
  pageSize?: number;
}

export function FullFeatureExample() {
  // 定义表格列
  const columns: ColumnsType<FullFeatureDataItem> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record: FullFeatureDataItem) => (
        <Space size="small">
          <Button 
            size="small" 
            type="link" 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            size="small" 
            type="link" 
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button 
            size="small" 
            danger 
            type="link" 
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 定义搜索表单配置
  const formOptions: FormOptions[] = [
    {
      label: '名称',
      fieldName: 'name',
      type: 'Input',
      placeholder: '请输入名称',
      colProps: { span: 8 },
    },
    {
      label: '状态',
      fieldName: 'status',
      type: 'Select',
      placeholder: '请选择状态',
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' },
      ],
      colProps: { span: 8 },
    },
    {
      label: '类型',
      fieldName: 'type',
      type: 'Select',
      placeholder: '请选择类型',
      options: [
        { label: '类型A', value: 'typeA' },
        { label: '类型B', value: 'typeB' },
        { label: '类型C', value: 'typeC' },
      ],
      colProps: { span: 8 },
    },
    {
      label: '创建时间',
      fieldName: 'createTime',
      type: 'DatePicker',
      colProps: { span: 12 },
    },
  ];

  // 定义查询函数
  const queryFn = async (params?: QueryParams) => {
    console.log('查询参数:', params);
    
    // 模拟 API 调用
    return new Promise<{
      data: FullFeatureDataItem[];
      recordsCount: number;
      page: number;
      pageSize: number;
    }>((resolve) => {
      setTimeout(() => {
        // 模拟数据
        const mockData: FullFeatureDataItem[] = Array.from({ length: 25 }, (_, index) => ({
          id: `${index + 1}`,
          name: `示例数据${index + 1}`,
          status: index % 2 === 0 ? 'active' : 'inactive',
          type: `类型${String.fromCharCode(65 + (index % 3))}`,
          createTime: `2024-01-${String(15 - index % 15).padStart(2, '0')} 10:30:00`,
          updateTime: `2024-01-${String(16 - index % 15).padStart(2, '0')} 15:20:00`,
          description: `这是示例数据${index + 1}的详细描述信息，用于演示表格的显示效果。`,
        }));

        // 模拟分页
        const pageIndex = params?.pageIndex || 1;
        const pageSize = params?.pageSize || 10;
        const startIndex = (pageIndex - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const pageData = mockData.slice(startIndex, endIndex);

        resolve({
          data: pageData,
          recordsCount: mockData.length,
          page: pageIndex,
          pageSize: pageSize,
        });
      }, 800); // 模拟网络延迟
    });
  };

  // 操作函数
  const handleCreate = () => {
    message.info('点击了新建按钮');
  };

  const handleEdit = (record: FullFeatureDataItem) => {
    message.info(`编辑: ${record.name}`);
  };

  const handleView = (record: FullFeatureDataItem) => {
    message.info(`查看: ${record.name}`);
  };

  const handleDelete = (record: FullFeatureDataItem) => {
    message.warning(`删除: ${record.name}`);
  };

  const handleBatchDelete = () => {
    message.warning('批量删除功能');
  };

  return (
    <div>
      <h2>完整功能示例</h2>
      <ListPage<FullFeatureDataItem, QueryParams>
        columns={columns}
        queryFn={queryFn}
        formOptions={formOptions}
        defaultQueryData={{ status: 'active' }}
        operation={
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleCreate}
            >
              新建
            </Button>
            <Button onClick={handleBatchDelete}>
              批量删除
            </Button>
          </Space>
        }
        pagination={{
          showTotal: true,
          pageSize: 10,
          totalField: 'recordsCount',
          pageField: 'page',
          pageSizeField: 'pageSize',
        }}
        tableProps={{
          scroll: { x: 1200 },
          size: 'middle',
        }}
        emptyText="暂无相关数据"
      />
    </div>
  );
}

export default FullFeatureExample;
