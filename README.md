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

### 安装 puppeteer

使用 nrm 切换镜像源

```bash
nrm use taobao
npm i puppeteer
```

可能会下载失败，需要设置国内镜像源

```js
ERROR: Failed to download Chromium r609904! Set "PUPPETEER_SKIP_CHROMIUM_DOWNLOAD" env variable to skip download.
{ Error: read ECONNRESET
    at TLSWrap.onStreamRead (internal/stream_base_commons.js:111:27) errno: 'ECONNRESET', code: 'ECONNRESET', syscall: 'read' }
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.2.4 (node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.2.4: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
```

设置国内镜像源

```bash
PUPPETEER_DOWNLOAD_HOST=https://storage.googleapis.com.cnpmjs.org
```

如果仍旧下载不成功，可以尝试使用 cnpm

```bash
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm i puppeteer
```

## 需要添加 Chromium 依赖

将项目部署到服务器上后，发现定时任务没有生效，vi /root/.pm2/logs/www-error.log 查看 pm2 错误日志：

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

发现是 puppeteer 没有打开 chrome，发现是缺少相关依赖

```bash
yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 -y
```

需要以 --no-sandbox 模式启动

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

[Centos7 部署 Puppeteer 服务](http://www.lijundong.com/deply-puppeteer-on-production/)

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
