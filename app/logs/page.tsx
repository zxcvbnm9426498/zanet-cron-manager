'use client';

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { 
  History, 
  Search, 
  CalendarClock,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Trash2,
  Filter
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// 模拟日志数据
const MOCK_LOGS = [
  { 
    id: 1, 
    taskName: "每日签到任务", 
    taskId: 1,
    executionTime: "2024-06-10 08:00:22", 
    duration: "12s",
    status: "success",
    output: "任务执行成功，已完成签到操作。\n用户积分已更新。" 
  },
  { 
    id: 2, 
    taskName: "数据库备份", 
    taskId: 2,
    executionTime: "2024-06-10 01:00:05", 
    duration: "45s",
    status: "success",
    output: "数据库备份成功，文件已保存至备份服务器。\n总备份大小: 1.2GB" 
  },
  { 
    id: 3, 
    taskName: "同步用户数据", 
    taskId: 3,
    executionTime: "2024-06-10 14:30:10", 
    duration: "28s",
    status: "running",
    output: "同步进行中..." 
  },
  { 
    id: 4, 
    taskName: "清理临时文件", 
    taskId: 4,
    executionTime: "2024-06-09 00:00:03", 
    duration: "5s",
    status: "failed",
    output: "Error: 无法访问目标目录，权限被拒绝\n进程以代码 1 退出" 
  },
  { 
    id: 5, 
    taskName: "更新缓存", 
    taskId: 5,
    executionTime: "2024-06-10 12:00:18", 
    duration: "32s",
    status: "success",
    output: "缓存更新完成，共更新 208 个对象。\n过期缓存已清理。" 
  }
];

// 日志详情弹窗组件
function LogDetailModal({ log, onClose }: { log: any, onClose: () => void }) {
  if (!log) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">执行日志详情</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4">
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">任务名称</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{log.taskName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">执行时间</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{log.executionTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">执行状态</p>
              <div className="flex items-center">
                {log.status === 'success' && (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                )}
                {log.status === 'failed' && (
                  <XCircle className="h-4 w-4 text-red-500 mr-1" />
                )}
                {log.status === 'running' && (
                  <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                )}
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {log.status === 'success' ? '成功' : log.status === 'failed' ? '失败' : '进行中'}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">执行时长</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{log.duration}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">输出内容</p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md overflow-auto text-xs font-mono text-gray-800 dark:text-gray-200 h-64">
              {log.output}
            </pre>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end space-x-3">
          <button 
            onClick={() => {
              toast.success('日志已下载');
              onClose();
            }}
            className="btn inline-flex items-center justify-center text-sm"
          >
            <Download className="mr-2 h-4 w-4" />
            下载日志
          </button>
          <button 
            onClick={onClose}
            className="btn btn-primary inline-flex items-center justify-center text-sm"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<any>(null);
  
  // 过滤日志
  const filteredLogs = MOCK_LOGS.filter(log => {
    const matchesSearch = log.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.executionTime.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // 处理查看日志
  const handleViewLog = (log: any) => {
    setSelectedLog(log);
  };

  // 处理下载日志
  const handleDownloadLog = (id: number) => {
    console.log(`Download log ${id}`);
    toast.success('日志已下载');
  };

  // 处理删除日志
  const handleDeleteLog = (id: number) => {
    console.log(`Delete log ${id}`);
    toast.success('日志已删除');
  };

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">执行日志</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            查看任务执行历史和日志记录
          </p>
        </div>
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
              placeholder="搜索日志..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <select
              className="input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">所有状态</option>
              <option value="success">成功</option>
              <option value="failed">失败</option>
              <option value="running">进行中</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  任务
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  执行时间
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  执行时长
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
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/20 mr-3">
                        <CalendarClock className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {log.taskName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          任务 #{log.taskId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {log.executionTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {log.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {log.status === 'success' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          成功
                        </span>
                      )}
                      {log.status === 'failed' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                          <XCircle className="h-3 w-3 mr-1" />
                          失败
                        </span>
                      )}
                      {log.status === 'running' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          <Clock className="h-3 w-3 mr-1" />
                          进行中
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewLog(log)}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        title="查看日志"
                      >
                        <FileText className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDownloadLog(log.id)}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        title="下载日志"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 hover:text-red-700 dark:hover:text-red-300"
                        title="删除日志"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 日志详情弹窗 */}
      {selectedLog && (
        <LogDetailModal 
          log={selectedLog} 
          onClose={() => setSelectedLog(null)} 
        />
      )}
    </AppLayout>
  );
} 