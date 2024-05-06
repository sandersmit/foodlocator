import { defineStore } from "pinia";

//as the name of the file 'FoodStore.js'
export const useFoodDataStore = defineStore("FoodDataStore", {
  //The state is defined as a function returning the initial state
  state: function () {
    return {
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
        // [ 52.35303643511911, 4.895095825195313, "1 Amsterdam"],
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
      reactiveFoodCuising: [],
      reactiveClickedPosData: [],
      reactiveClickedPosCatData: [],
      searchedCountryFoodData: [],
      reactivePositionData: [],
      reactiveOrigonPosData: [],
      reactiveCountryPosData:[],
      reactviefoodTitles: [],
      reactiveClickedCatTitles: [],
      reactiveFoodMenuDetails: [],
      reactiveAllApiMenuDetails: [],
      reactviefoodOrigin: [],
      reactiveCountrieData: [],
      allCountryNames: [],
    };
  },
  //Getters are synchronous functions used to retrieve data from the state
  getters: {
    getFoodDataByCuisine: function (state) {
      //return this.reactiveFoodCuising.results
      for (var key in this.reactiveFoodCuising.results) {
       
        state.reactviefoodTitles.push(
          this.reactiveFoodCuising.results[key].title
        );
      }
      return state.reactviefoodTitles;
    },
    getFoodPositionDataByClick: function (state) {
      return this.reactiveClickedPosData;
    },
    getSearchedCountryFood: function (state) {
      return this.searchedCountryFoodData
    },
    getFoodPositionCatDataByClick: function (state) {
      //loop over object with
      for (var key in this.reactiveClickedPosCatData.results) {
        //result
        Object.entries(this.reactiveClickedPosCatData.results[key]).forEach(
          ([key1, value]) => {
            if (key1 == "poi") {
              //push into new state array
              state.reactiveClickedCatTitles.push(value.name);
            }
          }
        );
      }
      return this.reactiveClickedCatTitles;
    },
    getFoodPositionDataByBanner: function (state) {
      return this.reactiveOrigonPosData;
    },
    getCountryPositionData: function (state) {
      for (var key in this.reactiveCountryPosData.results) {
        //result
        if (this.reactiveCountryPosData.results[key].position) {
          return this.reactiveCountryPosData.results[key].position
        } else {
          return {lat:"100",lon:"40"}
        }
      }
    },
    getAllApiFoodOrigins: function (state) {
      for (var key in this.reactiveAllApiMenuDetails.meals) {
        state.reactviefoodOrigin.push(
          this.reactiveAllApiMenuDetails.meals[key].strArea
        );
      }
      return state.reactviefoodOrigin;
    },
    getAllCoutriesApi: function (state) {
      for (var key in this.reactiveCountrieData.data) {
        this.reactiveCountrieData.data.countries.forEach(
             element => {
              state.allCountryNames.push(element.name)
          });
        return this.reactiveCountrieData.data.countries;
      }
    },
  },
  //Actions are functions that can also be asynchronous which are used to update the state
  //For Mutating items within the store state, use actions
  actions: {
    async fetchcuisine(param) {
      const params = {
        apikey: "8c12d249836f4974861f860603695b21",
        cuisine: param.currentLandOrigin,
      };
      const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=8c12d249836f4974861f860603695b21&cuisine=${params.cuisine}`;
      const options = {
        method: "GET",
      };
      this.reactviefoodTitles.length = 0;
      //fetching fetchFoodCategorie
      return (this.reactiveFoodCuising = await fetch(url, options)
        .then(function (response) {
          return response.json();
        })
        .catch((error) => {
          //request failed
          console.log("error", error);
        }));
    },
    async fetchFoodOriginPosition(param) {
      const params = {
        apikey: "seHQMRp1KfTieFzb/6GYbQ==AMJZg9DMN3iiYKZX",
        targetClickedPos: param,
      };
      const url = `https://api.api-ninjas.com/v1/reversegeocoding?X-Api-Key=${params.apikey}&lat=${params.targetClickedPos.coords.latitude}&lon=${params.targetClickedPos.coords.longitude}`;
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
    async fetchFoodOriginClickPos(param) {
      const params = {
        apikey: "seHQMRp1KfTieFzb/6GYbQ==AMJZg9DMN3iiYKZX",
        targetClickedPos: param,
      };
      const url = `https://api.api-ninjas.com/v1/reversegeocoding?X-Api-Key=${params.apikey}&lat=${params.targetClickedPos.coords.latitude}&lon=${params.targetClickedPos.coords.longitude}`;
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
        }));
    },
    async fetchSearchCountryFood(param) {
      const params = {
        apikey: "seHQMRp1KfTieFzb/6GYbQ==AMJZg9DMN3iiYKZX",
        targetParam: param,
      };
      const url = `https://api.api-ninjas.com/v1/recipe?X-Api-Key=${params.apikey}&query=${params.targetParam}`;
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
    async fetchDataClickPos(param) {
      const params = {
        apikey: "KjKDh5pZHHuL7YseZFcXsCXQt5PhPgGv",
        targetClickedPos: param,
      };
      const url = `https://api.tomtom.com/search/2/categorySearch/snacks.json?key=${params.apikey}&typehead=false&lat=${params.targetClickedPos.coords.latitude}&lon=${params.targetClickedPos.coords.longitude}&radius=10000`;
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
      const url = `https://countries.trevorblades.com/graphql`;
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
    async fetchPositionCountries(param) {
      const params = {
        apikey: "KjKDh5pZHHuL7YseZFcXsCXQt5PhPgGv",
        targetClickedPos: param,
      };
      const url = `https://api.tomtom.com/search/2/geocode/${params.targetClickedPos}.json?limit=1&key=${params.apikey}`;
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
