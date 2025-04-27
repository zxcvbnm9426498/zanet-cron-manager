import AppLayout from "@/components/layout/AppLayout";
import { Calendar, Clock, CheckCircle, AlertTriangle, Activity, PlayCircle } from "lucide-react";
import Link from "next/link";
import GitHubIntegrationPrompt from "@/components/GitHubIntegrationPrompt";

// 仪表盘统计卡片组件
function StatCard({ title, value, icon: Icon, color }: { 
  title: string; 
  value: string | number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// 最近活动组件
function RecentActivity() {
  const activities = [
    { id: 1, task: "每日签到脚本", status: "成功", time: "2小时前", type: "success" },
    { id: 2, task: "数据同步任务", status: "失败", time: "6小时前", type: "error" },
    { id: 3, task: "备份数据库", status: "成功", time: "昨天 22:45", type: "success" },
    { id: 4, task: "更新用户信息", status: "成功", time: "昨天 18:30", type: "success" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-5">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">最近任务活动</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4">
            <div className={`p-2 rounded-full ${
              activity.type === 'success' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
            }`}>
              {activity.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.task}</p>
              <p className={`text-xs ${
                activity.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {activity.status}
              </p>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Link href="/logs" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
          查看所有活动
        </Link>
      </div>
    </div>
  );
}

// 快速操作组件
function QuickActions() {
  const actions = [
    { id: 1, name: "新建任务", icon: Calendar, href: "/tasks/new" },
    { id: 2, name: "上传脚本", icon: Activity, href: "/scripts/new" },
    { id: 3, name: "运行任务", icon: PlayCircle, href: "/tasks" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-5">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">快速操作</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Link key={action.id} href={action.href} className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <action.icon className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{action.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AppLayout>
      {/* GitHub 集成提示 */}
      <GitHubIntegrationPrompt />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">仪表盘</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          查看您的任务运行状态和系统统计
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="总任务数" 
          value={12} 
          icon={Calendar} 
          color="bg-primary-600"
        />
        <StatCard 
          title="运行中任务" 
          value={3} 
          icon={Clock} 
          color="bg-secondary-600"
        />
        <StatCard 
          title="今日执行任务" 
          value={8} 
          icon={CheckCircle} 
          color="bg-green-600"
        />
        <StatCard 
          title="失败任务" 
          value={1} 
          icon={AlertTriangle} 
          color="bg-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <QuickActions />
      </div>
    </AppLayout>
  );
}
