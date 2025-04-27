'use client';

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { 
  Settings, 
  Github, 
  Copy, 
  Save,
  Download,
  FileText,
  Check,
  BellRing,
  Database,
  User
} from "lucide-react";
import { toast } from "sonner";

// 模拟数据
const mockSettings = {
  notifications: {
    email: true,
    discord: false,
    slack: false,
    telegram: false,
    emailAddress: "user@example.com",
    discordWebhook: "",
    slackWebhook: "",
    telegramBotToken: "",
    telegramChatId: ""
  },
  database: {
    type: "vercel-kv",
    customUrl: ""
  },
  github: {
    repo: "user/my-cron-repo",
    branch: "main",
    workflowFile: ".github/workflows/cron.yml",
    autoCreatePr: true
  },
  webhook: {
    enabled: true,
    url: "https://my-app.vercel.app/api/webhook",
    secret: "your-webhook-secret"
  }
};

function CopyButton({ text, label }: { text: string, label?: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      toast.error('复制失败，请手动复制');
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className="inline-flex items-center justify-center p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
      title={label || "复制到剪贴板"}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
}

// 设置值类型
type SettingValue = string | boolean | number;

export default function SettingsPage() {
  const [settings, setSettings] = useState(mockSettings);
  const [activeTab, setActiveTab] = useState('github');
  
  const handleSettingsChange = (category: string, key: string, value: SettingValue) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    console.log('保存设置:', settings);
    toast.success('设置已保存');
  };

  const handleDownloadWorkflow = () => {
    const link = document.createElement('a');
    link.href = '/templates/github-actions-cron.yml';
    link.download = 'cron.yml';
    link.click();
    toast.success('工作流文件下载中');
  };

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">系统设置</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            管理系统配置和集成
          </p>
        </div>
        <button 
          onClick={handleSaveSettings}
          className="btn btn-primary inline-flex items-center"
        >
          <Save className="mr-2 h-4 w-4" />
          保存设置
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <nav className="flex overflow-x-auto py-2" aria-label="设置项">
            <button 
              onClick={() => setActiveTab('github')}
              className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'github' 
                  ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Github className="h-4 w-4 mr-2" />
                GitHub Actions
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'notifications' 
                  ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center">
                <BellRing className="h-4 w-4 mr-2" />
                通知设置
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('database')}
              className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'database' 
                  ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Database className="h-4 w-4 mr-2" />
                数据存储
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('webhook')}
              className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'webhook' 
                  ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Webhook配置
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('account')}
              className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'account' 
                  ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                账户设置
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'github' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">GitHub Actions 配置</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  使用GitHub Actions执行长时间运行的任务。创建一个GitHub仓库，并添加以下工作流文件。
                </p>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-primary-600 dark:text-primary-400" />
                      <span className="font-medium text-sm">工作流文件</span>
                    </div>
                    <div className="flex items-center">
                      <button 
                        onClick={handleDownloadWorkflow}
                        className="inline-flex items-center text-xs text-primary-600 dark:text-primary-400 hover:underline mr-2"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        下载文件
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-3 overflow-auto text-xs font-mono max-h-80">
                      <div className="absolute top-3 right-3">
                        <CopyButton text={`name: 定时任务执行\n\non:\n  schedule:\n    # 每天北京时间9点执行\n    - cron: '0 1 * * *'\n  \n  workflow_dispatch:\n    inputs:\n      task:\n        description: '要执行的任务名称'\n        required: false\n        default: 'all'\n\njobs:\n  run-scripts:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - uses: actions/setup-node@v3\n        with:\n          node-version: '18'\n      - uses: actions/setup-python@v4\n        with:\n          python-version: '3.10'\n      # 更多步骤请查看完整文件\n`} />
                      </div>
                      <pre className="text-gray-800 dark:text-gray-200">
                        {`name: 定时任务执行

on:
  schedule:
    # 每天北京时间9点执行
    - cron: '0 1 * * *'
  
  workflow_dispatch:
    inputs:
      task:
        description: '要执行的任务名称'
        required: false
        default: 'all'

jobs:
  run-scripts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      # 更多步骤请查看完整文件`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="github-repo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      GitHub仓库地址
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="github-repo"
                        className="input w-full"
                        placeholder="例如: username/repo"
                        value={settings.github.repo}
                        onChange={(e) => handleSettingsChange('github', 'repo', e.target.value)}
                      />
                      <CopyButton text={settings.github.repo} />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="github-branch" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      分支名称
                    </label>
                    <input
                      type="text"
                      id="github-branch"
                      className="input w-full"
                      placeholder="例如: main"
                      value={settings.github.branch}
                      onChange={(e) => handleSettingsChange('github', 'branch', e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="workflow-file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    工作流文件路径
                  </label>
                  <input
                    type="text"
                    id="workflow-file"
                    className="input w-full"
                    placeholder="例如: .github/workflows/cron.yml"
                    value={settings.github.workflowFile}
                    onChange={(e) => handleSettingsChange('github', 'workflowFile', e.target.value)}
                  />
                </div>

                <div className="mt-4 flex items-center">
                  <input
                    id="auto-create-pr"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    checked={settings.github.autoCreatePr}
                    onChange={(e) => handleSettingsChange('github', 'autoCreatePr', e.target.checked)}
                  />
                  <label htmlFor="auto-create-pr" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    自动创建PR以更新工作流文件（推荐）
                  </label>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Github className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400">集成说明</h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                        <p>1. 在GitHub上创建一个新仓库或使用现有仓库</p>
                        <p>2. 下载工作流文件并上传到仓库中的 <code className="text-xs bg-blue-100 dark:bg-blue-800/50 rounded px-1">.github/workflows/</code> 目录</p>
                        <p>3. 在GitHub仓库设置中添加Secrets（例如API密钥）</p>
                        <p>4. 添加 <code className="text-xs bg-blue-100 dark:bg-blue-800/50 rounded px-1">VERCEL_WEBHOOK_URL</code> Secret以便将执行结果推送回Vercel</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">通知设置</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="email-notifications"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    checked={settings.notifications.email}
                    onChange={(e) => handleSettingsChange('notifications', 'email', e.target.checked)}
                  />
                  <label htmlFor="email-notifications" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    启用电子邮件通知
                  </label>
                </div>

                {settings.notifications.email && (
                  <div className="ml-6 mt-2">
                    <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      电子邮件地址
                    </label>
                    <input
                      type="email"
                      id="email-address"
                      className="input w-full sm:w-96"
                      placeholder="例如: user@example.com"
                      value={settings.notifications.emailAddress}
                      onChange={(e) => handleSettingsChange('notifications', 'emailAddress', e.target.value)}
                    />
                  </div>
                )}

                <div className="flex items-center mt-4">
                  <input
                    id="discord-notifications"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    checked={settings.notifications.discord}
                    onChange={(e) => handleSettingsChange('notifications', 'discord', e.target.checked)}
                  />
                  <label htmlFor="discord-notifications" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    启用Discord通知
                  </label>
                </div>

                {settings.notifications.discord && (
                  <div className="ml-6 mt-2">
                    <label htmlFor="discord-webhook" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Discord Webhook URL
                    </label>
                    <input
                      type="text"
                      id="discord-webhook"
                      className="input w-full sm:w-96"
                      placeholder="例如: https://discord.com/api/webhooks/..."
                      value={settings.notifications.discordWebhook}
                      onChange={(e) => handleSettingsChange('notifications', 'discordWebhook', e.target.value)}
                    />
                  </div>
                )}

                <div className="flex items-center mt-4">
                  <input
                    id="telegram-notifications"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    checked={settings.notifications.telegram}
                    onChange={(e) => handleSettingsChange('notifications', 'telegram', e.target.checked)}
                  />
                  <label htmlFor="telegram-notifications" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    启用Telegram通知
                  </label>
                </div>

                {settings.notifications.telegram && (
                  <div className="ml-6 mt-2 space-y-4">
                    <div>
                      <label htmlFor="telegram-bot-token" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Telegram Bot Token
                      </label>
                      <input
                        type="text"
                        id="telegram-bot-token"
                        className="input w-full sm:w-96"
                        placeholder="例如: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                        value={settings.notifications.telegramBotToken}
                        onChange={(e) => handleSettingsChange('notifications', 'telegramBotToken', e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="telegram-chat-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Telegram Chat ID
                      </label>
                      <input
                        type="text"
                        id="telegram-chat-id"
                        className="input w-full sm:w-96"
                        placeholder="例如: -1001234567890"
                        value={settings.notifications.telegramChatId}
                        onChange={(e) => handleSettingsChange('notifications', 'telegramChatId', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'database' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">数据存储设置</h3>
              
              <div>
                <label htmlFor="database-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  数据库类型
                </label>
                <select
                  id="database-type"
                  className="input w-full sm:w-96"
                  value={settings.database.type}
                  onChange={(e) => handleSettingsChange('database', 'type', e.target.value)}
                >
                  <option value="vercel-kv">Vercel KV (Redis)</option>
                  <option value="vercel-postgres">Vercel Postgres</option>
                  <option value="custom">自定义数据库</option>
                </select>
              </div>

              {settings.database.type === 'custom' && (
                <div className="mt-4">
                  <label htmlFor="database-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    数据库连接URL
                  </label>
                  <input
                    type="text"
                    id="database-url"
                    className="input w-full"
                    placeholder="例如: postgres://user:password@localhost:5432/mydb"
                    value={settings.database.customUrl}
                    onChange={(e) => handleSettingsChange('database', 'customUrl', e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    注意：连接字符串将被加密存储，但请确保不要在公共环境中泄露此信息。
                  </p>
                </div>
              )}

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400">数据存储说明</h3>
                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                      <p>
                        使用Vercel KV或Postgres可以在免费额度内存储您的任务数据和执行历史。
                        这些服务与Vercel部署集成，无需额外配置。
                      </p>
                      <p className="mt-2">
                        如果选择自定义数据库，您需要自行维护数据库服务并提供正确的连接URL。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'webhook' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Webhook配置</h3>
              
              <div className="flex items-center">
                <input
                  id="webhook-enabled"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={settings.webhook.enabled}
                  onChange={(e) => handleSettingsChange('webhook', 'enabled', e.target.checked)}
                />
                <label htmlFor="webhook-enabled" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  启用Webhook接收GitHub Actions执行结果
                </label>
              </div>

              {settings.webhook.enabled && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Webhook URL
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="webhook-url"
                        className="input w-full"
                        placeholder="例如: https://your-app.vercel.app/api/webhook"
                        value={settings.webhook.url}
                        onChange={(e) => handleSettingsChange('webhook', 'url', e.target.value)}
                      />
                      <CopyButton text={settings.webhook.url} />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      此URL应该添加到GitHub Secrets中的VERCEL_WEBHOOK_URL变量
                    </p>
                  </div>

                  <div>
                    <label htmlFor="webhook-secret" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Webhook密钥（用于验证请求）
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="webhook-secret"
                        className="input w-full"
                        placeholder="输入一个安全的随机字符串"
                        value={settings.webhook.secret}
                        onChange={(e) => handleSettingsChange('webhook', 'secret', e.target.value)}
                      />
                      <CopyButton text={settings.webhook.secret} />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Github className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Webhook配置说明</h3>
                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <p>
                        Webhook允许GitHub Actions在任务执行完成后将结果发送回您的Vercel应用。
                        将生成的URL和密钥添加到GitHub仓库的Secrets中，使工作流可以安全地发送执行结果。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">账户设置</h3>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-6">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  这是一个演示项目，目前不支持账户管理。在完整版本中，您可以在此管理账户信息、密码和API密钥。
                </p>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Zanet</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">项目作者</p>
                    <div className="mt-4">
                      <a 
                        href="https://github.com/Zanet" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        <Github className="h-4 w-4 mr-1" />
                        Github主页
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
} 