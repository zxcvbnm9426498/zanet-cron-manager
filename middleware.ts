import { NextRequest, NextResponse } from 'next/server';

// 不需要认证的路由
const publicRoutes = ['/login', '/api/auth/callback/github'];

export function middleware(request: NextRequest) {
  // 检查当前路径是否为公共路由
  const { pathname } = request.nextUrl;
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 如果是API路由但不是认证相关的，检查认证
  if (pathname.startsWith('/api') && !pathname.startsWith('/api/auth')) {
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // 检查是否已登录
  const sessionCookie = request.cookies.get('session');
  if (!sessionCookie && !pathname.startsWith('/api')) {
    // 重定向到登录页
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // 匹配所有页面和API路由，除了静态文件
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 