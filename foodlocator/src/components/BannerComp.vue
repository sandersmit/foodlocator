<script setup lang="ts">
import { ref, reactive, computed, onMounted, ComputedRef} from 'vue'
import { useFoodDataStore } from '../stores/DataFoodStore';

import type { ReactiveCordsIntFace } from './../types';

const foodDataStore = useFoodDataStore();

const props = defineProps<{
  initPosDataProp: ReactiveCordsIntFace,
  reactiveCordsProp:ReactiveCordsIntFace
}>()

const activeBannerRef = ref(true)
const showloader = ref(false)
//data.currentposition.coords.longitude
let reactiveCurrentCords:ReactiveCordsIntFace = reactive({
  coords: {
    latitude: props.reactiveCordsProp.coords.latitude,
    longitude: props.reactiveCordsProp.coords.longitude
  }
})

const emit = defineEmits(['emit-position-value','emit-current-position'])

//METHODS
function positionValueEmit() {
  console.log('position?')
  showloader.value = true;
    if (navigator.geolocation) {
      console.log("navigator get position..")
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
    showloader.value = false;
    reactiveCurrentCords = position
  }


const computeinitPosData :ComputedRef<string> = computed(function(){
  //console.log(foodDataStore.getFoodPositionDataByBanner.length, foodDataStore.getFoodPositionDataByBanner[0].name)
  emit('emit-current-position', foodDataStore.getFoodPositionDataByBanner[0].name)
  return foodDataStore.getFoodPositionDataByBanner[0].name 
})

onMounted(() => {
  //initLocation
  console.log(typeof props.initPosDataProp)
  //emit('emit-current-position', computeinitPosData.value)
  //foodDataStore.fetchFoodOriginPosition(props.initPosDataProp)
})
</script>

<template>
  <!-- <hr>
    ---------------banner.vue COMPONENT
    <hr> -->
  <!-- computeinitPosData:{{ computeinitPosData }} -->
  <Transition>
    <!-- <div v-if="activeBannerRef"> -->
      <v-banner v-if="activeBannerRef" class="custBanner" color="warning" icon="mdi-map-marker" lines="one">
        <template v-slot:text>
          Default city: <span class="text-blue-darken-1">{{computeinitPosData}}</span> -- This app rquires the location of the user, choose to Confirm for optimal UX
        </template>
        <template v-slot:actions>
          <v-btn v-if="showloader">Loading position..</v-btn>
          <v-btn v-else @click="positionValueEmit">Confirm</v-btn>
        </template>
      </v-banner>
    <!-- </div>
    <div v-else> -->
      <v-banner v-else id="custbanner" class="custBanner" color="success" icon="mdi-map-marker" lines="one">
        <template v-slot:text>
          <span class="text-blue-darken-1">{{ computeinitPosData }} </span> is your current location. Lat:{{ reactiveCurrentCords.coords.latitude}} & Lng:{{reactiveCurrentCords.coords.longitude }}
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
