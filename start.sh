#!/bin/bash

# 检查 pnpm 是否已经安装
if ! command -v pnpm &> /dev/null
then
    # 如果 pnpm 没有安装，那么安装它
    npm install -g pnpm
fi

# 使用 pnpm 安装依赖
pnpm install

# 使用 pnpm 编译项目
pnpm run build

# 检查 pm2 是否已经安装
if ! command -v pm2 &> /dev/null
then
    # 如果 pm2 没有安装，那么安装它
    pnpm install -g pm2
fi

# 清理所有 pm2 进程
pm2 delete all

# 启动 pm2
pm2 start ecosystem.config.js

