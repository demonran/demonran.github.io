### 使用NVM（Node Version Manager）进行node多版本管理

#### 安装nvm
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

#### 激活nvm
```bash
source ~/.bashrc

```

#### nvm 常用命令
```bash
nvm list # 查看当前安装的node版本`
nvm install 16.13.2 # 安装node版本
nvm use 16.13.2 # 切换node版本
nvm alias default 16.13.2 # 设置默认版本
nvm uninstall 16.13.2 # 卸载node版本
nvm ls-remote # 查看远程node版本
nvm install --lts # 安装最新LTS版本
nvm install --lts=fermium # 安装指定LTS版本
nvm install --lts=fermium --latest-npm # 安装指定LTS版本并更新npm
nvm install --lts=fermium --latest-npm --reinstall-packages-from=16.13.2 # 安装指定LTS版本并更新npm

```