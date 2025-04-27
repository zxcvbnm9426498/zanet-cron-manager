import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // 清除会话cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('session', '', { 
      expires: new Date(0),
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('登出失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
} 