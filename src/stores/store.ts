import { defineStore } from 'pinia';

// 定义状态类型
interface JsonViewerState {
  jsonViewerNamespace: Record<string, any>; // 存储每个命名空间的数据
}

// 创建 Pinia Store
export const useJsonViewerStore = defineStore('jsonViewer', {
  state: (): JsonViewerState => ({
    jsonViewerNamespace: {}, // 初始化为空对象
  }),
  actions: {
    // 获取指定命名空间的 jsonViewer 数据
    getJsonViewerData(namespace: string): Record<string, any> {
      if (!this.jsonViewerNamespace[namespace]) {
        this.jsonViewerNamespace[namespace] = {}; // 如果命名空间不存在，初始化为空对象
      }
      return this.jsonViewerNamespace[namespace];
    },
    // 更新指定命名空间的 jsonViewer 数据
    updateJsonViewerData(payload: { namespace: string; key: string; value: any }): void {
      const { namespace, key, value } = payload;
      if (!this.jsonViewerNamespace[namespace]) {
        this.jsonViewerNamespace[namespace] = {};
      }
      this.jsonViewerNamespace[namespace][key] = value;
    },
  },
});
