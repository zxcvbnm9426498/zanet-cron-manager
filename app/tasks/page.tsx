'use client';

import AppLayout from "@/components/layout/AppLayout";
import { 
  CalendarClock, 
  Search, 
  Plus, 
  MoreVertical,
  PlayCircle,
  PauseCircle,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// 模拟数据
const MOCK_TASKS = [
  { 
    id: 1, 
    name: "每日签到任务", 
    schedule: "0 8 * * *", 
    lastRun: "2024-06-10 08:00", 
    nextRun: "2024-06-11 08:00", 
    status: "active",
    type: "python",
    lastStatus: "success"
  },
  { 
    id: 2, 
    name: "数据库备份", 
    schedule: "0 1 * * *", 
    lastRun: "2024-06-10 01:00", 
    nextRun: "2024-06-11 01:00", 
    status: "active",
    type: "shell",
    lastStatus: "success"
  },
  { 
    id: 3, 
    name: "同步用户数据", 
    schedule: "*/30 * * * *", 
    lastRun: "2024-06-10 14:30", 
    nextRun: "2024-06-10 15:00", 
    status: "active",
    type: "node",
    lastStatus: "running"
  },
  { 
    id: 4, 
    name: "清理临时文件", 
    schedule: "0 0 * * 0", 
    lastRun: "2024-06-09 00:00", 
    nextRun: "2024-06-16 00:00", 
    status: "inactive",
    type: "shell",
    lastStatus: "failed"
  },
  { 
    id: 5, 
    name: "更新缓存", 
    schedule: "0 */4 * * *", 
    lastRun: "2024-06-10 12:00", 
    nextRun: "2024-06-10 16:00", 
    status: "active",
    type: "node",
    lastStatus: "success"
  }
];

// 任务行动作下拉菜单
function TaskActionMenu({ onEdit, onDelete, onRun, onToggle, status }: { 
  onEdit: () => void; 
  onDelete: () => void; 
  onRun: () => void; 
  onToggle: () => void; 
  status: string;
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
            <PlayCircle className="mr-2 h-4 w-4" />
            立即执行
          </button>
          <button 
            onClick={() => { onEdit(); setOpen(false); }} 
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Edit className="mr-2 h-4 w-4" />
            编辑任务
          </button>
          <button 
            onClick={() => { onToggle(); setOpen(false); }} 
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {status === 'active' ? (
              <>
                <PauseCircle className="mr-2 h-4 w-4" />
                禁用任务
              </>
            ) : (
              <>
                <PlayCircle className="mr-2 h-4 w-4" />
                启用任务
              </>
            )}
          </button>
          <button 
            onClick={() => { onDelete(); setOpen(false); }} 
            className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            删除任务
          </button>
        </div>
      )}
    </div>
  );
}

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // 过滤任务
  const filteredTasks = MOCK_TASKS.filter(task => 
    task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.schedule.includes(searchQuery)
  );

  // 处理任务操作
  const handleEditTask = (id: number) => {
    console.log(`Edit task ${id}`);
  };

  const handleDeleteTask = (id: number) => {
    console.log(`Delete task ${id}`);
  };

  const handleRunTask = (id: number) => {
    console.log(`Run task ${id}`);
  };

  const handleToggleTask = (id: number) => {
    console.log(`Toggle task ${id}`);
  };

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">定时任务</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            管理您的定时任务和自动化脚本
          </p>
        </div>
        <Link 
          href="/tasks/new"
          className="btn btn-primary inline-flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          新建任务
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
              placeholder="搜索任务..."
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
                  任务名称
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  定时规则
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  上次运行
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  下次运行
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
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/20 mr-3">
                        <CalendarClock className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {task.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {task.type === 'python' && 'Python'}
                          {task.type === 'node' && 'Node.js'}
                          {task.type === 'shell' && 'Shell'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white font-mono">
                      {task.schedule}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {task.lastStatus === 'success' && (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      )}
                      {task.lastStatus === 'failed' && (
                        <XCircle className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      {task.lastStatus === 'running' && (
                        <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                      )}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {task.lastRun}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {task.nextRun}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${task.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }
                    `}>
                      {task.status === 'active' ? '运行中' : '已停止'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <TaskActionMenu 
                      onEdit={() => handleEditTask(task.id)}
                      onDelete={() => handleDeleteTask(task.id)}
                      onRun={() => handleRunTask(task.id)}
                      onToggle={() => handleToggleTask(task.id)}
                      status={task.status}
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