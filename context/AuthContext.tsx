'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// 用户类型定义
type User = {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
} | null;

// 认证上下文类型
type AuthContextType = {
  user: User;
  accessToken: string | null;
  isLoading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

// 创建上下文
const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  isLoading: true,
  logout: () => {},
  refreshUser: async () => {},
});

// 提供一个使用上下文的钩子
export const useAuth = () => useContext(AuthContext);

// 上下文提供者组件
export default function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化 - 从 cookie 或 localStorage 加载会话
  useEffect(() => {
    const loadSession = async () => {
      try {
        // 尝试从服务端 API 获取当前会话
        const response = await fetch('/api/auth/session');
        const data = await response.json();

        if (data.user) {
          setUser(data.user);
          setAccessToken(data.accessToken);
        }
      } catch (error) {
        console.error('加载会话失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  // 登出函数
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setAccessToken(null);
      toast.success('已成功登出');
      router.push('/login');
    } catch (error) {
      console.error('登出失败:', error);
      toast.error('登出失败，请重试');
    }
  };

  // 刷新用户信息
  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (data.user) {
        setUser(data.user);
        setAccessToken(data.accessToken);
      } else {
        setUser(null);
        setAccessToken(null);
      }
    } catch (error) {
      console.error('刷新用户信息失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    accessToken,
    isLoading,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 