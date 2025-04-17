<script setup lang="ts">
// import checkboxJsonviewer from './package/checkbox-jsonviewer/index.vue'
import checkboxJsonviewer from 'checkbox-jsonviewer'
import '../dist/checkbox-jsonviewer.css'

const jsonData_test = '{"name": "John", "age": {"a":30,"b":"dasf"}}'
// {
//   "request_id": "1744614285.322678_0.7948833576865223",
//   "raw_query": "饮品",
//   "search_mode": "Content",
//   "slot_info": {
//     "info": {
//       "time": [],
//       "contact_type": 0,
//       "chat_topic": [
//         "饮品"
//       ],
//       "exclude_topic": [],
//     },
//     "cost": {
//       "secs": true,
//       "nanos": 683076292
//     }
//   },
//   "metadata": {
//     "session_user_name": "111222@chatroom",
//     "long_caption": null,
//     "core_tags": [
//       "日常拍摄照片",
//       "杯子",
//       "包装盒"
//     ],
//     "exact_tags": [
//       "陶瓷杯",
//     ],
//     "ocr_text": "灬0\n© Uucky Every Day Lucky Dm\ntwery\nDay",
//     "cls_l1": null,
//     "cls_l2": null,
//     "cls_l3": null
//   },
//   "image_url": "https://baidu.com/l11.jpg",
//   "retrieval_infos": [
//     {
//       "module_name": "short_caption_embedding",
//       "detail": {
//         "hit_info": {
//           "L2": 1.3311166763305664
//         },
//         "postprocess_score": 0.9980087876319885
//       }
//     }
//   ]
// }
</script>

<template>
  <!-- <checkboxJsonviewer name-space="jsonviewer" :data="jsonData_test" :expand-depth="1" :show-border="false"
    :show-quota="true" :editable="true" :show-copy="false" />
  <checkboxJsonviewer name-space="jsonviewer2" :data="jsonData_test" :expand-depth="1" /> -->
  <div style="height: 300px; width: 100%;">

    <checkbox-jsonviewer :data="jsonData_test" :expand-depth="1" :linkage="true" />
    <checkbox-jsonviewer :data="jsonData_test" :expand-depth="2" :linkage="false" />
  </div>
</template>

<style scoped></style>
