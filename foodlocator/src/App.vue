<script setup lang="ts">
import { ref, reactive, computed,watch, onMounted, ComputedRef } from 'vue';
import { useFoodDataStore } from './stores/DataFoodStore';
import { storeToRefs } from "pinia";


import MapComp from './components/MapComp.vue'
import BannerComp from './components/BannerComp.vue'


//TS interfaces
import type { ReactiveCordsIntFace, SearchedCountryType, ObjectResults } from './types';

const foodDataStore = useFoodDataStore();

//destructure parts of the store
const { staticStoreGeoPos} = storeToRefs(useFoodDataStore());

const dataFindSelected = reactive({
  currentIngredientName: "",
  currentLandOrigin: null ,
  targetCountry: null,  
  currentLandLocation: null
})

const reactiveCords:ReactiveCordsIntFace = reactive({
  coords: {
    latitude: staticStoreGeoPos.value.coords.latitude,
    longitude: staticStoreGeoPos.value.coords.longitude
  }
})

//One-Way Data Flow - converted the prop to ref for reactive value 
//from other child comp to the prop app.vue 
const emitedValuePropRef = ref<ReactiveCordsIntFace>()
const mapCompRef = ref()
const currentBannerPositon = ref()
const locationUser = ref(false)
const showAllCountries = ref(false)
const pages = ref(1)
const searchedCountry = ref<SearchedCountryType>(null)
const showloader = ref(false)
const pointed = ref(false)
//Vite Env Variables are type:string - convert it to boolean
//const envLocal = ref(import.meta.env.VITE_env_local)


//METHODS
//One-Way Data Flow - emited to prop
function emitPositionValue(argument:ReactiveCordsIntFace) {
  console.log("fetch?",argument)
  locationUser.value = true;
  emitedValuePropRef.value = argument
  reactiveCords.coords.latitude = argument.coords.latitude;
  reactiveCords.coords.longitude = argument.coords.longitude;
  fetchPostionGeoData(emitedValuePropRef.value)
}

function emitCurrentPosition(argument:string) {
  // console.log("emit?",argument)
  currentBannerPositon.value = argument
}

//One-Way Data Flow - emited to prop
function emitClickedPositionValue(argument:ReactiveCordsIntFace) {
  //console.log(argument)
  reactiveCords.coords.latitude = argument.coords.latitude;
  reactiveCords.coords.longitude = argument.coords.longitude;
  foodDataStore.fetchFoodOriginClickPos(reactiveCords)
  foodDataStore.fetchDataClickPos(reactiveCords)
  pointed.value = true;
}

function fetchFoodData(arg:SearchedCountryType) {
 foodDataStore.fetchcuisine(arg)
}

function fetchCountries() {
  console.log("fetchCountries")
  foodDataStore.fetchDataCountries();
}

function fetchCountriePosition(arg:SearchedCountryType) {
console.log(arg)
  foodDataStore.fetchPositionCountries(arg);
}

function fetchPostionGeoData(arg:ReactiveCordsIntFace) {
  console.log("fetchPostionGeoData")
  foodDataStore.fetchFoodOriginPosition(arg)
}
function searchCountryFood(arg:SearchedCountryType){
  showloader.value = true;
  if(foodDataStore.getAllCountriesNames)
  foodDataStore.getAllCountriesNames.filter((item:string) => {
    console.log(typeof item)
  if(item=== arg){
    foodDataStore.fetchSearchCountryFood(item);
  };
}); 
}

function scrollPageTo(arg:number)
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
const computeGeoPosition :ComputedRef<ReactiveCordsIntFace>  = computed(function () {
  console.log('computeGeoPosition', staticStoreGeoPos.value)
  return staticStoreGeoPos.value
})

const computeClickedTargetPosition = computed(function () {
  ///get the lenght of an object. by counting keys 
  // console.log(Object.keys(foodDataStore.getFoodPositionDataByClick).length)
  return reactiveCords?foodDataStore.getFoodPositionDataByClick:{}
})

const computeClickedTargetCatPosition:ComputedRef<ObjectResults> = computed(function () {
 return foodDataStore.getFoodPositionCatDataByClick
})

const computeCoordsBanner = computed(function () {
 return emitedValuePropRef.value ? [emitedValuePropRef.value.coords.latitude,emitedValuePropRef.value.coords.longitude]: [staticStoreGeoPos.value.coords.latitude,staticStoreGeoPos.value.coords.longitude]  
})

const computeIsCluster = computed(function () {
  //toggle the cluster boolean from defineExpose outside MapComp 
   return mapCompRef.value ? mapCompRef.value.isClusterActive : "no computeIsCluster"
})

const computeGetCountries = computed(function () {
  //get cathegorie specific position data
      return foodDataStore.getAllCountriesApi?.countries;
})

const computeCountryFood = computed(function () {
  showloader.value = false;
  return foodDataStore.getSearchedCountryFood
})

const computeCountryNames = computed(function () {
      let array:string[]=[];
      if(foodDataStore.getAllCountriesNames != null){
      foodDataStore.getAllCountriesNames.forEach(
        element => {
          array.push(element)        
              });
          return array
        }
})
const computeCountryData = computed(function () {
  if(foodDataStore.getAllCountriesApi != null){
    let allvalues = Object.values(foodDataStore.getAllCountriesApi);
    let array:object[]=[];
    let countrieName;
    let countrieFlag;
    allvalues.flat().forEach(
    element => {
              countrieName = Object.values(element)[2]
              countrieFlag = Object.values(element)[0]
              array.push([countrieFlag,countrieName])        
          });
          return array
  }
})
const computeCuisineMenuTitles = computed(function () {
  let array:object[]=[];
  let countrieName;
  array.length = 0;
  foodDataStore.getFoodDataByCuisine.forEach(
    element => {
      countrieName = Object.values(element)[1]
     // console.log(countrieName)
              array.push(countrieName)        
          });
  return array
})

const computeCountryPositionData = computed(function () {
  let array:number[]=[];
  array.length = 0;
  foodDataStore.getCountryPositionData.results.forEach(
    element => {
             array.push(element.position.lat, element.position.lon)        
          });
     reactiveCords.coords.latitude = array[0];
     reactiveCords.coords.longitude = array[1];
    return array
})

//WATCH
watch(computeCoordsBanner, () => {
  console.log('computeCoordsBanner')
})

watch(computeCountryPositionData, () => {
  console.log('computeCountryPositionData')
})

onMounted(() => {
  fetchCountries()
  fetchPostionGeoData(staticStoreGeoPos.value)
  // console.log("envLocal: ", envLocal.value)
  // console.log("env message: ", import.meta.env.VITE_env_message)
  // console.log("envProd:", import.meta.env.PROD)
})
</script>

<template>
  <section class="mt-15">
    <!-- <hr>
    ---------------App.vue COMPONENT
    <hr> -->
    <!-- //One-Way Data Flow - drilled prop 'emitedValuePropRef' value in <MapComp  -->
     <!-- Emited coords to fetch Cityname from confirmed position banner: {{ computeCoordsBanner }}<br> -->
      <!--  :init-map-value="{{computeGeoPosition}}"<br> -->
      <!-- reactiveCords-latitude: {{reactiveCords.coords.latitude}}<br>
      reactiveCords-longitude: {{reactiveCords.coords.longitude}}<br> 
      <hr> -->
       
      <!-- :reactive-cords-prop="{{ reactiveCords }}"<br>
      
      :init-pos-data-prop="{{foodDataStore.getFoodPositionDataByBanner}}"<br>
      :init-coords-prop="{{computeCoordsPosition}}"<br>
      :country-pos-data-prop="{{foodDataStore.getCountryPositionData}}"<br> -->
       
      <!--:clicked-radius-data-prop="{{computeClickedTargetCatPosition}}"<br>
      :clicked-position-data-prop="{{computeClickedTargetPosition}}"<br> -->
      <!-- <br>
      <hr>
      computeCoordsBanner: {{computeCoordsBanner}}<br>
      computeCountryPositionData: {{ computeCountryPositionData }} -->
      <MapComp
       :reactive-cords-prop="reactiveCords"
       :init-map-value="computeGeoPosition"
       :init-pos-data-prop="foodDataStore.getFoodPositionDataByBanner"
       :init-coords-prop="computeCoordsBanner"
       :country-pos-data-prop="foodDataStore.getCountryPositionData"
       :clicked-radius-data-prop="computeClickedTargetCatPosition"
       :clicked-position-data-prop="computeClickedTargetPosition"
       @emit-clicked-position-value="emitClickedPositionValue"
      ref="mapCompRef" />
    <BannerComp 
    @emit-position-value="emitPositionValue" 
    @emit-current-position="emitCurrentPosition"
    :initPosDataProp="computeGeoPosition"
    :reactive-cords-prop="reactiveCords"
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
                Point location to locate nearby agriculture farms
              </h2>
              <p class="mt-5">
                Click on the map to discover where the nearest agriculture food farms are located. 
              </p>
                <p class="mt-5 text-blue-darken-1">
                  Current <span v-if="pointed"> pointed </span> position
                </p>
        
                <v-chip class="mt-2 mr-2" border append-icon="mdi-map-marker">
                 Lat: {{ reactiveCords.coords.latitude }}
                </v-chip>
                <v-chip class="mt-2 mr-2" border append-icon="mdi-map-marker">
                 Lon: {{ reactiveCords.coords.longitude }}
                </v-chip>
                <ul class="mt-5">
                  <li v-for="(value, key) in Object.values(computeClickedTargetPosition)[0]">
                    <span v-if="pointed">
                      {{ key }}
                     </span>
                    {{ value }}
                  </li>
                </ul>
                <ul class="mt-5">
                  <li>
                     Huidige locatie: 
                    <span class="text-blue-darken-1">
                    {{currentBannerPositon}}
                    </span>
                  </li>
                </ul>
                
            
              <!-- <div v-else>
                <p class="mt-5 text-blue-darken-1">
                  Current default position
                </p>
                <v-chip class="mt-2 mr-2" append-icon="$vuetify">
                  Lat: {{ reactiveCords.coords.latitude }}
                 </v-chip>
                 <v-chip class="mt-2 mr-2" append-icon="$vuetify">
                  Lon: {{ reactiveCords.coords.longitude }}
                 </v-chip>
              </div> -->
              

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
                  <li class="mt-3"  v-if="computeCountryFood.length > 0" v-for="(item) in computeCountryFood">
                  {{  Object.values(item)[0]}}
                  </li>
                  <li class="my-3 text-blue-darken-1" v-else>
                    <span v-if="showloader">Loading..</span>
                    <span v-else-if="!showloader">{{ computeCountryFood.length < 1 ? `no food found` : "no selection" }}</span>
                  </li>
                </ul>
                <p class="mt-5">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nu
                </p>
                <!-- <v-btn class="mt-6"
                  href="#html" :disabled="locationUser ? false : true" @click="fetchCountriePosition(searchedCountry)">
                  {{locationUser ? "Show on map" : "confirm location to show on map"}}
                </v-btn> -->
                <v-btn class="mt-6"
                href="#html" @click="fetchCountriePosition(searchedCountry)">
              {{ "show on map" }}
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
                <!-- <v-btn-alt class="my-6" :disabled="locationUser ? false : true"  @click="toggleCountries()" rel="">
                  {{ !showAllCountries ? 'Show all countries' : 'Hide countries'  }}
                </v-btn-alt> -->
                <v-btn-alt class="my-6" @click="toggleCountries()" rel="">
                  Show all countries
                </v-btn-alt>
                <a href=""  @click.prevent="scrollPageTo(400)" v-if="!locationUser" class="text-warning my-3 ">Confirm user location</a>
                <p v-else class="text-success my-3">
                  Total countries: <strong>{{ computeGetCountries ? computeGetCountries.length : 0 }} </strong>
                </p>
              </div>
              <ul class="countries" v-show="showAllCountries">
                <li v-for="(item) in computeCountryData">
                  <a href="#html" @click="fetchCountriePosition(Object.values(item)[1])">
                    <!-- Object.values(item) convert object to array -->
                    {{Object.values(item)[1]}}
                    <span class="flag">{{Object.values(item)[0] }}</span>
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
                        <v-autocomplete clearable label="Land of origin" :items="foodDataStore.reactiveCurrentCuisines"
                          v-model="dataFindSelected.currentLandOrigin"></v-autocomplete>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="12">
                        <v-btn @click="fetchFoodData(dataFindSelected.currentLandOrigin)" block>Search</v-btn>
                      </v-col>
                  </v-row>
                  </v-container>
                </v-form>
              </v-responsive>
            </v-col>
            <v-col cols="auto">
              <v-responsive width="450">
                <h2 class="text-h4">
                  Found  <span class="text-blue-darken-1">
                    {{ computeCuisineMenuTitles.length > 1 ? computeCuisineMenuTitles.length : 0 }}</span>
                    {{dataFindSelected.currentLandOrigin}} menu's
                </h2>
                <ul class="my-6">
                  <li v-for="(value) in computeCuisineMenuTitles">
                    {{ value }}
                   
                    value
                  </li>
                </ul>
                <p class="mt-5">
                  Assign default values for all components in the library, including nested support.
                </p>
                <v-btn class="mt-6"
                href="#html" @click="fetchCountriePosition(dataFindSelected.currentLandOrigin)">
              {{ "show on map" }}
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
