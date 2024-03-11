<script setup lang="ts">
import { computed ,ref, onMounted, onUpdated } from 'vue'
import L from "leaflet"
import 'leaflet/dist/leaflet.css'

// defineProps<{ msg: string }>()
const props =  defineProps({
  msg: {
       type:String,
       required: true
   },
   initmapvalue:{
    type:String,
       required: false
   }
});

//Reactives
let map = ref()


//METHODS

function initMap() {

  if (map.value != null)
  {
    console.log("remove existing map")
    map.value .remove();
    buildMap()  
  }else{
    console.log("add new map")
    buildMap()
  }

function buildMap(){
  map.value  = L.map('map').setView(computeInitPosition.value, 13);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map.value);
}

  const marker = L.marker(computeInitPosition.value).addTo(map.value)
    .bindPopup('<b>Hello world!</b><br />I am a popup.').openPopup();

  const circle = L.circle(computeInitPosition.value, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
  }).addTo(map.value).bindPopup('I am a circle.');


  const popup = L.popup()
    .setLatLng(computeInitPosition.value)
    .setContent('I am a standalone popup.')
    .openOn(map.value);

  function onMapClick(e) {
    popup.setLatLng(e.latlng).setContent(`You clicked the map at ${e.latlng.toString()}`)
      .openOn(map.value);
  }

  map.value.on('click', onMapClick);
}

//COMPUTED
const computeInitPosition = computed(function(){
  
  if (props.initmapvalue) {
    console.log("props.initmapvalue", props.initmapvalue)
    return [props.initmapvalue.coords.latitude,props.initmapvalue.coords.longitude]
  } else {
    const defaultPosition = [51.505, -0.09];
    return defaultPosition
  }  
  
})

onMounted(() => {
  console.log("onMounted")
  initMap()
})
onUpdated(() => {
  console.log("onUpdated")
  initMap()
})
</script>

<template>
  <div id="map" class="mapcomp mt-15"> 
  </div>
</template>

<style scoped>
.mapcomp {
  color: #fff;
  height: 50vh;
}
</style>
