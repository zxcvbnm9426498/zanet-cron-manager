import { NextResponse } from 'next/server';
import { findUser } from '../../../lib/users';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 验证请求数据
    if (!email || !password) {
      return NextResponse.json({ error: '请提供邮箱和密码' }, { status: 400 });
    }

    // 在用户数据库中查找用户
    const user = findUser(email, password);

    if (!user) {
      return NextResponse.json({ error: '邮箱或密码不正确' }, { status: 401 });
    }

    // 创建会话
    const session = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        // 排除密码等敏感信息
      },
      // 在实际应用中，可能还需要生成访问令牌
      provider: 'credentials',
    };

    // 保存会话到cookie
    const response = NextResponse.json({ success: true, user: session.user });
    response.cookies.set('session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7天
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('登录失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
} 