<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useFoodDataStore } from './stores/DataFoodStore';
import { storeToRefs } from "pinia";

import MapComp from './components/MapComp.vue'
import BannerComp from './components/BannerComp.vue'

const props = defineProps({
  emitedValueProp: {
    type: Object,
    required: false
  },
  emitedClickedPosValueProp: {
    type: Object,
    required: false
  }
});

//destructure parts of the store
const { reactiveCountries } = storeToRefs(useFoodDataStore());
const foodDataStore = useFoodDataStore();

const dataFindSelected = reactive({
  currentIngredientName: "",
  currentLandOrigin: null,
  targetCountry: null,
  currentLandLocation: null
})

const initPosData = reactive({
  coords: {
    latitude: 52.37031805385792,
    longitude: 4.890289306640626
  }
})

//One-Way Data Flow - converted the prop to ref for reactive value 
//from other child comp to the prop app.vue 
const emitedValuePropRef = ref()
const mapCompRef = ref()
const locationUser = ref(false)
const pages = ref(1)
const emitedClickedValueReacive = reactive({
  coords: {
    latitude: initPosData.coords.latitude,
    longitude: initPosData.coords.longitude
  }
})



//METHODS
//One-Way Data Flow - emited to prop
function emitPositionValue(argument) {
  locationUser.value = true;
  emitedValuePropRef.value = argument
  fetchPostionGeoData(emitedValuePropRef.value)
}

//One-Way Data Flow - emited to prop
function emitClickedPositionValue(argument) {
  console.log("clicked emit LatLong: ", argument.lat, argument.lng)
  emitedClickedValueReacive.coords.latitude = argument.lat;
  emitedClickedValueReacive.coords.longitude = argument.lng;
  foodDataStore.fetchFoodOriginClickPos(emitedClickedValueReacive)
  foodDataStore.fetchDataClickPos(emitedClickedValueReacive)
}


function fetchFoodData(arg) {
  foodDataStore.fetchcuisine(arg)
}

function fetchCountries() {
  console.log("fetchCountries")
  for (var key in mapCompRef.value) {
    console.log(mapCompRef.value.isDefaultMapStyle)
     mapCompRef.value.isDefaultMapStyle = false;
     console.log(mapCompRef.value.isDefaultMapStyle)
  }
  foodDataStore.fetchDataCountries();
}

function fetchCountriePosition(arg) {
  console.log("fetchCountriePosition", arg)
  foodDataStore.fetchPositionCountries(arg);
}

function fetchPostionGeoData(arg) {
  foodDataStore.fetchFoodOriginPosition(arg)
}
function scrollPageTo(arg)
{
    window.scrollTo({
    top: arg,
    behavior: "smooth",
  });
}

//COMPUTED
// const computeTargetPosition = computed(function () {
//   //cuisine is selected by user
//   if (dataFindSelected.currentLandOrigin) {
//     console.log("dataFindSelected.currentLandOrigin", dataFindSelected.currentLandOrigin)
//     fetchFoodData(dataFindSelected)
//     return 'currentLandLocation'
//   }
//   //location is accepted by user
//   if (emitedValuePropRef.value) {
//     console.log("computeTargetPosition", emitedValuePropRef.value)
//     return [emitedValuePropRef.value]
//     //location is clicked by user
//   } else if (emitedValuePropRef.value && emitedClickedValueReacive.coords) {
//     console.log("computeTargetPosition", emitedClickedValueReacive.coords)
//     return [emitedClickedValueReacive.coords]
//   }
// })

const computeClickedTargetPosition = computed(function () {
  if (emitedClickedValueReacive) {
    console.log("computeClickedTargetPosition", foodDataStore.getFoodPositionDataByClick)
    return foodDataStore.getFoodPositionDataByClick;
  } else {
    return foodDataStore.getFoodPositionDataByClick;
  }
})

const computeClickedTargetCatPosition = computed(function () {
  //get cathegorie specific position data
  if (emitedClickedValueReacive) {
    return foodDataStore.getFoodPositionCatDataByClick;
  } else {
    return foodDataStore.getFoodPositionCatDataByClick;
  }
})

const computeIsCluster = computed(function () {
  //get cathegorie specific position data
  for (var key in mapCompRef.value) {
    return mapCompRef.value.isClusterActive
  }
})

const computeGetCountries = computed(function () {
  //get cathegorie specific position data
  //if (reactiveCountries.length) {
  //array
  return foodDataStore.getAllCoutriesApi;
  //} else {
  //}
})

onMounted(() => {
  console.log("onMounted", initPosData.coords, computeIsCluster.value)
  fetchPostionGeoData(initPosData)
})
</script>

<template>
  <section class="mt-15">
    <!-- //One-Way Data Flow - drilled prop 'emitedValuePropRef' value in <MapComp  -->
    <MapComp msg="mapcomponent" :initmapvalue="initPosData"
      :init-pos-data-prop="foodDataStore.getFoodPositionDataByBanner"
      :country-pos-data-prop="foodDataStore.getCountryPositionData"
      :current-food-restaurants-prop="computeClickedTargetCatPosition" :initCoordsProp="emitedValuePropRef"
      :clickedPositionDataProp="computeClickedTargetPosition[0]" @emit-clicked-position-value="emitClickedPositionValue"
      ref="mapCompRef" />
    <BannerComp @emit-position-value="emitPositionValue" :initPosDataProp="foodDataStore.getFoodPositionDataByBanner"
      class="mb-5" />
  </section>
  <v-app>
    <v-app-bar>
      <v-container class="d-flex align-center py-0">
        <v-app-bar-title class="pl-0" id="topbar">
          <div class="d-flex align-center">
            <v-avatar rounded="0" class="mr-3" image="https://cdn.vuetifyjs.com/docs/images/logos/v.png" />
            Foodlocator
          </div>
        </v-app-bar-title>
      </v-container>
    </v-app-bar>
    
    <section id="grid" class="py-8">
      <v-container>
        <v-row justify="space-around">
          <v-col cols="auto">
            <v-responsive class="overflow-visible" width="350">
              <h2 class="text-h4">
                All the farmers in the netherlands
              </h2>
              <p class="mt-8">
                <span class="text-blue">{{ computeIsCluster ? "Show all farmers" : "Don't show all farmers" }}</span>
              </p>
              <p>
                License and requires an extensive amount of time
                to maintain. Supporting development ensures Vuetify will be actively maintained.
              </p>
              <v-switch @click="mapCompRef.setClusters()" color="info" inset
                :label="`Toggle all farmers on the map ${computeIsCluster}`" false-value="no"
                true-value="yes"></v-switch>
            </v-responsive>
          </v-col>
          <v-col cols="auto">
            <v-responsive class="overflow-visible" width="350">
              <h2 class="text-h4">
                Pointed geo data
              </h2>

              <v-chip class="my-1" append-icon="$vuetify">
                {{ emitedClickedValueReacive.coords.latitude }}
              </v-chip>
              <v-chip append-icon="$vuetify">
                {{ emitedClickedValueReacive.coords.longitude }}
              </v-chip>

              <strong>Become a sponsor</strong>
              <p class="mt-8">
                Vuetify is free to use software under the <a href="https://opensource.org/licenses/MIT" target="_blank"
                  rel="noopener noreferrer">MIT</a> License and requires an extensive amount of time
                to maintain. Supporting development ensures Vuetify will be actively maintained.
              </p>
              <ul class="mt-5">
                <li v-for="(value, key, index) in computeClickedTargetPosition[0]">
                  <span v-if="index == 0">
                    City {{ key }}
                  </span>
                  <span v-else>
                    {{ key }}
                  </span>
                  : {{ value }}
                </li>
              </ul>

            </v-responsive>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <v-sheet class="py-16">
      <section>
        <v-container>
          <v-row justify="space-around">
            <v-col cols="auto">
              <v-responsive width="350">
                <v-form @submit.prevent>
                  <v-container>
                    <h4 class="text-h5 pb-5">
                      Show food from specific country
                    </h4>
                    <v-row>
                      <v-col cols="12" md="12">
                        <v-combobox label="Select country" :items="foodDataStore.reactiveCountryOrgins">
                        </v-combobox>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-btn type="submit" @click="fetchFoodData(dataFindSelected)" block>Search</v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-responsive>
            </v-col>
            <v-col cols="auto">
              <v-responsive width="350">
                <h2 class="text-h4">
                  Total selected foods: {{ foodDataStore.getFoodDataByCuisine.length }}
                </h2>
                <p class="text-success my-3">
                  Foods from : country name
                </p>

                <li v-for="(item, index) in foodDataStore.getFoodDataByCuisine ">
                  {{ index }}{{ item }}
                </li>

                <p class="mt-8">
                  Assign default values for all components in the library, including nested support.
                </p>

                <v-btn class="mt-6" href="https://next.vuetifyjs.com/features/global-configuration/" target="_blank"
                  rel="noopener noreferrer">
                  More Information
                </v-btn>
              </v-responsive>
            </v-col>

          </v-row>
        </v-container>
      </section>
    </v-sheet>
    <section>
      <v-container>
        <v-row>
          <v-col>
            <v-responsive>
              <!-- {{locationUser.value ? disabled : '' }} -->
              <div class="countriesTop">
                <v-btn-alt class="my-6" :disabled="locationUser ? false : true"  @click="fetchCountries()" rel="">
                  Show all countries 
                </v-btn-alt>
                <a href=""  @click.prevent="scrollPageTo(400)" v-if="!locationUser" class="text-warning my-3 ">Confirm user location</a>
                <p v-else class="text-success my-3">
                  Total countries: <strong>{{ computeGetCountries ? computeGetCountries.length : 0 }} </strong>
                </p>
              </div>
              <!-- <div>{{ computeGetCountries.data.countries }}</div> -->
              <ul class="countries">

                <li v-for="(item, index) in computeGetCountries">
                  <a href="#html" @click="fetchCountriePosition(item.name)">
                    {{ item.name }}
                    <span class="flag">{{ item.emoji }}</span>
                  </a>
                </li>
              </ul>
            </v-responsive>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <v-sheet class="py-16">
      <section>
        <v-container>
          <v-row justify="space-between">
            <v-col cols="auto">
              <v-responsive width="350">
                <v-form @submit.prevent>
                  <v-container>
                    <h4 class="text-h5 pb-5">
                      Select food based on nationality
                    </h4>
                    <v-row>
                      <v-col cols="12" md="12">
                        <v-autocomplete clearable label="Land of origin" :items="foodDataStore.reactiveCurrentCuisines"
                          v-model="dataFindSelected.currentLandOrigin"></v-autocomplete>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-btn type="submit" @click="fetchFoodData(dataFindSelected)" block>Search</v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-responsive>
            </v-col>
            <v-col cols="auto">
              <v-responsive width="350">
                <h2 class="text-h4">
                  Total selected cuisines: {{ foodDataStore.getFoodDataByCuisine.length }}
                </h2>
                <p class="text-success mt-3">
                  Global Defaults
                </p>

                <strong class="mt-3">
                  Version 3 Only
                </strong>

                <li v-for="(item, index) in foodDataStore.getFoodDataByCuisine ">
                  {{ index }}{{ item }}
                </li>

                <p class="mt-8">
                  Assign default values for all components in the library, including nested support.
                </p>

                <v-btn class="mt-6" href="https://next.vuetifyjs.com/features/global-configuration/" target="_blank"
                  rel="noopener noreferrer">
                  More Information
                </v-btn>
              </v-responsive>
            </v-col>

          </v-row>
        </v-container>
      </section>
    </v-sheet>
    <v-main class="pt-0">
      <v-form @submit.prevent>
        <v-container>
          <h4 class="text-h5 pb-5">
            Insert new world foodIngredient
          </h4>
          <v-row>
            <v-col cols="12" md="3">
              <v-text-field label="Food ingredient name" clearable required></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-autocomplete clearable label="Food category"
                :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"></v-autocomplete>
            </v-col>
            <v-col cols="12" md="3">
              <v-autocomplete clearable label="Land of origin"
                :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"></v-autocomplete>
            </v-col>
            <v-col cols="12" md="3">
              <v-btn type="submit" block>Submit</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <section id="hero">
        <v-sheet class="d-flex align-center py-16" color="grey-darken-3">
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
                  <h3 class="text-h3 mt-4">
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

        <v-pagination v-model="pages" :length="15" :total-visible="7" rounded="0" />
      </section>
      <v-sheet class="py-16">
        <section>
          <v-container>
            <v-row justify="space-between">
              <v-col cols="auto">
                <v-responsive width="350">
                  <h2 class="text-h4">
                    New customization system {{ pages }}
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
html {
  scroll-behavior: smooth;
}

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

.countriesTop {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.countries {
  display: flex;
  flex-wrap: wrap;
  align-content: space-around;
  justify-content: space-between;

  li {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: solid 1px #212121;

    a {
      display: flex;
      background-color: transparent;
      text-decoration: none;
      flex-wrap: wrap;
      align-items: center;
      color: #333;
    }
  }
}

.flag {
  font-size: 2rem;
  padding: 0.5rem;
}
</style>
