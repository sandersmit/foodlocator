import App from './App.vue'

//pinia instance for data
import { createPinia } from 'pinia'
import { createApp } from 'vue'

// Vuetify
// import 'vuetify/styles'
// import '@mdi/font/css/materialdesignicons.css'

import './style.css'
//import { createVuetify } from 'vuetify'
import { registerPlugins } from './plugins'
import vuetify from './plugins/vuetify'



import MapComp from './components/MapComp.vue'

//setting a constant for the imported 'createPinia' call it : pinia
const pinia = createPinia()
const app = createApp(App)




app.component('map-comp', MapComp)

registerPlugins(app)
app.use(pinia)
app
  .use(vuetify)
  .mount('#app')
