/**
 * ListPage 基础使用示例
 * 
 * 这个示例展示了 ListPage 组件的最简单用法：
 * - 基本的表格列配置
 * - 简单的数据查询函数
 * - 默认的分页配置
 */

import React from 'react';
import ListPage from '@/components/ListPage';
import type { ColumnsType } from 'antd/es/table';

// 注意：使用前请确保已正确配置路径别名 @/ 指向 src/ 目录
// 如果没有配置别名，请使用相对路径：
// import ListPage from '../../../src/components/ListPage';

// 定义数据类型
interface BasicDataItem {
  id: string /** 数据ID */;
  name: string /** 名称 */;
  status: string /** 状态 */;
  createTime: string /** 创建时间 */;
}

export function BasicExample() {
  // 定义表格列
  const columns: ColumnsType<BasicDataItem> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
  ];

  // 定义查询函数 - 实际项目中的实现方式
  const queryFn = async (params: any) => {
    console.log('查询参数:', params);
    
    try {
      // 实际项目中应该调用真实的 API
      // const response = await userApi.getUsers(params);
      // return response;
      
      // 以下是模拟实现，仅用于演示
      return new Promise<{
        data: BasicDataItem[];
        recordsCount: number;
        page: number;
        pageSize: number;
      }>((resolve) => {
        setTimeout(() => {
          // 模拟真实的业务数据
          const mockData: BasicDataItem[] = [
            {
              id: 'user_001',
              name: '张三',
              status: '在职',
              createTime: '2024-01-15 10:30:00',
            },
            {
              id: 'user_002', 
              name: '李四',
              status: '离职',
              createTime: '2024-01-14 15:20:00',
            },
            {
              id: 'user_003',
              name: '王五',
              status: '在职',
              createTime: '2024-01-13 09:45:00',
            },
          ];

          resolve({
            data: mockData,
            recordsCount: mockData.length,
            page: params?.pageIndex || 1,
            pageSize: params?.pageSize || 10,
          });
        }, 800); // 模拟网络延迟
      });
    } catch (error) {
      console.error('数据获取失败:', error);
      // 错误处理：返回空数据结构
      return {
        data: [],
        recordsCount: 0,
        page: 1,
        pageSize: 10,
      };
    }
  };

  return (
    <div>
      <h2>基础使用示例</h2>
      <ListPage
        columns={columns}
        queryFn={queryFn}
        showSearchForm={false} // 隐藏搜索表单，仅显示表格
      />
    </div>
  );
}

export default BasicExample;
