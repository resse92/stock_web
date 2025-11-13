# 多阶段构建 - 构建阶段
FROM node:22-alpine AS builder

# 设置工作目录
WORKDIR /app

# 启用 corepack 以使用 pnpm
RUN corepack enable

# 复制依赖清单与 npmrc（确保使用国内源）
COPY package.json pnpm-lock.yaml ./
COPY .npmrc .npmrc

# 安装依赖
RUN pnpm install --frozen-lockfile --silent

# 复制源代码
COPY . .

# 构建应用
RUN pnpm run build

# 清理缓存和依赖
RUN pnpm store prune && rm -rf node_modules

# 生产阶段 - 使用Nginx提供静态文件
FROM nginx:alpine AS production

# 复制构建产物到nginx目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
