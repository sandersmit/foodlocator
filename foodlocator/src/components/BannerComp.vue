<script setup lang="ts">
import { ref, reactive, computed, onMounted, defineProps } from 'vue'
import { useFoodDataStore } from '../stores/DataFoodStore';
import { storeToRefs } from "pinia";

import type { ReactiveCordsIntFace } from './../types';

const foodDataStore = useFoodDataStore();

const { currentGeoPos, reactiveOrigonPosData} = storeToRefs(useFoodDataStore());
const props =  defineProps({
  initPosDataProp: {
       type:Object,
       required: false
   }
});

const activeBannerRef = ref(true)
//data.currentposition.coords.longitude
let reactiveCurrentCords:ReactiveCordsIntFace = reactive({
  coords: {
    latitude: currentGeoPos.value.coords.latitude,
    longitude: currentGeoPos.value.coords.longitude
  }
})

const emit = defineEmits(['emit-position-value'])

//METHODS
function positionValueEmit() {
  console.log('position?')
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation is not supported by this browser.")
    }
  
}
function showPosition(position:ReactiveCordsIntFace) {
  console.log("position", position)
    console.log("Latitude: " + position.coords.latitude +
       "Longitude:" + position.coords.longitude)
    emit('emit-position-value', position)
    activeBannerRef.value = false;
    reactiveCurrentCords = position
  }


const computeinitPosData = computed(function(){
 return foodDataStore.getFoodPositionDataByBanner.length == 1?foodDataStore.getFoodPositionDataByBanner[0].name:"loading..";
  //return "loading..",reactiveOrigonPosData;
})

onMounted(() => {
  //initLocation
  foodDataStore.fetchFoodOriginPosition(props.initPosDataProp)
})
</script>

<template>
  <Transition>
    <!-- <div v-if="activeBannerRef"> -->
      <v-banner v-if="activeBannerRef" class="custBanner" color="warning" icon="mdi-map-marker" lines="one">
        <template v-slot:text>
          Default city: <span class="text-blue-darken-1">{{computeinitPosData}}</span> -- This app rquires the location of the user, choose to Confirm for optimal UX
        </template>
        <template v-slot:actions>
          <v-btn @click="positionValueEmit">Confirm</v-btn>
          <!-- <v-btn @click="activeBannerRef=true">Cancel</v-btn> -->
        </template>
      </v-banner>
    <!-- </div>
    <div v-else> -->
      <v-banner v-else id="custbanner" class="custBanner" color="success" icon="mdi-map-marker" lines="one">
        <template v-slot:text>
          <span class="text-blue-darken-1">{{ computeinitPosData }} </span> is your current location : {{ reactiveCurrentCords.coords.latitude}} and {{reactiveCurrentCords.coords.longitude }}
        </template>
      </v-banner>
    <!-- </div> -->
  </Transition>
</template>

<style scoped lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

</style>
