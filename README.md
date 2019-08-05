# bing-koa2

## 服务器部署

进入服务器文件夹， `git clone ${project-name}`

### 安装 pm2

全局安装 pm2

```bash
npm install pm2 -g
```

启动 pm2 守护进程

```bash
pm2 start ./bin/www --watch
```

> pm2 start 就是 npm start，会帮你调用 node ./bin/www; --watch 监听 koa2 应用代码，当代码发生变化，pm2 会帮你重启服务。

PS: 因为设置了定时任务，不需要增加 `--watch` 参数，否则定时任务会重复触发。

#### command

```bash
pm2 ls
pm2 stop     <app_name|id|'all'|json_conf>
pm2 restart  <app_name|id|'all'|json_conf>
pm2 delete   <app_name|id|'all'|json_conf>
```

### 安装 puppeteer

#### 使用 nrm 切换镜像源

```bash
nrm use taobao
npm i puppeteer
```

可能会下载失败，需要设置国内镜像源

```bash
ERROR: Failed to download Chromium r609904! Set "PUPPETEER_SKIP_CHROMIUM_DOWNLOAD" env variable to skip download.
{ Error: read ECONNRESET
    at TLSWrap.onStreamRead (internal/stream_base_commons.js:111:27) errno: 'ECONNRESET', code: 'ECONNRESET', syscall: 'read' }
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.2.4 (node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.2.4: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
```

#### 设置国内镜像源

```bash
PUPPETEER_DOWNLOAD_HOST=https://storage.googleapis.com.cnpmjs.org
```

如果仍旧下载不成功，可以尝试使用 cnpm 。

```bash
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm i puppeteer
```

### 需要添加 Chromium 依赖

将项目部署到服务器上后，发现定时任务没有生效，`vi /root/.pm2/logs/www-error.log` 查看 pm2 错误日志：

```bash
TROUBLESHOOTING: https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md

    at onClose (/var/www/bing-koa2/node_modules/_puppeteer@1.11.0@puppeteer/lib/Launcher.js:342:14)
    at Interface.helper.addEventListener (/var/www/bing-koa2/node_modules/_puppeteer@1.11.0@puppeteer/lib/Launcher.js:331:50)
    at Interface.emit (events.js:187:15)
    at Interface.close (readline.js:379:8)
    at Socket.onend (readline.js:157:10)
    at Socket.emit (events.js:187:15)
    at endReadableNT (_stream_readable.js:1094:12)
    at args.(anonymous function) (/usr/local/lib/node_modules/pm2/node_modules/event-loop-inspector/index.js:138:29)
    at process._tickCallback (internal/process/next_tick.js:63:19)
(node:10843) UnhandledPromiseRejectionWarning: Error: Failed to launch chrome!
/var/www/bing-koa2/node_modules/_puppeteer@1.11.0@puppeteer/.local-chromium/linux-609904/chrome-linux/chrome: error while loading shared libraries: libXcomposite.so.1: cannot open shared object file: No such file or directory
```

是 puppeteer 没有打开 chrome，发现是缺少相关依赖。

```bash
yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 -y
```

需要以 `--no-sandbox` 模式启动。

```bash
Error: Failed to launch chrome!
[0108/111100.740545:ERROR:zygote_host_impl_linux.cc(89)] Running as root without --no-sandbox is not supported. See https://crbug.com/638180.
```

```js
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox']
})
```

### 通过 node-schedule 设置定时任务

#### 安装

```bash
npm install node-schedule
```

#### 时间设置

```bash
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
```

#### Example

```js
const time = '11 11 * * *'

schedule.scheduleJob(time, function() {
  main()
  console.log(`The schedule.scheduleJob ${time} !`)
})
```

### nginx 反向代理

编辑 nginx.conf 配置文件。

```bash
vi /etc/nginx/nginx.conf
```

`i` 进入编辑模式;

在 server 配置中加入：

```conf
location ~ /api/ {
  proxy_pass http://127.0.0.1:9527;
}
```

esc 退出编辑模式，:wq 保存并退出;

```bash
// 检测 nginx 配置
nginx -t
// 重启 nginx
nginx -s reload
```

### nginx config

#### 设置图片访问下载

```conf
location ~ /image/ {
  add_header Content-Type "image/jpeg";
  add_header Content-disposition "attachment";
  root /var/www/;
  expires 30d;
}
```

- Content-disposition "attachment"; 设置 Response Headers 浏览器自动下载
- root /var/www/; 路径配置
- expires 30d; 缓存 30 天

#### 设置缓存

图片静态资源缓存，缓存时间 30 天

```conf
location ~ /image/large/(.*)_(\d+)x(\d+)\.(jpg|gif|png)$ {
  # add_header X-Cache-Status $upstream_cache_status;
  # proxy_cache img_cache;
  # proxy_cache_revalidate on;
  # proxy_cache_min_uses 1;
  # proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
  # proxy_cache_background_update on;
  # proxy_cache_lock on;
  root /var/www/;
  set $n $1;
  set $w $2;
  set $h $3;
  set $t $4;
  image_filter resize $w $h;
  image_filter_buffer 10M;
  rewrite ^/image/large/(.*)$ /image/large/$break;
  expires 30d;
  error_page 415 = /empty;
}
```

### Centos7 防火墙配置

服务器如果开启防火墙，会导致端口访问失败，需关闭 firewall。

#### 查看 firewall 服务状态

```bash
systemctl status firewalld
```

#### 查看 firewall 的状态

```bash
firewall-cmd --state
```

#### 开启、重启、关闭、firewalld.service 服务

```bash
# 开启
service firewalld start
# 重启
service firewalld restart
# 关闭
service firewalld stop
```

#### 查看防火墙规则

```bash
firewall-cmd --list-all
```

### 插件

#### 分页插件

[mongoose-paginate](https://github.com/edwardhotchkiss/mongoose-paginate)

#### async 异步 JavaScript 函数

[async](https://github.com/caolan/async)

### tinify

使用 tinify 进行图片压缩。

```js
const tinify = require('tinify')

tinify.key = 'HzYhScvVt9W5fxDk1l7rG6FV8ym3B54k'

const tinifySource = tinify.fromUrl(source)
tinifySource.toFile(target)
```

需要到 `https://tinypng.com/dashboard/api` 进行注册，获取 APIKey。

每月限调用 500 次

### [Multer](https://github.com/expressjs/multer)

> [Multer](https://github.com/expressjs/multer) 是一个 node.js 中间件，用于处理 multipart/form-data 类型的表单数据，它主要用于上传文件。它是写在 busboy 之上非常高效。

### 参考资料

[mongoose 基础入门](https://www.cnblogs.com/xiaohuochai/p/7215067.html#anchor9)

[mongoose populate 多表关联查询](https://www.jianshu.com/p/817ff51bd548)

[Centos7 部署 Puppeteer 服务](http://www.lijundong.com/deply-puppeteer-on-production/)

#### API 命名规范

[RESTful API 设计指南](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)
[restify](http://restify.com/docs/home/)
