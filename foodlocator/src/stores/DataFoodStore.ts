import { defineStore } from "pinia"; 

import type { ObjectResults, ObjDataCountries, ArrayResults, CuisineNameType, ReactiveCordsIntFace ,SearchedCountryType, LatlngIntFace} from './../types';

//as the name of the file 'FoodStore.js'
export const useFoodDataStore = defineStore("FoodDataStore", {
  //The state is defined as a function returning the initial state
  state: function () {
    return {
      staticStoreGeoPos: {
        coords: {
          latitude: 52.37031805385792,
          longitude: 4.890289306640626
        }
      } as ReactiveCordsIntFace,

      //Static data
      reactiveCountryOrgins: [
        "Netherlands",
        "Germany",
        "France",
        "Spain",
        "Italy",
      ],
      reactiveIngredients: [
        "kool",
        "bieten",
        "varkensvlees",
        "rundvlees",
        "aardappelen",
      ],
      reactiveCurrentCuisines: [
        "african?",
        "chinese",
        "japanese",
        "korean",
        "vietnamese",
        "thai",
        "indian",
        "british",
        "irish",
        "french",
        "Asian",
        "American",
        "Cajun",
        "Caribbean",
        "Eastern European",
        "European", 
        "German",
        "Greek",
        "Italian",
        "Jewish",
        "Latin American",
        "Mediterranean",
        "Mexican",
        "Middle Eastern",
        "Nordic",
        "Southern",
        "Spanish",
      ],
      clusterPositions: [
        [51.90567656749997, 4.474182128906251, "2 Rotterdam"],
        [51.5051497, 3.5764998, "3 Middelburg"],
        [51.7148962, 5.2357782, "4 Denbosch"],
        [52.0842635, 5.0000913, "5 Utrecht"],
        [50.8578761, 5.6185061, "6 Maastricht"],
        [52.0056928, 5.8141985, "Arnhem 7"],
        [52.51660546750251, 5.490417480468751, "Lelystad 8"],
        [52.993960810438914, 6.560211181640626, "9 Assen"],
        [52.50929333176149, 6.097412109375001, "10 Zwolle"],
        [53.2082473529397, 6.557464599609376, "11 Groningen"],
        [53.199451902831555, 5.770568847656251, "12 Leeuwarden"],
      ],
      //reactiveDataSet
      reactiveFoodCuising: {} as ArrayResults,
      reactiveClickedPosData: [{
        name:'No pointed location'
      }],
      reactiveClickedPosCatData: {results:{
        
      }} as ObjectResults,
      searchedCountryFoodData: [] as object[],
      reactivePositionData: [],
      reactiveOrigonPosData:  [{
        name: 'loading...',
        country: 'loading..',
        state: 'loading..',
      }],
      reactiveCountryPosData:{
        results:[{
          position:{
                lat:52.37031805385792,
                lon:4.890289306640626
          }
        }]
      } as LatlngIntFace, 
      reactviefoodTitles:[{
         title:''
      }] as object[],
      reactiveClickedCatTitles: [] as string[],
      reactiveFoodMenuDetails: [],
      reactviefoodOrigin: [],
      reactiveCountrieData: {} as ObjDataCountries,
      allCountryNames: [] as object[],
      allCountryInfoObj: [] as string[]
    };
  },
  //Getters are synchronous functions used to retrieve data from the state
  getters: {
    getFoodDataByCuisine:function(state) {   
    return state.reactiveFoodCuising.results != null ? state.reactiveFoodCuising.results : []
     },
    getFoodPositionDataByClick: function (state) {
      return state.reactiveClickedPosData;
    },
    getSearchedCountryFood: function (state) {
      console.log("state.searchedCountryFoodData",state.searchedCountryFoodData)
      return state.searchedCountryFoodData
    },
    getFoodPositionCatDataByClick: function (state) {
      //loop over object with
      return state.reactiveClickedPosCatData
    },
    getFoodPositionDataByBanner: function (state) {
      //plaatsnaam returned
      // console.log("state.reactiveOrigonPosData.lenght",state.reactiveOrigonPosData.length, 
      // "state.reactiveOrigonPosData",state.reactiveOrigonPosData, 
      // "state.staticStoreGeoPos", state.staticStoreGeoPos)
      //return state.reactiveOrigonPosData.length>0 ? state.reactiveOrigonPosData : state.staticStoreGeoPos ;
      return state.reactiveOrigonPosData;
    },
    getCountryPositionData: function (state) {
      console.log('getCountryPositionData:',state.reactiveCountryPosData)
      return state.reactiveCountryPosData
    },
    getAllCountriesNames: function (state) {
      let countrieName;
      for (let _key in state.reactiveCountrieData.data) {
        state.reactiveCountrieData.data.countries.forEach(
             element => {
              // console.log(element)
              countrieName = Object.values(element)[2]
              state.allCountryInfoObj.push(countrieName)

          });
        return state.allCountryInfoObj;
      }
    },
    getAllCountriesApi: function (state) {
      if(state.reactiveCountrieData.data){
        return state.reactiveCountrieData.data;
      }
        
    },
  },
  //Actions are functions that can also be asynchronous which are used to update the state
  //For Mutating items within the store state, use actions
  actions: {
    async fetchcuisine(param:CuisineNameType) {
      const params = {
        apikey: import.meta.env.VITE_endpoint1apikey,
        cuisine: param,
      };
      const url = import.meta.env.VITE_endpoint1+params.apikey+'&cuisine='+params.cuisine;
      const options = {
        method: "GET",
      };
      this.reactviefoodTitles.length = 0;
      //fetching fetchFoodCategorie
      return (this.reactiveFoodCuising = await fetch(url, options)
        .then(function (response) {
         // console.log('api response: ',response.ok)
          return response.json();
        })
        .catch((error) => {
          //request failed
          console.log("error", error);
        }));
    },
    async fetchFoodOriginPosition(param:ReactiveCordsIntFace) {
      const params = {
        apikey: import.meta.env.VITE_endpoint2apikey,
        targetPos: param,
      };
      const url = `${import.meta.env.VITE_endpoint2}${params.apikey}&lat=${params.targetPos.coords.latitude}&lon=${params.targetPos.coords.longitude}`;
        const options = {
          method: "GET",
        };
      return (this.reactiveOrigonPosData = await fetch(url, options)
        .then(function (response) {
          return response.json();
        })
        .catch((error) => {
          //request failed
          console.log("error", error);
        }));
    },
    async fetchFoodOriginClickPos(param:ReactiveCordsIntFace) {
      const params = {
        apikey: import.meta.env.VITE_endpoint2apikey,
        targetPos: param,
      };
      const url =`${import.meta.env.VITE_endpoint2}${params.apikey}&lat=${params.targetPos.coords.latitude}&lon=${params.targetPos.coords.longitude}`;
        const options = {
          method: "GET",
        };
      this.reactiveClickedCatTitles.length = 0;
      return (this.reactiveClickedPosData = await fetch(url, options)
        .then(function (response) {
          return response.json();
        })
        .catch((error) => {
          //request failed
          console.log("error", error);
        }));
    },
    async fetchSearchCountryFood(param:SearchedCountryType) {
      const params = {
        apikey: import.meta.env.VITE_endpoint3apikey,
        targetParam: param,
      };
     const url = `${import.meta.env.VITE_endpoint3}${params.apikey}&query=${params.targetParam}`;
      const options = {
        method: "GET",
      };
      return (this.searchedCountryFoodData = await fetch(url, options)
        .then(function (response) {
          return response.json();
        })
        .catch((error) => {
          //request failed
          console.log("error", error);
        }));
    },
    async fetchDataClickPos(param:ReactiveCordsIntFace) {
      const params = {
        apikey: import.meta.env.VITE_endpoint4apikey,
        targetClickedPos: param,
      };
      console.log(param)
      const url = `${import.meta.env.VITE_endpoint4}${params.apikey}&typehead=false&lat=${params.targetClickedPos.coords.latitude}&lon=${params.targetClickedPos.coords.longitude}&radius=10000`; 
      const options = {
        method: "GET",
      };
      return (this.reactiveClickedPosCatData = await fetch(url, options)
        .then(function (response) {
          return response.json();
        })
        .catch((error) => {
          //request failed
          console.log("error", error);
        }));
    },
    async fetchDataCountries() {
      const url = `${import.meta.env.VITE_endpoint7}`;
      const options = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          query: `{
                      countries {
                        emoji
                        emojiU
                        name
                        code
                      }
                  }`,
        }),
      };
      return (this.reactiveCountrieData = await fetch(url, options)
        .then(function (response) {
          return response.json();
        })
        .catch((error) => {
          //request failed
          console.log("error", error);
        }));
    },
    async fetchPositionCountries(param:SearchedCountryType) {
      const params = {
        apikey: import.meta.env.VITE_endpoint6apikey,
        targetClickedPos: param,
      };
      const url = `${import.meta.env.VITE_endpoint6}${params.targetClickedPos}.json?limit=1&${params.apikey}`;
      const options = {
        method: "GET",
      };

      return (this.reactiveCountryPosData = await fetch(url, options)
        .then(function (response) {
          if (response.status === 200) {
            console.log("response.ok:", response.ok);
          }
          return response.json();
        })
        .catch((error) => {
          //request failed
          console.log("error", error);
        }));
    },
  },
});
