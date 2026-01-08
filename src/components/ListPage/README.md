# ListPage 组件使用文档

> 通用列表页面组件，集成搜索表单和数据表格功能

## 目录

- [概述](#概述)
- [快速开始](#快速开始)
- [API 参考](#api-参考)
- [使用指南](#使用指南)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)
- [示例代码](#示例代码)

## 概述

### 组件介绍

ListPage 是一个高度可配置的列表页面组件，专为快速构建数据列表页面而设计。它集成了搜索表单、数据表格、分页等常用功能，支持多种表单项类型和自定义配置。

### 主要特性

- 🚀 **开箱即用**：最少配置即可构建完整列表页面
- 🎯 **类型安全**：完整的 TypeScript 支持
- 🔧 **高度可配置**：支持自定义表单项、表格列、分页等
- 📱 **响应式设计**：适配不同屏幕尺寸
- ⚡ **性能优化**：内置防抖、防重复调用等优化
- 🎨 **主题定制**：基于 Ant Design 设计系统

### 适用场景

- 管理后台的数据列表页面
- 带搜索功能的表格展示
- 需要分页的大数据量列表
- 复杂表单查询的数据展示

## 快速开始

### 安装和导入

```typescript
import ListPage from '@/components/ListPage';
import type { ColumnsType } from 'antd/es/table';
import type { FormOptions } from '@/components/ListPage/interface';
```

### 基础使用示例

最简单的使用方式，只需要配置表格列和查询函数：

```typescript
import React from 'react';
import ListPage from '@/components/ListPage';
import type { ColumnsType } from 'antd/es/table';

// 定义数据类型
interface DataItem {
  id: string;
  name: string;
  status: string;
  createTime: string;
}

export function BasicExample() {
  // 定义表格列
  const columns: ColumnsType<DataItem> = [
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

  // 定义查询函数
  const queryFn = async (params: any) => {
    const response = await api.getData(params);
    return {
      data: response.list,
      recordsCount: response.total,
      page: response.page,
      pageSize: response.pageSize,
    };
  };

  return (
    <ListPage
      columns={columns}
      queryFn={queryFn}
    />
  );
}
```

### 核心概念

- **columns**：表格列配置，使用 Ant Design Table 的 ColumnsType
- **queryFn**：数据查询函数，返回 Promise 格式的分页数据
- **formOptions**：搜索表单配置，支持多种表单项类型
- **分页处理**：自动处理分页参数和响应数据

### 项目规范要求

在使用 ListPage 组件时，请遵循以下项目规范：

#### 命名规范
- 组件名使用 PascalCase：`UserListPage`
- 接口名使用 PascalCase：`UserRecord`, `UserQueryParams`
- 变量名使用 camelCase：`queryFn`, `formOptions`
- 常量使用 UPPER_SNAKE_CASE：`DEFAULT_PAGE_SIZE`

#### 类型定义规范
- 优先使用 `interface` 而不是 `type`
- 接口字段必须包含中文注释
- 使用可选操作符 `?` 标记可选字段
- 禁止使用 `any` 类型

```typescript
// ✅ 正确的类型定义
interface UserRecord {
  id: string /** 用户ID */;
  name: string /** 用户名称 */;
  age?: number /** 年龄，可选 */;
}

// ❌ 错误的类型定义
type UserRecord = {
  id: any;  // 不要使用 any
  name;     // 缺少类型和注释
}
```

#### 代码组织规范
- 使用 `useMemo` 优化列配置和表单配置
- 使用 `useCallback` 优化查询函数和事件处理
- 将复杂的业务逻辑提取为自定义 Hook
- 操作按钮统一使用 `type="link"` 样式

#### 错误处理规范
- 查询函数必须包含 try-catch 错误处理
- 网络错误使用 `message.error()` 提示用户
- 返回空数据结构避免组件崩溃

```typescript
const queryFn = useCallback(async (params) => {
  try {
    const response = await api.getData(params);
    return response;
  } catch (error) {
    console.error('数据获取失败:', error);
    message.error('数据加载失败，请稍后重试');
    
    // 返回空数据结构，保持组件稳定
    return {
      data: [],
      recordsCount: 0,
      page: 1,
      pageSize: 10,
    };
  }
}, []);
```

## API 参考

### ProTableProps 接口

```typescript
interface ProTableProps<
  TRecord = Record<string, unknown>,        // 表格行数据类型
  TQueryParams extends QueryParams = QueryParams,  // 查询参数类型
  TResponse extends PaginatedResponse<TRecord> = PaginatedResponse<TRecord>  // 响应数据类型
> {
  // 必需属性
  columns: ColumnsType<TRecord>; /** 表格列配置，使用 Ant Design Table 的 ColumnsType */
  queryFn: (params?: TQueryParams) => Promise<TResponse>; /** 数据查询函数，返回 Promise 格式的分页数据 */
  
  // 可选属性
  defaultQueryData?: TQueryParams; /** 默认查询参数，组件初始化时使用 */
  children?: React.ReactNode; /** 自定义内容，显示在操作区域和表格之间 */
  operation?: React.ReactNode; /** 操作区域内容，通常放置新建按钮等操作 */
  showSearchForm?: boolean; /** 是否显示搜索表单，默认 true */
  pagination?: IPaginationProps; /** 分页配置，自定义分页行为 */
  showPagination?: boolean; /** 是否显示分页组件，默认 true */
  needPagination?: boolean; /** 是否需要分页功能，默认 true */
  formOptions?: FormOptions[]; /** 搜索表单配置数组，定义表单项 */
  tableProps?: Omit<ITableProps, 'dataSource'>; /** 表格属性，透传给 Ant Design Table */
  emptyText?: string; /** 空数据提示文字，默认"暂无数据" */
  tableRowKey?: string | number; /** 表格行唯一标识字段，默认"id" */
  autoSearch?: boolean; /** 是否启用自动搜索，表单值变化时自动触发查询 */
  form?: FormInstance; /** 外部表单实例，用于表单联动 */
  debounceDelay?: number; /** 防抖延迟时间（毫秒），默认300ms */
  refreshKey?: number; /** 外部刷新标识，变化时触发重新查询 */
}
```

#### 属性详细说明

**必需属性**

- **columns**: 表格列配置
  - 类型: `ColumnsType<TRecord>`
  - 说明: 使用 Ant Design Table 的列配置格式
  - 示例: `[{ title: '名称', dataIndex: 'name', key: 'name' }]`

- **queryFn**: 数据查询函数
  - 类型: `(params?: TQueryParams) => Promise<TResponse>`
  - 说明: 接收查询参数，返回分页数据的异步函数
  - 示例: `async (params) => await api.getData(params)`

**可选属性**

- **defaultQueryData**: 默认查询参数
  - 类型: `TQueryParams`
  - 默认值: `{}`
  - 说明: 组件初始化和重置时使用的默认参数

- **showSearchForm**: 是否显示搜索表单
  - 类型: `boolean`
  - 默认值: `true`
  - 说明: 控制搜索表单的显示隐藏

- **formOptions**: 搜索表单配置
  - 类型: `FormOptions[]`
  - 默认值: `[]`
  - 说明: 定义搜索表单的表单项配置

- **pagination**: 分页配置
  - 类型: `IPaginationProps`
  - 说明: 自定义分页行为，包括字段映射、显示配置等

- **operation**: 操作区域
  - 类型: `React.ReactNode`
  - 说明: 自定义操作区域内容，通常放置新建、批量操作等按钮

- **tableRowKey**: 表格行标识
  - 类型: `string | number`
  - 默认值: `"id"`
  - 说明: 表格行的唯一标识字段名

- **autoSearch**: 自动搜索
  - 类型: `boolean`
  - 默认值: `false`
  - 说明: 启用后表单值变化时自动触发查询

- **refreshKey**: 刷新标识
  - 类型: `number`
  - 说明: 外部控制刷新的标识，变化时触发重新查询

### FormOptions 配置

FormOptions 是一个联合类型，支持多种表单项类型的配置。每种类型都有特定的属性和用法。

```typescript
type FormOptions = 
  | SearchFormInputProps      // 输入框
  | SearchSelectProps         // 下拉选择
  | SearchFormInputTagProps   // 标签输入
  | SearchDatePickerProps     // 日期选择
  | CascaderFormProps         // 级联选择
  | CustomFormItemProps;      // 自定义组件
```

#### 通用属性 (CommonItemProps)

所有表单项都包含以下通用属性：

```typescript
interface CommonItemProps {
  fieldName: string;          /** 字段名，对应表单字段 */
  label?: React.ReactNode;    /** 表单项标签 */
  tooltip?: React.ReactNode;  /** 提示信息 */
  rules?: Rule[];            /** 表单验证规则 */
  colProps?: ColProps;       /** 栅格布局属性 */
}
```

#### 1. Input 输入框 (SearchFormInputProps)

```typescript
interface SearchFormInputProps extends InputProps, CommonItemProps {
  fieldName: string;
  placeholder?: string;
  type: 'Input';
}
```

**使用示例：**
```typescript
{
  label: '用户名',
  fieldName: 'username',
  type: 'Input',
  placeholder: '请输入用户名',
  rules: [{ required: true, message: '请输入用户名' }]
}
```

#### 2. Select 下拉选择 (SearchSelectProps)

```typescript
interface SearchSelectProps extends SelectProps, CommonItemProps {
  fieldName: string;
  placeholder?: string;
  type: 'Select';
  options?: { label: string; value: any }[];  // 选项数据
}
```

**使用示例：**
```typescript
{
  label: '状态',
  fieldName: 'status',
  type: 'Select',
  placeholder: '请选择状态',
  options: [
    { label: '启用', value: 'active' },
    { label: '禁用', value: 'inactive' }
  ]
}
```

#### 3. DatePicker 日期选择 (SearchDatePickerProps)

```typescript
interface SearchDatePickerProps extends RangePickerProps, CommonItemProps {
  fieldName: string;
  type: 'DatePicker';
}
```

**特殊说明：**
- 自动处理日期范围，生成 `${fieldName}StartTime` 和 `${fieldName}EndTime` 字段
- 开始时间自动设置为 00:00:00，结束时间设置为 23:59:59

**使用示例：**
```typescript
{
  label: '创建时间',
  fieldName: 'createTime',  // 会生成 createTimeStartTime 和 createTimeEndTime
  type: 'DatePicker'
}
```

#### 4. Cascader 级联选择 (CascaderFormProps)

```typescript
interface CascaderFormProps extends CascaderProps, CommonItemProps {
  fieldName: string;
  placeholder?: string;
  type: 'Cascader';
  multiple?: boolean;        // 是否支持多选
  options?: CascaderOption[]; // 级联数据
}
```

**使用示例：**
```typescript
{
  label: '地区',
  fieldName: 'region',
  type: 'Cascader',
  placeholder: '请选择地区',
  options: [
    {
      value: 'beijing',
      label: '北京',
      children: [
        { value: 'haidian', label: '海淀区' },
        { value: 'chaoyang', label: '朝阳区' }
      ]
    }
  ]
}
```

#### 5. InputTag 标签输入 (SearchFormInputTagProps)

```typescript
interface SearchFormInputTagProps extends SelectProps, CommonItemProps {
  fieldName: string;
  placeholder?: string;
  type: 'InputTag';
}
```

**使用示例：**
```typescript
{
  label: '标签',
  fieldName: 'tags',
  type: 'InputTag',
  placeholder: '请输入标签，回车确认'
}
```

#### 6. Custom 自定义组件 (CustomFormItemProps)

```typescript
interface CustomFormItemProps extends CommonItemProps {
  fieldName: string;
  type: 'Custom';
  placeholder?: string;
  defaultValue?: string;
  component: JSX.Element;    // 自定义组件
}
```

**使用示例：**
```typescript
{
  label: '部门',
  fieldName: 'department',
  type: 'Custom',
  component: (
    <TreeSelect
      placeholder="请选择部门"
      treeData={departmentData}
    />
  )
}
```

#### 布局配置

通过 `colProps` 属性可以控制表单项的布局：

```typescript
{
  label: '名称',
  fieldName: 'name',
  type: 'Input',
  colProps: { span: 12 }  // 占用 12 列（50% 宽度）
}
```

**默认布局：**
- 每个表单项默认占用 8 列（约 33% 宽度）
- 一行最多显示 3 个表单项
- 响应式布局，小屏幕自动调整为单列

### 回调函数说明

#### queryFn - 数据查询函数

**类型定义：**
```typescript
type QueryFunction<TQueryParams, TResponse> = (
  params?: TQueryParams
) => Promise<TResponse>;
```

**参数说明：**
- `params`: 查询参数对象，包含分页、搜索条件等
- 返回值: Promise 格式的分页响应数据

**实现要求：**
```typescript
const queryFn = async (params) => {
  // 1. 处理查询参数
  const { pageIndex, pageSize, ...searchParams } = params || {};
  
  // 2. 调用 API
  const response = await api.getData({
    page: pageIndex,
    size: pageSize,
    ...searchParams
  });
  
  // 3. 返回标准格式
  return {
    data: response.list,           // 数据数组
    recordsCount: response.total,  // 总记录数
    page: response.page,           // 当前页码
    pageSize: response.pageSize,   // 每页条数
  };
};
```

#### 组件方法 - 通过 ref 访问

**获取表单引用：**
```typescript
import { useRef } from 'react';
import type { SearchFormRef } from '@/components/ListPage/SearchForm';

const searchFormRef = useRef<SearchFormRef>(null);

// 获取表单值
const getFormValues = () => {
  return searchFormRef.current?.formRef.getFieldsValue();
};

// 设置表单值
const setFormValues = (values: any) => {
  searchFormRef.current?.formRef.setFieldsValue(values);
};

// 重置表单
const resetForm = () => {
  searchFormRef.current?.formRef.resetFields();
};

// 验证表单
const validateForm = async () => {
  try {
    const values = await searchFormRef.current?.formRef.validateFields();
    return values;
  } catch (error) {
    console.error('表单验证失败:', error);
  }
};
```

#### 事件回调

**表单搜索回调：**
组件内部自动处理，无需手动绑定。当用户点击搜索按钮或表单值变化时（autoSearch=true），会自动调用 queryFn。

**分页变化回调：**
组件内部自动处理分页参数变化，并重新调用 queryFn。

**外部刷新控制：**
```typescript
const [refreshKey, setRefreshKey] = useState(0);

// 触发刷新
const handleRefresh = () => {
  setRefreshKey(prev => prev + 1);
};

<ListPage
  refreshKey={refreshKey}
  // 其他属性...
/>
```

### 类型定义

#### 核心类型

**PaginatedResponse<TRecord>** - 分页响应数据结构
```typescript
interface PaginatedResponse<TRecord = unknown> {
  data: TRecord[];           /** 数据列表 */
  page?: number;            /** 当前页码 */
  pageSize?: number;        /** 每页条数 */
  pageCount?: number;       /** 总页数 */
  recordsCount?: number;    /** 总记录数 */
  [key: string]: unknown;   /** 其他扩展字段 */
}
```

**QueryParams** - 查询参数类型
```typescript
type QueryParams = Record<string, unknown>;

// 扩展示例
interface CustomQueryParams extends QueryParams {
  pageIndex?: number;       /** 页码 */
  pageSize?: number;        /** 每页条数 */
  name?: string;           /** 名称搜索 */
  status?: string;         /** 状态筛选 */
  createTimeStartTime?: string;  /** 开始时间 */
  createTimeEndTime?: string;    /** 结束时间 */
}
```

**IPaginationProps** - 分页配置接口
```typescript
interface IPaginationProps {
  showTotal?: boolean;      /** 是否显示总数，默认 true */
  totalField?: string;      /** 总数字段名，默认 "recordsCount" */
  pageField?: string;       /** 页码字段名，默认 "page" */
  pageSizeField?: string;   /** 页面大小字段名，默认 "pageSize" */
  pageSize?: number;        /** 默认页面大小 */
  sizeCanChange?: boolean;  /** 是否可以改变页面大小 */
  sizeOptions?: number[];   /** 页面大小选项，默认 [10, 20, 100, 200] */
}
```

#### 泛型使用说明

ListPage 组件支持三个泛型参数，提供完整的类型安全：

```typescript
<ListPage<TRecord, TQueryParams, TResponse>
  columns={columns}
  queryFn={queryFn}
  formOptions={formOptions}
/>
```

**泛型参数说明：**

1. **TRecord** - 表格行数据类型
   - 默认值: `Record<string, unknown>`
   - 说明: 定义表格每一行数据的结构

2. **TQueryParams** - 查询参数类型
   - 默认值: `QueryParams`
   - 约束: `extends QueryParams`
   - 说明: 定义查询函数接收的参数结构

3. **TResponse** - 响应数据类型
   - 默认值: `PaginatedResponse<TRecord>`
   - 约束: `extends PaginatedResponse<TRecord>`
   - 说明: 定义查询函数返回的数据结构

#### 类型化使用示例

```typescript
// 1. 定义数据类型
interface UserRecord {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  createTime: string;
}

// 2. 定义查询参数类型
interface UserQueryParams {
  name?: string;
  status?: string;
  pageIndex?: number;
  pageSize?: number;
  createTimeStartTime?: string;
  createTimeEndTime?: string;
}

// 3. 定义响应数据类型
interface UserResponse {
  data: UserRecord[];
  recordsCount: number;
  page: number;
  pageSize: number;
}

// 4. 类型化使用
const UserListPage: React.FC = () => {
  const columns: ColumnsType<UserRecord> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: UserRecord['status']) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
  ];

  const queryFn = async (params?: UserQueryParams): Promise<UserResponse> => {
    const response = await userApi.getUsers(params);
    return response;
  };

  const formOptions: FormOptions[] = [
    {
      label: '姓名',
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

  return (
    <ListPage<UserRecord, UserQueryParams, UserResponse>
      columns={columns}
      queryFn={queryFn}
      formOptions={formOptions}
    />
  );
};
```

#### 工具类型

**SearchFormRef** - 搜索表单引用类型
```typescript
interface SearchFormRef {
  formRef: FormInstance;    /** Ant Design 表单实例 */
}
```

**使用示例：**
```typescript
const searchFormRef = useRef<SearchFormRef>(null);

// 获取表单值
const getFormValues = () => {
  return searchFormRef.current?.formRef.getFieldsValue();
};

// 重置表单
const resetForm = () => {
  searchFormRef.current?.formRef.resetFields();
};
```

## 使用指南

### 基础列表

最简单的列表页面，只显示表格数据：

```typescript
<ListPage
  columns={columns}
  queryFn={queryFn}
  showSearchForm={false}  // 隐藏搜索表单
/>
```

**适用场景**：简单的数据展示页面，不需要复杂的搜索功能。

[查看完整示例 →](./examples/BasicExample.tsx)

### 搜索表单

带有搜索功能的完整列表页面：

```typescript
const formOptions: FormOptions[] = [
  {
    label: '名称',
    fieldName: 'name',
    type: 'Input',
  },
  {
    label: '状态',
    fieldName: 'status',
    type: 'Select',
    options: [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'inactive' }
    ]
  }
];

<ListPage
  columns={columns}
  queryFn={queryFn}
  formOptions={formOptions}
/>
```

**适用场景**：需要多条件搜索的数据列表页面。

[查看完整示例 →](./examples/FullFeatureExample.tsx)

### 自定义组件

使用自定义表单项处理复杂的输入需求：

```typescript
{
  label: '部门',
  fieldName: 'department',
  type: 'Custom',
  component: (
    <TreeSelect
      placeholder="请选择部门"
      treeData={departmentData}
    />
  )
}
```

**适用场景**：需要使用 Ant Design 之外的组件或自定义业务组件。

[查看完整示例 →](./examples/CustomFormExample.tsx)

### 高级配置

类型安全、性能优化的企业级使用方式：

```typescript
// 完整的类型定义
interface UserRecord { /* ... */ }
interface UserQueryParams { /* ... */ }
interface UserResponse { /* ... */ }

// 性能优化
const columns = useMemo(() => [...], []);
const queryFn = useCallback(async (params) => { /* ... */ }, []);

<ListPage<UserRecord, UserQueryParams, UserResponse>
  columns={columns}
  queryFn={queryFn}
  // 其他高级配置...
/>
```

**适用场景**：大型项目中需要严格类型检查和性能优化的场景。

[查看完整示例 →](./examples/AdvancedExample.tsx)

## 最佳实践

### 性能优化

#### 1. 使用 React.memo 和 useMemo 优化渲染

```typescript
import React, { useMemo, useCallback } from 'react';

// 使用 useMemo 缓存列配置，避免每次渲染重新创建
const columns = useMemo(() => [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    // 复杂的 render 函数也应该优化
    render: useCallback((text: string) => (
      <span style={{ fontWeight: 'bold' }}>{text}</span>
    ), []),
  },
  // ... 其他列
], []);

// 使用 useMemo 缓存表单配置
const formOptions = useMemo(() => [
  {
    label: '名称',
    fieldName: 'name',
    type: 'Input' as const,
  },
  // ... 其他表单项
], []);
```

#### 2. 优化查询函数

```typescript
// 使用 useCallback 避免不必要的重新渲染
const queryFn = useCallback(async (params: QueryParams) => {
  // 防抖处理已在组件内部实现，无需额外处理
  try {
    const response = await api.getData(params);
    return response;
  } catch (error) {
    // 错误处理
    return { data: [], recordsCount: 0, page: 1, pageSize: 10 };
  }
}, []); // 依赖数组为空，函数不会重新创建

// 如果查询函数依赖外部状态，正确设置依赖
const queryFnWithDeps = useCallback(async (params: QueryParams) => {
  const response = await api.getData({ ...params, userId });
  return response;
}, [userId]); // 当 userId 变化时重新创建函数
```

#### 3. 合理使用 refreshKey

```typescript
// ✅ 正确使用 refreshKey
const [refreshKey, setRefreshKey] = useState(0);

const handleRefresh = useCallback(() => {
  setRefreshKey(prev => prev + 1);
}, []);

// ❌ 避免频繁变化的 refreshKey
// const refreshKey = Date.now(); // 每次渲染都会变化

<ListPage
  refreshKey={refreshKey}
  // ... 其他属性
/>
```

#### 4. 表格性能优化

```typescript
<ListPage
  tableProps={{
    // 虚拟滚动，适用于大量数据
    scroll: { y: 400, x: 1200 },
    
    // 设置合理的分页大小
    pagination: { pageSize: 20 },
    
    // 固定列减少重排
    columns: columnsWithFixed,
  }}
/>

// 固定列配置示例
const columnsWithFixed = useMemo(() => [
  {
    title: '操作',
    key: 'action',
    fixed: 'right' as const,
    width: 120,
    render: (_, record) => (
      <Space>
        <Button size="small" type="link">编辑</Button>
      </Space>
    ),
  },
], []);
```

#### 5. 减少不必要的重新渲染

```typescript
// 使用 React.memo 包装子组件
const OptimizedOperationButton = React.memo<{ record: DataRecord }>(({ record }) => {
  return (
    <Button onClick={() => handleEdit(record.id)}>
      编辑
    </Button>
  );
});

// 在列配置中使用优化后的组件
const columns = useMemo(() => [
  {
    title: '操作',
    key: 'action',
    render: (_, record) => <OptimizedOperationButton record={record} />,
  },
], []);
```

#### 6. 数据预处理优化

```typescript
// 在查询函数中预处理数据，避免在 render 中处理
const queryFn = useCallback(async (params: QueryParams) => {
  const response = await api.getData(params);
  
  // 预处理数据，添加计算字段
  const processedData = response.data.map(item => ({
    ...item,
    // 预计算显示文本，避免在 render 中计算
    statusText: getStatusText(item.status),
    displayName: `${item.firstName} ${item.lastName}`,
  }));
  
  return {
    ...response,
    data: processedData,
  };
}, []);
```

#### 7. 防抖和节流

```typescript
// 组件内置防抖功能，可通过 debounceDelay 配置
<ListPage
  debounceDelay={500}  // 500ms 防抖延迟
  autoSearch={true}    // 启用自动搜索
  // ... 其他属性
/>

// 对于自定义的搜索逻辑，可以使用 lodash 的防抖
import { debounce } from 'lodash';

const debouncedSearch = useMemo(
  () => debounce((searchText: string) => {
    // 执行搜索逻辑
  }, 300),
  []
);
```

#### 性能监控建议

```typescript
// 使用 React DevTools Profiler 监控组件性能
// 关注以下指标：
// 1. 组件渲染次数
// 2. 渲染耗时
// 3. 不必要的重新渲染

// 在开发环境中添加性能日志
const queryFn = useCallback(async (params: QueryParams) => {
  const startTime = performance.now();
  
  try {
    const response = await api.getData(params);
    const endTime = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`查询耗时: ${endTime - startTime}ms`);
    }
    
    return response;
  } catch (error) {
    console.error('查询失败:', error);
    return { data: [], recordsCount: 0, page: 1, pageSize: 10 };
  }
}, []);
```

### 错误处理

```typescript
// 待补充：错误处理策略和示例
```

### 类型安全

```typescript
// 待补充：类型安全使用建议
```

### 代码组织

```typescript
// 待补充：代码组织最佳实践
```

## 常见问题

### FAQ

**Q: 如何自定义分页配置？**

A: 通过 `pagination` 属性配置分页行为：

```typescript
<ListPage
  pagination={{
    showTotal: true,           // 显示总数
    pageSize: 20,             // 默认每页条数
    totalField: 'total',      // 总数字段名
    pageField: 'currentPage', // 页码字段名
    pageSizeField: 'size',    // 页面大小字段名
    sizeOptions: ['10', '20', '50', '100'], // 页面大小选项
  }}
/>
```

**Q: 如何处理日期范围查询？**

A: 使用 `DatePicker` 类型的表单项，组件会自动处理：

```typescript
{
  label: '创建时间',
  fieldName: 'createTime',  // 会自动生成 createTimeStartTime 和 createTimeEndTime
  type: 'DatePicker',
}

// 查询参数中会包含：
// {
//   createTimeStartTime: '2024-01-01 00:00:00',
//   createTimeEndTime: '2024-01-31 23:59:59'
// }
```

**Q: 如何禁用搜索表单？**

A: 设置 `showSearchForm={false}`：

```typescript
<ListPage
  showSearchForm={false}
  columns={columns}
  queryFn={queryFn}
/>
```

**Q: 如何实现表格行选择功能？**

A: 通过 `tableProps.rowSelection` 配置：

```typescript
const [selectedRows, setSelectedRows] = useState([]);

<ListPage
  tableProps={{
    rowSelection: {
      selectedRowKeys: selectedRows.map(row => row.id),
      onChange: (keys, rows) => setSelectedRows(rows),
    }
  }}
/>
```

**Q: 如何自定义空数据显示？**

A: 使用 `emptyText` 属性：

```typescript
<ListPage
  emptyText="暂无相关数据"
  // 或者使用自定义组件
  tableProps={{
    locale: {
      emptyText: (
        <div>
          <img src="/empty.png" alt="暂无数据" />
          <p>暂无数据</p>
        </div>
      )
    }
  }}
/>
```

**Q: 如何处理接口返回的非标准数据格式？**

A: 在 `queryFn` 中进行数据转换：

```typescript
const queryFn = async (params) => {
  const response = await api.getData(params);
  
  // 转换为标准格式
  return {
    data: response.list || response.items,     // 适配不同的数据字段
    recordsCount: response.totalCount || response.total,
    page: response.pageNum || response.page,
    pageSize: response.pageSize || response.size,
  };
};
```

**Q: 如何实现表格列的动态显示/隐藏？**

A: 使用状态控制列的显示：

```typescript
const [visibleColumns, setVisibleColumns] = useState(['name', 'status']);

const columns = useMemo(() => 
  allColumns.filter(col => visibleColumns.includes(col.key))
, [visibleColumns]);

<ListPage columns={columns} />
```

**Q: 如何处理大数据量的性能问题？**

A: 采用以下优化策略：

1. 启用虚拟滚动：`tableProps={{ scroll: { y: 400 } }}`
2. 合理设置分页大小：`pagination={{ pageSize: 50 }}`
3. 使用 `useMemo` 缓存列配置和数据处理
4. 避免在 `render` 函数中进行复杂计算

**Q: 如何实现搜索表单的联动效果？**

A: 使用外部表单实例控制：

```typescript
const [form] = Form.useForm();

// 监听表单值变化
const handleValuesChange = (changedValues, allValues) => {
  if (changedValues.category) {
    // 当分类变化时，清空子分类
    form.setFieldsValue({ subCategory: undefined });
  }
};

<ListPage
  form={form}
  formOptions={formOptions}
  // 在 formOptions 中使用 Custom 类型处理复杂联动
/>
```

**Q: 如何添加表格工具栏（导出、刷新等功能）？**

A: 使用 `operation` 属性：

```typescript
<ListPage
  operation={
    <Space>
      <Button type="primary">新建</Button>
      <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
        刷新
      </Button>
      <Button icon={<ExportOutlined />} onClick={handleExport}>
        导出
      </Button>
    </Space>
  }
/>
```

### 故障排除

- 待补充：常见错误及解决方案

### 迁移指南

- 待补充：版本升级指南

## 示例代码

### 完整示例

- [基础使用示例](./examples/BasicExample.tsx)
- [完整功能示例](./examples/FullFeatureExample.tsx)
- [自定义表单示例](./examples/CustomFormExample.tsx)
- [高级用法示例](./examples/AdvancedExample.tsx)

### 场景演示

- 待补充：不同场景的使用演示

### 代码片段

- 待补充：常用代码片段

---

## 更新日志

### v1.0.0
- 初始版本发布
- 完整的 API 文档
- 丰富的使用示例
