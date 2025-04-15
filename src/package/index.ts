import type { App, Component } from 'vue';
import checkboxJsonviewer from './checkbox-jsonviewer/index.vue';

const components: { name: string, component: Component }[] = [
  {
    name: 'checkboxJsonviewer',
    component: checkboxJsonviewer
  }
];

const install = (app: App): void => {
  components.forEach((com) => {
    if (com.name) {
      app.component(com.name, com.component)
    } else {
      console.warn(`Component does not have a name property and will not be registered.`);
    }
  })
};

export default install;