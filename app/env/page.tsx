'use client';

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { 
  TerminalSquare, 
  Search, 
  Plus, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Key
} from "lucide-react";
import { toast } from "sonner";

// 模拟数据
const MOCK_ENV_VARS = [
  { 
    id: 1, 
    name: "API_KEY", 
    value: "sk-***********************",
    isSecret: true,
    created: "2024-06-01 10:30",
    updated: "2024-06-10 14:22",
  },
  { 
    id: 2, 
    name: "DATABASE_URL", 
    value: "postgres://user:password@localhost:5432/mydb",
    isSecret: true,
    created: "2024-05-20 09:45",
    updated: "2024-06-08 22:15",
  },
  { 
    id: 3, 
    name: "NODE_ENV", 
    value: "production",
    isSecret: false,
    created: "2024-06-05 16:20",
    updated: "2024-06-09 11:30",
  },
  { 
    id: 4, 
    name: "PORT", 
    value: "3000",
    isSecret: false,
    created: "2024-05-10 12:00",
    updated: "2024-06-03 17:42",
  },
  { 
    id: 5, 
    name: "SMTP_PASSWORD", 
    value: "********",
    isSecret: true,
    created: "2024-06-08 08:15",
    updated: "2024-06-10 10:10",
  }
];

// 环境变量行动作下拉菜单
function EnvVarActionMenu({ onEdit, onDelete, isSecret, onToggleVisibility }: { 
  onEdit: () => void; 
  onDelete: () => void; 
  isSecret: boolean;
  onToggleVisibility: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [valueVisible, setValueVisible] = useState(false);

  const handleToggleVisibility = () => {
    setValueVisible(!valueVisible);
    onToggleVisibility();
  };

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
          {isSecret && (
            <button 
              onClick={() => { handleToggleVisibility(); setOpen(false); }} 
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {valueVisible ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  隐藏值
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  显示值
                </>
              )}
            </button>
          )}
          <button 
            onClick={() => { onEdit(); setOpen(false); }} 
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Edit className="mr-2 h-4 w-4" />
            编辑变量
          </button>
          <button 
            onClick={() => { onDelete(); setOpen(false); }} 
            className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            删除变量
          </button>
        </div>
      )}
    </div>
  );
}

export default function EnvPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [visibleValues, setVisibleValues] = useState<Record<number, boolean>>({});
  const [newEnvVar, setNewEnvVar] = useState({ name: '', value: '', isSecret: false });
  
  // 过滤环境变量
  const filteredEnvVars = MOCK_ENV_VARS.filter(env => 
    env.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (!env.isSecret && env.value.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // 处理环境变量操作
  const handleEditEnvVar = (id: number) => {
    const envVar = MOCK_ENV_VARS.find(env => env.id === id);
    if (envVar) {
      setNewEnvVar({ 
        name: envVar.name, 
        value: envVar.value, 
        isSecret: envVar.isSecret 
      });
      setShowAddModal(true);
    }
  };

  const handleDeleteEnvVar = (id: number) => {
    console.log(`Delete env var ${id}`);
    toast.success('环境变量已删除');
  };

  const handleToggleVisibility = (id: number) => {
    setVisibleValues(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddEnvVar = () => {
    if (!newEnvVar.name || !newEnvVar.value) {
      toast.error('名称和值不能为空');
      return;
    }
    console.log('添加环境变量:', newEnvVar);
    toast.success('环境变量已添加');
    setShowAddModal(false);
    setNewEnvVar({ name: '', value: '', isSecret: false });
  };

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">环境变量</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            管理您的脚本使用的环境变量
          </p>
        </div>
        <button 
          onClick={() => {
            setNewEnvVar({ name: '', value: '', isSecret: false });
            setShowAddModal(true);
          }}
          className="btn btn-primary inline-flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          添加变量
        </button>
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
              placeholder="搜索环境变量..."
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
                  变量名称
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  变量值
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  类型
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
              {filteredEnvVars.map((env) => (
                <tr key={env.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 mr-3">
                        <TerminalSquare className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                        {env.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white font-mono max-w-xs truncate">
                      {env.isSecret 
                        ? (visibleValues[env.id] ? env.value : '••••••••••••••••')
                        : env.value
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${env.isSecret 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      }
                    `}>
                      {env.isSecret ? (
                        <>
                          <Lock className="mr-1 h-3 w-3" />
                          <span>加密</span>
                        </>
                      ) : (
                        <>
                          <Key className="mr-1 h-3 w-3" />
                          <span>普通</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {env.updated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <EnvVarActionMenu 
                      onEdit={() => handleEditEnvVar(env.id)}
                      onDelete={() => handleDeleteEnvVar(env.id)}
                      isSecret={env.isSecret}
                      onToggleVisibility={() => handleToggleVisibility(env.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 添加/编辑环境变量模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {newEnvVar.name ? '编辑环境变量' : '添加环境变量'}
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label htmlFor="env-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  变量名称
                </label>
                <input
                  type="text"
                  id="env-name"
                  className="input w-full"
                  placeholder="例如: API_KEY"
                  value={newEnvVar.name}
                  onChange={(e) => setNewEnvVar({ ...newEnvVar, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="env-value" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  变量值
                </label>
                <input
                  type={newEnvVar.isSecret ? "password" : "text"}
                  id="env-value"
                  className="input w-full"
                  placeholder="变量的值"
                  value={newEnvVar.value}
                  onChange={(e) => setNewEnvVar({ ...newEnvVar, value: e.target.value })}
                />
              </div>
              <div className="flex items-center">
                <input
                  id="is-secret"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={newEnvVar.isSecret}
                  onChange={(e) => setNewEnvVar({ ...newEnvVar, isSecret: e.target.checked })}
                />
                <label htmlFor="is-secret" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  标记为敏感数据（加密存储）
                </label>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="btn btn-outline"
              >
                取消
              </button>
              <button
                onClick={handleAddEnvVar}
                className="btn btn-primary"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
} 