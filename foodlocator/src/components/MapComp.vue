<script setup lang="ts">
import { computed, watch, ref, onMounted, defineProps, reactive, toRaw } from 'vue'
import { useFoodDataStore } from '../stores//DataFoodStore';
import { storeToRefs } from "pinia";


import L from "leaflet"
import 'leaflet/dist/leaflet.css'

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


const foodDataStore = useFoodDataStore();

//destructure parts of the store
const { reactiveOrigonPosData, clusterPositions } = storeToRefs(useFoodDataStore());

//define emits 
const emitClickedPos = defineEmits(['emit-clicked-position-value'])

//Reactives
let map = ref()
let marker = ref()
let arrayRefIds = ref([]);
const isClusterActive = ref(false)
const isDefaultMapStyle = ref(true)
const buildmapStat = ref(false)
const currentMapStyle = ref();


let reactiveCords = reactive({
  coords: {
    latitude: props.initmapvalue.coords.latitude,
    longitude: props.initmapvalue.coords.longitude
  }
})


//METHODS

function initMap() {
  if (map.value != null) {
    map.value.remove();
    buildMap()
    //addMarker()
  } else {
    buildMap()
    //addMarker()
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
  //option zoomAnimation:false is manditory setting because of bug. needs fix to set to : true
  map.value = L.map('map', { 
    zoomAnimation: false,
    center: computeInitCoords.value 
  }).setView(computeInitCoords.value, 6);

const tiles = L.tileLayer(computeMapStyle.value, {
    attribution: 'some attributions'
  }).addTo(map.value);
  buildmapStat.value = true;
  createMarker()
}



////////////////////////////
//markers for cluster groups
function addNewMarker() {
  //let layergroup = L.layerGroup()
  const markersClusterGroup = L.markerClusterGroup();
  for (var i = 0; i < clusterPositions.value.length; i++) {
    var a = clusterPositions.value[i];
    var title = a[2];
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

function onMapClick(e) {
  let Clickedcoords = e.latlng;
  reactiveCords = {
    lat: Clickedcoords.lat,
    lng: Clickedcoords.lng
  }
  emitClickedPos('emit-clicked-position-value', reactiveCords)
  
// isDefaultMapStyle.value ? '' : setMapStyle(true)
}

function createMarker(arg) {
  var customIcon = L.icon({
    iconUrl: 'src/assets/img/icon-marker.png',
    iconSize: [40, 40] // size of the icon
  });
  L.marker(computeInitCoords.value, { icon: customIcon }).addTo(map.value)
    .bindPopup(arg, { className: "customPopup" })
}


function setContentPopup(reactiveCords) {
  const clickedPopup = L.popup()
  const contentContainer = document.createElement("div");
  contentContainer.classList.add('popupContent')
  const listUl = document.createElement("ul");
  const title = document.createElement("h2");
  let titleText = document.createTextNode('QuickSnacks in ' + computeClickedPosition.value);
  title.append(titleText)
  contentContainer.append(title)
  contentContainer.append(listUl)
  for (let index = 0; index < computeRestaurants.value.length; index++) {
    let textnode = document.createTextNode(computeRestaurants.value[index]);
    let liEl = document.createElement("li");
    liEl.append(textnode)
    listUl.append(liEl)
  }
  clickedPopup.setLatLng(reactiveCords).setContent(contentContainer).openOn(map.value);
}

async function addMarker(cuisine) {
  // fetch the cuisine when props city name is known
  let findCuisine = await foodDataStore.fetchcuisine(cuisine);
  let foodTitle;
  const listUl = document.createElement("ul");
  const title = document.createElement("h2");
  let titleText = document.createTextNode('In your current city: ' + props.initPosDataProp[0].name + ' are the following ' + cuisine.currentLandOrigin + ', foodmenus:');
  title.append(titleText)
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
      // createMarker(listUl)
     createMarker(contentContainer)
    }
  }
}

//COMPUTED
const computeinitPostData = computed(function () {
  if (props.initPosDataProp) {
    for (var key in props.initPosDataProp[0]) {
      //returning city name
      return props.initPosDataProp[0].name
    }
  } else {
    return "nothing"
  }
})

const computeInitCoords = computed(function () {
  //computed when change in value prop.initmapvalue
  if (props.initmapvalue && (props.initCoordsProp === undefined)) {
      reactiveCords = reactive({
        coords: {
          latitude: props.initmapvalue.coords.latitude,
          longitude: props.initmapvalue.coords.longitude
        }
      })
    return [props.initmapvalue.coords.latitude, props.initmapvalue.coords.longitude]
  }
  else if (props.initmapvalue && props.initCoordsProp && (props.countryPosDataProp === undefined)) {
    reactiveCords = reactive({
        coords: {
          latitude: props.initCoordsProp.coords.latitude,
          longitude: props.initCoordsProp.coords.longitude
        }
      })
    return [props.initCoordsProp.coords.latitude, props.initCoordsProp.coords.longitude]
  }
  else if (props.countryPosDataProp && props.initmapvalue && props.initCoordsProp) {
    reactiveCords = reactive({
        coords: {
          latitude: props.countryPosDataProp.lat,
          longitude: props.countryPosDataProp.lon
        }
      })
    return [props.countryPosDataProp.lat, props.countryPosDataProp.lon];
  }
})

const computeClickedPosition = computed(function () {
  if (props.clickedPositionDataProp) {
    return foodDataStore.getFoodPositionDataByClick[0].name;
  }
})


const computeMapStyle = computed(function () {
  if (isDefaultMapStyle.value) {
    return currentMapStyle.value = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
  }else{
    return currentMapStyle.value = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
  }
})

const computeRestaurants = computed(function () {
  return props.currentFoodRestaurantsProp
})

//WATCH
watch(computeinitPostData, async () => {
  // positionName.value = true
  const cuisine = {
    currentLandOrigin: "thai"
  }
  addMarker(cuisine);
})

watch(computeInitCoords, () => {
  initMap()
})

watch(computeClickedPosition, () => {
  setContentPopup(reactiveCords)
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

.popupContent {
  border-radius: 0;

  h2 {
    padding: 1rem 0rem;
  }

  ul {
    li {
      list-style: none;
    }
  }
}
</style>
