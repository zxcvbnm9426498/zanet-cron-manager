'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Github, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function GitHubIntegrationPrompt() {
  const { user, accessToken } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  
  // 检查用户是否已绑定GitHub (基于accessToken和用户登录来源)
  // GitHub登录的用户会有login属性，而且会有accessToken
  const hasGitHubBinding = Boolean(accessToken && user?.login);
  
  // 获取实际部署的域名
  const getDeployedDomain = () => {
    if (typeof window === 'undefined') return 'https://your-app.vercel.app';
    
    // 生产环境下使用实际域名
    if (process.env.NODE_ENV === 'production') {
      return window.location.origin;
    }
    
    // 开发环境下模拟Vercel部署域名
    return 'https://zanet-cron.vercel.app';
  };
  
  // 如果用户已绑定GitHub或已关闭提示，不显示组件
  if (hasGitHubBinding || dismissed) {
    return null;
  }
  
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg shadow-sm mb-6">
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" />
              <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">尚未绑定 GitHub 账号</h3>
            </div>
            <div className="mt-2 max-w-xl text-sm text-yellow-700 dark:text-yellow-300">
              <p>
                您需要绑定 GitHub 账号才能使用 Zanet Cron 管理 GitHub Actions 定时任务。
              </p>
            </div>
            <div className="mt-4 space-y-3 text-sm text-yellow-700 dark:text-yellow-300">
              <h4 className="font-semibold">配置步骤：</h4>
              <ol className="list-decimal list-inside space-y-2">
                <li>前往 <a href="https://github.com/settings/developers" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-500 underline">GitHub 开发者设置</a> 创建 OAuth App</li>
                <li>设置 Homepage URL 为：<code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">{getDeployedDomain()}</code></li>
                <li>设置 Authorization callback URL 为：<code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">{`${getDeployedDomain()}/api/auth/callback/github`}</code></li>
                <li>获取 Client ID 和 Client Secret</li>
                <li>在Vercel部署设置中添加环境变量：
                  <pre className="bg-yellow-100 dark:bg-yellow-900 p-2 mt-1 rounded overflow-x-auto">
                    GITHUB_CLIENT_ID=您的Client_ID<br />
                    GITHUB_CLIENT_SECRET=您的Client_Secret<br />
                    NEXT_PUBLIC_GITHUB_CLIENT_ID=您的Client_ID
                  </pre>
                </li>
              </ol>
            </div>
            <div className="mt-5">
              <Link 
                href="/settings/github"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Github className="mr-2 -ml-1 h-4 w-4" />
                前往绑定 GitHub
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                稍后再说
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 