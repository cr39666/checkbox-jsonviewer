<template>
  <div :class="['json-viewer', { 'json-viewer-border': props.showBorder, 'json-viewer-shadow': props.showShadow }]">
    <div class="btn-menu">
      <el-button v-if="editable" :type="isEditMode ? 'primary' : ''" :icon="Edit" size="small" circle
        @click="toggleMode" />
      <el-button v-if="props.showCopy" :icon="CopyDocument" :type="copied ? 'primary' : ''" size="small" circle
        @click="copyJson" />
    </div>
    <ChildNode :is-top="true" :data="jsonData" :is-edit-mode="isEditMode" :visible-keys="visibleKeys" :path="'_'"
      :expand-depth="expandDepth" :show-quota="props.showQuota" :showbtn-menu="showbtnMenu"
      @update-visible-keys="updateVisibleKeys" />
  </div>
</template>

<script lang="ts">
export default {
  name: "checkbox-jsonviewer",
};
</script>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import ChildNode from './child-node.vue';
import { Edit, CopyDocument } from '@element-plus/icons-vue';
import { useJsonViewerStore } from '@/stores/store'; // 引入局部 store 实例

const jsonViewerStore = useJsonViewerStore();

/**
 * json-viewer
 * @param {string} nameSpace - 组件的命名空间,用于多个地方复用组件的时候区分localstorage
 * @param {unknown} props.data - 传入的json数据
 * @param {number} props.expandDepth - 展开层数
 * @param {boolean} props.linkage - 不刷新页面的情况下，是否将当前组件的显隐状态与其他的同命名空间的组件联动同步,默认不联动；若手动刷新页面，无论此属性是否为true,同命名空间的都会同步
 * @param {boolean} props.editable - 是否可编辑，即是否可通过选择复选框来控制成员显隐，默认可以
 * @param {boolean} props.showQuota - 是否显示key值的引号，默认不显示
 * @param {boolean} props.showBorder - 是否显示边框，默认显示
 * @param {boolean} props.showShadow - 是否显示阴影，默认显示
 * @param {boolean} props.showCopy- 是否显示复制按钮，默认显示
 */
interface Props {
  nameSpace?: string;
  data: unknown;
  expandDepth?: number;
  linkage?: boolean;
  editable?: boolean;
  showQuota?: boolean;
  showBorder?: boolean;
  showShadow?: boolean;
  showCopy?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  nameSpace: '',
  expandDepth: 0,
  linkage: false,
  editable: true,
  showQuota: false,
  showBorder: true,
  showShadow: true,
  showCopy: true,
});
const showbtnMenu = computed(() => {
  return props.editable || props.showCopy;
});

/**
 * 校验并格式化 props.data 为 JSON 对象格式
 * @param data - 可能是 JSON 对象或 JSON 字符串
 * @returns 格式化后的 JSON 对象
 * @throws 如果数据无法解析为 JSON 对象，则抛出错误
 */
function validateAndFormatData(data: unknown): object {
  try {
    // 如果已经是对象，直接返回
    if (typeof data === 'object' && data !== null) {
      return data as object;
    }

    // 如果是字符串，尝试解析为 JSON 对象
    if (typeof data === 'string') {
      const parsedData = JSON.parse(data);

      // 确保解析后的结果是一个对象
      if (typeof parsedData === 'object' && parsedData !== null) {
        return parsedData;
      } else {
        throw new Error('Parsed data is not a valid JSON object');
      }
    }

    // 如果既不是对象也不是字符串，抛出错误
    throw new Error('Invalid input: data must be a JSON object or a JSON string');
  } catch (error) {
    console.error('Error validating and formatting data:', error);
    throw error; // 抛出错误以便调用方处理
  }
}
const fromatData = validateAndFormatData(props.data);
const jsonData = ref({ _: fromatData });

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

const copied = ref<boolean>(false);
const copyJson = () => {
  if (copied.value) return;
  const jsonStr = JSON.stringify(fromatData, null, 2);
  navigator.clipboard.writeText(jsonStr).then(() => {
    copied.value = true;
    console.log('复制成功');
  });
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
  border-radius: 8px;
  height: fit-content;
  /* max-height: 400px; */
  padding: 10px;
  font-family: monospace;
  overflow-y: auto;
  line-height: 22px;
}

.json-viewer-border {
  border: 1px solid rgb(225, 225, 239);
}

.json-viewer-shadow {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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

.btn-menu {
  position: absolute;
  top: 4px;
  right: 4px;
}
</style>
