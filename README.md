# checkbox - jsonviewer - JSON 可视化组件

`checkbox-jsonviewer`是一个用 Vue3 + TypeScript 封装的公共组件，旨在提供便捷的 JSON 数据可视化查看功能。通过该组件，你可以轻松地将 JSON 数据以直观的方式展示出来，并且能够通过复选框灵活控制每个 JSON 成员的显示与隐藏。

## 组件依赖

使用 `checkbox - jsonviewer` 之前，你需要确保项目使用了element-plus和pinia，否则可能无法使用当前组件，后续有时间本人可能会去掉element-plus的依赖。

## 功能特点

**JSON 数据可视化**：能够接收并可视化传入的 JSON 数据。

**复选框控制显隐**：通过选中或取消选中每个 JSON 成员前的复选框，动态控制成员的显示与隐藏。

**丰富的配置参数**：提供多个参数，满足不同场景下的使用需求。

**联动同步**：支持，详见属性`linkage`描述。

## 安装

你可以通过 npm 安装`checkbox - jsonviewer`：

```
npm install checkbox-jsonviewer
```

## 使用方法

在你的 Vue 项目中引入并使用该组件：

```html
<template>
  <checkbox-jsonviewer
    :nameSpace="yourNamespace"
    :props.data="yourJsonData"
    :props.expandDepth="1"
    :props.linkage="true"
    :props.editable="true"
    :props.showQuota="false"
    :props.showBorder="true"
    :props.showShadow="true"
    :props.showCopy="true"
  />
</template>

<script setup lang="ts">
  import checkboxJsonviewer from 'checkbox-jsonviewer'

  const yourNamespace = 'exampleNamespace'

  const yourJsonData: string | object = { key1: 'value1', key2: 'value2' }
</script>
```

## 组件参数

| 参数名            | 类型       | 描述                                                                                                                                               | 默认值 |
| ----------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| nameSpace         | string     | 组件的命名空间，用于多个地方复用组件的时候区分 localstorage                                                                                        | ''     |
| props.data        | string/obj | 传入的 JSON 数据                                                                                                                                   | 无     |
| props.expandDepth | number     | 展开层数                                                                                                                                           | 0      |
| props.linkage     | boolean    | 不刷新页面的情况下，是否将当前组件的显隐状态与其他的同命名空间的组件联动同步,默认不联动；若手动刷新页面，无论此属性是否为true,同命名空间的都会同步 | false  |
| props.editable    | boolean    | 是否可编辑,即是否可通过选择复选框来控制成员显隐                                                                                                    | true   |
| props.showQuota   | boolean    | 是否显示 key 值的引号                                                                                                                              | false  |
| props.showBorder  | boolean    | 是否显示边框                                                                                                                                       | true   |
| props.showShadow  | boolean    | 是否显示阴影                                                                                                                                       | true   |
| props.showCopy    | boolean    | 是否显示复制按钮                                                                                                                                   | true   |

## 示例

你可以在[此处](链接到示例页面，若有)查看在线示例，了解该组件的实际使用效果。

## 贡献

如果你想为`checkbox - jsonviewer`贡献代码，欢迎提交 Pull Request。请确保你的代码符合项目的编码规范，并添加必要的测试。

## 许可证

`checkbox - jsonviewer`使用[MIT 许可证](LICENSE)，你可以自由地使用、修改和分发该组件。
