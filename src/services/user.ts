import { BaseApiService } from './base';
import { get, post, ApiResponse } from '@/utils/request';

/**
 * 用户数据接口
 */
export interface User {
  id: string /** 用户ID */;
  username: string /** 用户名 */;
  email: string /** 邮箱 */;
  realName: string /** 真实姓名 */;
  phone?: string /** 手机号 */;
  avatar?: string /** 头像 */;
  status: number /** 状态：1-正常，0-禁用 */;
  roles: string[] /** 角色列表 */;
  permissions: string[] /** 权限列表 */;
  createTime: string /** 创建时间 */;
  updateTime: string /** 更新时间 */;
}

/**
 * 登录请求参数
 */
export interface LoginParams {
  username: string /** 用户名 */;
  password: string /** 密码 */;
  captcha?: string /** 验证码 */;
  remember?: boolean /** 记住登录 */;
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
  token: string /** 访问令牌 */;
  refreshToken: string /** 刷新令牌 */;
  user: User /** 用户信息 */;
  expiresIn: number /** 过期时间（秒） */;
}

/**
 * 修改密码参数
 */
export interface ChangePasswordParams {
  oldPassword: string /** 旧密码 */;
  newPassword: string /** 新密码 */;
  confirmPassword: string /** 确认密码 */;
}

/**
 * 用户 API 服务
 */
class UserApiService extends BaseApiService<User> {
  constructor() {
    super('/user');
  }

  /**
   * 用户登录
   */
  async login(params: LoginParams): Promise<ApiResponse<LoginResponse>> {
    return post<LoginResponse>('/auth/login', params);
  }

  /**
   * 用户登出
   */
  async logout(): Promise<ApiResponse<void>> {
    return post<void>('/auth/logout');
  }

  /**
   * 刷新令牌
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string; expiresIn: number }>> {
    return post<{ token: string; expiresIn: number }>('/auth/refresh', { refreshToken });
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return get<User>('/user/current');
  }

  /**
   * 更新当前用户信息
   */
  async updateCurrentUser(data: Partial<User>): Promise<ApiResponse<User>> {
    return post<User>('/user/update-profile', data, {
      showSuccessMessage: true,
    });
  }

  /**
   * 修改密码
   */
  async changePassword(params: ChangePasswordParams): Promise<ApiResponse<void>> {
    return post<void>('/user/change-password', params, {
      showSuccessMessage: true,
    });
  }

  /**
   * 上传头像
   */
  async uploadAvatar(file: File): Promise<ApiResponse<{ url: string }>> {
    const { upload } = await import('@/utils/request');
    return upload<{ url: string }>('/user/upload-avatar', file, {
      showSuccessMessage: true,
    });
  }

  /**
   * 获取用户权限
   */
  async getUserPermissions(userId?: string): Promise<ApiResponse<string[]>> {
    return get<string[]>('/user/permissions', userId ? { userId } : undefined);
  }

  /**
   * 检查用户名是否可用
   */
  async checkUsername(username: string): Promise<ApiResponse<{ available: boolean }>> {
    return get<{ available: boolean }>('/user/check-username', { username });
  }

  /**
   * 检查邮箱是否可用
   */
  async checkEmail(email: string): Promise<ApiResponse<{ available: boolean }>> {
    return get<{ available: boolean }>('/user/check-email', { email });
  }

  /**
   * 重置密码
   */
  async resetPassword(email: string): Promise<ApiResponse<void>> {
    return post<void>('/user/reset-password', { email }, {
      showSuccessMessage: true,
    });
  }

  /**
   * 启用/禁用用户
   */
  async toggleUserStatus(userId: string, status: number): Promise<ApiResponse<void>> {
    return post<void>(`/user/${userId}/toggle-status`, { status }, {
      showSuccessMessage: true,
    });
  }

  /**
   * 分配角色
   */
  async assignRoles(userId: string, roleIds: string[]): Promise<ApiResponse<void>> {
    return post<void>(`/user/${userId}/assign-roles`, { roleIds }, {
      showSuccessMessage: true,
    });
  }
}

/**
 * 用户 API 服务实例
 */
export const userApi = new UserApiService();

export default userApi;
