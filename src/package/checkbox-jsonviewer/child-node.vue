<template>
  <ul>
    <li v-for="(value, key) in filteredData" :key="key" :class="{ 'left-line': !isTop }">
      <div>
        <!-- 选择元素的复选框 -->
        <el-checkbox v-if="isEditMode && !isTop" :key="componentKey" :checked="isKeyVisible(key)"
          @change="(selected: boolean) => toggleKeyVisibility(key, selected)" />
        <div :style="`cursor: ${isObject(value) || isArray(value) ? 'pointer' : 'default'}`"
          @click="toggleExpanded(key)">
          <!-- 展开关闭的icon -->
          <el-icon v-if="shouldShowExpandIcon(value)" style="margin-right: 2px;">
            <template #default>
              <component :is="isExpanded(key) ? CollapseIcon : ExpandIcon" />
            </template>
          </el-icon>
          <!-- json的key值 -->
          <span :class="['key-style', { 'number-key-style': !isNaN(Number(key)) }]">
            {{ isTop ? '' : isNaN(Number(key)) ? props.showQuota ? `"${key}"` : key : Number(key) }}
          </span>
          <span v-if="!isTop" class="semicolon-style">:</span>
          <!-- json的各种类型value值 -->
          <span v-if="isObject(value) || isArray(value)" class="bracket-style">
            <span>{{ isArray(value) ? '[' : '{' }}</span>
            <span v-if="!isExpanded(key) && shouldShowEllipsisIcon(value)" class="ellipsis-style">...</span>
            <span v-if="!isExpanded(key)">{{ isArray(value) ? ']' : '}' }}</span>
          </span>
          <span v-if="isBoolean(value)">
            <span class="boolean-value">{{ value }}</span>
          </span>
          <span v-if="isNumber(value)">
            <span class="number-value">{{ value }}</span>
          </span>
          <span v-if="isNull(value)">
            <span class="null-value">NULL</span>
          </span>
          <span v-if="isLink(value)">
            <a :href="value" target="_blank" class="link-value">{{ value }}</a>
          </span>
          <span
            v-else-if="!isObject(value) && !isArray(value) && !isBoolean(value) && !isNumber(value) && !isNull(value)">
            <span class="text-value">"{{ value }}"</span>
          </span>
        </div>
      </div>
      <!-- 子级复用组件 -->
      <div v-if="isExpanded(key) && (isObject(value) || isArray(value))">
        <ChildNode :is-top="false" :data="value" :is-edit-mode="isEditMode" :visible-keys="getVisibleKeysForChild(key)"
          :path="String(key)" :expand-depth="expandDepth - 1" :show-quota="props.showQuota"
          :showbtn-menu="props.showbtnMenu" @update-visible-keys="updateChildVisibleKeys(key, $event)" />
        <div class="bracket-style bracket-end">
          <span>{{ isArray(value) ? ']' : '}' }}</span>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, shallowRef, computed, watchEffect, watch } from 'vue';
import { CaretTop, CaretBottom } from '@element-plus/icons-vue';

interface Props {
  isTop: boolean;
  data: Record<string, any>;
  isEditMode: boolean;
  visibleKeys: { [key: string]: boolean };
  path: string;
  expandDepth: number;
  showQuota: boolean;
  showbtnMenu: boolean;
}

const props = defineProps<Props>();
const emits = defineEmits<(event: 'update-visible-keys', newVisibleKeys: { [key: string]: boolean }) => void>();

const expandedKeys = ref<{ [key: string]: boolean }>({});

const componentKey = ref(0);

const isObject = (val: unknown): val is object => typeof val === 'object' && val !== null && !Array.isArray(val);
const isArray = (val: unknown): val is any[] => Array.isArray(val);
const isLink = (val: unknown): val is string => typeof val === 'string' && (val.startsWith('http://') || val.startsWith('https://'));
const isBoolean = (val: unknown): val is boolean => typeof val === 'boolean';
const isNumber = (val: unknown): val is number => typeof val === 'number';
const isNull = (val: unknown): val is null => val === null;

const isExpanded = (key: string): boolean => expandedKeys.value[key] || false;

const toggleExpanded = (key: string): void => {
  expandedKeys.value[key] = !expandedKeys.value[key];
};

const updateComponentKey = () => {
  componentKey.value += 1;
};

const isKeyVisible = computed(() => (key: string): boolean => props.visibleKeys[key] !== false);

// 递归更新子级的可见性和禁用状态
const recursionVisibility = (newVisibleKeys: { [key: string]: boolean }, parentKey: string, isSelected: boolean) => {
  // 获取props.data中路径parentKey对应的数据
  const toString = String(parentKey);
  const childData = toString.split('.').reduce((current, part) => {
    if (current && part in current) {
      return current[part]; // 返回当前层级的值
    }
    return {}; // 如果某个层级不存在，返回 {}
  }, props.data);
  // 如果childData是数组或对象，则递归处理其子项
  if (isObject(childData) || isArray(childData)) {
    const childKeys = Object.keys(childData);
    childKeys.forEach((childKey) => {
      const fullChildKey = `${parentKey}.${childKey}`;
      newVisibleKeys[fullChildKey] = isSelected; // 修改副本
      recursionVisibility(newVisibleKeys, fullChildKey, isSelected);
    });
  }
};
// 复选框切换选中状态
const toggleKeyVisibility = (key: string, isSelected: boolean): void => {
  const newVisibleKeys = { ...props.visibleKeys };
  newVisibleKeys[key] = isSelected;
  // console.log('切换了', key, newVisibleKeys);
  recursionVisibility(newVisibleKeys, key, isSelected);
  emits('update-visible-keys', newVisibleKeys);
};

// 处理传给子级的visiblekeys
const getVisibleKeysForChild = computed(() => (key: string) => {
  const initialAcc: { [key: string]: boolean } = {};
  const curKeyChildKeys = Object.keys(props.visibleKeys).filter(k => k.startsWith(`${key}.`));
  const result = curKeyChildKeys.reduce((acc, k) => {
    acc[k.replace(`${key}.`, '')] = props.visibleKeys[k];
    return acc;
  }, initialAcc);
  // console.log(key,'传给子', result);
  return result;
});

// 由子组件切换选中状态触发的方法
const updateChildVisibleKeys = (key: string, newVisibleKeys: { [key: string]: boolean }) => {
  const updatedKeys = { ...props.visibleKeys };
  Object.keys(newVisibleKeys).forEach((childKey) => {
    updatedKeys[`${key}.${childKey}`] = newVisibleKeys[childKey];
  });
  // 根据子级状况处理当前选中状态：如果子级有true,当前true;
  // 子级无true的情况暂不处理，因为还要考虑：若子级无切换操作的话，是不在newVisibleKeys中的
  const childHasTrue = Object.values(newVisibleKeys).some(item => item === true);
  if (!props.isTop && childHasTrue) {
    updatedKeys[`${key}`] = childHasTrue;
  }
  // console.log(key, '的子组件修改了', JSON.parse(JSON.stringify(updatedKeys)),newVisibleKeys);
  emits('update-visible-keys', updatedKeys);
};

const filteredData = computed(() => {
  if (!props.isEditMode) {
    return Object.fromEntries(Object.entries(props.data).filter(([key]) => isKeyVisible.value(key)));
  }
  return props.data;
});

const ExpandIcon = shallowRef(CaretBottom);
const CollapseIcon = shallowRef(CaretTop);

const shouldShowExpandIcon = (value: unknown): boolean => isObject(value) || isArray(value);

const shouldShowEllipsisIcon = (value: unknown): boolean => (isObject(value) && Object.keys(value as object).length > 0) || (isArray(value) && (value as any[]).length > 0);

// 处理默认展开的层数
watchEffect(() => {
  if (props.expandDepth > 0) {
    Object.keys(props.data).forEach((key) => {
      expandedKeys.value[key] = true;
    });
  }
});

// 强制更新渲染checkbox视图
watch(() => props.visibleKeys, () => {
  updateComponentKey();
});

const ulMarginTop = computed(() => (props.showbtnMenu && props.isTop ? '1em' : 0))
</script>

<style scoped>
ul {
  list-style-type: none;
  margin-left: 6px;
  padding-left: 0;
  margin-block-start: v-bind(ulMarginTop);
  margin-block-end: 0;
}

.left-line {
  border-left: 1px solid rgb(235, 235, 235);
  padding-left: 14px;
}

li>div:first-child {
  display: flex;
  align-items: center;

  label {
    height: auto;
    margin: 0 5px 0 0;
  }
}

.key-style {
  color: rgb(0, 43, 54);
  letter-spacing: 0.5px;
  opacity: 0.85;
}

.number-key-style {
  color: rgb(108, 113, 196);
}

.semicolon-style {
  color: rgb(0, 43, 54);
  margin: 0 5px;
}

.bracket-style {
  display: inline-block;

  span {
    font-weight: bold;
    letter-spacing: 0;
  }
}

.bracket-end {
  span {
    margin-left: 4px;
  }
}

.ellipsis-style {
  color: rgb(203, 75, 22);
  font-size: 18px;
  margin-left: 2px;
}

.boolean-value {
  color: rgb(42, 161, 152);
}

.number-value {
  color: rgb(38, 139, 210);
}

.null-value {
  display: inline-block;
  padding: 1px 2px;
  color: rgb(220, 50, 47);
  font-size: 11px;
  font-weight: bold;
  background-color: rgb(235, 235, 235);
  border-radius: 3px;
  line-height: 1.4;
}

.link-value {
  color: rgb(29, 111, 210);
}

.text-value {
  color: rgb(203, 75, 22);
}
</style>
