<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, ComputedRef, watchEffect } from 'vue';
import { useFoodDataStore } from './stores/DataFoodStore';
import { storeToRefs } from "pinia";

import { onValue } from 'firebase/database';
import { writeUserData, dbRef} from "./firebase";

//Importing components
import MapComp from './components/MapComp.vue'
import BannerComp from './components/BannerComp.vue'

//TS interfaces
import type { ReactiveCordsIntFace, SearchedCountryType, ObjectResults, ObjectUserPosts } from './types';

const foodDataStore = useFoodDataStore();

//destructure parts of the store
const { staticStoreGeoPos } = storeToRefs(useFoodDataStore());

const dataFindSelected = reactive({
  currentIngredientName: "",
  currentLandOrigin: null,
  targetCountry: null,
  currentLandLocation: null
})

const reactiveCords: ReactiveCordsIntFace = reactive({
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
const showloader = ref(false)
const pointed = ref(false)
const foodName = ref()
const inputLat = ref()
const inputLng = ref()

const locationName = ref()
const countryName = ref()
const reactiveRef = ref()
const distanceRef = ref()

const huisnummerRef = ref()
const zipcodeRef = ref()

const amountMaxRef:number[] = ref([0,1,2,3])



//Vuetify
interface PropsCatInterface {
  aardappel:boolean,
  groente:boolean,
  fruit:boolean,
  maaltijden:boolean,
  pizza:boolean,
  vlees:boolean,
  vis:boolean,
  zuivel:boolean,
  beleg:boolean,
  snoep:boolean
}

let reactiveCategories:PropsCatInterface = reactive({
      aardappel:false,
      groente:false,
      fruit:false,
      maaltijden:false,
      pizza:false,
      vlees:false,
      vis:false,
      zuivel:false,
      beleg:false,
      snoep:false
})

//max total items per categorie
let reactiveAmountItems = reactive({
      totalFooditems1:0,
      totalFooditems2:0,
      totalFooditems3:0,
      totalFooditems4:0,
})

//max total items per user 
let reactiveSelectedItems = reactive({
      totalSelectedItem1:[],
      totalSelectedItem2:[],
      totalSelectedItem3:[],
      totalSelectedItem4:[],
})

//Vite Env Variables are type:string - convert it to boolean
//const envLocal = ref(import.meta.env.VITE_env_local)

//METHODS
//One-Way Data Flow - emited to prop
function emitPositionValue(argument: ReactiveCordsIntFace) {
  console.log("fetch?", argument)
  locationUser.value = true;
  emitedValuePropRef.value = argument
  reactiveCords.coords.latitude = argument.coords.latitude;
  reactiveCords.coords.longitude = argument.coords.longitude;
  fetchPostionGeoData(emitedValuePropRef.value)
}

function checkZipRule(){
 console.log("check?")
}

function emitCurrentPosition(argument: string) {
  // console.log("emit?",argument)
  currentBannerPositon.value = argument
}

//One-Way Data Flow - emited to prop
function emitClickedPositionValue(argument: ReactiveCordsIntFace) {
  //console.log(argument)
  reactiveCords.coords.latitude = argument.coords.latitude;
  reactiveCords.coords.longitude = argument.coords.longitude;
  foodDataStore.fetchFoodOriginClickPos(reactiveCords)
  foodDataStore.fetchDataClickPos(reactiveCords)
  pointed.value = true;
}

function fetchFoodData(arg: SearchedCountryType) {
  foodDataStore.fetchcuisine(arg)
}

function fetchCountries() {
  console.log("fetchCountries")
  foodDataStore.fetchDataCountries();
}

function fetchCountriePosition(arg: SearchedCountryType) {
  console.log(arg)
  foodDataStore.fetchPositionCountries(arg);
}

function fetchPostionGeoData(arg: ReactiveCordsIntFace) {
  console.log("fetchPostionGeoData")
  foodDataStore.fetchFoodOriginPosition(arg)
}
function searchCountryFood(arg: SearchedCountryType) {
  showloader.value = true;
  if (foodDataStore.getAllCountriesNames)
    foodDataStore.getAllCountriesNames.filter((item: string) => {
      console.log(typeof item)
      if (item === arg) {
        foodDataStore.fetchSearchCountryFood(item);
      };
    });
}

function scrollPageTo(arg: number) {
  window.scrollTo({
    top: arg,
    behavior: "smooth",
  });
}

function toggleCountries() {
  showAllCountries.value = !showAllCountries.value
}

function checkZip() {
  console.log("checkZip")
  foodDataStore.fetchPostcode( zipcodeRef.value , huisnummerRef.value )
}

function sendToFirbase(){
  if( !foodName.value || !locationName.value || !countryName.value ){
    console.log("do nothing");
  }else{
    //computeCountryPositionData
    console.log(typeof(computeCountryPositionData.value[0]))
    inputLat.value = computeCountryPositionData.value[0]
    inputLng.value = computeCountryPositionData.value[1]
    writeUserData(foodName.value, locationName.value, countryName.value, inputLat.value , inputLng.value  )
    
    //set true to remove markers
    resetMapOnSubmitUserData()
  }
}

//computeAdressCheck
function sendAddressToFirbase(){
  if( !computeAdressCheck){
    console.log("do nothing");
  }else{
    //computeCountryPositionData
    // inputLat.value = computeAdressCheck.geo.lat
    // inputLng.value = computeAdressCheck.geo.lon
    //console.log("sendAddressToFirbase:",computeAdressCheck.value.geo.lat)
    console.log(computeAdressCheck.value.geo.lat, typeof(computeAdressCheck.value.geo.lat))
    writeUserData(computeAdressCheck.value.street, computeAdressCheck.value.number, computeAdressCheck.value.city, computeAdressCheck.value.geo.lat , computeAdressCheck.value.geo.lon)
    resetMapOnSubmitUserData()
    
  }
}

function resetMapOnSubmitUserData(){
  //set true to remove markers
  if(mapCompRef.value.isClusterActive){
      let element = document.querySelector('.v-selection-control__input input') as HTMLElement;
      element.click();
      mapCompRef.value.isClusterActive = true
      mapCompRef.value.setClusters()
    }
}

onValue(dbRef, (snapshot) => {
  const data = snapshot.val();
  reactiveRef.value = snapshot.val()
});

//COMPUTED
const computeReadUserData: ComputedRef<ObjectUserPosts> = computed(function () {
  console.log('reactiveRef.value', reactiveRef.value)
  return reactiveRef.value ? reactiveRef.value.posts : 'no values'
  //random(4)
 
})

const computeGeoPosition: ComputedRef<ReactiveCordsIntFace> = computed(function () {
  console.log('computeGeoPosition', staticStoreGeoPos.value)
  return staticStoreGeoPos.value
})

const computeClickedTargetPosition = computed(function () {
  ///get the lenght of an object. by counting keys 
  // console.log(Object.keys(foodDataStore.getFoodPositionDataByClick).length)
  return reactiveCords ? foodDataStore.getFoodPositionDataByClick : {}
})

const computeClickedTargetCatPosition: ComputedRef<ObjectResults> = computed(function () {
  return foodDataStore.getFoodPositionCatDataByClick
})

const computeCoordsBanner = computed(function () {
  return emitedValuePropRef.value ? [emitedValuePropRef.value.coords.latitude, emitedValuePropRef.value.coords.longitude] : [staticStoreGeoPos.value.coords.latitude, staticStoreGeoPos.value.coords.longitude]
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
  let array: string[] = [];
  if (foodDataStore.getAllCountriesNames != null) {
    foodDataStore.getAllCountriesNames.forEach(
      element => {
        array.push(element)
      });
    return array
  }
})
const computeCountryData = computed(function () {
  if (foodDataStore.getAllCountriesApi != null) {
    let allvalues = Object.values(foodDataStore.getAllCountriesApi);
    let array: object[] = [];
    let countrieName;
    let countrieFlag;
    allvalues.flat().forEach(
      element => {
        countrieName = Object.values(element)[2]
        countrieFlag = Object.values(element)[0]
        array.push([countrieFlag, countrieName])
      });
    return array
  }
})
const computeCuisineMenuTitles = computed(function () {
  let array: object[] = [];
  let countrieName;
  array.length = 0;
  foodDataStore.getFoodDataByCuisine.forEach(
    element => {
      countrieName = Object.values(element)[1]
      array.push(countrieName)
    });
  return array
})

const computeCountryPositionData = computed(function () {
  let array: number[] = [];
  array.length = 0;
  foodDataStore.getCountryPositionData.results.forEach(
    element => {
      array.push(element.position.lat, element.position.lon)
    });
  reactiveCords.coords.latitude = array[0];
  reactiveCords.coords.longitude = array[1];
  return array
})


const computeLocationName = computed(function () {
   countryName.value? foodDataStore.fetchPositionCountries(countryName.value):'nothing'
   return countryName.value
})

const computeAdressCheck = computed(function () {
  return foodDataStore.getAllZipApi.length==0?"no data input":foodDataStore.getAllZipApi
})



/// Compute total selected items per user (max 4 categories - 4 items each)
//computeCat1Selected,computeCat2SelectedcomputeCat3Selected,computeCat4Selected
const computeCat1Selected = computed(function () {
  if(reactiveSelectedItems.totalSelectedItem1[0]!=null){
    reactiveSelectedItems.totalSelectedItem1.length = reactiveAmountItems.totalFooditems1
  } 
  return reactiveSelectedItems.totalSelectedItem1[0]!=null ? reactiveSelectedItems.totalSelectedItem1 : "nothing selected"
})

const computeCat2Selected = computed(function () {
  if(reactiveSelectedItems.totalSelectedItem2[0]!=null){
    reactiveSelectedItems.totalSelectedItem2.length = reactiveAmountItems.totalFooditems2
  } 
  return reactiveSelectedItems.totalSelectedItem2[0]!=null ? reactiveSelectedItems.totalSelectedItem2 : "nothing selected"
})




//WATCH
watch(computeCoordsBanner, () => {
  // console.log('computeCoordsBanner')
})

watch(computeCountryPositionData, () => {
  // console.log('computeCountryPositionData')
})

watch(computeLocationName, () => {
  // console.log('computeLocationName')
})







onMounted(() => {

  //fetchCountries()
  //fetchPostionGeoData(staticStoreGeoPos.value)
  //readFromFirebase()
  // console.log("envLocal: ", envLocal.value)
  // console.log("env message: ", import.meta.env.VITE_env_message)
  // console.log("envProd:", import.meta.env.PROD)
})
</script>

<template>
  <section class="mt-15">
    <MapComp 
      :reactive-cords-prop="reactiveCords"
      :init-map-value="computeGeoPosition"
      :init-pos-data-prop="foodDataStore.getFoodPositionDataByBanner" 
      :init-coords-prop="computeCoordsBanner"
      :country-pos-data-prop="foodDataStore.getCountryPositionData"
      :clicked-radius-data-prop="computeClickedTargetCatPosition"
      :clicked-position-data-prop="computeClickedTargetPosition"
      :user-added-data-prop="computeReadUserData" 
      @emit-clicked-position-value="emitClickedPositionValue"
      ref="mapCompRef" />
    <BannerComp @emit-position-value="emitPositionValue" @emit-current-position="emitCurrentPosition"
      :initPosDataProp="computeGeoPosition" :reactive-cords-prop="reactiveCords" class="mb-5" />
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
    <section id="grid" class="">
      <v-container>
        <v-row justify="space-around">
          <v-col cols="auto">
            
            <v-form @submit.prevent class="py-10">
              <v-container>
                <h4 class="text-h5 pb-5">
                  Insert new adress | fooddrop
                </h4>
                <!-- checkZipRule() -->
                <v-row>
                  <v-col cols="3" md="3">
                    <v-text-field 
                    
                    label="Postcode"
                    v-model="zipcodeRef"
                    clearable
                    >
                  </v-text-field>
                  </v-col>
                  <v-col cols="3" md="3">
                    <v-text-field 
                    label="Adress nummer"
                     v-model="huisnummerRef" 
                     clearable>
                    </v-text-field>
                  </v-col>
                  <v-col cols="3" md="3">
                    <v-btn type="submit" @click="checkZip" block>Check adress</v-btn>
                  </v-col>
                </v-row>
                <v-row v-if="computeAdressCheck.street">
                  <v-col cols="4">
                    <ul >
                      <li class="text-info">Straat:{{computeAdressCheck.street}} huisnummerRef:{{computeAdressCheck.number}}</li>
                      <li class="text-info">Postcode:{{computeAdressCheck.postcode}}</li>
                      <li class="text-info">Stad:{{computeAdressCheck.city}}</li>
                      <li class="text-info">Lat:{{computeAdressCheck.geo.lat}}</li>
                      <li class="text-info">Lon:{{computeAdressCheck.geo.lon}}</li>
                  </ul>
                 
                  
                  <v-divider class="border-opacity-25 my-5" ></v-divider>
                  <!-- <h3 v-if="computeCat1Selected instanceof Object"> Mandje({{computeCat1Selected.length}})</h3>
                  <h3 v-else>Mandje({{computeCat1Selected}})</h3> -->
                  
                  <ul v-if="computeCat1Selected instanceof Object" v-for="(value, index) in computeCat1Selected">
                    {{value}} 
                    </ul>
                    <ul v-else>
                      {{"nothing"}} 
                    </ul>
                    <ul v-if="computeCat2Selected instanceof Object" v-for="(value, index) in computeCat2Selected">
                      {{value}} 
                    </ul>
                    <ul v-else>
                      {{computeCat2Selected}} 
                    </ul>
                      
                  </v-col>   
                  
                  <v-col cols="8">
                    <v-card>                    
                      <v-card-text>
                          <div class="d-flex pa-4 alig" justify="space-between">
                            <v-checkbox-btn
                          label="Maaltijden"
                            v-model="reactiveCategories.maaltijden"
                            class="pe-2"
                          ></v-checkbox-btn>
                            <v-autocomplete
                            v-model="reactiveAmountItems.totalFooditems1"
                            align-right
                            label="Aantal"
                            max-width="130"
                            :disabled="!reactiveCategories.maaltijden"
                            :items="amountMaxRef"
                          >
                          </v-autocomplete>
                        </div>
                        <div class="d-flex pa-4"  v-for="(value, index) in reactiveAmountItems.totalFooditems1" >  
                           <v-combobox
                            clearable 
                            label="Selecteer maaltijd"
                            :disabled="!reactiveCategories.maaltijden"
                            :items="['Pasta', 'Stampot', 'Salade', 'Ovenschotel']"
                            v-model="reactiveSelectedItems.totalSelectedItem1[index]">
                            </v-combobox>                
                        </div>
                      </v-card-text>
                      <v-card-text>
                        <div class="d-flex pa-4 alig" justify="space-between">
                          <v-checkbox-btn
                        label="Zuivel"
                          v-model="reactiveCategories.zuivel"
                          class="pe-2"
                        ></v-checkbox-btn>
                          <v-autocomplete
                          v-model="reactiveAmountItems.totalFooditems2"
                          align-right
                          label="Aantal"
                          max-width="130"
                          :disabled="!reactiveCategories.zuivel"
                          :items="amountMaxRef"
                        >
                        </v-autocomplete>
                      </div>
                      <div class="d-flex pa-4"  v-for="(value, index) in reactiveAmountItems.totalFooditems2" >  
                         <v-combobox
                          clearable 
                          label="Selecteer zuivel"
                          :disabled="!reactiveCategories.zuivel"
                          :items="['Eieren', 'Kaas', 'Yogurt', 'Melk']"
                          v-model="reactiveSelectedItems.totalSelectedItem2[index]">
                          </v-combobox>                
                      </div>
                    </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="6">
                    <v-radio-group inline label="Status of Package">
                      <v-radio label="Full" value="Full"></v-radio>
                      <v-radio label="Empty" value="Empty"></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col cols="6">
                    <v-btn type="submit" @click="sendAddressToFirbase" class="my-10" block>Add address</v-btn>
                    </v-col>
                </v-row>
                <v-row v-if="computeAdressCheck.message">
                  <v-col>  
                  <ul>
                    <li class="text-info">Error: {{computeAdressCheck.message}}</li>
                  </ul> 
                    <ul  v-for="(value, key, index) in computeAdressCheck.errors">
                      <li class="text-info">{{key}}: <br>{{value[0]}}</li>
                    </ul> 
                  </v-col>
                  
                 
               </v-row>
              </v-container>
            </v-form>
                <v-divider class="border-opacity-25 my-10" ></v-divider>
                <v-form @submit.prevent class="py-10">
                  <v-container>
                <h4 class="text-h5 pb-5">
                  Insert new location | 411
                </h4>
                <v-row>
                  <v-col cols="3" md="3">
                    <v-text-field label="Food ingredient name" v-model="foodName" clearable required></v-text-field>
                  </v-col>
                  <v-col cols="3" md="3">
                    <v-autocomplete clearable label="Food category"
                      :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
                       v-model="locationName"></v-autocomplete>
                  </v-col>
                  <v-col cols="3" md="3">
                    <v-autocomplete clearable label="Land of origin"
                      :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming', 'Enkhuizen', 'Alkmaar', 'Paris']"
                      v-model="countryName" 
                     ></v-autocomplete>
                  </v-col>
                  <v-col cols="3" md="3">
                    <v-autocomplete clearable label="Select distance KM"
                      :items="[1, 2, 3, 4, 5, 6]"
                      v-model="distanceRef"
                      
                     ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-radio-group inline label="What transport are you using?">
                      <v-radio label="Walking" value="Walking"></v-radio>
                      <v-radio label="Bicycle" value="Bicycle"></v-radio>
                      <v-radio label="Car" value="Car"></v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="3" md="3">
                    <v-btn type="submit" @click="sendToFirbase" block>Submit location info</v-btn>
                  </v-col>
                </v-row>
         
              </v-container>
            </v-form>
            <v-divider class="border-opacity-25 pb-5" ></v-divider>
            <v-responsive class="overflow-visible py-16 ">
            <!-- <v-container>
              <v-row justify="space-between">
              <h3 class="text-h5 pb-5">
                Current known locations  
              </h3>
              <v-chip class="text-success" append-icon="$vuetify">
                Total: {{Object.entries(computeReadUserData).length}}
              </v-chip>
              </v-row>
              <v-row >
              <v-col cols="3"  v-for="(value, key, index) in computeReadUserData">
              <ul >
                <li class="text-info">Location:{{index}}</li>
                <li>Name: {{ value.username }}</li>
                <li>Email: {{ value.email }}</li>
                <li>Location: {{ value.location }}</li>
                <li>inputLat: {{ value.inputlat }}</li>
                <li>inputLng: {{ value.inputlng }}</li>
               
                <li><a  href="#html" @click="fetchCountriePosition(value.location)">Show {{value.location}} on map</a></li>
              </ul> 
            </v-col>
            </v-row>
            </v-container> -->
          </v-responsive>
            <v-responsive class="overflow-visible py-16 " >
              <h2 class="text-h4">
                All agriculture in the netherlands | page {{ pages }}
              </h2>
              <p class="mt-5">
                <span class="text-blue-darken-1">{{ computeIsCluster ? "Show all farmers" : "Don't show all farmers"
                  }}</span>
              </p>
              <p>
                All agriculture comppanies in the netherlands that are producing. Agriculture is economy of the country.
                The country's economy depends on agriculture.
              </p>
              <v-switch @click="mapCompRef.setClusters()" color="info" inset class="Vswitch"
                :label="`Toggle all farmers on the map ${computeIsCluster}`" false-value="no"
                true-value="yes"></v-switch>
            </v-responsive>
            <v-pagination v-model="pages" :length="15" :total-visible="7" rounded="0" />
          </v-col>
          
          <v-divider class="border-opacity-25 pb-5" ></v-divider>
          <v-col >
            <v-responsive class="overflow-visible" width="100%">
              <h2 class="text-h4">
                Point location to locate nearby agriculture farms
              </h2>
              <p class="mt-5">
                <span class="mt-5 text-success">Click on the map</span> to discover where the nearest agriculture food farms are located. 
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
                <v-btn class="mt-6"
                  href="#html" :disabled="locationUser ? false : true" @click="fetchCountriePosition(searchedCountry)">
                  {{locationUser ? "Show on map" : "confirm location to show on map"}}
                </v-btn>
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
              <div class="countriesTop">
                <v-btn-alt class="my-6" :disabled="locationUser ? false : true"  @click="toggleCountries()" rel="">
                  {{ !showAllCountries ? 'Show all countries' : 'Hide countries'  }}
                </v-btn-alt>
                <!-- <v-btn-alt class="my-6" @click="toggleCountries()" rel="">
                  Show all countries
                </v-btn-alt> -->
                <a href=""  @click.prevent="scrollPageTo(400)" v-if="!locationUser" class="text-warning my-3 ">Confirm user location</a>
                <p v-else class="text-success my-3">
                  Total countries: <strong>{{ computeGetCountries ? computeGetCountries.length : 0 }} </strong>
                </p>
              </div>
              <ul class="countries" v-show="showAllCountries">
                <li v-for="(item) in computeCountryData">
                  <a href="#html" @click="fetchCountriePosition(Object.values(item)[1])">
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
                      <!-- <v-col cols="12" md="12">
                        <v-autocomplete clearable label="Land of origin" :items="foodDataStore.reactiveCurrentCuisines"
                          v-model="dataFindSelected.currentLandOrigin"></v-autocomplete>
                      </v-col> -->
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
      <section id="hero">
        <v-sheet class="d-flex align-center py-16" color="grey-darken-3"> 
          <v-container >
            <h2 class="text-h4">
            How it works 
          </h2>
            <v-row justify="space-between" class="text-center">  
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

ul {
  li {
    list-style-type: none;
  }
}
</style>
