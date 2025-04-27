'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { 
  Github, 
  ExternalLink, 
  Check, 
  AlertTriangle, 
  RotateCcw,
  Shield,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

export default function GitHubSettingsPage() {
  const { accessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showConfigInstructions, setShowConfigInstructions] = useState(false);
  const [githubInfo, setGithubInfo] = useState<{
    login?: string;
    avatar_url?: string;
    html_url?: string;
  } | null>(null);

  // 检查GitHub连接状态
  useEffect(() => {
    const checkGitHubConnection = async () => {
      try {
        // 这里应该调用API检查GitHub连接状态
        // 现在使用accessToken作为判断依据
        if (accessToken) {
          setIsConnected(true);
          
          // 模拟获取GitHub用户信息
          // 在实际应用中，这应该从你的API获取
          setGithubInfo({
            login: 'github_username',
            avatar_url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
            html_url: 'https://github.com/github_username',
          });
        } else {
          setIsConnected(false);
          setGithubInfo(null);
        }
      } catch (error) {
        console.error('检查GitHub连接失败:', error);
        setIsConnected(false);
      }
    };

    checkGitHubConnection();
  }, [accessToken]);

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

  // 处理GitHub连接
  const handleConnectGitHub = async () => {
    setIsLoading(true);
    try {
      // 实际部署时需要使用真实的 OAUTH_CLIENT_ID
      const OAUTH_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || 'your_github_oauth_client_id';
      const REDIRECT_URI = encodeURIComponent(`${getDeployedDomain()}/api/auth/callback/github?bind=true`);
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${OAUTH_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo`;
      
      toast.info('正在跳转到 GitHub 授权页面...');
      window.location.href = authUrl;
    } catch (error) {
      console.error('GitHub连接失败:', error);
      toast.error('连接失败，请重试');
      setIsLoading(false);
    }
  };

  // 处理GitHub断开连接
  const handleDisconnectGitHub = async () => {
    setIsLoading(true);
    try {
      // 这里应该调用API断开GitHub连接
      // 在实际应用中，这应该清除用户的GitHub令牌
      
      // 模拟断开连接
      setTimeout(() => {
        setIsConnected(false);
        setGithubInfo(null);
        toast.success('已成功断开与GitHub的连接');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('断开GitHub连接失败:', error);
      toast.error('断开连接失败，请重试');
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">GitHub 连接</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            连接您的GitHub账号以管理Actions工作流和定时任务
          </p>
        </div>

        {!isConnected && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">需要 GitHub 连接</h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>您需要连接 GitHub 账号才能使用 Zanet Cron 管理 GitHub Actions 定时任务。</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-start sm:justify-between">
              <div className="sm:flex sm:items-center">
                <div className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-full p-2">
                  <Github className="h-8 w-8 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">GitHub</h3>
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    {isConnected ? (
                      <>
                        <Check className="mr-1 h-4 w-4 text-green-500" />
                        <span>已连接</span>
                        {githubInfo && (
                          <a
                            href={githubInfo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 inline-flex items-center text-primary-600 hover:text-primary-500"
                          >
                            @{githubInfo.login}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        )}
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="mr-1 h-4 w-4 text-yellow-500" />
                        <span>未连接</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
                {isConnected ? (
                  <button
                    type="button"
                    onClick={handleDisconnectGitHub}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <RotateCcw className="mr-2 -ml-1 h-4 w-4" />
                    断开连接
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleConnectGitHub}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Github className="mr-2 -ml-1 h-4 w-4" />
                      连接 GitHub
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowConfigInstructions(!showConfigInstructions)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Info className="mr-2 -ml-1 h-4 w-4" />
                      {showConfigInstructions ? '隐藏配置说明' : '查看配置说明'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {showConfigInstructions && (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">GitHub OAuth 配置说明</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400 space-y-4">
                <p>要使用 GitHub 登录和授权功能，您需要在 GitHub 上创建一个 OAuth 应用：</p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">步骤 1: 创建 GitHub OAuth 应用</h4>
                  <ol className="list-decimal list-inside space-y-2 pl-2">
                    <li>前往 <a href="https://github.com/settings/developers" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-500 underline">GitHub 开发者设置</a></li>
                    <li>点击 &quot;New OAuth App&quot; 按钮</li>
                    <li>填写应用信息:
                      <ul className="list-disc list-inside pl-5 mt-1">
                        <li>Application name: Zanet Cron Manager</li>
                        <li>Homepage URL: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{getDeployedDomain()}</code></li>
                        <li>Application description: (可选描述)</li>
                        <li>Authorization callback URL: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{`${getDeployedDomain()}/api/auth/callback/github`}</code></li>
                      </ul>
                    </li>
                    <li>点击 &quot;Register application&quot;</li>
                    <li>注册后，您将获得 Client ID 和 Client Secret</li>
                  </ol>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">步骤 2: 配置Vercel环境变量</h4>
                  <p>将获取的 Client ID 和 Client Secret 添加到Vercel项目的环境变量中：</p>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                    <pre className="text-sm">
                      GITHUB_CLIENT_ID=您的客户端ID<br />
                      GITHUB_CLIENT_SECRET=您的客户端密钥<br />
                      NEXT_PUBLIC_GITHUB_CLIENT_ID=您的客户端ID
                    </pre>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">步骤 3: 重新部署应用</h4>
                  <p>添加环境变量后，在Vercel上重新部署应用，GitHub 连接功能将可用。</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">权限和范围</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
              <p>
                连接GitHub后，我们需要以下权限来管理您的Actions工作流:
              </p>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Shield className="h-5 w-5 text-primary-500" />
                </div>
                <div className="ml-3 text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">读取和写入仓库内容</p>
                  <p className="text-gray-500 dark:text-gray-400">读取和修改您的仓库内容，包括工作流配置文件</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Shield className="h-5 w-5 text-primary-500" />
                </div>
                <div className="ml-3 text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">工作流权限</p>
                  <p className="text-gray-500 dark:text-gray-400">触发、查看和管理GitHub Actions工作流</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 