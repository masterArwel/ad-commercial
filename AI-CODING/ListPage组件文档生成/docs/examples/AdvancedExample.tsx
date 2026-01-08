/**
 * ListPage 高级用法示例
 * 
 * 这个示例展示了 ListPage 组件的高级用法：
 * - 类型化使用（泛型）
 * - 性能优化技巧
 * - 错误处理策略
 * - 复杂业务场景处理
 */

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Button, Space, Tag, message, Modal, Tooltip } from 'antd';
import { 
  ReloadOutlined, 
  ExportOutlined, 
  ImportOutlined,
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import ListPage from '@/components/ListPage';
import type { ColumnsType } from 'antd/es/table';
import type { FormOptions } from '@/components/ListPage/interface';
import type { SearchFormRef } from '@/components/ListPage/SearchForm';

// 严格类型定义
interface AdvancedDataRecord {
  id: string /** 唯一标识 */;
  name: string /** 名称 */;
  status: 'active' | 'inactive' | 'pending' /** 状态枚举 */;
  priority: 'high' | 'medium' | 'low' /** 优先级 */;
  progress: number /** 进度百分比 0-100 */;
  assignee: string /** 负责人 */;
  createTime: string /** 创建时间 */;
  updateTime: string /** 更新时间 */;
  tags: string[] /** 标签数组 */;
  metadata?: Record<string, any> /** 元数据 */;
}

interface AdvancedQueryParams {
  name?: string;
  status?: string;
  priority?: string;
  assignee?: string;
  progressMin?: number;
  progressMax?: number;
  createTimeStartTime?: string;
  createTimeEndTime?: string;
  tags?: string[];
  pageIndex?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

interface AdvancedResponse {
  data: AdvancedDataRecord[];
  recordsCount: number;
  page: number;
  pageSize: number;
  summary?: {
    activeCount: number;
    completedCount: number;
    avgProgress: number;
  };
}

// 模拟 API 服务
class AdvancedApiService {
  private static mockData: AdvancedDataRecord[] = Array.from({ length: 100 }, (_, index) => ({
    id: `task-${index + 1}`,
    name: `任务${index + 1}`,
    status: ['active', 'inactive', 'pending'][index % 3] as any,
    priority: ['high', 'medium', 'low'][index % 3] as any,
    progress: Math.floor(Math.random() * 101),
    assignee: ['张三', '李四', '王五', '赵六'][index % 4],
    createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updateTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['前端', '后端', '设计', '测试', '运维'].slice(0, Math.floor(Math.random() * 3) + 1),
    metadata: { complexity: Math.floor(Math.random() * 5) + 1 },
  }));

  static async getData(params?: AdvancedQueryParams): Promise<AdvancedResponse> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

    // 模拟网络错误（5% 概率）
    if (Math.random() < 0.05) {
      throw new Error('网络请求失败，请稍后重试');
    }

    // 模拟业务异常（3% 概率）
    if (Math.random() < 0.03) {
      throw new Error('服务器内部错误');
    }

    let filteredData = [...this.mockData];

    // 应用筛选条件
    if (params?.name) {
      filteredData = filteredData.filter(item => 
        item.name.includes(params.name!)
      );
    }
    if (params?.status) {
      filteredData = filteredData.filter(item => item.status === params.status);
    }
    if (params?.priority) {
      filteredData = filteredData.filter(item => item.priority === params.priority);
    }
    if (params?.assignee) {
      filteredData = filteredData.filter(item => item.assignee === params.assignee);
    }

    // 应用排序
    if (params?.sortField) {
      filteredData.sort((a, b) => {
        const aVal = a[params.sortField as keyof AdvancedDataRecord];
        const bVal = b[params.sortField as keyof AdvancedDataRecord];
        const order = params.sortOrder === 'desc' ? -1 : 1;
        return aVal > bVal ? order : aVal < bVal ? -order : 0;
      });
    }

    // 应用分页
    const pageIndex = params?.pageIndex || 1;
    const pageSize = params?.pageSize || 10;
    const startIndex = (pageIndex - 1) * pageSize;
    const pageData = filteredData.slice(startIndex, startIndex + pageSize);

    // 计算汇总信息
    const summary = {
      activeCount: filteredData.filter(item => item.status === 'active').length,
      completedCount: filteredData.filter(item => item.progress === 100).length,
      avgProgress: Math.round(
        filteredData.reduce((sum, item) => sum + item.progress, 0) / filteredData.length
      ),
    };

    return {
      data: pageData,
      recordsCount: filteredData.length,
      page: pageIndex,
      pageSize,
      summary,
    };
  }
}

export function AdvancedExample() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedRows, setSelectedRows] = useState<AdvancedDataRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const searchFormRef = useRef<SearchFormRef>(null);

  // 使用 useMemo 优化列配置
  const columns: ColumnsType<AdvancedDataRecord> = useMemo(() => [
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      render: (name: string) => (
        <Tooltip title={name}>
          {name}
        </Tooltip>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      sorter: true,
      render: (status: AdvancedDataRecord['status']) => {
        const statusConfig = {
          active: { color: 'green', text: '进行中' },
          inactive: { color: 'red', text: '已停止' },
          pending: { color: 'orange', text: '待开始' },
        };
        const config = statusConfig[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      sorter: true,
      render: (priority: AdvancedDataRecord['priority']) => {
        const priorityConfig = {
          high: { color: 'red', text: '高' },
          medium: { color: 'orange', text: '中' },
          low: { color: 'blue', text: '低' },
        };
        const config = priorityConfig[priority];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 120,
      sorter: true,
      render: (progress: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ 
            width: 60, 
            height: 8, 
            backgroundColor: '#f0f0f0', 
            borderRadius: 4,
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: progress === 100 ? '#52c41a' : '#1890ff',
              transition: 'width 0.3s',
            }} />
          </div>
          <span style={{ fontSize: 12, color: '#666' }}>{progress}%</span>
        </div>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 100,
      sorter: true,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 150,
      render: (tags: string[]) => (
        <Space size={4} wrap>
          {tags.map(tag => (
            <Tag key={tag} size="small">{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      sorter: true,
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record: AdvancedDataRecord) => (
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
            danger 
            type="link" 
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ], []);

  // 使用 useMemo 优化表单配置
  const formOptions: FormOptions[] = useMemo(() => [
    {
      label: '任务名称',
      fieldName: 'name',
      type: 'Input',
      placeholder: '请输入任务名称',
      colProps: { span: 6 },
    },
    {
      label: '状态',
      fieldName: 'status',
      type: 'Select',
      placeholder: '请选择状态',
      options: [
        { label: '进行中', value: 'active' },
        { label: '已停止', value: 'inactive' },
        { label: '待开始', value: 'pending' },
      ],
      colProps: { span: 6 },
    },
    {
      label: '优先级',
      fieldName: 'priority',
      type: 'Select',
      placeholder: '请选择优先级',
      options: [
        { label: '高', value: 'high' },
        { label: '中', value: 'medium' },
        { label: '低', value: 'low' },
      ],
      colProps: { span: 6 },
    },
    {
      label: '负责人',
      fieldName: 'assignee',
      type: 'Select',
      placeholder: '请选择负责人',
      options: [
        { label: '张三', value: '张三' },
        { label: '李四', value: '李四' },
        { label: '王五', value: '王五' },
        { label: '赵六', value: '赵六' },
      ],
      colProps: { span: 6 },
    },
    {
      label: '创建时间',
      fieldName: 'createTime',
      type: 'DatePicker',
      colProps: { span: 12 },
    },
  ], []);

  // 使用 useCallback 优化查询函数
  const queryFn = useCallback(async (params?: AdvancedQueryParams): Promise<AdvancedResponse> => {
    try {
      console.log('查询参数:', params);
      const response = await AdvancedApiService.getData(params);
      
      // 显示汇总信息
      if (response.summary) {
        message.success(
          `查询成功！活跃任务: ${response.summary.activeCount}，` +
          `已完成: ${response.summary.completedCount}，` +
          `平均进度: ${response.summary.avgProgress}%`
        );
      }
      
      return response;
    } catch (error) {
      console.error('查询失败:', error);
      
      // 错误处理策略
      if (error instanceof Error) {
        if (error.message.includes('网络')) {
          message.error('网络连接失败，请检查网络后重试');
        } else if (error.message.includes('服务器')) {
          message.error('服务器异常，请联系管理员');
        } else {
          message.error(`查询失败: ${error.message}`);
        }
      }
      
      // 返回空数据结构，保持组件稳定
      return {
        data: [],
        recordsCount: 0,
        page: 1,
        pageSize: 10,
      };
    }
  }, []);

  // 操作函数
  const handleEdit = useCallback((record: AdvancedDataRecord) => {
    message.info(`编辑任务: ${record.name}`);
  }, []);

  const handleDelete = useCallback((record: AdvancedDataRecord) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除任务"${record.name}"吗？`,
      onOk: () => {
        message.success(`已删除任务: ${record.name}`);
        setRefreshKey(prev => prev + 1);
      },
    });
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    message.info('正在刷新数据...');
  }, []);

  const handleExport = useCallback(async () => {
    setLoading(true);
    try {
      // 模拟导出操作
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('导出成功！');
    } catch (error) {
      message.error('导出失败，请重试');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleImport = useCallback(() => {
    message.info('导入功能开发中...');
  }, []);

  const handleBatchDelete = useCallback(() => {
    if (selectedRows.length === 0) {
      message.warning('请先选择要删除的任务');
      return;
    }

    Modal.confirm({
      title: '批量删除确认',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除选中的 ${selectedRows.length} 个任务吗？`,
      onOk: () => {
        message.success(`已删除 ${selectedRows.length} 个任务`);
        setSelectedRows([]);
        setRefreshKey(prev => prev + 1);
      },
    });
  }, [selectedRows]);

  const handleResetSearch = useCallback(() => {
    searchFormRef.current?.formRef.resetFields();
    setRefreshKey(prev => prev + 1);
  }, []);

  // 表格选择配置
  const rowSelection = {
    selectedRowKeys: selectedRows.map(row => row.id),
    onChange: (selectedRowKeys: React.Key[], selectedRows: AdvancedDataRecord[]) => {
      setSelectedRows(selectedRows);
    },
    onSelectAll: (selected: boolean, selectedRows: AdvancedDataRecord[], changeRows: AdvancedDataRecord[]) => {
      console.log('全选状态:', selected, '选中行:', selectedRows, '变化行:', changeRows);
    },
  };

  return (
    <div>
      <h2>高级用法示例</h2>
      <p style={{ marginBottom: 16, color: '#666' }}>
        这个示例展示了类型安全、性能优化、错误处理、复杂业务逻辑等高级用法。
      </p>
      
      <ListPage<AdvancedDataRecord, AdvancedQueryParams, AdvancedResponse>
        ref={searchFormRef}
        columns={columns}
        queryFn={queryFn}
        formOptions={formOptions}
        refreshKey={refreshKey}
        defaultQueryData={{ 
          status: 'active',
          pageSize: 15,
        }}
        operation={
          <Space wrap>
            <Button type="primary">新建任务</Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
            >
              刷新
            </Button>
            <Button 
              icon={<ExportOutlined />} 
              loading={loading}
              onClick={handleExport}
            >
              导出
            </Button>
            <Button 
              icon={<ImportOutlined />} 
              onClick={handleImport}
            >
              导入
            </Button>
            <Button 
              danger
              disabled={selectedRows.length === 0}
              onClick={handleBatchDelete}
            >
              批量删除 ({selectedRows.length})
            </Button>
            <Button onClick={handleResetSearch}>
              重置搜索
            </Button>
          </Space>
        }
        pagination={{
          showTotal: true,
          pageSize: 15,
          sizeOptions: ['10', '15', '20', '50'],
        }}
        tableProps={{
          scroll: { x: 1200, y: 400 },
          size: 'middle',
          rowSelection,
          onChange: (pagination, filters, sorter) => {
            console.log('表格变化:', { pagination, filters, sorter });
          },
        }}
        emptyText="暂无任务数据"
        debounceDelay={500}
        autoSearch={false}
      />
      
      {selectedRows.length > 0 && (
        <div style={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24, 
          padding: '12px 16px',
          backgroundColor: '#1890ff',
          color: 'white',
          borderRadius: 6,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          已选择 {selectedRows.length} 项
          <Button 
            size="small" 
            style={{ marginLeft: 8 }}
            onClick={() => setSelectedRows([])}
          >
            清空
          </Button>
        </div>
      )}
    </div>
  );
}

export default AdvancedExample;
