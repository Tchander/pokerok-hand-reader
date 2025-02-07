import './assets/reset.css';

import { createApp } from 'vue';
import App from './App.vue';
import store from '@/stores';

function setupProject() {
  const app = createApp(App);

  app.use(store);

  app.mount('#app');
}

setupProject();
