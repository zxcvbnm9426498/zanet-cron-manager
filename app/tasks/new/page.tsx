'use client';

import { useState } from 'react';
import AppLayout from "@/components/layout/AppLayout";
import { ArrowLeft, HelpCircle, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// 定时任务表单组件
export default function NewTaskPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'node',
    schedule: '',
    script: '',
    description: '',
    timeout: 60,
    runOnce: false,
    params: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.schedule || !formData.script) {
      toast.error('请填写必填字段');
      return;
    }
    
    setLoading(true);
    
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('提交的表单数据:', formData);
      
      toast.success('任务创建成功');
      
      // 重置表单
      setFormData({
        name: '',
        type: 'node',
        schedule: '',
        script: '',
        description: '',
        timeout: 60,
        runOnce: false,
        params: ''
      });
    } catch (error) {
      console.error('创建任务失败:', error);
      toast.error('创建任务失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/tasks" className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">新建定时任务</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              创建一个新的定时任务脚本
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  任务名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="mt-1 input w-full"
                  placeholder="请输入任务名称"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  脚本类型 <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  className="mt-1 input w-full"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="node">Node.js</option>
                  <option value="python">Python</option>
                  <option value="shell">Shell</option>
                </select>
              </div>

              <div>
                <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  定时规则 <span className="text-red-500">*</span>
                  <span 
                    className="ml-1 inline-flex items-center text-gray-400 cursor-help"
                    title="使用cron表达式设置定时规则，例如 0 * * * * 表示每小时整点执行"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </span>
                </label>
                <input
                  type="text"
                  name="schedule"
                  id="schedule"
                  required
                  className="mt-1 input w-full font-mono"
                  placeholder="Cron表达式 (例如: 0 * * * *)"
                  value={formData.schedule}
                  onChange={handleInputChange}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  格式: 分 时 日 月 周 (Cron表达式)
                </p>
              </div>

              <div>
                <label htmlFor="timeout" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  超时时间 (秒)
                </label>
                <input
                  type="number"
                  name="timeout"
                  id="timeout"
                  min="1"
                  max="3600"
                  className="mt-1 input w-full"
                  value={formData.timeout}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="script" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                脚本内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="script"
                id="script"
                rows={10}
                required
                className="mt-1 input w-full font-mono"
                placeholder={`// 编写您的脚本...\n${
                  formData.type === 'node' 
                    ? 'console.log("Hello World");' 
                    : formData.type === 'python' 
                      ? 'print("Hello World")' 
                      : '#!/bin/bash\necho "Hello World"'
                }`}
                value={formData.script}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="params" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                脚本参数
              </label>
              <input
                type="text"
                name="params"
                id="params"
                className="mt-1 input w-full"
                placeholder="脚本运行时的参数，多个参数用空格分隔"
                value={formData.params}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                任务描述
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                className="mt-1 input w-full"
                placeholder="任务的详细描述和说明"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <input
                id="runOnce"
                name="runOnce"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={formData.runOnce}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="runOnce" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                只运行一次 (运行后自动禁用)
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                href="/tasks"
                className="btn btn-outline"
              >
                取消
              </Link>
              <button
                type="submit"
                className="btn btn-primary inline-flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    处理中...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    保存任务
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
} 