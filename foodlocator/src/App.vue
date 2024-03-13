<script setup lang="ts">
import { ref } from 'vue'
import { useFoodDataStore } from './stores/DataFoodStore';
import { storeToRefs } from "pinia"; 



import MapComp from './components/MapComp.vue'
import BannerComp from './components/BannerComp.vue'



const props =  defineProps({
    emitedValueProp: {
        type:Object,
        required: false
    }
});

//One-Way Data Flow - converted the prop to ref for reactive value 
//from other child comp
const emitedValuePropRef = ref(props.emitedValueProp)
const foodDataStore = useFoodDataStore();


//METHODS
function emitPositionValue(argument){
  console.log( foodDataStore.reactiveCountryOrgins)
  console.log( "Latitude: " + argument.coords.latitude +
    "Longitude:" + argument.coords.longitude)
    emitedValuePropRef.value = argument
}
function fetchFoodData(){
  foodDataStore.fetchcuisine()
}
</script>

<template>
<div class="mt-15">
  {{ foodDataStore.getFoodDataByCuisine.length }}
{{ foodDataStore.getFoodDataByCuisine }}
</div>

  <MapComp msg="mapcomponent" :initmapvalue="emitedValuePropRef" />
 
  <v-app>
    <v-app-bar>
      <v-container class="d-flex align-center py-0">
        <v-app-bar-title class="pl-0">
          <div class="d-flex align-center">
            <v-avatar
              rounded="0"
              class="mr-3"
              image="https://cdn.vuetifyjs.com/docs/images/logos/v.png"
            />

            Foodlocator
          </div>
       
        </v-app-bar-title>
      </v-container>
    </v-app-bar>

    <v-main>
     
      <BannerComp @emit-position-value="emitPositionValue" class="mb-5"/>
      <v-form  @submit.prevent>
        <v-container>
          <h4 class="text-h5 pb-5">
                  Find existing world food
          </h4>
          <v-row>
            <v-col cols="12" md="4">
            <v-combobox
              label="Food ingredient name"
              :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
            ></v-combobox>
            </v-col>
            <v-col cols="12" md="4">
              <v-autocomplete
                clearable
                label="Land of origin"
                :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="4">
              <v-btn type="submit" @click="fetchFoodData()" block>Search</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <v-form @submit.prevent>
        <v-container>
          <h4 class="text-h5 pb-5">
                  Insert new world foodIngredient
                  </h4>
          <v-row>
            <v-col cols="12" md="3">
              <v-text-field label="Food ingredient name" clearable
                required></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
                <v-autocomplete
                clearable
                label="Food category"
                :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" md="3">
              <v-autocomplete
                clearable
                label="Land of origin"
                :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="3">
              <v-btn type="submit" block>Submit</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
     
      <section id="hero">
        <v-sheet class="d-flex align-center pb-16" color="grey-darken-3">
          <v-container class="text-center">
            <v-row justify="space-between">
              <v-col cols="auto">
                <v-responsive class="mx-auto mt-4" max-width="250">
                  <v-img max-width="400" src="https://cdn.vuetifyjs.com/store/themes/vite-free/slider.png" />
                  <h3 class="text-h3 mt-4">
                   Step1
                  </h3>
                  <p class="mt-4 text-medium-emphasis">
                    This is a basic Vuetify 3 application designed to help get your feet wet with the next version of
                    the framework. Visit our <a href="https://next.vuetifyjs.com/" target="_blank"
                      rel="noopener noreferrer">documentation</a> for more information.
                  </p>
                </v-responsive>
              </v-col>
              <v-col cols="auto">
                <v-responsive class="mx-auto mt-4" max-width="250">
                  <v-img max-width="400" src="https://cdn.vuetifyjs.com/store/themes/vite-free/slider.png" />
                  <h3 class="text-h3 mt-4" >
                    Step2
                  </h3>
                  <p class="mt-4 text-medium-emphasis">
                    This is a basic Vuetify 3 application designed to help get your feet wet with the next version of
                    the framework. Visit our <a href="https://next.vuetifyjs.com/" target="_blank"
                      rel="noopener noreferrer">documentation</a> for more information.
                  </p>
                </v-responsive>
              </v-col>

              <v-col cols="auto">
                <v-responsive width="250" class="mx-auto mt-4" max-width="250">
                  <v-img max-width="400" src="https://cdn.vuetifyjs.com/store/themes/vite-free/slider.png" />
                  <h3 class="text-h3 mt-4">
                    Step3
                  </h3>
                  <p class="mt-4 text-medium-emphasis">
                    This is a basic Vuetify 3 application designed to help get your feet wet with the next version of
                    the framework. Visit our <a href="https://next.vuetifyjs.com/" target="_blank"
                      rel="noopener noreferrer">documentation</a> for more information.
                  </p>
                </v-responsive>
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
        <v-pagination :length="15" :total-visible="7" rounded="0" />
      </section>

      <v-sheet class="py-16">
        <section id="filter">
          <v-container>
            <v-row justify="space-between">
              <v-col cols="auto">
                <v-responsive width="350">
                  <h2 class="text-h4">
                    New customization system
                  </h2>

                  <p class="text-success mt-3">
                    Global Defaults
                  </p>

                  <strong class="mt-3">
                    Version 3 Only
                  </strong>

                  <p class="mt-8">
                    Vuetify 3 has an unprecedented level of customization options that make implementing any design
                    system easy.
                  </p>

                  <p class="mt-8">
                    Assign default values for all components in the library, including nested support.
                  </p>

                  <v-btn class="mt-6" href="https://next.vuetifyjs.com/features/global-configuration/" target="_blank"
                    rel="noopener noreferrer">
                    More Information
                  </v-btn>
                </v-responsive>
              </v-col>
              <v-col cols="auto">
                <v-responsive width="350">
                  <v-img max-width="400" src="https://cdn.vuetifyjs.com/store/themes/vite-free/chips-bar.png" />
                </v-responsive>
              </v-col>
            </v-row>
          </v-container>
        </section>

        <v-container>
          <v-divider class="my-12" />
        </v-container>

        <section id="controls">
          <v-container>
            <v-row justify="space-between">
              <v-col cols="auto">
                <v-responsive width="350">
                  <h2 class="text-h4">
                    Rebuilt from the ground up
                  </h2>

                  <p class="text-success mt-3">
                    Composition API
                  </p>

                  <p class="mt-3">
                    Vuetify 3 uses the Vue composition API to build easy-to-use and feature rich components that work
                    out of the box.
                  </p>

                  <p class="mt-8">
                    <strong>How to use:</strong>

                    Services are now accessed through <strong>use functions</strong> that follow the Vue 3 nomenclature
                    and code styling.
                  </p>

                  <v-btn class="mt-6" href="https://next.vuetifyjs.com/introduction/why-vuetify/" target="_blank"
                    rel="noopener noreferrer">
                    More Information
                  </v-btn>
                </v-responsive>
              </v-col>

              <v-img max-width="400" src="https://cdn.vuetifyjs.com/store/themes/vite-free/slider.png" />
            </v-row>
          </v-container>
        </section>

        <v-container>
          <v-divider class="my-12" />
        </v-container>

        <section id="grid">
          <v-container>
            <v-row justify="space-between">
              <v-col cols="auto">
                <v-responsive width="350">
                  <h2 class="text-h4">
                    The most complete version yet
                  </h2>

                  <p class="text-success mt-3">
                    Available now!
                  </p>

                  <p class="mt-3">
                    The latest version is almost here. Use one of our free themes to get a head start!
                  </p>

                  <p class="mt-8">
                    This theme is designed to demonstrate a basic single page application using Vuetify 3.
                  </p>

                  <v-btn class="mt-6">
                    More Information
                  </v-btn>
                </v-responsive>
              </v-col>

              <v-img max-width="400" src="https://cdn.vuetifyjs.com/store/themes/vite-free/layout.png" />
            </v-row>
          </v-container>
        </section>
      </v-sheet>

      <v-sheet class="py-16" color="#181818">
        <section id="grid">
          <v-container>
            <v-row justify="space-between">
              <v-col cols="auto">
                <v-responsive class="overflow-visible" width="350">
                  <h2 class="text-h4">
                    Shape the future of Vuetify
                  </h2>

                  <p class="text-success mt-3">
                    Support Development
                  </p>

                  <strong>Become a sponsor</strong>

                  <p class="mt-8">
                    Vuetify is free to use software under the <a href="https://opensource.org/licenses/MIT"
                      target="_blank" rel="noopener noreferrer">MIT</a> License and requires an extensive amount of time
                    to maintain. Supporting development ensures Vuetify will be actively maintained.
                  </p>

                  <v-btn-alt class="mt-6 " href="https://github.com/sponsors/johnleider" target="_blank"
                    rel="noopener noreferrer">
                    Support now
                  </v-btn-alt>
                </v-responsive>
              </v-col>
            </v-row>
          </v-container>
        </section>
      </v-sheet>
    </v-main>

    <v-footer>
      <v-container class="text-overline d-flex align-center justify-space-between">
        <div>
          Copyright &copy; 2022 Vuetify, LLC
        </div>

        <v-icon icon="mdi-vuetify" size="x-large" />
      </v-container>
    </v-footer>
  </v-app>


</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
