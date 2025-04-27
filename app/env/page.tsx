'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Save, RefreshCw, Key, Lock } from "lucide-react";
import { toast } from 'sonner';
import AppLayout from '@/components/layout/AppLayout';

// 环境变量类型
type EnvVar = {
  id: number;
  key: string;
  value: string;
  description: string;
  isEncrypted: boolean;
  createdAt: string;
  updatedAt: string;
  isSystem: boolean;
};

// 模拟数据
const MOCK_ENV_VARS: EnvVar[] = [
  {
    id: 1,
    key: 'GITHUB_CLIENT_ID',
    value: 'github_oauth_client_id_value',
    description: 'GitHub OAuth应用的Client ID',
    isEncrypted: false,
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-06-10T15:30:00Z',
    isSystem: true
  },
  {
    id: 2,
    key: 'GITHUB_CLIENT_SECRET',
    value: '******************************',
    description: 'GitHub OAuth应用的Client Secret',
    isEncrypted: true,
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-06-10T15:30:00Z',
    isSystem: true
  },
  {
    id: 3,
    key: 'DATABASE_URL',
    value: 'postgres://username:password@host:5432/dbname',
    description: '数据库连接URL',
    isEncrypted: true,
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-06-05T11:20:00Z',
    isSystem: true
  },
  {
    id: 4,
    key: 'MY_CUSTOM_API_KEY',
    value: '********************************',
    description: '自定义API密钥',
    isEncrypted: true,
    createdAt: '2024-06-08T14:25:00Z',
    updatedAt: '2024-06-08T14:25:00Z',
    isSystem: false
  }
];

export default function EnvPage() {
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingVar, setEditingVar] = useState<EnvVar | null>(null);

  useEffect(() => {
    // 这里应该从API获取环境变量
    // 现在使用模拟数据
    setEnvVars(MOCK_ENV_VARS);
    setIsLoading(false);
  }, []);

  // 过滤环境变量
  const filteredEnvVars = envVars.filter(v => 
    v.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 处理保存环境变量
  const handleSaveEnvVar = async (envVar: EnvVar) => {
    try {
      // 这里应该调用API保存环境变量
      // 现在只是模拟操作
      setEnvVars(prevVars => 
        prevVars.map(v => v.id === envVar.id ? {...envVar, updatedAt: new Date().toISOString()} : v)
      );
      setEditingVar(null);
      toast.success(`变量 ${envVar.key} 已保存`);
    } catch (error) {
      toast.error('保存失败，请重试');
      console.error('保存环境变量失败:', error);
    }
  };

  // 处理添加环境变量
  const handleAddEnvVar = () => {
    const newVar: EnvVar = {
      id: Math.max(...envVars.map(v => v.id), 0) + 1,
      key: '',
      value: '',
      description: '',
      isEncrypted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSystem: false
    };
    setEditingVar(newVar);
  };

  // 编辑表单
  const renderEditForm = () => {
    if (!editingVar) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {editingVar.id ? '编辑环境变量' : '添加环境变量'}
            </h3>
            <button 
              onClick={() => setEditingVar(null)}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="key" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  变量名
                </label>
                <input
                  type="text"
                  id="key"
                  className="mt-1 input w-full"
                  value={editingVar.key}
                  onChange={(e) => setEditingVar({...editingVar, key: e.target.value})}
                  placeholder="MY_VARIABLE_NAME"
                />
              </div>
              <div>
                <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  变量值
                </label>
                <input
                  type={editingVar.isEncrypted ? "password" : "text"}
                  id="value"
                  className="mt-1 input w-full"
                  value={editingVar.value}
                  onChange={(e) => setEditingVar({...editingVar, value: e.target.value})}
                  placeholder="变量值"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  描述
                </label>
                <textarea
                  id="description"
                  className="mt-1 input w-full"
                  value={editingVar.description}
                  onChange={(e) => setEditingVar({...editingVar, description: e.target.value})}
                  placeholder="变量的用途描述"
                  rows={3}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isEncrypted"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={editingVar.isEncrypted}
                  onChange={(e) => setEditingVar({...editingVar, isEncrypted: e.target.checked})}
                />
                <label htmlFor="isEncrypted" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  加密存储（推荐用于密钥和敏感信息）
                </label>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end space-x-3">
            <button 
              onClick={() => setEditingVar(null)}
              className="btn"
            >
              取消
            </button>
            <button 
              onClick={() => handleSaveEnvVar(editingVar)}
              className="btn btn-primary inline-flex items-center"
              disabled={!editingVar.key || !editingVar.value}
            >
              <Save className="mr-2 h-4 w-4" />
              保存
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">环境变量</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            管理系统环境变量和配置
          </p>
        </div>
        <button 
          onClick={handleAddEnvVar}
          className="btn btn-primary inline-flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          添加变量
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
              placeholder="搜索变量..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="ml-auto">
            <button
              onClick={() => {
                // 这里应该刷新环境变量
                toast.success('变量已刷新');
              }}
              className="btn inline-flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              刷新
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  变量名
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  变量值
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  描述
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  更新时间
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    加载中...
                  </td>
                </tr>
              ) : filteredEnvVars.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    没有找到环境变量
                  </td>
                </tr>
              ) : (
                filteredEnvVars.map((envVar) => (
                  <tr key={envVar.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/20 mr-3">
                          <Key className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {envVar.key}
                          </div>
                          {envVar.isSystem && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                              系统
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {envVar.isEncrypted ? (
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Lock className="h-4 w-4 mr-1" />
                            <span>******</span>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-900 dark:text-white font-mono">
                            {envVar.value}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {envVar.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(envVar.updatedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            // 编辑变量
                            setEditingVar(envVar);
                          }}
                          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400"
                          title="编辑变量"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {!envVar.isSystem && (
                          <button
                            onClick={() => {
                              // 删除变量
                              if (confirm(`确定要删除变量 ${envVar.key} 吗？`)) {
                                setEnvVars(prevVars => prevVars.filter(v => v.id !== envVar.id));
                                toast.success(`变量 ${envVar.key} 已删除`);
                              }
                            }}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                            title="删除变量"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {renderEditForm()}
    </AppLayout>
  );
} 