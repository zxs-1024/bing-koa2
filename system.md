升级 yum && Tools

```bash
yum update -y
yum groupinstall -y "Development Tools"

// 安装 n 管理 node 版本

which node

vim ~/.bash_profile

export N_PREFIX=/opt/node #node 实际安装位置

export PATH=$N_PREFIX/bin:$PATH

source ~/.bash_profile
```

```bash
npm install -g n

// 安装最新版本
n latest

// 安装稳定版
n stable
```

安装 nrm

```bash
// install
npm install -g nrm

// 查看版本
nrm --version

// 查看镜像源列表
nrm ls

// 切换镜像源
nrm use taobao
```

安装 cnpm

```bash
npm i -g cnpm
```

安装 Ghost Client （ghost-cli）

```bash
npm i -g ghost-cli
ghost -v
adduser ghost
mkdir /var/www
mkdir /var/www/ghost
chown ghost /var/www/ghost
su ghost
cd /var/www/ghost
ghost install local --db=sqlite3
```
