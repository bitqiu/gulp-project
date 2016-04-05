## 环境准备
安装sass,compass,以及compass spriting(精灵图)支持.(png图片生成库)
[sass安装方法](http://sass-lang.com/install)
[compass安装方法](http://compass-style.org/install)
[png图片生成库安装方法](http://compass-style.org/help/tutorials/spriting)
```
$ gem install sass
$ gem install compass
$ gem install oily_png
```

## 开发

```
$ npm install
$ bower install
$ gulp serve
```

## 打包

```
$ gulp build 或 gulp serve:dist
```

## 线上布署
```
$ pm2 start process.json
```
## 测试
karma测试:

```
$ gulp test
```
e2e测试:

```
//需要先在服务端开启测试模式
$ gulp test:e2e
```
## TODO
- [ ] gulp-minify-html  替换  htmlmin