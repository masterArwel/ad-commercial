import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  InternalAxiosRequestConfig 
} from 'axios';
import { message } from 'antd';

/**
 * 通用响应数据结构
 */
export interface ApiResponse<T = any> {
  code: number /** 响应状态码 */;
  message: string /** 响应消息 */;
  data: T /** 响应数据 */;
  success: boolean /** 是否成功 */;
}

/**
 * 请求配置接口
 */
export interface RequestConfig extends AxiosRequestConfig {
  skipErrorHandler?: boolean /** 是否跳过错误处理 */;
  showLoading?: boolean /** 是否显示加载状态 */;
  showSuccessMessage?: boolean /** 是否显示成功消息 */;
}

/**
 * 环境配置
 */
const getBaseURL = (): string => {
  const env = import.meta.env.MODE;
  
  switch (env) {
    case 'development':
      return 'http://localhost:8080/api';
    case 'test':
      return 'https://test-api.example.com/api';
    case 'production':
      return 'https://api.example.com/api';
    default:
      return 'http://localhost:8080/api';
  }
};

/**
 * 创建 axios 实例
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: getBaseURL(),
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 添加认证 token
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 添加请求 ID 用于追踪
      config.headers['X-Request-ID'] = generateRequestId();

      // 添加时间戳防止缓存
      if (config.method === 'get') {
        config.params = {
          ...config.params,
          _t: Date.now(),
        };
      }

      console.log('📤 Request:', {
        url: config.url,
        method: config.method,
        params: config.params,
        data: config.data,
      });

      return config;
    },
    (error) => {
      console.error('❌ Request Error:', error);
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      const { data } = response;
      
      console.log('📥 Response:', {
        url: response.config.url,
        status: response.status,
        data: data,
      });

      // 检查业务状态码
      if (data.code === 200 || data.success) {
        // 显示成功消息（如果配置了）
        const config = response.config as RequestConfig;
        if (config.showSuccessMessage && data.message) {
          message.success(data.message);
        }
        return response;
      }

      // 处理业务错误
      const errorMessage = data.message || '请求失败';
      message.error(errorMessage);
      
      return Promise.reject(new Error(errorMessage));
    },
    (error) => {
      console.error('❌ Response Error:', error);
      
      // 检查是否跳过错误处理
      const config = error.config as RequestConfig;
      if (config?.skipErrorHandler) {
        return Promise.reject(error);
      }

      // 处理不同类型的错误
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 401:
            message.error('登录已过期，请重新登录');
            // 清除 token 并跳转到登录页
            localStorage.removeItem('access_token');
            window.location.href = '/login';
            break;
          case 403:
            message.error('没有权限访问该资源');
            break;
          case 404:
            message.error('请求的资源不存在');
            break;
          case 500:
            message.error('服务器内部错误');
            break;
          default:
            message.error(data?.message || `请求失败 (${status})`);
        }
      } else if (error.request) {
        // 网络错误
        message.error('网络连接失败，请检查网络设置');
      } else {
        // 其他错误
        message.error(error.message || '请求失败');
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * 生成请求 ID
 */
const generateRequestId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * axios 实例
 */
const request = createAxiosInstance();

/**
 * 通用请求方法
 */
export const apiRequest = <T = any>(
  config: RequestConfig
): Promise<ApiResponse<T>> => {
  return request(config).then(response => response.data);
};

/**
 * GET 请求
 */
export const get = <T = any>(
  url: string,
  params?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>({
    method: 'GET',
    url,
    params,
    ...config,
  });
};

/**
 * POST 请求
 */
export const post = <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>({
    method: 'POST',
    url,
    data,
    ...config,
  });
};

/**
 * PUT 请求
 */
export const put = <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>({
    method: 'PUT',
    url,
    data,
    ...config,
  });
};

/**
 * DELETE 请求
 */
export const del = <T = any>(
  url: string,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>({
    method: 'DELETE',
    url,
    ...config,
  });
};

/**
 * PATCH 请求
 */
export const patch = <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>({
    method: 'PATCH',
    url,
    data,
    ...config,
  });
};

/**
 * 文件上传
 */
export const upload = <T = any>(
  url: string,
  file: File,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  const formData = new FormData();
  formData.append('file', file);
  
  return apiRequest<T>({
    method: 'POST',
    url,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  });
};

/**
 * 批量上传
 */
export const uploadMultiple = <T = any>(
  url: string,
  files: File[],
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`files[${index}]`, file);
  });
  
  return apiRequest<T>({
    method: 'POST',
    url,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  });
};

/**
 * 下载文件
 */
export const download = (
  url: string,
  filename?: string,
  config?: RequestConfig
): Promise<void> => {
  return request({
    method: 'GET',
    url,
    responseType: 'blob',
    ...config,
  }).then(response => {
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  });
};

export default request;
