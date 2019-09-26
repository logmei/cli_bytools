## npm包的配置 package.json
* 设置private：false
* 入口文件配置(使用编译后的文件)
  ```js
   "main": "bin/index.js",
  ```
* 命令运行
  ```js
  "bin":{
    "logmeiCli":"bin/index.js"
  }
  ```
* 增加README.MD发布的npm自动读取说明
* script增加babel编译
  ```js
  "build": "babel src -d dist",
  ```
  