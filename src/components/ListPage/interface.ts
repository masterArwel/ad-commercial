import type { ColProps } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { FormItemProps as AntdFormItemProps } from 'antd/es/form';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { InputProps } from 'antd';
import type { SelectProps } from 'antd';
import type { CascaderProps } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';

// search form
export type SearchFormItemType =
  | 'Input'
  | 'Custom'
  | 'Select'
  | 'DatePicker'
  | 'Cascader'
  | 'InputTag';

export type GirdColProps = {
  colProps?: ColProps;
};

// Keep backward compatibility while offering a correct spelling alias
export type GridColProps = GirdColProps;

export type FormItemProps = Pick<
  AntdFormItemProps,
  'tooltip' | 'label' | 'rules'
>;

export type CommonItemProps = GirdColProps & FormItemProps;

export interface SearchFormInputProps extends InputProps, CommonItemProps {
  fieldName: string;
  placeholder?: string;
  type: 'Input';
}

export interface SearchFormInputTagProps extends SelectProps, CommonItemProps {
  fieldName: string;
  placeholder?: string;
  type: 'InputTag';
}

export interface SearchDatePickerProps
  extends RangePickerProps,
    CommonItemProps {
  fieldName: string;
  type: 'DatePicker';
}

export interface SearchSelectProps extends SelectProps, CommonItemProps {
  fieldName: string;
  placeholder?: string;
  type: 'Select';
}

export type CascaderFormProps = CommonItemProps & {
  fieldName: string;
  placeholder?: string;
  defaultValue?: unknown; // ts-ignore
  type: 'Cascader';
} & Omit<CascaderProps, 'multiple'> & { multiple?: true };

export interface CustomFormItemProps extends CommonItemProps {
  fieldName: string;
  type: 'Custom';
  placeholder?: string;
  defaultValue?: string;
  component: JSX.Element;
}

export type FormOptions =
  | SearchSelectProps
  | SearchFormInputProps
  | SearchFormInputTagProps
  | CustomFormItemProps
  | SearchDatePickerProps
  | CascaderFormProps;

// table
export interface ITableProps
  extends Omit<
    TableProps<unknown>,
    'dataSource' | 'loading' | 'rowKey' | 'pagination'
  > {
  rowKey?: string;
}

export interface IPaginationProps {
  showTotal?: boolean;
  totalField?: string;
  pageField?: string;
  pageSizeField?: string;
  pageSize?: number; // 添加自定义默认页面大小
  sizeCanChange?: boolean;
  sizeOptions?: number[];
}

// 分页响应数据结构
export interface PaginatedResponse<TRecord = unknown> {
  data: TRecord[];
  page?: number;
  pageSize?: number;
  pageCount?: number;
  recordsCount?: number;
  [key: string]: unknown;
}

// 查询参数类型
export type QueryParams = Record<string, unknown>;

export interface ProTableProps<
  TRecord = Record<string, unknown>,
  TQueryParams extends QueryParams = QueryParams,
  TResponse extends PaginatedResponse<TRecord> = PaginatedResponse<TRecord>
> {
  columns: ColumnsType<TRecord>;
  defaultQueryData?: TQueryParams;
  children?: React.ReactNode;
  operation?: React.ReactNode;
  showSearchForm?: boolean;
  pagination?: IPaginationProps;
  showPagination?: boolean;
  needPagination?: boolean;
  formOptions?: FormOptions[];
  tableProps?: Omit<ITableProps, 'dataSource'>;
  emptyText?: string;
  queryFn: (params?: TQueryParams) => Promise<TResponse>;
  tableRowKey?: string | number;
  autoSearch?: boolean;
  form?: FormInstance;
  debounceDelay?: number; // 防抖延迟时间（毫秒），默认300ms
  refreshKey?: number; // 外部刷新标识，变化时触发重新查询
}
