import { NextResponse } from 'next/server';
import { addUser, isEmailTaken } from '../../../lib/users';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // 验证请求数据
    if (!name || !email || !password) {
      return NextResponse.json({ error: '请提供姓名、邮箱和密码' }, { status: 400 });
    }

    // 检查邮箱是否已被注册
    if (isEmailTaken(email)) {
      return NextResponse.json({ error: '该邮箱已被注册' }, { status: 409 });
    }

    // 创建新用户
    const newUser = addUser(name, email, password);

    // 返回成功响应，但不包含密码等敏感信息
    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };

    return NextResponse.json({
      success: true,
      message: '注册成功',
      user: userResponse,
    });
  } catch (error) {
    console.error('注册失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
} 