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
const { reactiveCountries , allCountryNames} = storeToRefs(useFoodDataStore());
const foodDataStore = useFoodDataStore();

const dataFindSelected = reactive({
  currentIngredientName: "",
  currentLandOrigin: 'thai',
  targetCountry: null,
  currentLandLocation: null
})

const initPosData = reactive({
  coords: {
    latitude: 52.37031805385792,
    longitude: 4.890289306640626
  }
})

const emitedClickedValueReacive = reactive({
  coords: {
    latitude: initPosData.coords.latitude,
    longitude: initPosData.coords.longitude
  }
})

//One-Way Data Flow - converted the prop to ref for reactive value 
//from other child comp to the prop app.vue 
const emitedValuePropRef = ref()
const mapCompRef = ref()
const locationUser = ref(false)
const showAllCountries = ref(false)
const pages = ref(1)
const searchedCountry = ref()
const showloader = ref(false)


//METHODS
//One-Way Data Flow - emited to prop
function emitPositionValue(argument) {
  locationUser.value = true;
  emitedValuePropRef.value = argument
  fetchPostionGeoData(emitedValuePropRef.value)
}

//One-Way Data Flow - emited to prop
function emitClickedPositionValue(argument) {
  emitedClickedValueReacive.coords.latitude = argument.lat;
  emitedClickedValueReacive.coords.longitude = argument.lng;
  foodDataStore.fetchFoodOriginClickPos(emitedClickedValueReacive)
  foodDataStore.fetchDataClickPos(emitedClickedValueReacive)
}

function fetchFoodData(arg) {
  foodDataStore.fetchcuisine(arg)
}

function fetchCountries() {
  foodDataStore.fetchDataCountries();
}

function fetchCountriePosition(arg) {
  foodDataStore.fetchPositionCountries(arg);
}

function fetchPostionGeoData(arg) {
  foodDataStore.fetchFoodOriginPosition(arg)
}
function searchCountryFood(arg){
  showloader.value = true;
  const searchedLandCode = foodDataStore.getAllCoutriesApi.filter((item, index) => {
  if(item.name === arg){
    //not needed in api 
    //some others do need it
    foodDataStore.fetchSearchCountryFood(item.name);
  };
}); 
// for (let key in searchedLandCode) {
//         if (searchedLandCode.hasOwnProperty(key)) {
//             const value = searchedLandCode[key];
//             console.log(value.code);
//         }
//     }
}

function scrollPageTo(arg)
{
    window.scrollTo({
    top: arg,
    behavior: "smooth",
  });
}

function toggleCountries(){
  showAllCountries.value = !showAllCountries.value
}

//COMPUTED
const computeClickedTargetPosition = computed(function () {
  if (emitedClickedValueReacive) {
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
  for (let key in mapCompRef.value) {
    return mapCompRef.value.isClusterActive
  }
})

const computeGetCountries = computed(function () {
  //get cathegorie specific position data
 // if (reactiveCountries.length) {
  //array
  return foodDataStore.getAllCoutriesApi;
 // }
})

const computeCountryFood = computed(function () {
  showloader.value = false;
  return foodDataStore.getSearchedCountryFood;
})

const computeCountryNames = computed(function () {
  return allCountryNames.value.flat()
})



onMounted(() => {
  fetchPostionGeoData(initPosData)
  fetchCountries()
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
            <v-responsive class="overflow-visible" width="450">
              <h2 class="text-h4">
                All agriculture in the netherlands
              </h2>
              <p class="mt-5">
                <span class="text-blue-darken-1">{{ computeIsCluster ? "Show all farmers" : "Don't show all farmers" }}</span>
              </p>
              <p>
               All agriculture comppanies in the netherlands that are producing. Agriculture is economy of the country. The country's economy depends on agriculture. 
              </p>
              <v-switch @click="mapCompRef.setClusters()" color="info" inset
                :label="`Toggle all farmers on the map ${computeIsCluster}`" false-value="no"
                true-value="yes"></v-switch>
            </v-responsive>
          </v-col>
          <v-col cols="auto">
            <v-responsive class="overflow-visible" width="450">
              <h2 class="text-h4">
                Pointed geo data
              </h2>
              <p class="mt-5">
                Click on the map to discover where the nearest agriculture food farms are located. 
              </p>
              <p class="mt-5 text-blue-darken-1">
                Current position
              </p>
              <v-chip class="mt-2 mr-2" append-icon="$vuetify">
               Lat: {{ emitedClickedValueReacive.coords.latitude }}
              </v-chip>
              <v-chip class="mt-2 mr-2" append-icon="$vuetify">
               Lon: {{ emitedClickedValueReacive.coords.longitude }}
              </v-chip>

              
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
              <v-responsive width="450">
                <v-form @submit.prevent>
                  <v-container>
                    <h4 class="text-h5 pb-5">
                    Search food from specific country 
                    </h4>
                    <p class="my-3 text-blue-darken-1">
                      Foods from {{ computeGetCountries ? computeGetCountries.length : 0 }} different countries
                    </p>
                    <v-row>
                      <v-col cols="12" md="12">
                        <v-autocomplete
                          clearable
                          label="Search country"
                          :items="computeCountryNames"
                          v-model="searchedCountry"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-btn type="submit" @click="searchCountryFood(searchedCountry)" block>Search</v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-responsive>
            </v-col>
            <v-col cols="auto">
              <v-responsive width="450">
                <h2 class="text-h4">
                Total found foods:  <span class="my-3 text-blue-darken-1">{{ computeCountryFood.length }}</span> 
                </h2>
                <ul>
                  <li class="mt-3"  v-if="!computeCountryFood.length == 0" v-for="(item, index) in foodDataStore.getSearchedCountryFood ">
                  {{ item.title }}
                  </li>
                  <li class="my-3 text-blue-darken-1" v-else>
                    <span v-if="showloader">Loading..</span>
                    <span v-else-if="!showloader">{{ searchedCountry ? `no food found in ${searchedCountry}` : "no selection" }}</span>
                  </li>
                </ul>
                <p class="mt-5">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nu
                </p>
                <v-btn class="mt-6"
                  href="#html" :disabled="locationUser ? false : true" @click="fetchCountriePosition(searchedCountry)">
                  {{locationUser ? "Show on map" : "confirm location to show on map"}}
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
                <v-btn-alt class="my-6" :disabled="locationUser ? false : true"  @click="toggleCountries()" rel="">
                  {{ !showAllCountries ? 'Show all countries' : 'Hide countries'  }}
                </v-btn-alt>
                <a href=""  @click.prevent="scrollPageTo(400)" v-if="!locationUser" class="text-warning my-3 ">Confirm user location</a>
                <p v-else class="text-success my-3">
                  Total countries: <strong>{{ computeGetCountries ? computeGetCountries.length : 0 }} </strong>
                </p>
              </div>
              <ul class="countries" v-show="showAllCountries">
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
          <v-row justify="space-around">
            <v-col cols="auto"> 
              <v-responsive width="450">
                <v-form @submit.prevent>
                  <v-container>
                    <h4 class="text-h5 pb-5">
                      Select food based on nationality
                    </h4>
                    <v-row>
                      <v-col cols="12" md="12">
                        <v-autocomplete @blur="fetchFoodData(dataFindSelected)" clearable label="Land of origin" :items="foodDataStore.reactiveCurrentCuisines"
                          v-model="dataFindSelected.currentLandOrigin"></v-autocomplete>
                      </v-col>
                      <!-- <v-col cols="12" md="12">
                        <v-btn type="submit" @click="fetchFoodData(dataFindSelected)" block>Search</v-btn>
                      </v-col> -->
                    </v-row>
                  </v-container>
                </v-form>
              </v-responsive>
            </v-col>
            <v-col cols="auto">
              <v-responsive width="450">
                <h2 class="text-h4">
                  Total selected {{dataFindSelected.currentLandOrigin}} cuisines: <span class="text-blue-darken-1">{{ foodDataStore.getFoodDataByCuisine.length }}</span>
                </h2>
                <ul class="my-6">
                  <li v-for="(item, index) in foodDataStore.getFoodDataByCuisine ">
                    {{ item }}
                  </li>
                </ul>
                <p class="mt-5">
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

                  <p class="mt-5">
                    Vuetify 3 has an unprecedented level of customization options that make implementing any design
                    system easy.
                  </p>

                  <p class="mt-5">
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

                  <p class="mt-5">
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
ul{
  li{
    list-style-type: none;
  }
}
</style>
