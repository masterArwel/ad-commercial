/**
 * ListPage 自定义表单项示例
 * 
 * 这个示例展示了如何使用自定义表单项：
 * - Custom 类型表单项的使用
 * - 复杂组件的集成
 * - 自定义表单验证
 */

import React, { useState } from 'react';
import { 
  TreeSelect, 
  Slider, 
  Rate, 
  ColorPicker, 
  Button, 
  Space, 
  Tag,
  InputNumber 
} from 'antd';
import ListPage from '@/components/ListPage';
import type { ColumnsType } from 'antd/es/table';
import type { FormOptions } from '@/components/ListPage/interface';

// 定义数据类型
interface CustomDataItem {
  id: string /** 数据ID */;
  name: string /** 名称 */;
  department: string /** 部门 */;
  level: number /** 等级 */;
  rating: number /** 评分 */;
  color: string /** 颜色 */;
  salary: number /** 薪资 */;
  tags: string[] /** 标签 */;
}

// 定义查询参数类型
interface CustomQueryParams {
  name?: string;
  department?: string;
  levelRange?: [number, number];
  minRating?: number;
  color?: string;
  salaryRange?: [number, number];
  pageIndex?: number;
  pageSize?: number;
}

export function CustomFormExample() {
  const [refreshKey, setRefreshKey] = useState(0);

  // 部门树形数据
  const departmentTreeData = [
    {
      title: '技术部',
      value: 'tech',
      children: [
        { title: '前端组', value: 'frontend' },
        { title: '后端组', value: 'backend' },
        { title: '移动端组', value: 'mobile' },
      ],
    },
    {
      title: '产品部',
      value: 'product',
      children: [
        { title: '产品设计', value: 'design' },
        { title: '用户研究', value: 'research' },
      ],
    },
    {
      title: '运营部',
      value: 'operation',
      children: [
        { title: '市场运营', value: 'marketing' },
        { title: '用户运营', value: 'user-ops' },
      ],
    },
  ];

  // 定义表格列
  const columns: ColumnsType<CustomDataItem> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 120,
      render: (dept: string) => {
        const deptMap: Record<string, string> = {
          frontend: '前端组',
          backend: '后端组',
          mobile: '移动端组',
          design: '产品设计',
          research: '用户研究',
          marketing: '市场运营',
          'user-ops': '用户运营',
        };
        return deptMap[dept] || dept;
      },
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: number) => `L${level}`,
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      render: (rating: number) => <Rate disabled value={rating} />,
    },
    {
      title: '主题色',
      dataIndex: 'color',
      key: 'color',
      width: 100,
      render: (color: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div 
            style={{ 
              width: 16, 
              height: 16, 
              backgroundColor: color,
              border: '1px solid #d9d9d9',
              borderRadius: 2,
            }} 
          />
          {color}
        </div>
      ),
    },
    {
      title: '薪资',
      dataIndex: 'salary',
      key: 'salary',
      width: 120,
      render: (salary: number) => `¥${salary.toLocaleString()}`,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <Space size={4} wrap>
          {tags.map(tag => (
            <Tag key={tag} size="small">{tag}</Tag>
          ))}
        </Space>
      ),
    },
  ];

  // 定义搜索表单配置
  const formOptions: FormOptions[] = [
    {
      label: '姓名',
      fieldName: 'name',
      type: 'Input',
      placeholder: '请输入姓名',
      colProps: { span: 8 },
    },
    {
      label: '部门',
      fieldName: 'department',
      type: 'Custom',
      colProps: { span: 8 },
      component: (
        <TreeSelect
          placeholder="请选择部门"
          treeData={departmentTreeData}
          treeDefaultExpandAll
          allowClear
        />
      ),
    },
    {
      label: '等级范围',
      fieldName: 'levelRange',
      type: 'Custom',
      colProps: { span: 8 },
      component: (
        <Slider
          range
          min={1}
          max={10}
          defaultValue={[1, 10]}
          marks={{
            1: 'L1',
            5: 'L5',
            10: 'L10',
          }}
        />
      ),
    },
    {
      label: '最低评分',
      fieldName: 'minRating',
      type: 'Custom',
      colProps: { span: 8 },
      component: (
        <Rate allowHalf />
      ),
    },
    {
      label: '主题色',
      fieldName: 'color',
      type: 'Custom',
      colProps: { span: 8 },
      component: (
        <ColorPicker
          showText
          format="hex"
          presets={[
            {
              label: '推荐色彩',
              colors: [
                '#1890ff',
                '#52c41a',
                '#faad14',
                '#f5222d',
                '#722ed1',
                '#13c2c2',
              ],
            },
          ]}
        />
      ),
    },
    {
      label: '薪资范围',
      fieldName: 'salaryRange',
      type: 'Custom',
      colProps: { span: 8 },
      component: (
        <Space.Compact style={{ width: '100%' }}>
          <InputNumber
            placeholder="最低薪资"
            formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value?.replace(/¥\s?|(,*)/g, '') as any}
            style={{ width: '50%' }}
          />
          <InputNumber
            placeholder="最高薪资"
            formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value?.replace(/¥\s?|(,*)/g, '') as any}
            style={{ width: '50%' }}
          />
        </Space.Compact>
      ),
    },
  ];

  // 定义查询函数
  const queryFn = async (params?: CustomQueryParams) => {
    console.log('查询参数:', params);
    
    // 模拟 API 调用
    return new Promise<{
      data: CustomDataItem[];
      recordsCount: number;
      page: number;
      pageSize: number;
    }>((resolve) => {
      setTimeout(() => {
        // 模拟数据
        const mockData: CustomDataItem[] = [
          {
            id: '1',
            name: '张三',
            department: 'frontend',
            level: 5,
            rating: 4.5,
            color: '#1890ff',
            salary: 25000,
            tags: ['React', 'TypeScript', '前端架构'],
          },
          {
            id: '2',
            name: '李四',
            department: 'backend',
            level: 6,
            rating: 4.0,
            color: '#52c41a',
            salary: 28000,
            tags: ['Java', 'Spring', '微服务'],
          },
          {
            id: '3',
            name: '王五',
            department: 'design',
            level: 4,
            rating: 4.8,
            color: '#faad14',
            salary: 22000,
            tags: ['UI设计', 'Figma', '用户体验'],
          },
          {
            id: '4',
            name: '赵六',
            department: 'mobile',
            level: 7,
            rating: 4.2,
            color: '#f5222d',
            salary: 32000,
            tags: ['Flutter', 'iOS', 'Android'],
          },
          {
            id: '5',
            name: '钱七',
            department: 'marketing',
            level: 3,
            rating: 3.8,
            color: '#722ed1',
            salary: 18000,
            tags: ['数据分析', '增长黑客', 'SEO'],
          },
        ];

        resolve({
          data: mockData,
          recordsCount: mockData.length,
          page: params?.pageIndex || 1,
          pageSize: params?.pageSize || 10,
        });
      }, 1000);
    });
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div>
      <h2>自定义表单项示例</h2>
      <p style={{ marginBottom: 16, color: '#666' }}>
        这个示例展示了如何使用各种自定义表单项，包括树形选择、滑块、评分、颜色选择器等复杂组件。
      </p>
      
      <ListPage<CustomDataItem, CustomQueryParams>
        columns={columns}
        queryFn={queryFn}
        formOptions={formOptions}
        refreshKey={refreshKey}
        operation={
          <Space>
            <Button type="primary">新建员工</Button>
            <Button onClick={handleRefresh}>刷新数据</Button>
          </Space>
        }
        pagination={{
          showTotal: true,
          pageSize: 5,
        }}
        tableProps={{
          scroll: { x: 800 },
          size: 'small',
        }}
      />
    </div>
  );
}

export default CustomFormExample;
