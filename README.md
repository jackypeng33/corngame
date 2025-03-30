# BoxGame2 - 网页游戏聚合平台

BoxGame2是一个通过iframe嵌入各类网页游戏的聚合平台。用户可以浏览、搜索和玩各种分类的在线游戏，管理员可以添加、编辑和管理游戏与分类。

## 技术栈

- **前端框架**: Next.js 14 + React
- **样式**: Tailwind CSS
- **数据库**: SQLite
- **认证**: JWT (JSON Web Tokens)

## 功能特点

- 游戏分类系统
  - 按类型分类游戏
  - 分类导航菜单
  - 每个分类的专属页面
- 搜索功能
  - 按游戏名称搜索
  - 搜索结果页面
- 游戏管理功能
  - 添加/编辑/删除游戏
  - 添加/编辑/删除分类
  - 管理员登录权限控制
- 游戏展示
  - 使用iframe加载游戏内容
  - 游戏详情页面
  - 响应式设计，适配移动设备和桌面

## 安装与运行

### 前提条件

- Node.js 18.0 或更高版本
- npm 或 yarn

### 安装步骤

1. 克隆代码库

```bash
git clone <repository-url>
cd boxgame2
```

2. 安装依赖

```bash
npm install
```

3. 初始化管理员账户

```bash
npm run init-admin
```

4. 启动开发服务器

```bash
npm run dev
```

5. 浏览器访问 [http://localhost:3000](http://localhost:3000)

### 管理员登录

- 默认用户名: `admin`
- 默认密码: `admin123456`
- 登录地址: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

**重要提示**: 首次登录后请立即修改默认密码!

## 项目结构

```
boxgame2/
├── db/                   # SQLite数据库文件
├── public/               # 静态文件
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API路由
│   │   ├── admin/        # 管理员页面
│   │   └── ...
│   ├── components/       # React组件
│   ├── lib/              # 工具函数和助手
│   ├── models/           # 数据模型和服务
│   └── scripts/          # 脚本工具
├── .gitignore
├── next.config.ts
├── package.json
├── README.md
└── tsconfig.json
```

## 生产部署

构建生产版本:

```bash
npm run build
```

启动生产服务器:

```bash
npm start
```

## 许可证

MIT
