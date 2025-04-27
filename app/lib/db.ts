import { getEnv } from './env';
import { createPool } from '@vercel/postgres';

// 创建连接池
export const db = createPool({
  connectionString: getEnv('DATABASE_URL'),
});

// 系统配置类型
export type SystemConfig = {
  id: number;
  key: string;
  value: string;
  description?: string;
  is_encrypted: boolean;
  created_at: Date;
  updated_at: Date;
};

// 获取系统配置
export async function getSystemConfig(key: string): Promise<string | null> {
  try {
    const { rows } = await db.query<SystemConfig>(
      'SELECT * FROM system_config WHERE key = $1',
      [key]
    );
    return rows.length > 0 ? rows[0].value : null;
  } catch (error) {
    console.error('获取系统配置失败:', error);
    return null;
  }
}

// 设置系统配置
export async function setSystemConfig(
  key: string, 
  value: string, 
  description?: string,
  isEncrypted: boolean = false
): Promise<boolean> {
  try {
    const now = new Date();
    await db.query(
      `INSERT INTO system_config (key, value, description, is_encrypted, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (key) 
       DO UPDATE SET value = $2, description = $3, is_encrypted = $4, updated_at = $6`,
      [key, value, description, isEncrypted, now, now]
    );
    return true;
  } catch (error) {
    console.error('设置系统配置失败:', error);
    return false;
  }
}

// 初始化数据库
export async function initDatabase(): Promise<boolean> {
  try {
    // 创建系统配置表
    await db.query(`
      CREATE TABLE IF NOT EXISTS system_config (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) UNIQUE NOT NULL,
        value TEXT NOT NULL,
        description TEXT,
        is_encrypted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
      );
    `);
    
    // 创建其他必要的表...
    
    return true;
  } catch (error) {
    console.error('初始化数据库失败:', error);
    return false;
  }
} 