<template>
  <div class="json-viewer">
    <el-button :type="isEditMode ? 'primary' : ''" :icon="Edit" size="small" circle class="mode-button"
      @click="toggleMode" />
    <ChildNode :is-top="true" :data="jsonData" :is-edit-mode="isEditMode" :visible-keys="visibleKeys" :path="'_'"
      :expand-depth="expandDepth" @update-visible-keys="updateVisibleKeys" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import ChildNode from './child-node.vue';
import { Edit } from '@element-plus/icons-vue';
import { useJsonViewerStore } from '@/stores/store'; // 引入局部 store 实例

const jsonViewerStore = useJsonViewerStore();

/**
 * json-viewer
 * @param {string} nameSpace - 组件的命名空间,用于多个地方复用组件的时候区分localstorage
 * @param {Object} props.data - json对象
 * @param {number} props.expandDepth - 展开层数
 * @param {boolean} props.linkage - 不刷新页面的情况下，是否与其他的同命名空间的组件联动同步显隐状态,默认联动；若刷新页面，无论此属性是否为true,同命名空间的都会同步
 * TODO:
 * @param {boolean} props.mode - 模式，默认all,可选 all,select,view
 * @param {boolean} props.showQuotationMark - 是否显示引号，默认不显示
 * @param {boolean} props.showborder - 是否显示边框，默认不显示
 * @param {boolean} props.showShadow - 是否显示阴影，默认不显示
 * @param {boolean} props.showLineNumber- 是否显示行号，默认不显示
 */
interface Props {
  nameSpace?: string;
  data: Record<string, any>;
  expandDepth?: number;
  linkage?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  nameSpace: '',
  expandDepth: 0,
  linkage: false,
});

const jsonData = ref({ _: props.data });

const isEditMode = ref<boolean>(false);
const visibleKeys = ref<Record<string, boolean>>({});

const toggleMode = () => {
  isEditMode.value = !isEditMode.value;
  if (!isEditMode.value) {
    localStorage.setItem(`${props.nameSpace}_json-viewer`, JSON.stringify(visibleKeys.value));
    // 更新 store 中的 visibleKeys
    if (props.linkage) {
      jsonViewerStore.updateJsonViewerData({
        namespace: props.nameSpace,
        key: 'visibleKeys',
        value: visibleKeys.value,
      });
    }
  }
};

const updateVisibleKeys = (newVisibleKeys: Record<string, boolean>) => {
  visibleKeys.value = newVisibleKeys;
  /**
   * 注释掉就只有在切换为!isEditedMode.value的时候才更新视图的成员的显隐
   * 注释取消，会随着selected/unselected立即更新同一个命名空间的所有组件的视图
   */
  // if (props.linkage) {
  //   jsonViewerStore.updateJsonViewerData({
  //     namespace: props.nameSpace,
  //     key: 'visibleKeys',
  //     value: newVisibleKeys,
  //   });
  // }
};

// 监听 store 中 visibleKeys 的变化
watch(
  () => jsonViewerStore.jsonViewerNamespace[props.nameSpace]?.visibleKeys,
  (newValue) => {
    if (newValue) {
      visibleKeys.value = newValue;
    }
  },
  { deep: true },
);

// 从 store 中获取 visibleKeys
// const getVisibleKeysFromStore = () => jsonViewerStore.getJsonViewerData(props.nameSpace).then(data => data.visibleKeys || {});

// 初始化 visibleKeys
const initVisibleKeys = async () => {
  const storedKeys = localStorage.getItem(`${props.nameSpace}_json-viewer`);
  if (storedKeys) {
    visibleKeys.value = JSON.parse(storedKeys);
  }
};

onMounted(() => {
  initVisibleKeys();
});
</script>

<style scoped>
.json-viewer {
  background-color: #fff;
  position: relative;
  border: 1px solid rgb(225, 225, 239);
  border-radius: 8px;
  height: fit-content;
  /* max-height: 400px; */
  padding: 10px;
  font-family: monospace;
  overflow-y: auto;
  line-height: 22px;
}

.json-viewer::-webkit-scrollbar {
  width: 6px;
}

.json-viewer::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #999;
  }
}

.mode-button {
  position: absolute;
  top: 4px;
  right: 4px;
}
</style>
