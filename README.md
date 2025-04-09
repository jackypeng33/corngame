# 游戏之家 - 多页HTML游戏网站框架

这是一个使用HTML、CSS和原生JavaScript开发的多页游戏网站框架。该框架允许通过iframe嵌入和展示游戏内容，并提供游戏分类和搜索功能。

## 项目结构

```
/
├── index.html           # 网站主页
├── games.html           # 游戏浏览页面
├── play.html            # 游戏播放页面
├── css/
│   └── style.css        # 样式表
├── js/
│   ├── data.js          # 游戏数据
│   └── main.js          # 主要JavaScript功能
├── images/              # 游戏图片目录
│   └── ...              # 游戏缩略图
└── games/               # 游戏文件夹
    ├── game1/           # 游戏1
    │   └── index.html   # 游戏1内容
    ├── game2/           # 游戏2
    │   └── index.html   # 游戏2内容
    └── game3/           # 游戏3
        └── index.html   # 游戏3内容
```

## 功能特点

- **多页面结构**：网站包含首页、游戏浏览页和游戏播放页
- **游戏嵌入**：通过iframe嵌入游戏内容
- **游戏分类**：支持按类别过滤游戏（儿童游戏、经典游戏、动作游戏、冒险游戏、多人游戏）
- **游戏搜索**：可以按游戏名称搜索
- **响应式设计**：适应不同屏幕尺寸的设备

## 技术栈

- HTML5
- CSS3
- 原生JavaScript（不依赖任何外部库或框架）

## 使用方法

1. 克隆或下载本项目
2. 在浏览器中打开 `index.html` 文件
3. 导航到"浏览游戏"页面查看所有游戏
4. 可以使用搜索栏或类别过滤器查找特定游戏
5. 点击"开始游戏"按钮来玩游戏

## 当前游戏列表

网站目前包含以下游戏：

1. Incredibox Sprunki (儿童游戏)
2. Plants Vs Zombies (经典游戏)
3. Granny (动作游戏)
4. Toca Life World (儿童游戏)
5. Five Nights at Freddy's (冒险游戏)
6. Super Mario Bros (经典游戏)
7. Pacman (经典游戏)
8. Bloxd.io (多人游戏)

## 添加新游戏

1. 在 `games` 文件夹中创建一个新的游戏子文件夹
2. 在该子文件夹中添加游戏文件（主文件应命名为 `index.html`）
3. 在 `images` 文件夹中添加游戏缩略图
4. 在 `js/data.js` 文件中添加新游戏的信息
5. 新游戏将自动显示在网站上

## 开发指南

### 修改样式

样式表位于 `css/style.css` 文件中。可以根据需要修改样式来定制网站外观。

### 修改游戏数据

游戏数据存储在 `js/data.js` 文件中。每个游戏对象包含以下属性：

- `id`：唯一标识符
- `name`：游戏名称
- `category`：游戏类别（kids、classic、action、adventure或multiplayer）
- `description`：游戏描述
- `imageUrl`：游戏缩略图路径
- `gameUrl`：游戏文件路径

### 自定义功能

主要的JavaScript功能位于 `js/main.js` 文件中。可以根据需要修改或扩展这些功能。 