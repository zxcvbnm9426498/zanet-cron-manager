'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { 
  Search, 
  Plus, 
  Play, 
  Pause, 
  RefreshCcw, 
  Github, 
  GitBranch, 
  History,
  Settings,
  FileCode,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

// GitHub Actions 工作流类型
type Workflow = {
  id: number;
  name: string;
  path: string;
  state: string;
  created_at: string;
  updated_at: string;
  url: string;
  html_url: string;
  badge_url: string;
  repository: {
    name: string;
    full_name: string;
    owner: {
      login: string;
    }
  };
  last_run?: {
    status: string;
    conclusion: string | null;
    created_at: string;
  }
};

// 模拟数据
const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: 1,
    name: "每日签到任务",
    path: ".github/workflows/daily-check-in.yml",
    state: "active",
    created_at: "2024-06-01T10:30:00Z",
    updated_at: "2024-06-10T14:22:00Z",
    url: "https://api.github.com/repos/username/repo/actions/workflows/1",
    html_url: "https://github.com/username/repo/actions/workflows/daily-check-in.yml",
    badge_url: "https://github.com/username/repo/workflows/Daily%20Check-in/badge.svg",
    repository: {
      name: "repo",
      full_name: "username/repo",
      owner: {
        login: "username"
      }
    },
    last_run: {
      status: "completed",
      conclusion: "success",
      created_at: "2024-06-10T08:00:00Z"
    }
  },
  {
    id: 2,
    name: "数据库备份",
    path: ".github/workflows/db-backup.yml",
    state: "active",
    created_at: "2024-05-20T09:45:00Z",
    updated_at: "2024-06-08T22:15:00Z",
    url: "https://api.github.com/repos/username/repo/actions/workflows/2",
    html_url: "https://github.com/username/repo/actions/workflows/db-backup.yml",
    badge_url: "https://github.com/username/repo/workflows/Database%20Backup/badge.svg",
    repository: {
      name: "repo",
      full_name: "username/repo",
      owner: {
        login: "username"
      }
    },
    last_run: {
      status: "completed", 
      conclusion: "success",
      created_at: "2024-06-10T01:00:00Z"
    }
  },
  {
    id: 3,
    name: "同步用户数据",
    path: ".github/workflows/sync-users.yml",
    state: "active",
    created_at: "2024-06-05T16:20:00Z",
    updated_at: "2024-06-09T11:30:00Z",
    url: "https://api.github.com/repos/username/repo/actions/workflows/3",
    html_url: "https://github.com/username/repo/actions/workflows/sync-users.yml",
    badge_url: "https://github.com/username/repo/workflows/Sync%20Users/badge.svg",
    repository: {
      name: "repo",
      full_name: "username/repo",
      owner: {
        login: "username"
      }
    },
    last_run: {
      status: "in_progress",
      conclusion: null,
      created_at: "2024-06-10T14:30:00Z"
    }
  },
  {
    id: 4,
    name: "清理临时文件",
    path: ".github/workflows/cleanup.yml",
    state: "disabled",
    created_at: "2024-05-10T12:00:00Z",
    updated_at: "2024-06-03T17:42:00Z",
    url: "https://api.github.com/repos/username/repo/actions/workflows/4",
    html_url: "https://github.com/username/repo/actions/workflows/cleanup.yml",
    badge_url: "https://github.com/username/repo/workflows/Cleanup/badge.svg",
    repository: {
      name: "repo",
      full_name: "username/repo", 
      owner: {
        login: "username"
      }
    },
    last_run: {
      status: "completed",
      conclusion: "failure",
      created_at: "2024-06-09T00:00:00Z"
    }
  }
];

// 工作流操作菜单组件
function WorkflowActionMenu({ workflow, onRun, onToggle, onEdit, onDelete }: { 
  workflow: Workflow;
  onRun: () => void;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)} 
        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <MoreVertical className="h-5 w-5 text-gray-500" />
      </button>

      {open && (
        <div 
          className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1"
          onBlur={() => setOpen(false)}
        >
          <button 
            onClick={() => { onRun(); setOpen(false); }} 
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Play className="mr-2 h-4 w-4" />
            立即运行
          </button>
          <button 
            onClick={() => { onEdit(); setOpen(false); }} 
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Edit className="mr-2 h-4 w-4" />
            编辑工作流
          </button>
          <button 
            onClick={() => { onToggle(); setOpen(false); }} 
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {workflow.state === 'active' ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                禁用工作流
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                启用工作流
              </>
            )}
          </button>
          <button 
            onClick={() => { onDelete(); setOpen(false); }} 
            className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            删除工作流
          </button>
        </div>
      )}
    </div>
  );
}

export default function GitHubActionsPage() {
  const { user, accessToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [repositories, setRepositories] = useState<string[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");

  // 获取工作流列表
  useEffect(() => {
    // 这里实际应用中会从 GitHub API 获取数据
    // 现在使用模拟数据
    setWorkflows(MOCK_WORKFLOWS);
    setRepositories(['username/repo', 'username/another-repo']);
    setIsLoading(false);
  }, []);

  // 过滤工作流
  const filteredWorkflows = workflows.filter(workflow => 
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    workflow.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 处理工作流操作
  const handleRunWorkflow = (workflow: Workflow) => {
    toast.info(`正在运行工作流: ${workflow.name}`);
    // 实际应用中这里会调用 GitHub API 触发工作流
  };

  const handleToggleWorkflow = (workflow: Workflow) => {
    const newState = workflow.state === 'active' ? 'disabled' : 'active';
    toast.success(`工作流 ${workflow.name} 已${newState === 'active' ? '启用' : '禁用'}`);
    // 实际应用中这里会调用 GitHub API 修改工作流状态
  };

  const handleEditWorkflow = (workflow: Workflow) => {
    toast.info(`编辑工作流: ${workflow.name}`);
    // 实际应用中这里会跳转到工作流编辑页面
  };

  const handleDeleteWorkflow = (workflow: Workflow) => {
    toast.success(`工作流 ${workflow.name} 已删除`);
    // 实际应用中这里会调用 GitHub API 删除工作流
  };

  // 获取工作流运行状态对应的样式
  const getStatusClass = (status: string, conclusion: string | null) => {
    if (status === 'in_progress') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    if (conclusion === 'success') return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    if (conclusion === 'failure') return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  // 获取工作流运行状态对应的文本
  const getStatusText = (status: string, conclusion: string | null) => {
    if (status === 'in_progress') return '运行中';
    if (conclusion === 'success') return '成功';
    if (conclusion === 'failure') return '失败';
    return '未知';
  };

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">GitHub Actions</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            管理您的 GitHub Actions 工作流
          </p>
        </div>
        <button 
          onClick={() => toast.info('创建工作流功能即将推出')}
          className="btn btn-primary inline-flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          新建工作流
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10 w-full"
              placeholder="搜索工作流..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <select
              className="input"
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
            >
              <option value="">所有仓库</option>
              {repositories.map(repo => (
                <option key={repo} value={repo}>{repo}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => toast.success('工作流已刷新')}
            className="btn inline-flex items-center ml-auto"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            刷新
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  工作流
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  仓库
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  最近运行
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  状态
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {filteredWorkflows.map((workflow) => (
                <tr key={workflow.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/20 mr-3">
                        <FileCode className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {workflow.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {workflow.path}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Github className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {workflow.repository.full_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {workflow.last_run ? new Date(workflow.last_run.created_at).toLocaleString() : '未运行'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {workflow.state === 'active' ? (
                        <span className="mr-2 inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                      ) : (
                        <span className="mr-2 inline-flex h-2.5 w-2.5 rounded-full bg-gray-400"></span>
                      )}
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {workflow.state === 'active' ? '运行中' : '已禁用'}
                      </span>
                    </div>
                    {workflow.last_run && (
                      <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${getStatusClass(workflow.last_run.status, workflow.last_run.conclusion)}
                      `}>
                        {getStatusText(workflow.last_run.status, workflow.last_run.conclusion)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleRunWorkflow(workflow)}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400"
                        title="运行工作流"
                      >
                        <Play className="h-5 w-5" />
                      </button>
                      <a 
                        href={workflow.html_url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        title="在 GitHub 查看"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                      <WorkflowActionMenu 
                        workflow={workflow}
                        onRun={() => handleRunWorkflow(workflow)}
                        onToggle={() => handleToggleWorkflow(workflow)}
                        onEdit={() => handleEditWorkflow(workflow)}
                        onDelete={() => handleDeleteWorkflow(workflow)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
} 