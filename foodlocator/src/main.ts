import App from './App.vue'
import { createApp } from 'vue'

// Vuetify
// import 'vuetify/styles'
// import '@mdi/font/css/materialdesignicons.css'

import './style.css'
//import { createVuetify } from 'vuetify'
import { registerPlugins } from './plugins'
import vuetify from './plugins/vuetify'



import MapComp from './components/MapComp.vue'

const app = createApp(App)


app.component('map-comp', MapComp)

registerPlugins(app)

app
  .use(vuetify)
  .mount('#app')
