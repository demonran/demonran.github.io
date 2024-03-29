# 发布前端静态资源到OSS

前端发布静态资源到oss， 使用oss的CDN功能来加快页面的加载速度。
部署主要分为三个：
1. 修改构建文件，将静态资源指向阿里云路径
2. 读取dist下所有的所有文件
3. 将文件put到阿里云oss

### 1. 修改构建文件（以vue webpack打包为例）
修改vue.config.js中的publicPath, 指定为oss上传的目录地址，以//开头，不要加http或者https，让页面请求时根据请求的域名来自动添加。
```js
module.exports = {
  // hash 模式下可使用
  publicPath: '//' + process.env.VUE_APP_BUCKET_NAME +'.oss-cn-shanghai.aliyuncs.com/',
  outputDir: 'dist',
  assetsDir: 'static',
```

### 2. 通过nodejs获取某目录下所有文件
读取所有目录下的文件包含子目录， 思路就是采用递归读取文件。

##### nodejs 读取文件使用fs模块

fs模块为nodejs的核心模块之一，主要处理文件的读写、复制、s删除、重命名等操作。当需要使用该模块时，需要先导入该文件
```js
const fs = require('fs')
```
nodejs文件系统中的方法均有异步和同步两种版本，本地只用于构建脚本，可以使用同步接口，降低脚本的复杂度。
例如读取文件内容的函数有异步的fs.readFile()和同步的fs.readFileSync().
```js
const files = fs.readdirSync(dir_path)
```

使用path拼接目录和子目录/文件
```js
const path = require('path')
const file_dir = path.join(dir_path, filename)
```

通过fs.stat 检测是文件还是目录, 如果是文件就直接加载到arr中，如果是目录就递归调用读取目录的方法
```js
const stats = fs.statSync(file_dir)
const isDir = stats.isDirectory()
const isFile = stats.isFile()
if (isFile) {
    arr.push(file_dir)
} else if (isDir) {
    dir_list(file_dir, arr)
}
```
### 3. put静态资源到OSS
上传文件到阿里云oss使用ali-oss模块
```js
const OSS = require('ali-oss')
const client = new OSS({
    region: // yourRegion,
    accessKeyId: //'yourAccessKeyId',
    accessKeySecret: // 'yourAccessKeySecret',
    bucket: bucket//'exampleBucket',
  })
```
上传上一步获取的的文件列表到oss, 使用async和await 变为同步上传等待结果
```js
files.forEach(async function (file) {
    ossfile = path.join(static_dir, file.substr(build_dir.length))
    console.log('upload', file)
    await client.put(ossfile, file)
  })

```

## 其他优化点
#### 1. 区分构建环境
实际运用中会有多个部署环境， 一般会对不同的环境设置不同的bukcet, 所以我们需要讲静态资源发布到不同的bucket中

可以在构建上传的是提交一个环境变量， 根据变量来动态设置要用的bucket
```js
function getBucket(env) {
  const bucket = {
    sit: 'sitBucket',
    uat: 'uatBucket',
    prod: 'prodBucket',
  }
  return bucket[env]
}
```

增加不同的配置文件
.env.sit
.env.uat
.env.prod
每个配置文件中设置不同的环境变量`VUE_APP_BUCKET_NAME = 'sitBucket'`
package.json中增加scripts
```js
"scripts": {
    "build:prod": "vue-cli-service build && node scripts/upload.js prod",
    "build:sit": "vue-cli-service build --mode sit && node scripts/upload.js sit",
    "build:uat": "vue-cli-service build --mode uat && node scripts/upload.js uat"
    ....
}
```



完整的上传代码
```js
const fs = require('fs')
const path = require('path')
const OSS = require('ali-oss')

const static_dir = '__static__'
const build_dir = 'dist/'
function getOssClient(bucket) {
  return new OSS({
    region: // yourRegion,
    accessKeyId: //'yourAccessKeyId',
    accessKeySecret: // 'yourAccessKeySecret',
    bucket: bucket//'exampleBucket',
  })
}
function uploadOss(files, env) {
  const client = getOssClient(getBucket(env));
  files.forEach(async function (file) {
    ossfile = path.join(static_dir, file.substr(build_dir.length))
    console.log('upload', file)
    await client.put(ossfile, file)
  })
}
const dir_list = (dir_path, arr) => {
  const files = fs.readdirSync(dir_path)
  files.forEach(filename => {
    const file_dir = path.join(dir_path, filename)
    const stats = fs.statSync(file_dir)
    const isDir = stats.isDirectory()
    const isFile = stats.isFile()
    if (isFile) {
      arr.push(file_dir)
    } else if (isDir) {
      dir_list(file_dir, arr)
    }
  })
  return arr

}

function getBucket(env) {
  const bucket = {
    sit: 'sitBucket',
    uat: 'uatBucket',
    prod: 'prodBucket',
  }
  return bucket[env]
}

function main() {
  const env = process.argv[2]
  const file_list = []
  dir_list(build_dir, file_list)
  uploadOss(file_list, env)
}

main()


```