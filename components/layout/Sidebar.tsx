'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  CalendarClock, 
  LayoutDashboard, 
  FileCode, 
  Settings, 
  History,
  Github,
  MenuIcon,
  XIcon,
  PanelRight,
  TerminalSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

// 用户类型定义
interface User {
  name?: string;
  login?: string;
  avatar_url?: string;
}

const navigation: NavItem[] = [
  { name: '仪表盘', href: '/', icon: LayoutDashboard },
  { name: '定时任务', href: '/tasks', icon: CalendarClock },
  { name: '脚本管理', href: '/scripts', icon: FileCode },
  { name: '执行日志', href: '/logs', icon: History },
  { name: '环境变量', href: '/env', icon: TerminalSquare },
  { name: 'GitHub Actions', href: '/github-actions', icon: Github },
  { name: '系统设置', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-40 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-600 text-white"
        >
          {mobileMenuOpen ? (
            <XIcon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-30 lg:hidden bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div 
              className="fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 overflow-y-auto"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent pathname={pathname} user={user} onLogout={logout} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-10 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-1 flex-col min-h-0 border-r border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
          <SidebarContent pathname={pathname} user={user} onLogout={logout} />
        </div>
      </div>
    </>
  );
}

function SidebarContent({ 
  pathname, 
  user,
  onLogout
}: { 
  pathname: string;
  user: User | null;
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col pt-5 pb-4 overflow-y-auto">
      <div className="flex flex-shrink-0 items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <PanelRight className="h-8 w-8 text-primary-600" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">Zanet Cron</span>
        </Link>
      </div>
      
      {user && (
        <div className="mt-6 px-4">
          <div className="flex items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
            {user.avatar_url && (
              <Image 
                src={user.avatar_url} 
                alt={user.name || 'User avatar'} 
                width={32}
                height={32}
                className="rounded-full mr-2"
              />
            )}
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {user.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {user.login}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <nav className="mt-6 flex-1 px-2 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md
                ${isActive 
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                }
              `}
            >
              <item.icon
                className={`
                  mr-3 h-5 w-5 flex-shrink-0 
                  ${isActive 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
                  }
                `}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200 dark:border-gray-800">
        {user ? (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm9 10a1 1 0 01-1 1H7a1 1 0 110-2h4a1 1 0 011 1zm0-4a1 1 0 01-1 1H7a1 1 0 110-2h4a1 1 0 011 1zm-8-3a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5z" clipRule="evenodd" />
            </svg>
            退出登录
          </button>
        ) : (
          <Link
            href="/login"
            className="w-full flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            <Github className="h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300" />
            使用 GitHub 登录
          </Link>
        )}
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          © 2024 Zanet. All rights reserved.
        </div>
      </div>
    </div>
  );
} 