/**
 * ListPage 组件类型定义文件
 * 
 * 本文件包含 ListPage 组件及其相关子组件的所有类型定义，包括：
 * 
 * 1. 搜索表单相关类型：
 *    - SearchFormItemType: 表单项类型枚举
 *    - SearchFormRef: 表单组件引用类型
 *    - SearchFormProps: 表单组件属性类型
 *    - FormOptions: 表单配置项联合类型
 *    - 各种具体表单项类型（Input、Select、DatePicker 等）
 * 
 * 2. 表格相关类型：
 *    - ITableProps: 表格组件属性类型
 *    - IPaginationProps: 分页配置属性类型
 * 
 * 3. 数据类型定义：
 *    - PaginatedResponse: 分页响应数据结构
 *    - QueryParams: 查询参数类型
 *    - PageInfoConfig: 分页信息配置类型
 * 
 * 4. 主组件类型：
 *    - ProTableProps: ListPage 主组件属性类型（支持泛型）
 * 
 * 使用说明：
 * - 所有类型都包含详细的 JSDoc 注释
 * - 支持 TypeScript 严格模式
 * - 提供完整的类型安全保障
 * - 支持泛型以适应不同的数据结构
 * 
 * @author ListPage 组件开发团队
 * @version 1.0.0
 */

import type { ColProps, FormProps } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { FormItemProps as AntdFormItemProps } from 'antd/es/form';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { InputProps } from 'antd';
import type { SelectProps } from 'antd';
import type { CascaderProps } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import type { PaginationProps } from 'antd';

// ==================== 搜索表单相关类型 ====================

/**
 * 搜索表单项类型枚举
 * 定义了支持的所有表单项类型
 */
export type SearchFormItemType =
  | 'Input'      /** 输入框 */
  | 'Custom'     /** 自定义组件 */
  | 'Select'     /** 下拉选择 */
  | 'DatePicker' /** 日期选择器 */
  | 'Cascader'   /** 级联选择器 */
  | 'InputTag';  /** 标签输入框 */

/**
 * 栅格列属性配置
 * 用于控制表单项的布局
 */
export type GirdColProps = {
  colProps?: ColProps /** Ant Design 栅格列属性 */;
};

/**
 * 栅格列属性配置（正确拼写别名）
 * 保持向后兼容性
 */
export type GridColProps = GirdColProps;

/**
 * 表单项基础属性
 * 从 Ant Design FormItemProps 中提取常用属性
 */
export type FormItemProps = Pick<
  AntdFormItemProps,
  'tooltip' | 'label' | 'rules'
>;

/**
 * 通用表单项属性
 * 结合了栅格布局和表单项基础属性
 */
export type CommonItemProps = GirdColProps & FormItemProps;

/**
 * 输入框表单项配置
 * 继承 Ant Design Input 组件的所有属性
 */
export interface SearchFormInputProps extends InputProps, CommonItemProps {
  fieldName: string /** 字段名，对应表单字段 */;
  placeholder?: string /** 占位符文本 */;
  type: 'Input' /** 表单项类型标识 */;
}

/**
 * 标签输入框表单项配置
 * 基于 Select 组件的 tags 模式实现
 */
export interface SearchFormInputTagProps extends SelectProps, CommonItemProps {
  fieldName: string /** 字段名，对应表单字段 */;
  placeholder?: string /** 占位符文本 */;
  type: 'InputTag' /** 表单项类型标识 */;
}

/**
 * 日期选择器表单项配置
 * 使用 RangePicker 实现日期范围选择
 * 注意：会自动生成 ${fieldName}StartTime 和 ${fieldName}EndTime 字段
 */
export interface SearchDatePickerProps
  extends RangePickerProps,
    CommonItemProps {
  fieldName: string /** 字段名，会自动生成开始和结束时间字段 */;
  type: 'DatePicker' /** 表单项类型标识 */;
}

/**
 * 下拉选择框表单项配置
 * 继承 Ant Design Select 组件的所有属性
 */
export interface SearchSelectProps extends SelectProps, CommonItemProps {
  fieldName: string /** 字段名，对应表单字段 */;
  placeholder?: string /** 占位符文本 */;
  type: 'Select' /** 表单项类型标识 */;
}

/**
 * 级联选择器表单项配置
 * 支持单选和多选模式
 */
export type CascaderFormProps = CommonItemProps & {
  fieldName: string /** 字段名，对应表单字段 */;
  placeholder?: string /** 占位符文本 */;
  defaultValue?: unknown /** 默认值 */;
  type: 'Cascader' /** 表单项类型标识 */;
} & Omit<CascaderProps, 'multiple'> & { 
  multiple?: true /** 是否支持多选 */;
};

/**
 * 自定义组件表单项配置
 * 允许使用任意 React 组件作为表单项
 */
export interface CustomFormItemProps extends CommonItemProps {
  fieldName: string /** 字段名，对应表单字段 */;
  type: 'Custom' /** 表单项类型标识 */;
  placeholder?: string /** 占位符文本（可选） */;
  defaultValue?: string /** 默认值（可选） */;
  component: JSX.Element /** 自定义组件实例 */;
}

/**
 * 表单配置项联合类型
 * 支持所有类型的表单项配置
 */
/**
 * 表单配置项联合类型
 * 支持所有类型的表单项配置
 */
export type FormOptions =
  | SearchSelectProps      /** 下拉选择框 */
  | SearchFormInputProps   /** 输入框 */
  | SearchFormInputTagProps /** 标签输入框 */
  | CustomFormItemProps    /** 自定义组件 */
  | SearchDatePickerProps  /** 日期选择器 */
  | CascaderFormProps;     /** 级联选择器 */

/**
 * 搜索表单组件引用类型
 * 用于获取表单实例和调用表单方法
 */
export interface SearchFormRef {
  formRef: FormInstance /** Ant Design 表单实例 */;
}

/**
 * 搜索表单组件属性类型
 * 定义搜索表单组件接收的所有属性
 */
export interface SearchFormProps {
  form?: FormInstance /** 外部表单实例，可选 */;
  loading?: boolean /** 加载状态，影响按钮禁用状态 */;
  initialValues?: any /** 表单初始值 */;
  formOptions?: FormOptions[] /** 表单项配置数组 */;
  onSearch: (values: Record<string, any>) => void /** 搜索回调函数 */;
  onReset?: () => void /** 重置回调函数，可选 */;
  extraFields?: AntdFormItemProps['name'][] /** 额外的隐藏字段 */;
  extra?: {
    action?: React.ReactNode /** 额外的操作按钮 */;
  };
  formProps?: FormProps /** Ant Design Form 组件属性 */;
  colProps?: ColProps /** 默认的栅格列属性 */;
  classNames?: {
    wrapper?: string /** 包装器样式类名 */;
    form?: string /** 表单样式类名 */;
  };
  autoSearch?: boolean /** 是否启用自动搜索 */;
}

/**
 * 表单项渲染组件属性类型
 */
export interface RenderFormItemProps {
  formOptions?: FormOptions[] /** 表单项配置数组 */;
  colProps?: ColProps /** 默认的栅格列属性 */;
}

// ==================== 表格相关类型 ====================

/**
 * 表格组件属性类型
 * 继承 Ant Design Table 组件属性，排除由 ListPage 管理的属性
 */
export interface ITableProps
  extends Omit<
    TableProps<unknown>,
    'dataSource' | 'loading' | 'rowKey' | 'pagination'
  > {
  rowKey?: string /** 表格行唯一标识字段名 */;
}

/**
 * 分页配置属性类型
 * 定义分页组件的行为和数据字段映射
 */
export interface IPaginationProps {
  showTotal?: boolean /** 是否显示总数信息，默认 true */;
  totalField?: string /** 总记录数字段名，默认 'recordsCount' */;
  pageField?: string /** 当前页码字段名，默认 'page' */;
  pageSizeField?: string /** 每页条数字段名，默认 'pageSize' */;
  pageSize?: number /** 自定义默认页面大小 */;
  sizeCanChange?: boolean /** 是否允许改变页面大小 */;
  sizeOptions?: number[] /** 页面大小选项，默认 [10, 20, 100, 200] */;
}

// ==================== 数据类型定义 ====================

/**
 * 分页响应数据结构
 * 定义后端 API 返回的标准分页数据格式
 * @template TRecord 数据记录类型
 */
export interface PaginatedResponse<TRecord = unknown> {
  data: TRecord[] /** 数据列表 */;
  page?: number /** 当前页码 */;
  pageSize?: number /** 每页条数 */;
  pageCount?: number /** 总页数 */;
  recordsCount?: number /** 总记录数 */;
  [key: string]: unknown /** 其他扩展字段 */;
}

/**
 * 查询参数类型
 * 定义查询函数接收的参数结构
 * 通常包含分页参数、搜索条件、排序参数等
 */
export type QueryParams = Record<string, unknown>;

/**
 * getPageInfo 函数的分页信息参数类型
 * 用于配置分页组件的显示和行为
 */
export interface PageInfoConfig {
  page?: number /** 当前页码 */;
  pageSize?: number /** 每页条数 */;
  showTotal?: boolean /** 是否显示总数 */;
  totalField?: string /** 总数字段名 */;
  pageField?: string /** 页码字段名 */;
  pageSizeField?: string /** 页面大小字段名 */;
  sizeCanChange?: boolean /** 是否可以改变页面大小 */;
  sizeOptions?: number[] /** 页面大小选项 */;
}

// ==================== 主组件类型定义 ====================

/**
 * ListPage 主组件属性类型
 * 
 * @template TRecord 表格行数据类型，默认为 Record<string, unknown>
 * @template TQueryParams 查询参数类型，默认为 QueryParams，必须继承 QueryParams
 * @template TResponse 响应数据类型，默认为 PaginatedResponse<TRecord>，必须继承 PaginatedResponse<TRecord>
 */
export interface ProTableProps<
  TRecord = Record<string, unknown>,
  TQueryParams extends QueryParams = QueryParams,
  TResponse extends PaginatedResponse<TRecord> = PaginatedResponse<TRecord>
> {
  // ==================== 必需属性 ====================
  
  /**
   * 表格列配置
   * 使用 Ant Design Table 的 ColumnsType 类型
   */
  columns: ColumnsType<TRecord>;
  
  /**
   * 数据查询函数
   * 接收查询参数，返回 Promise 格式的分页数据
   * @param params 查询参数，包含分页、搜索条件等
   * @returns Promise<TResponse> 分页响应数据
   */
  queryFn: (params?: TQueryParams) => Promise<TResponse>;

  // ==================== 可选属性 ====================
  
  /**
   * 默认查询参数
   * 组件初始化和重置时使用的默认参数
   */
  defaultQueryData?: TQueryParams;
  
  /**
   * 自定义内容
   * 显示在操作区域和表格之间的自定义内容
   */
  children?: React.ReactNode;
  
  /**
   * 操作区域内容
   * 通常放置新建按钮、批量操作按钮等
   */
  operation?: React.ReactNode;
  
  /**
   * 是否显示搜索表单
   * @default true
   */
  showSearchForm?: boolean;
  
  /**
   * 分页配置
   * 自定义分页行为，包括字段映射、显示配置等
   */
  pagination?: IPaginationProps;
  
  /**
   * 是否显示分页组件
   * @default true
   */
  showPagination?: boolean;
  
  /**
   * 是否需要分页功能
   * 设为 false 时不会添加分页参数到查询中
   * @default true
   */
  needPagination?: boolean;
  
  /**
   * 搜索表单配置数组
   * 定义搜索表单的表单项
   */
  formOptions?: FormOptions[];
  
  /**
   * 表格属性
   * 透传给 Ant Design Table 组件的属性
   * 排除了 dataSource（由组件管理）
   */
  tableProps?: Omit<ITableProps, 'dataSource'>;
  
  /**
   * 空数据提示文字
   * @default "暂无数据"
   */
  emptyText?: string;
  
  /**
   * 表格行唯一标识字段名
   * @default "id"
   */
  tableRowKey?: string | number;
  
  /**
   * 是否启用自动搜索
   * 启用后表单值变化时自动触发查询
   * @default false
   */
  autoSearch?: boolean;
  
  /**
   * 外部表单实例
   * 用于表单联动或外部控制表单
   */
  form?: FormInstance;
  
  /**
   * 防抖延迟时间（毫秒）
   * 用于优化搜索性能，避免频繁请求
   * @default 300
   */
  debounceDelay?: number;
  
  /**
   * 外部刷新标识
   * 当此值变化时会触发重新查询
   * 通常用于外部控制数据刷新
   */
  refreshKey?: number;
}
