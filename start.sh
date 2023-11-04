#!/bin/bash

# 检查 volta 是否已经安装
if ! command -v volta &> /dev/null
then
    # 如果 volta 没有安装，那么安装它
    curl https://get.volta.sh | bash
    # 提示用户重新运行脚本
    echo "Volta 安装完成，请重新运行 start.sh 启动服务"
    exit 1
fi

volta install node pmpm pm2

# 使用 pnpm 安装依赖
pnpm install

# 使用 pnpm 编译项目
pnpm run build



# 清理所有 pm2 进程
pm2 delete all

# 启动 pm2
pm2 start ecosystem.config.js
