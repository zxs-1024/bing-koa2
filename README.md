# bing-koa2

## 插件

### 分页插件

[mongoose-paginate](https://github.com/edwardhotchkiss/mongoose-paginate)

### 异步 JavaScript 函数

[async](https://github.com/caolan/async)

### API 命名规范

[RESTful API 设计指南](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)
[restify](http://restify.com/docs/home/)

## 服务器部署

进入服务器文件夹， git clone 项目。

### 安装 pm2

全局安装 pm2

```bash
npm install pm2 -g
```

启动 pm2 守护进程

```bash
pm2 start ./bin/www --watch
```

pm2 start 就是 npm start，会帮你调用 node ./bin/www;
--watch 监听 koa2 应用代码，当代码发生变化，pm2 会帮你重启服务。

### nginx 接口代理

编辑 nginx.conf 配置

```bash
vi /etc/nginx/nginx.conf
```

i 进入编辑模式，

在 server 配置中加入：

```conf
location ~ /api/ {
  proxy_pass http://127.0.0.1:9527;
}
```

esc 退出编辑模式，:wq 保存并退出。

```bash
// 检测 nginx 配置
nginx -t
// 重启 nginx
nginx -s reload
```

## 参考资料

[mongoose 基础入门](https://www.cnblogs.com/xiaohuochai/p/7215067.html#anchor9)

[mongoose populate 多表关联查询](https://www.jianshu.com/p/817ff51bd548)
