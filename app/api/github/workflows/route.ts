import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// 从 cookie 获取会话
const getSession = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  
  if (!sessionCookie) {
    return null;
  }
  
  try {
    return JSON.parse(sessionCookie.value);
  } catch (error) {
    console.error('解析会话失败:', error);
    return null;
  }
};

// 获取用户的 GitHub 工作流列表
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const url = new URL(request.url);
    const repository = url.searchParams.get('repository');
    
    if (!repository) {
      return NextResponse.json({ error: '需要提供仓库名称' }, { status: 400 });
    }

    // 调用 GitHub API 获取工作流列表
    const response = await fetch(`https://api.github.com/repos/${repository}/actions/workflows`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.message || '获取工作流失败' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('获取工作流失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 触发 GitHub 工作流运行
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const { repository, workflow_id, ref = 'main' } = await request.json();
    
    if (!repository || !workflow_id) {
      return NextResponse.json({ error: '需要提供仓库名称和工作流ID' }, { status: 400 });
    }

    // 调用 GitHub API 触发工作流运行
    const response = await fetch(`https://api.github.com/repos/${repository}/actions/workflows/${workflow_id}/dispatches`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ref }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: error || '触发工作流失败' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('触发工作流失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
} 