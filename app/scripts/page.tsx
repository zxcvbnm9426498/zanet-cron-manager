'use client';

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { 
  FileCode, 
  Search, 
  Plus, 
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Eye,
  FileType
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// 模拟数据
const MOCK_SCRIPTS = [
  { 
    id: 1, 
    name: "daily-signup.js", 
    type: "node",
    size: "2.3 KB",
    created: "2024-06-01 10:30",
    updated: "2024-06-10 14:22",
    tasks: 2
  },
  { 
    id: 2, 
    name: "backup-database.sh", 
    type: "shell",
    size: "1.1 KB",
    created: "2024-05-20 09:45",
    updated: "2024-06-08 22:15",
    tasks: 1
  },
  { 
    id: 3, 
    name: "sync-users.js", 
    type: "node",
    size: "3.7 KB",
    created: "2024-06-05 16:20",
    updated: "2024-06-09 11:30",
    tasks: 1
  },
  { 
    id: 4, 
    name: "cleanup.py", 
    type: "python",
    size: "4.2 KB",
    created: "2024-05-10 12:00",
    updated: "2024-06-03 17:42",
    tasks: 1
  },
  { 
    id: 5, 
    name: "update-cache.js", 
    type: "node",
    size: "1.8 KB",
    created: "2024-06-08 08:15",
    updated: "2024-06-10 10:10",
    tasks: 1
  }
];

// 脚本行动作下拉菜单
function ScriptActionMenu({ onEdit, onDelete, onView, onDownload }: { 
  onEdit: () => void; 
  onDelete: () => void; 
  onView: () => void; 
  onDownload: () => void; 
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
            onClick={() => { onView(); setOpen(false); }} 
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Eye className="mr-2 h-4 w-4" />
            查看脚本
          </button>
          <button 
            onClick={() => { onEdit(); setOpen(false); }} 
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Edit className="mr-2 h-4 w-4" />
            编辑脚本
          </button>
          <button 
            onClick={() => { onDownload(); setOpen(false); }} 
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Download className="mr-2 h-4 w-4" />
            下载脚本
          </button>
          <button 
            onClick={() => { onDelete(); setOpen(false); }} 
            className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            删除脚本
          </button>
        </div>
      )}
    </div>
  );
}

// 获取脚本图标
function getScriptIcon(type: string) {
  switch (type) {
    case 'node':
      return <FileCode className="h-5 w-5 text-green-600 dark:text-green-400" />;
    case 'python':
      return <FileCode className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    case 'shell':
      return <FileCode className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
    default:
      return <FileType className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
  }
}

export default function ScriptsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // 过滤脚本
  const filteredScripts = MOCK_SCRIPTS.filter(script => 
    script.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    script.type.includes(searchQuery)
  );

  // 处理脚本操作
  const handleEditScript = (id: number) => {
    console.log(`Edit script ${id}`);
    toast.info('编辑脚本功能即将推出');
  };

  const handleDeleteScript = (id: number) => {
    console.log(`Delete script ${id}`);
    toast.success('脚本已删除');
  };

  const handleViewScript = (id: number) => {
    console.log(`View script ${id}`);
    toast.info('查看脚本功能即将推出');
  };

  const handleDownloadScript = (id: number) => {
    console.log(`Download script ${id}`);
    toast.success('脚本下载已开始');
  };

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">脚本管理</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            管理和编辑您的自动化脚本
          </p>
        </div>
        <Link 
          href="/scripts/new"
          className="btn btn-primary inline-flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          新建脚本
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10 w-full"
              placeholder="搜索脚本..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  脚本名称
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  大小
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  更新时间
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  关联任务
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {filteredScripts.map((script) => (
                <tr key={script.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 mr-3">
                        {getScriptIcon(script.type)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {script.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {script.type === 'node' && 'Node.js'}
                          {script.type === 'python' && 'Python'}
                          {script.type === 'shell' && 'Shell'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {script.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {script.updated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400">
                      {script.tasks} 个任务
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <ScriptActionMenu 
                      onEdit={() => handleEditScript(script.id)}
                      onDelete={() => handleDeleteScript(script.id)}
                      onView={() => handleViewScript(script.id)}
                      onDownload={() => handleDownloadScript(script.id)}
                    />
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