import { defineStore } from "pinia"; 

import type { ObjectResults, ObjDataCountries, ArrayResults, ObjName, CuisineNameType, ReactiveCordsIntFace, SearchedCountryType} from './../types';

//as the name of the file 'FoodStore.js'
export const useFoodDataStore = defineStore("FoodDataStore", {
  //The state is defined as a function returning the initial state
  state: function () {
    return {
      currentGeoPos: {
        coords: {
          latitude: 52.37031805385792,
          longitude: 4.890289306640626
        }
      },
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
        "african",
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
      valuePoi: {} as ObjName,
      reactiveFoodCuising: {} as ArrayResults,
      reactiveClickedPosData: [],
      reactiveClickedPosCatData: {} as ObjectResults,
      searchedCountryFoodData: [],
      reactivePositionData: [],
      reactiveOrigonPosData: [],
      reactiveCountryPosData:{} as ObjectResults,
      reactviefoodTitles:[] as string[],
      reactiveClickedCatTitles: [] as string[],
      reactiveFoodMenuDetails: [],
      reactviefoodOrigin: [],
      reactiveCountrieData: {} as ObjDataCountries,
      allCountryNames: [] as string[],
      allCountryInfoObj: [] as object[],
    };
   
  },
  //Getters are synchronous functions used to retrieve data from the state
  getters: {
    getFoodDataByCuisine: function (state) {
          for (let key in state.reactiveFoodCuising.results) {
          state.reactviefoodTitles.push(
            state.reactiveFoodCuising.results[key]
          );
        }
      return state.reactviefoodTitles;
    },
    getFoodPositionDataByClick: function (state) {
      return state.reactiveClickedPosData;
    },
    getSearchedCountryFood: function (state) {
      // console.log(state.searchedCountryFoodData.length)
      return state.searchedCountryFoodData
    },
    getFoodPositionCatDataByClick: function (state) {
      //loop over object with
      return state.reactiveClickedPosCatData.results
    },
    getFoodPositionDataByBanner: function (state) {
      //plaatsnaam returned
      console.log("state.reactiveOrigonPosData.lenght",state.reactiveOrigonPosData.length, 
      "state.reactiveOrigonPosData",state.reactiveOrigonPosData, 
      "state.currentGeoPos", state.currentGeoPos)
      return state.reactiveOrigonPosData.length>0 ? state.reactiveOrigonPosData : state.currentGeoPos ;
    },
    getCountryPositionData: function (state) {
      console.log('getCountryPositionData:',state.reactiveCountryPosData)
      return state.reactiveCountryPosData.results
    },
    getAllCountriesApi: function (state) {
      for (var key in this.reactiveCountrieData.data) {
        this.reactiveCountrieData.data.countries.forEach(
             element => {
              state.allCountryInfoObj.push(element)
          });
        return this.reactiveCountrieData.data.countries;
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
