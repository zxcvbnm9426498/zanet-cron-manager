import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // 从cookie中获取会话信息
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json({ user: null, accessToken: null });
    }

    // 解析会话数据
    try {
      const session = JSON.parse(sessionCookie.value);
      return NextResponse.json({
        user: session.user || null,
        accessToken: session.accessToken || null,
      });
    } catch (error) {
      console.error('解析会话数据失败:', error);
      return NextResponse.json({ user: null, accessToken: null });
    }
  } catch (error) {
    console.error('获取会话失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
} 