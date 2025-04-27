import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getRequiredEnv } from '@/app/lib/env';

// 这个函数将处理GitHub OAuth回调
export async function GET(request: NextRequest) {
  try {
    // 获取GitHub返回的code
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const isBind = searchParams.get('bind') === 'true';

    if (!code) {
      return NextResponse.json(
        { error: 'Missing GitHub authorization code' }, 
        { status: 400 }
      );
    }
    
    // 交换GitHub OAuth代码获取访问令牌
    const tokenResponse = await exchangeCodeForToken(code);
    
    if (!tokenResponse.access_token) {
      return NextResponse.json(
        { error: 'Failed to get GitHub access token' }, 
        { status: 500 }
      );
    }
    
    // 获取GitHub用户信息
    const githubUser = await getGitHubUserInfo(tokenResponse.access_token);
    
    // 如果是绑定现有账号
    if (isBind) {
      // 获取当前会话
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get('session');
      if (!sessionCookie || !sessionCookie.value) {
        return NextResponse.redirect(new URL('/login?error=not_authenticated', request.url));
      }
      
      try {
        const sessionData = JSON.parse(sessionCookie.value);
        
        // 在这里应该将GitHub账号与当前用户关联
        // 这里只是模拟操作
        console.log(`Binding GitHub account ${githubUser.login} to user ${sessionData.user.id}`);
        
        // 重定向到设置页面
        return NextResponse.redirect(new URL('/settings/github?status=success', request.url));
      } catch (error) {
        console.error('Session parsing error:', error);
        return NextResponse.redirect(new URL('/login?error=invalid_session', request.url));
      }
    } 
    // 否则是使用GitHub登录
    else {
      // 在实际应用中，这里应该:
      // 1. 检查这个GitHub用户是否已经在系统中注册
      // 2. 如果已注册，创建会话
      // 3. 如果未注册，创建新用户账号并创建会话
      
      // 模拟创建会话
      const session = {
        user: {
          id: `github_${githubUser.id}`,
          name: githubUser.name || githubUser.login,
          email: githubUser.email,
          avatar: githubUser.avatar_url,
          github: {
            id: githubUser.id,
            login: githubUser.login,
            avatar_url: githubUser.avatar_url,
            access_token: tokenResponse.access_token
          }
        },
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7天过期
      };
      
      // 设置会话cookie
      const cookieStore = await cookies();
      cookieStore.set({
        name: 'session',
        value: JSON.stringify(session),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60, // 7天
        path: '/'
      });
      
      // 重定向到首页
      return NextResponse.redirect(new URL('/', request.url));
    }
  } catch (error) {
    console.error('GitHub callback error:', error);
    return NextResponse.redirect(new URL('/login?error=github_callback_failed', request.url));
  }
}

// 交换GitHub OAuth代码获取访问令牌的函数
async function exchangeCodeForToken(code: string) {
  const clientId = getRequiredEnv('GITHUB_CLIENT_ID');
  const clientSecret = getRequiredEnv('GITHUB_CLIENT_SECRET');
  
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code
    })
  });
  
  const data = await response.json();
  return data;
}

// 获取GitHub用户信息的函数
async function getGitHubUserInfo(accessToken: string) {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `token ${accessToken}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  const userData = await response.json();
  return userData;
} 