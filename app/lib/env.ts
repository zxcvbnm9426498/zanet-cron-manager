/*
 * @Author: 择安网络
 * @Code function: 
 * @Date: 2025-04-27 22:42:47
 * @FilePath: /vercel-cron-manager/app/lib/env.ts
 * @LastEditTime: 2025-04-27 22:50:00
 */
/**
 * 环境变量配置工具
 * 用于集中管理应用的环境变量，提供类型安全的访问方式
 */

// 必需的环境变量列表
const requiredEnvVars = [
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
] as const;

// 可选的环境变量列表
const optionalEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
] as const;

// 创建环境变量类型
type RequiredEnvVars = typeof requiredEnvVars[number];
type OptionalEnvVars = typeof optionalEnvVars[number];
type EnvVars = RequiredEnvVars | OptionalEnvVars;

// 环境变量值的类型
export type Env = {
  [key in RequiredEnvVars]: string;
} & {
  [key in OptionalEnvVars]?: string;
};

// 获取环境变量的函数
export function getEnv(key: EnvVars): string | undefined {
  return process.env[key];
}

// 获取必需的环境变量，如果不存在则抛出错误
export function getRequiredEnv(key: RequiredEnvVars): string {
  const value = getEnv(key);
  if (!value) {
    throw new Error(`必需的环境变量 ${key} 未设置`);
  }
  return value;
}

// 验证所有必需的环境变量是否存在
export function validateEnv(): boolean {
  try {
    requiredEnvVars.forEach(getRequiredEnv);
    return true;
  } catch (error) {
    console.error('环境变量验证失败:', error);
    return false;
  }
}

// 获取所有环境变量
export function getAllEnv(): Env {
  const env: Partial<Env> = {};
  
  // 添加所有必需的环境变量
  requiredEnvVars.forEach(key => {
    try {
      env[key] = getRequiredEnv(key);
    } catch (error) {
      console.error(error);
    }
  });
  
  // 添加所有可选的环境变量
  optionalEnvVars.forEach(key => {
    const value = getEnv(key);
    if (value) {
      env[key] = value;
    }
  });
  
  return env as Env;
}

// 当应用启动时验证环境变量
validateEnv(); 