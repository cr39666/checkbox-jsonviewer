## 当前进展

目前情况发布后，安装checkbox-jsonviewer可以使用，但是样式文件未生效，不知道为何，需要手动引入样式才行。

另外安装后还有一个报错，明明包中已经有了.d.ts文件，但还是报错，报错信息如下：

```
无法找到模块“checkbox-jsonviewer”的声明文件。“d:/code/checkbox-jsonviewer/node_modules/checkbox-jsonviewer/checkbox-jsonviewer.es.js”隐式拥有 "any" 类型。
  尝试使用 `npm i --save-dev @types/checkbox-jsonviewer` (如果存在)，或者添加一个包含 `declare module 'checkbox-jsonviewer';` 的新声明(.d.ts)文件ts-plugin
```

## 发布步骤

1. checkbox-jsonviewer目录执行`npm run build-only` 进行打包
2. 进入`cd dist`目录，执行`npm init -y`手动生成包的package.json文件，然后将以下内容放进去，重复的属性覆盖掉即可

```json
  "name": "checkbox-jsonviewer",
  "version": "1.0.0",
  "description": "A Vue3 + TS JSON visualization component with checkbox to control member visibility",
  "license": "MIT",
  "author": "croyell",
  "keywords": [
    "jsonviewer",
    "Vue3",
    "jsonviewer-vue3",
    "jsonviewer-vue3-checkbox",
    "jsonviewer-checkbox",
    "checkbox-jsonviewer"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/cr39666/checkbox-jsonviewer"
  },
  "main": "checkbox-jsonviewer.es.js",
```

3. 将项目中的`README.md`文件手动复制到dist目录下
4. 可以执行`npm version patch`进行版本更新，也可以手动修改package.json中的版本号(初次发布，就1.0.0就可以了，跳过这一步)
5. 执行`npm publish`发布
6. 发布成功返回项目目录`cd ../`,直接`npm install checkbox-jsonviewer`使用即可
