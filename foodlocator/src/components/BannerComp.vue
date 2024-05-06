<script setup lang="ts">
import { ref, reactive, computed, onMounted, defineProps } from 'vue'


// defineProps<{ msg: string }>()
const props =  defineProps({
  initPosDataProp: {
       type:Object,
       required: true
   }
});

const activeBannerRef = ref(true)
const data = reactive({
  currentposition: ''
})

const emit = defineEmits(['emit-position-value'])

//METHODS
function positionValueEmit() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.")
  }
  function showPosition(position) {
    // console.log("Latitude: " + position.coords.latitude +
    //   "Longitude:" + position.coords.longitude)
    emit('emit-position-value', position)
    activeBannerRef.value = false;
    data.currentposition = position
  }
}


const computeinitPosData = computed(function(){
  if (props.initPosDataProp) {
     for(var key in props.initPosDataProp[0]) {
      //returning city name
          return props.initPosDataProp[0].name
        } 
    }else{
      return "nothing"
    } 
})

onMounted(() => {
  //initLocation()
})
</script>

<template>
  <Transition>
    <!-- <div v-if="activeBannerRef"> -->
      <v-banner v-if="activeBannerRef" class="custBanner" color="warning" icon="mdi-map-marker" lines="one">
        <template v-slot:text>
          This app rquires the location of the user, choose to Confirm or Cancel to use default {{ computeinitPosData }}
        </template>
        <template v-slot:actions>
          <v-btn @click="positionValueEmit">Confirm</v-btn>
          <v-btn @click="activeBannerRef = false">Cancel</v-btn>
        </template>
      </v-banner>
    <!-- </div>
    <div v-else> -->
      <v-banner v-else id="custbanner" class="custBanner" color="success" icon="mdi-map-marker" lines="one">
        <template v-slot:text>
          {{ computeinitPosData }} is your current location : {{ data.currentposition.coords.latitude}} and {{data.currentposition.coords.longitude }}
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
.custBanner{
  // position:absolute;
  // top:0px;
}

</style>
