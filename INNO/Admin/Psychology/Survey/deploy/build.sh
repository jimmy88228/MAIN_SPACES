#!/bin/sh

################ 用于自动化部署 ################

# -e 　若指令传回值不等于0，则立即退出shell。
# -u 　当执行时使用到未定义过的变量，则显示错误信息。
# -x 　执行指令后，会先显示该指令及所下的参数。
set -eux

################### 环境变量 ##################
# 编译环境 dev prod
rt_env=$(echo "${BUTLD_ENV:-dev}" | tr '[:upper:]' '[:lower:]')
# 编译输出目录
output_path=$BUILD_OUTPUT_PATH

# 更换软件源
{
    echo "http://mirrors.cloud.aliyuncs.com/alpine/v3.15/main"
    echo "http://mirrors.cloud.aliyuncs.com/alpine/v3.15/community"
} | tee /etc/apk/repositories >/dev/null
# 临时安装文件同步工具
apk add --no-cache rsync

################ 依赖安装和编译 ################
# 依赖安装和编译
yarn config set registry https://registry.npmmirror.com
yarn install --no-default-rc
yarn run build

#################### 输出 #####################
rsync -av --delete --exclude='.gitignore' --exclude='.svn' ./dist/ "$output_path"
