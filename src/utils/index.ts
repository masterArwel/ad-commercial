import dayjs from 'dayjs';
import { debounce, throttle } from 'lodash';
import { customAlphabet } from 'nanoid';
import JSEncrypt from 'jsencrypt';
import { RSA_PUBLIC_KEY } from '@/constants';

// 日期格式化
export const formatDate = (
  date: string | Date,
  format = 'YYYY-MM-DD HH:mm:ss'
): string => {
  return dayjs(date).format(format);
};

// 防抖函数
export const debounceFn = debounce;

// 节流函数
export const throttleFn = throttle;

// 深拷贝
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array)
    return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

// 生成唯一ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// 格式化文件大小
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 验证邮箱
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 验证手机号
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// 用于提交表单时移除格式化添加的空格字符
export const removeFormattedSpaces = (formattedPhone: string): string => {
  return formattedPhone.replace(/\s/g, '');
};

// 获取URL参数
export const getUrlParamsByKey = (
  key: string,
  url?: string
): string | undefined => {
  if (!key) {
    return undefined;
  }
  const searchUrl = url?.split('?')[1] || window.location.search;
  const params = new URLSearchParams(searchUrl);

  return params.get(key) || undefined;
};

// 设置URL参数
export const setUrlParams = (params: Record<string, string>): void => {
  const url = new URL(window.location.href);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  window.history.replaceState({}, '', url.toString());
};

// 移除URL参数
export const removeUrlParams = (keys: string[]): void => {
  const url = new URL(window.location.href);

  keys.forEach(key => {
    url.searchParams.delete(key);
  });

  window.history.replaceState({}, '', url.toString());
};

// 下载文件
export const downloadFile = (url: string, filename?: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || '';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 复制到剪贴板
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // 降级方案
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }
};
// 生成随机长度的字符
export const generateCode = (len = 10) => {
  const only_alpha =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';

  const nano = customAlphabet(only_alpha, len);
  return nano();
};

export function formatSize(size: number) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let i = 0;
  while (size >= 1024) {
    size /= 1024;
    i++;
  }
  return size.toFixed(2) + ' ' + units[i];
}

// CSS类名合并工具函数
export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(' ');
};

// 格式化统一社会信用代码/身份证号码/手机号（添加空格分隔）
export const formatSpecialInputValue = (
  value?: string,
  firstNumber: number = 6,
  secondNumber: number = 8,
  thirdNumber: number = 4
): string => {
  if (!value) return '';
  const cleaned = value.replace(/[^\w]/g, '');
  const regex = new RegExp(
    `^(\\w{0,${firstNumber}})(\\w{0,${secondNumber}})(\\w{0,${thirdNumber}}).*$`
  );
  const match = cleaned.match(regex);
  if (match) {
    return [match[1], match[2], match[3]].filter(Boolean).join(' ');
  }
  return cleaned;
};

export const getToken = () => {
  return localStorage.getItem('@!-token!@');
};

// 密码校验
export const validatePassword = (_: unknown, value: string) => {
  if (!value) {
    return Promise.reject();
  }

  const missing: string[] = [];

  if (value.length < 8 || value.length > 20) {
    return Promise.reject(
      new Error('密码需为8-20位，且同时包含大小写字母、数字。')
    );
  }
  if (!/[a-z]/.test(value)) {
    missing.push('小写字母');
  }
  if (!/[A-Z]/.test(value)) {
    missing.push('大写字母');
  }
  if (!/\d/.test(value)) {
    missing.push('数字');
  }

  if (missing.length > 0) {
    return Promise.reject(
      new Error(
        `新密码须包含大小写字母、数字，当前缺少[${missing.join('、')}]，请完善后提交`
      )
    );
  }

  return Promise.resolve();
};

/**
 * RSA 加密函数
 * 用于加密敏感信息（账号密码、身份证号等）
 * @param plainText 待加密的明文
 * @returns 加密后的Base64字符串，失败时返回null
 */
export const rsaEncrypt = (plainText: string): string => {
  if (!plainText) {
    console.warn('RSA加密：明文为空');
    return '';
  }

  try {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(RSA_PUBLIC_KEY);
    const encrypted = encrypt.encrypt(plainText);

    if (!encrypted) {
      console.error('RSA加密失败：加密结果为明文');
      return plainText;
    }

    return encrypted;
  } catch (error) {
    console.error('RSA加密异常:', error);
    return plainText;
  }
};

/**
 * RSA 批量加密函数
 * 用于同时加密多个字段
 * @param data 待加密的数据对象，key为字段名，value为待加密的明文
 * @returns 加密后的数据对象，key保持不变，value为加密后的Base64字符串
 */
export const rsaEncryptBatch = <T extends Record<string, string>>(
  data: T
): Partial<Record<keyof T, string>> => {
  const result: Partial<Record<keyof T, string>> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value) {
      const encrypted = rsaEncrypt(value);
      if (encrypted) {
        result[key as keyof T] = encrypted;
      }
    }
  }

  return result;
};
