<script setup lang="ts">
import { computed, watch, ref, onMounted, defineProps, reactive, ComputedRef } from 'vue'
import { useFoodDataStore } from '../stores/DataFoodStore';
import { storeToRefs } from "pinia";

import L from "leaflet";
import 'leaflet/dist/leaflet.css';

import type { ReactiveCordsIntFace,LatlngIntFace,LatlngClickIntFace,CuisineNameType,ObjectResults } from './../types';
 
interface Props {
  reactiveCordsProp:ReactiveCordsIntFace,
  initMapValue:ReactiveCordsIntFace,
  initPosDataProp:object[],
  initCoordsProp: number[],
  countryPosDataProp:LatlngIntFace,
  clickedRadiusDataProp: ObjectResults,
  clickedPositionDataProp:object
}
const props = defineProps<Props>()

const foodDataStore = useFoodDataStore();
//destructure parts of the store
const { clusterPositions } = storeToRefs(useFoodDataStore());

//define emits 
const emitClickedPos = defineEmits(['emit-clicked-position-value'])

//Reactives
let map = ref()

 //type Array<object> - .value not recognized? 
const arrayRefIds: any = ref([])
const isClusterActive = ref(false)
const isDefaultMapStyle = ref(true)
const buildmapStat = ref(false)
const currentMapStyle = ref();

let reactiveCords:ReactiveCordsIntFace = reactive({
  coords: {
    latitude: props.reactiveCordsProp.coords.latitude,
    longitude: props.reactiveCordsProp.coords.longitude
  }
})


//METHODS
function initMap() {
  if (map.value != null) {
   map.value.remove(); 
   buildMap(true)
    //refactor for dynamic selected cuising from api
    addMarker('african')
  } else {
    buildMap(true)
    //refactor for dynamic selected cuising from api
    addMarker('Thai')
  }
  map.value.on('click', onMapClick);
}

function buildMap(zoomAniBoolean:boolean) {
  //option zoomAnimation:false is manditory setting because of bug. needs fix to set to : true
  map.value = L.map('map', { 
    zoomAnimation: false,
    //center: computeInitCoords.value
    center: [computeInitCoords.value[0], computeInitCoords.value[1]]
  })
  //init setview
  map.value.setView([computeInitCoords.value[0], computeInitCoords.value[1]], 6);

 L.tileLayer(computeMapStyle.value, {
    attribution: 'some attributions'
  }).addTo(map.value);
  buildmapStat.value = true;
  const contentContainer = document.createElement("div");
  createMarker(contentContainer)
}

////////////////////////////
//markers for cluster groups
function addClusterMarkers() {
  //let layergroup = L.layerGroup()
  const markersClusterGroup = (L as any).markerClusterGroup();
  //an type array with type numbers and type strings. 
  let element:Array<any>;
  for (element of clusterPositions.value) {  
    let title:string = element[2]
    let lng:number = element[0]
    let lat:number = element[1]
    //layer
    const clustmarker:any = L.marker([lng, lat],{ title: title }).addTo(markersClusterGroup);
    clustmarker.bindPopup(title)
  }
  arrayRefIds.value.push(markersClusterGroup)
  markersClusterGroup.addTo(map.value)
}

function removeNewMarker() {
  // remove all markers
  arrayRefIds.value.forEach((element:HTMLElement) => {
    // remove all markers
    element.remove();
    //setMapStyle(true)
  });
}

function setClusters() {
  map.value.flyTo([52.37031805385792, 4.890289306640626], 6);
    //toggle mapstyle
    //isDefaultMapStyle.value ? initMap() : setMapStyle(true)
  if (!isClusterActive.value) {
    isClusterActive.value = true
    addClusterMarkers()
  } else {
    isClusterActive.value = false
    removeNewMarker()
  }
}

function onMapClick(e:LatlngClickIntFace) {
  reactiveCords.coords.latitude = e.latlng.lat
  reactiveCords.coords.longitude = e.latlng.lng
  emitClickedPos('emit-clicked-position-value', reactiveCords)
}

function createMarker(contentContainer:HTMLElement) {
  let customIcon = L.icon({
    iconUrl: 'src/assets/img/icon-marker.png',
    iconSize: [40, 40] // size of the icon
  });
  L.marker(computeInitCoords.value, { icon: customIcon }).addTo(map.value)
  .bindPopup(contentContainer, { className: "customPopup" })
  
}

function setContentPopup() {
  const clickedPopup = L.popup()
  const contentContainer = document.createElement("div");
  contentContainer.classList.add('popupContent')
  const listUl = document.createElement("ul");
  const title = document.createElement("h2");
  const span = document.createElement("span");
  let placeholderText = document.createTextNode('Local food farms in ');
  //computeClickedPosition.value
  let titleText = document.createTextNode(computeClickedPosition.value);
  span.classList.add('text-blue-darken-1');
  span.append(titleText)
  title.append(placeholderText)
  title.append(span)
  contentContainer.append(title)
  contentContainer.append(listUl)
  
  //type:any because of unknown
  Object.values(computeRadiusData.value.results).forEach(element => {
    let newString:any|string;
    newString = Object.values(element.poi)[0]
    let liEl = document.createElement("li");
    listUl.append(liEl)
    liEl.append(newString)
  });
  clickedPopup.setLatLng(computeInitCoords.value).setContent(contentContainer).openOn(map.value);
}

async function addMarker(cuisine:CuisineNameType) {
  // fetch the cuisine when props city name is known
  let findCuisine = await foodDataStore.fetchcuisine(cuisine);
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

  for (let index = 0; index < findCuisine.results.length; index++) {
    foodTitle = findCuisine.results[index];
    let textnode = document.createTextNode(foodTitle.title);
     let liEl = document.createElement("li");
    liEl.append(textnode)
    listUl.append(liEl)
    if (index == (findCuisine.results.length - 1)) {    
     createMarker(contentContainer)
    }
  }
}

//COMPUTED
const computeInitCoords:ComputedRef<any> = computed  (function() {
  reactiveCords.coords.latitude = props.reactiveCordsProp.coords.latitude  
  reactiveCords.coords.longitude = props.reactiveCordsProp.coords.longitude  
  return [reactiveCords.coords.latitude,  reactiveCords.coords.longitude]
})


const computeClickedPosition:ComputedRef<any> = computed(function () {
  if (props.clickedPositionDataProp) {
    let cityName;
    cityName = Object.values(props.clickedPositionDataProp)[0].name
    return cityName;
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

const computeRadiusData:ComputedRef<ObjectResults> = computed(function () {
  return props.clickedRadiusDataProp
})

const computeCurrentCityName = computed(function () {
  let posData;
  posData = Object.values(props.initPosDataProp)
  return props.initPosDataProp.length > 0 ? Object.values(posData[0])[0] : 'loading..'
})

//WATCH
watch(computeInitCoords, () => {
  map.value.flyTo([computeInitCoords.value[0], computeInitCoords.value[1]], 6);
})

watch(computeClickedPosition, () => {
  setContentPopup()
})

watch(computeCurrentCityName, () => {
  //watching when cityname is loaded, the initMap is fired. 
  computeCurrentCityName.value ? initMap() : 'waiting for name before map loads'   

})

//DefineExpose
defineExpose({
  setClusters,
  isClusterActive,
  isDefaultMapStyle
});
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
