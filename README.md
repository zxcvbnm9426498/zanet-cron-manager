# Zanet Cron Manager

一个基于Next.js和Vercel构建的GitHub Actions定时任务管理系统。该系统允许用户通过Web界面管理GitHub Actions的定时任务，无需手动编辑YAML文件。

## 主要功能

- 用户账号系统(支持邮箱注册和GitHub OAuth登录)
- GitHub集成(管理GitHub仓库的工作流文件)
- 定时任务创建和管理
- 任务执行日志查看
- 脚本管理

## 技术栈

- Next.js 15 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Vercel部署

## 部署到Vercel

1. Fork本仓库到你的GitHub账号
2. 在[Vercel](https://vercel.com)创建一个新项目，选择刚刚fork的仓库
3. 配置以下环境变量:
   - `GITHUB_CLIENT_ID`: GitHub OAuth应用的Client ID
   - `GITHUB_CLIENT_SECRET`: GitHub OAuth应用的Client Secret
   - `NEXT_PUBLIC_GITHUB_CLIENT_ID`: 与GITHUB_CLIENT_ID相同的值

## GitHub OAuth配置

1. 前往[GitHub开发者设置](https://github.com/settings/developers)创建一个新的OAuth应用
2. 设置应用信息:
   - Application name: Zanet Cron Manager
   - Homepage URL: 你的Vercel部署地址(例如https://zanet-cron.vercel.app)
   - Application description: (可选)GitHub Actions定时任务管理系统
   - Authorization callback URL: 你的Vercel部署地址+回调路径(例如https://zanet-cron.vercel.app/api/auth/callback/github)
3. 注册应用后，获取Client ID和Client Secret
4. 将这些凭据添加到Vercel项目的环境变量中

## 本地开发

1. 克隆仓库
   ```bash
   git clone https://github.com/your-username/zanet-cron-manager.git
   cd zanet-cron-manager
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 创建.env.local文件并添加必要的环境变量
   ```
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
   ```

4. 启动开发服务器
   ```bash
   npm run dev
   ```

5. 在浏览器中访问 http://localhost:3000

## 许可证

MIT
