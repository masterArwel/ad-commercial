import { get, post, put, del, patch, ApiResponse } from '@/utils/request';

/**
 * 分页请求参数
 */
export interface PaginationParams {
  pageNum?: number /** 页码 */;
  pageSize?: number /** 每页数量 */;
  sortBy?: string /** 排序字段 */;
  sortOrder?: 'asc' | 'desc' /** 排序方向 */;
}

/**
 * 分页响应数据
 */
export interface PaginationResponse<T> {
  list: T[] /** 数据列表 */;
  total: number /** 总数 */;
  pageNum: number /** 当前页码 */;
  pageSize: number /** 每页数量 */;
  totalPages: number /** 总页数 */;
}

/**
 * 基础 API 服务类
 */
export abstract class BaseApiService<T = any> {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * 获取列表（分页）
   */
  async getList(params?: PaginationParams & Record<string, any>): Promise<ApiResponse<PaginationResponse<T>>> {
    return get<PaginationResponse<T>>(`${this.baseUrl}/list`, {
      pageNum: 1,
      pageSize: 10,
      ...params,
    });
  }

  /**
   * 获取所有数据（不分页）
   */
  async getAll(params?: Record<string, any>): Promise<ApiResponse<T[]>> {
    return get<T[]>(`${this.baseUrl}/all`, params);
  }

  /**
   * 根据 ID 获取详情
   */
  async getById(id: string | number): Promise<ApiResponse<T>> {
    return get<T>(`${this.baseUrl}/${id}`);
  }

  /**
   * 创建新记录
   */
  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    return post<T>(`${this.baseUrl}`, data, {
      showSuccessMessage: true,
    });
  }

  /**
   * 更新记录
   */
  async update(id: string | number, data: Partial<T>): Promise<ApiResponse<T>> {
    return put<T>(`${this.baseUrl}/${id}`, data, {
      showSuccessMessage: true,
    });
  }

  /**
   * 部分更新记录
   */
  async patch(id: string | number, data: Partial<T>): Promise<ApiResponse<T>> {
    return patch<T>(`${this.baseUrl}/${id}`, data, {
      showSuccessMessage: true,
    });
  }

  /**
   * 删除记录
   */
  async delete(id: string | number): Promise<ApiResponse<void>> {
    return del<void>(`${this.baseUrl}/${id}`, {
      showSuccessMessage: true,
    });
  }

  /**
   * 批量删除
   */
  async batchDelete(ids: (string | number)[]): Promise<ApiResponse<void>> {
    return post<void>(`${this.baseUrl}/batch-delete`, { ids }, {
      showSuccessMessage: true,
    });
  }

  /**
   * 批量更新
   */
  async batchUpdate(data: { id: string | number; [key: string]: any }[]): Promise<ApiResponse<void>> {
    return post<void>(`${this.baseUrl}/batch-update`, { data }, {
      showSuccessMessage: true,
    });
  }

  /**
   * 搜索
   */
  async search(keyword: string, params?: PaginationParams): Promise<ApiResponse<PaginationResponse<T>>> {
    return get<PaginationResponse<T>>(`${this.baseUrl}/search`, {
      keyword,
      pageNum: 1,
      pageSize: 10,
      ...params,
    });
  }

  /**
   * 导出数据
   */
  async export(params?: Record<string, any>): Promise<void> {
    const { download } = await import('@/utils/request');
    return download(`${this.baseUrl}/export`, `${this.baseUrl.split('/').pop()}_export.xlsx`, {
      params,
    });
  }

  /**
   * 导入数据
   */
  async import(file: File): Promise<ApiResponse<{ success: number; failed: number }>> {
    const { upload } = await import('@/utils/request');
    return upload<{ success: number; failed: number }>(`${this.baseUrl}/import`, file, {
      showSuccessMessage: true,
    });
  }
}

/**
 * 创建 API 服务实例的工厂函数
 */
export function createApiService<T = any>(baseUrl: string) {
  return new (class extends BaseApiService<T> {
    constructor() {
      super(baseUrl);
    }
  })();
}

export default BaseApiService;
