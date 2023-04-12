# STEP1: 构建基础镜像
FROM alpine:3.17 as base
# -设置环境变量
ENV NODE_VERSION=18.15.0
ENV PNPM_VERSION=7.27.0
ENV APP_PATH=/app
# -设置工作目录
WORKDIR $APP_PATH
# 安装基础包
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories \
    && apk add --no-cache nodejs python3 curl gcc g++ make linux-headers \
    && curl -sL https://unpkg.com/@pnpm/self-installer | node

# STEP2: 构建依赖镜像
FROM base as installer

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/web/package.json  apps/server/pnpm-lock.yaml  ./apps/web/
COPY apps/server/package.json apps/server/pnpm-lock.yaml ./apps/server/

RUN pnpm install

# STEP3: 构建编译镜像
FROM base as builder

ENV NODE_ENV=production

COPY . .
COPY --from=installer /${APP_PATH}/node_modules ./node_modules
COPY --from=installer /${APP_PATH}/apps/web/node_modules ./apps/web/node_modules
COPY --from=installer /${APP_PATH}/apps/server/node_modules ./apps/server/node_modules

RUN pnpm build

EXPOSE 4000

CMD [ "pnpm","prod:start" ]


