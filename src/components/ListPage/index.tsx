import { useState, useEffect, forwardRef, useCallback, useRef } from 'react';

import { Card, Empty, Table } from 'antd';
import type { PaginationProps } from 'antd';

import { type ProTableProps, type PaginatedResponse, type QueryParams, type PageInfoConfig } from './interface';
import SearchForm, { type SearchFormRef } from './SearchForm';

const DEFAULT_QUERY_DATA = {
  pageIndex: 1,
  pageSize: 10,
  timestamp: new Date().getTime(),
};

export function getPageInfo(
  data: PaginatedResponse<unknown>,
  pageInfo: PageInfoConfig = {}
): PaginationProps {
  const {
    showTotal,
    totalField = 'recordsCount',
    pageField = 'page',
    pageSizeField = 'pageSize',
  } = pageInfo;

  const pagination: PaginationProps = {
    pageSize: (pageSizeField === 'pageSize' ? pageInfo?.pageSize : undefined) || (data?.[pageSizeField] as number | undefined) || data?.pageSize || 10,
    showSizeChanger: true,
    current: (data?.[pageField] as number | undefined) || (pageField === 'page' ? pageInfo?.page : undefined) || data?.page || 1,
  } as PaginationProps;
  if (showTotal) {
    pagination.total = data?.[totalField] as number | undefined;
    pagination.showTotal = total => `共 ${total} 条`;
  }
  pagination.pageSizeOptions =
    pageInfo?.sizeOptions || [10, 20, 100, 200].map(String);
  return pagination;
}

const ProTable = forwardRef<SearchFormRef, ProTableProps>(
  (props, searchFormRef) => {
    const {
      columns,
      queryFn,
      defaultQueryData = {},
      children,
      operation,
      formOptions = [],
      showSearchForm = true,
      tableProps,
      showPagination = true,
      needPagination = true,
      pagination = {
        showTotal: true,
        totalField: 'recordsCount',
        pageField: 'page',
        pageSizeField: 'pageSize',
      },
      emptyText = '暂无数据',
      tableRowKey = 'id',
      autoSearch = false,
      refreshKey,
    } = props;

    // 获取默认的 pageSize，优先级：pagination.pageSize > defaultQueryData.pageSize > DEFAULT_QUERY_DATA.pageSize
    const getDefaultPageSize = () => {
      return (
        pagination?.pageSize ||
        (defaultQueryData as QueryParams)?.pageSize as number ||
        DEFAULT_QUERY_DATA.pageSize
      );
    };

    const [queryData, setQueryData] = useState<QueryParams>({
      ...(needPagination
        ? { ...DEFAULT_QUERY_DATA, pageSize: getDefaultPageSize() }
        : {}),
      ...defaultQueryData,
    } as QueryParams);

    // 数据状态管理
    const [data, setData] = useState<PaginatedResponse<Record<string, unknown>> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    // 使用ref来存储queryFn，避免因为queryFn变化导致的重复调用
    const queryFnRef = useRef(queryFn);
    queryFnRef.current = queryFn;

    // 防重复调用的ref
    const isFetchingRef = useRef(false);

    // 获取数据的函数
    const fetchData = useCallback(async (params: QueryParams) => {
      // 防止重复调用
      if (isFetchingRef.current) {
        return;
      }

      try {
        isFetchingRef.current = true;
        setIsFetching(true);
        if (!data) {
          setIsLoading(true);
        }

        const result = await queryFnRef.current(params as QueryParams);
        setData(result as PaginatedResponse<Record<string, unknown>>);
        setIsLoading(false);
        setIsFetching(false);
      } catch (err) {
        const error = err as Error;
        setIsLoading(false);
        setIsFetching(false);
        console.error('数据获取失败:', error);
      } finally {
        isFetchingRef.current = false;
      }
    }, []); // 移除queryFn依赖

    // 监听查询数据变化和外部刷新标识变化，统一处理数据获取
    useEffect(() => {
      fetchData(queryData);
    }, [queryData, fetchData, refreshKey]);

    const res = data;

    /**
     * 获取对象中所有数组类型且首项为日期字符串的键
     * @param obj - 待处理的对象
     * @returns 符合条件的键名数组
     *
     * @example
     * const obj = {
     *   validDates: ['2023-10-01', '2023-10-02'],
     *   validTimes: ['2023-03-04 11:59:59','2023-03-04 23:00:00']
     *   invalidDates: ['not-a-date', 123],
     *   nonArray: '2023-10-01'
     * };
     * getDateArrayKeys(obj); // ['validDates','validTimes']
     */
    const getDateArrayKeys = (obj: Record<string, unknown>): string[] => {
      const DATE_TIME_REGEX =
        /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])(?: ([01]\d|2[0-3]):([0-5]\d):([0-5]\d))?$/;
      return Object.entries(obj)
        .filter(([_, value]) => {
          console.log('key', _);
          // 第一步：过滤数组类型且非空
          if (!Array.isArray(value) || value.length === 0) return false;
          // 第二步：校验首项为日期字符串
          const firstItem = value[0];
          if (typeof firstItem !== 'string') return false;
          return DATE_TIME_REGEX.test(firstItem);
        })
        .map(([key]) => key);
    };

    function handleSearch(params: QueryParams) {
      const dateArrayKeys = getDateArrayKeys(params);
      const hasRangeKeys = dateArrayKeys.length > 0;
      // 创建需要清理的日期字段模式，防止重制后queryData携带上一次的日期
      const timeFieldPattern = /(StartTime|EndTime)$/;
      const timeFields = hasRangeKeys
        ? dateArrayKeys.reduce((acc: Record<string, unknown>, key) => {
            const arr = params[key];
            if (Array.isArray(arr)) {
              const hasTimeFormat = (str: string) =>
                /\d{1,2}:\d{2}:\d{2}$/.test(str);
              // 处理开始时间和结束时间，若未设置默认值或具体时间，则采用00:00:00-23:59:59
              const start = arr[0]
                ? hasTimeFormat(String(arr[0]))
                  ? arr[0]
                  : `${arr[0]} 00:00:00`
                : null;
              const end = arr[1]
                ? hasTimeFormat(String(arr[1]))
                  ? arr[1]
                  : `${arr[1]} 23:59:59`
                : null;
              acc[`${key}StartTime`] = start;
              acc[`${key}EndTime`] = end;
            }
            return acc;
          }, {})
        : {};

      const newQueryData = {
        // 清除上一步残留的日期范围属性
        ...Object.keys(queryData)
          .filter(k => !timeFieldPattern.test(k))
          .reduce((acc, k) => ({ ...acc, [k]: (queryData as QueryParams)[k] }), {} as QueryParams),
        ...params,
        ...timeFields,
        ...(needPagination
          ? {
              pageIndex: 1,
              pageSize: getDefaultPageSize(), // 使用自定义的默认 pageSize
            }
          : {}),
        timestamp: new Date().getTime(),
      };
      setQueryData(newQueryData);
    }
    const loading = isLoading || isFetching;

    return (
      <div>
        {showSearchForm && (
          <Card styles={{ body: { paddingBottom: 0 } }}>
            <SearchForm
              form={props?.form}
              ref={searchFormRef}
              initialValues={defaultQueryData}
              formOptions={formOptions}
              loading={loading}
              onSearch={handleSearch}
              autoSearch={autoSearch}
            />
          </Card>
        )}
        <Card
          className={!showSearchForm ? '' : 'mt-4'}
          styles={{
            body: {
              padding: '20px',
              paddingTop: operation ? '20px' : '0',
            },
          }}
        >
          {children}
          {!!operation && <div className="operation-content">{operation}</div>}
          <div>
            <Table<Record<string, unknown>>
              rowKey={tableRowKey as string}
              loading={loading}
              // @ts-ignore - antd Table type inference limitation with generic ProTableProps
              columns={columns}
              dataSource={res?.data || []}
              pagination={
                showPagination && needPagination
                  ? {
                      ...getPageInfo(res || { data: [] } as PaginatedResponse<Record<string, unknown>>, {
                        ...pagination,
                        page: queryData.pageIndex as number | undefined,
                        pageSize: queryData.pageSize as number | undefined,
                      }),
                      onChange: (pageIndexber, pageSize) => {
                        setQueryData({
                          ...queryData,
                          pageIndex: pageIndexber,
                          pageSize,
                        });
                      },
                    }
                  : false
              }
              scroll={{
                x: 1142,
              }}
              locale={{
                emptyText: !loading ? (
                  <Empty description={emptyText} />
                ) : undefined,
              }}
              {...tableProps}
            />
          </div>
        </Card>
      </div>
    );
  }
);

export default ProTable;
