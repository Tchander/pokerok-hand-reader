import './assets/reset.css';

import { createApp } from 'vue';
import App from './App.vue';
import store from '@/stores';

// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

function setupProject() {
  const app = createApp(App);

  const vuetify = createVuetify({
    components,
    directives,
  })

  app.use(vuetify);

  app.use(store);

  app.mount('#app');
}

setupProject();
