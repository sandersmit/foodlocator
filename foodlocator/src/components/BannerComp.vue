<script setup lang="ts">
import { ref, reactive, computed, ComputedRef } from 'vue'
import { useFoodDataStore } from '../stores/DataFoodStore';

import type { ReactiveCordsIntFace } from './../types';

const foodDataStore = useFoodDataStore();

const props = defineProps<{
  initPosDataProp: ReactiveCordsIntFace,
  reactiveCordsProp: ReactiveCordsIntFace
}>()

const activeBannerRef = ref(true)
const showloader = ref(false)
//data.currentposition.coords.longitude
let reactiveCurrentCords: ReactiveCordsIntFace = reactive({
  coords: {
    latitude: props.reactiveCordsProp.coords.latitude,
    longitude: props.reactiveCordsProp.coords.longitude
  }
})

const emit = defineEmits(['emit-position-value', 'emit-current-position'])

//METHODS
function positionValueEmit() {
  showloader.value = true;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
  }
}
function showPosition(position: ReactiveCordsIntFace) {
  emit('emit-position-value', position)
  activeBannerRef.value = false;
  showloader.value = false;
  reactiveCurrentCords = position
}

const computeinitPosData: ComputedRef<string> = computed(function () {
  emit('emit-current-position', foodDataStore.getFoodPositionDataByBanner[0].name)
  return foodDataStore.getFoodPositionDataByBanner[0].name
})
</script>

<template>
  <Transition>
    <v-banner v-if="activeBannerRef" class="custBanner" color="warning" icon="mdi-map-marker" lines="one">
      <template v-slot:text>
        Default city: <span class="text-blue-darken-1">{{ computeinitPosData }}</span> -- This app rquires the location of
        the user, choose to Confirm for optimal UX
      </template>
      <template v-slot:actions>
        <v-btn v-if="showloader">Loading position..</v-btn>
        <v-btn v-else @click="positionValueEmit">Confirm</v-btn>
      </template>
    </v-banner>
    <v-banner v-else id="custbanner" class="custBanner" color="success" icon="mdi-map-marker" lines="one">
      <template v-slot:text>
        <span class="text-blue-darken-1">{{ computeinitPosData }} </span> is your current location. Lat:{{
          reactiveCurrentCords.coords.latitude}} & Lng:{{ reactiveCurrentCords.coords.longitude }}
      </template>
    </v-banner>
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
