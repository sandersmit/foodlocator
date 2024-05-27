<script setup lang="ts">
import { computed, watch, ref, onMounted, defineProps, reactive, ComputedRef } from 'vue'
import { useFoodDataStore } from '../stores/DataFoodStore';
import { storeToRefs } from "pinia";

import L from "leaflet";
import 'leaflet/dist/leaflet.css';

import type { ReactiveCordsIntFace } from './../types';

// defineProps<{ msg: string }>()
const props = defineProps({
  msg: {
    type: String,
    required: true
  },
  initmapvalue: {
    type: Object,
    required: false
  },
  initPosDataProp: {
    type: Object,
    required: true
  },
  countryPosDataProp: {
    type: Object,
    required: false
  },
  initCoordsProp: {
    type: Object,
    required: false
  },
  clickedPositionDataProp: {
    type: Object,
    required: false
  },
  showFoodProp: {
    type: String,
    required: false
  },
  currentFoodRestaurantsProp: {
    type: Array,
    required: false
  }
});

// var latlng = L.latLng(computeInitCoords.value);
let latlng = ref()

const foodDataStore = useFoodDataStore();
//destructure parts of the store
const { currentGeoPos, clusterPositions } = storeToRefs(useFoodDataStore());

//define emits 
const emitClickedPos = defineEmits(['emit-clicked-position-value'])

//Reactives
let map = ref()
let arrayRefIds = ref([]);
const isClusterActive = ref(false)
const isDefaultMapStyle = ref(true)
const buildmapStat = ref(false)
const currentMapStyle = ref();



let reactiveCords:ReactiveCordsIntFace = reactive({
  coords: {
    latitude: currentGeoPos.value.coords.latitude,
    longitude: currentGeoPos.value.coords.longitude
  }
})


//METHODS
function initMap() {
  if (map.value != null) {
    map.value.remove();
    buildMap()
    //refactor for dynamic selected cuising from api
    addMarker('Thai')
  } else {
    buildMap()
    //refactor for dynamic selected cuising from api
    addMarker('Thai')
  }
  map.value.on('click', onMapClick);
  // const circle = L.circle(computeInitCoords.value, {
  //   color: 'red',
  //   fillColor: '#f03',
  //   fillOpacity: 0.5,
  //   radius: 1500
  // }).addTo(map.value).bindPopup('Dit is de een range van deze locatie');
}

function buildMap() {
  console.log("computeInitCoords.value",computeInitCoords.value)
  latlng = ref(L.latLng(computeInitCoords.value))
  //option zoomAnimation:false is manditory setting because of bug. needs fix to set to : true
  map.value = L.map('map', { 
    zoomAnimation: false,
    //center: computeInitCoords.value 
    center: latlng.value
  }).setView(latlng.value, 6);
  
 L.tileLayer(computeMapStyle.value, {
    attribution: 'some attributions'
  }).addTo(map.value);
  buildmapStat.value = true;
  const contentContainer = document.createElement("div");
  createMarker(contentContainer)
  console.log('buildMap.. done')

}

////////////////////////////
//markers for cluster groups
function addNewMarker() {
  //let layergroup = L.layerGroup()
  const markersClusterGroup = L.markerClusterGroup();
  for (const element of clusterPositions.value) {
    let a = element;
    let title = a[2];
    //layer
    const clustmarker = L.marker([a[0], a[1]], { title: title }).addTo(markersClusterGroup);
    clustmarker.bindPopup(title)
  }
  arrayRefIds.value.push(markersClusterGroup)
  markersClusterGroup.addTo(map.value)
}

function removeNewMarker() {
  // remove all markers
  arrayRefIds.value.forEach(element => {
    // remove all markers
    element.remove();
  });
}

function setMapStyle(arg){
  isDefaultMapStyle.value = arg;
  initMap()
}

function setClusters() {
  //toggle mapstyle
   isDefaultMapStyle.value ? initMap() : setMapStyle(true)
  
  //toggle clusters on map
  isClusterActive.value = !isClusterActive.value;
  if (isClusterActive.value) {
    addNewMarker()
    return isClusterActive.value
  } else {
    removeNewMarker()
    return isClusterActive.value
  }
  //isClusterActive.value ? map.value.addLayer(markers) : 
}

function onMapClick(e:GeolocationPosition) {
  let Clickedcoords = e.latlng;
  reactiveCords.coords.latitude = Clickedcoords.lat
  reactiveCords.coords.longitude = Clickedcoords.lng
  console.log(reactiveCords)
  emitClickedPos('emit-clicked-position-value', reactiveCords)
  
// isDefaultMapStyle.value ? '' : setMapStyle(true)
}

function createMarker(contentContainer:HTMLElement) {
  let customIcon = L.icon({
    iconUrl: 'src/assets/img/icon-marker.png',
    iconSize: [40, 40] // size of the icon
  });
  L.marker(computeInitCoords.value, { icon: customIcon }).addTo(map.value)
  .bindPopup(contentContainer, { className: "customPopup" })
  
}

function setContentPopup(arg) {
  const clickedPopup = L.popup()
  const contentContainer = document.createElement("div");
  contentContainer.classList.add('popupContent')
  const listUl = document.createElement("ul");
  const title = document.createElement("h2");
  const span = document.createElement("span");
  let placeholderText = document.createTextNode('Local food farms in ');
  let titleText = document.createTextNode(computeClickedPosition.value);
  span.classList.add('text-blue-darken-1');
  span.append(titleText)
  title.append(placeholderText)
  title.append(span)
  contentContainer.append(title)
  contentContainer.append(listUl)
  for (const element of computeRestaurants.value) {
    let textnode = document.createTextNode(element.poi.name);
    let liEl = document.createElement("li");
    liEl.append(textnode)
    listUl.append(liEl)
  }
  const latlng = L.latLng(arg.coords.latitude, arg.coords.longitude);
  clickedPopup.setLatLng(latlng).setContent(contentContainer).openOn(map.value);
}

async function addMarker(cuisine) {
  console.log("cuisine",cuisine)
  // fetch the cuisine when props city name is known
  //let findCuisine = await foodDataStore.fetchcuisine(cuisine);
  let foodTitle;
  const listUl = document.createElement("ul");
  const title = document.createElement("h2");
  title.innerHTML = "In your current city:"+
  "<span class='text-blue-darken-1'>"+computeCurrentCityName.value+"</span>are the following"+
  ",<span class='text-blue-darken-1'>"+cuisine+"</span>cuisine foodmenus:";
  const contentContainer = document.createElement("div");
  contentContainer.classList.add('popupContent')
  contentContainer.append(title)
  contentContainer.append(listUl)

  // for (let index = 0; index < findCuisine.results.length; index++) {
  //   foodTitle = findCuisine.results[index];
  //   let textnode = document.createTextNode(foodTitle.title);
  //    let textnode = document.createTextNode("foodTitle.title");
  //    let liEl = document.createElement("li");
  //   liEl.append(textnode)
  //   listUl.append(liEl)
  //   if (index == (findCuisine.results.length - 1)) {    
  //    createMarker(contentContainer)
  //   }
  // }
  
  //temporary - for max calls per day - spoonacular api  
     const textnode = document.createTextNode("foodTitle.title");
     const liEl = document.createElement("li");
     liEl.append('textnode')
     listUl.append(liEl)
     createMarker(contentContainer)
  //end
}

//COMPUTED
const computeInitCoords:ComputedRef<any> = computed  (function() {
  //computed when change in value prop.initmapvalue
  if (props.initmapvalue && (props.initCoordsProp === undefined)) {
    console.log('1')
    reactiveCords.coords.latitude = currentGeoPos.value.coords.latitude
    reactiveCords.coords.longitude = currentGeoPos.value.coords.longitude
    return [props.initmapvalue.coords.latitude, props.initmapvalue.coords.longitude]
  }
  else if (props.initmapvalue && props.initCoordsProp && (props.countryPosDataProp === undefined)) {
    console.log('2')
    reactiveCords = reactive({
        coords: {
          latitude: currentGeoPos.value.coords.latitude,
          longitude: currentGeoPos.value.coords.longitude
        }
      })
    return [props.initCoordsProp.coords.latitude, props.initCoordsProp.coords.longitude]
  }
  else if (props.countryPosDataProp && props.initmapvalue && props.initCoordsProp) {
    console.log('3', props.countryPosDataProp)
    reactiveCords = reactive({
        coords: {
          latitude: currentGeoPos.value.coords.latitude,
          longitude: currentGeoPos.value.coords.longitude
        }
      })
    return [ props.countryPosDataProp[0].position.lat,  props.countryPosDataProp[0].position.lon];
  }
})

const computeClickedPosition = computed(function () {
  if (props.clickedPositionDataProp) {
    return foodDataStore.getFoodPositionDataByClick[0].name;
  }
})

//refactor for switching custom map styles. 
const computeMapStyle = computed(function () {
  if (isDefaultMapStyle.value) {
    currentMapStyle.value = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
    return currentMapStyle.value 
  }else{
    currentMapStyle.value = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
    return currentMapStyle.value
  }
})

const computeRestaurants = computed(function () {
  return props.currentFoodRestaurantsProp
})

const computeCurrentCityName = computed(function () {
  // console.log("computeCurrentCityName", props.initPosDataProp.length > 0 ? props.initPosDataProp[0].name : 'loading..')
  return props.initPosDataProp.length > 0 ? props.initPosDataProp[0].name : 'loading..'
})


//WATCH
watch(computeInitCoords, () => {
  console.log('initmap')
  initMap()
})

watch(computeClickedPosition, () => {
  setContentPopup(reactiveCords)
})

watch(computeCurrentCityName, () => {
  //watching when cityname is loaded, the initMap is fired. 
  computeCurrentCityName.value !== 'loading' ?  initMap() : 'waiting for name before map loads'   
})

//DefineExpose
defineExpose({
  setClusters,
  isClusterActive,
  isDefaultMapStyle
});

onMounted(() => {
  initMap()
})
</script>

<template>
  <div id="map" class="mapcomp mt-15">
  </div>
</template>

<style lang="scss">
.mapcomp {
  color: #fff;
  height: 50vh;
}

.leaflet-popup-content,
.leaflet-popup-content-wrapper,
.leaflet-popup-tip {
  background-color: black;
  color: #fff;
}

.leaflet-marker-icon{
  margin-top: -40px !important;
}
.leaflet-container{
  a{
    &.leaflet-popup-close-button{
      color: #fff;
    font-size: 1.5rem;
    right: 0.5rem;
    top: 0.5rem;


  }
}
}

.popupContent {
  border-radius: 0;

  h2 {
    padding-bottom: 1rem;
    display: flex;
    flex-direction: column;
  }

  ul {
    li {
      list-style: none;
      font-size: 0.9rem;
    }
  }
}
</style>
