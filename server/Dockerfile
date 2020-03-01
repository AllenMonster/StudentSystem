FROM keymetrics/pm2:latest-alpine
WORKDIR /app
ADD . /app
RUN npm config set registry https://registry.npm.taobao.org/ && \  
    npm i
# RUN npm i
EXPOSE 4000
#pm2在docker中使用命令为pm2-docker
CMD ["pm2-runtime", "start",  "process.yml"]
