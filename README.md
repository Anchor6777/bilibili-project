# bilibili-project

仿写B站web网页端的个人前端项目

本仓库为前端部分，后端参见[bilibili-project-backend]([Anchor6777/bilibili-project: 仿写b站web端的个人前端项目](https://github.com/Anchor6777/bilibili-project))

## 技术栈

- 语言：TS + JS
- 框架/脚手架：Vue3 + Vite
- 路由：Vue-Router
- 网络请求库：Axios
- 组件库：Naive UI
- 状态管理：Pinia
- 图床：PicGo
- 其他第三方库：DPlayer（视频播放器）、lodash.js（工具库，提供防抖、节流等工具函数）、dayjs（日期处理库）

## 主要页面/功能介绍

### 1.首页

#### 1.1登录：

采用双Token登录机制（token、refreshToken），避免基于session的登录方式的两个缺点：

1. 服务端需要保存状态信息，不支持分布式系统，A服务器保存了session对象，但B服务器没有。
2. 服务器重启后，登录信息全部失效，因为内存被清空

演示：

https://github.com/user-attachments/assets/292a7ca9-a52e-4e68-88d0-d9e5b9b7f250

