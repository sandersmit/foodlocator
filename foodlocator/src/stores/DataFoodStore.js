import { defineStore } from "pinia";

//as the name of the file 'FoodStore.js'
export const useFoodDataStore = defineStore('FoodDataStore', {

  //The state is defined as a function returning the initial state
    state: function () {
        return {
         //Static data
         reactiveCountryOrgins: [
         "Nederland",
         "Duitsland",
         "Frankrijk",
         "Spanje",
         "Italie"],
         reactiveIngredients: [
            "kool",
            "bieten",
            "varkensvlees",
            "rundvlees",
            "aardappelen"],
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
            "french"
        ],
         
         //reactiveDataSet
         allFilteredTitles:[],
         reactiveFoodCuising:[],
         reactviefoodTitles:[],
         reactiveFoodMenuDetails:[],
         titlesFoodMenu:[],
         reactiveAllApiMenuDetails:[],
         allMenuDetailsFromApi:[],
         categoriesFood:[],  
         reactviefoodOrigin:[],
         allFoodMenuData:[],
         reactiveFoodCategorieAllId:[],
         reactiveFoodAllIdsState:[],
         allTitlesGet:[],
         allFlattendFilteredTitles:[]
        };
      },
      //Getters are synchronous functions used to retrieve data from the state
    getters: {
      getFoodDataByCuisine:function(state){
        //return this.reactiveFoodCuising.results 
        for(var key in this.reactiveFoodCuising.results) {
          state.reactviefoodTitles.push(this.reactiveFoodCuising.results[key].title)
        }
        return state.reactviefoodTitles;
      },
      
      getAllApiFoodOrigins:function(state){
        //console.log("getAllApiFoodMenuTitles")
          for(var key in this.reactiveAllApiMenuDetails.meals) {
           state.reactviefoodOrigin.push(this.reactiveAllApiMenuDetails.meals[key].strArea)
         }
         return state.reactviefoodOrigin;
      },
    },
    //Actions are functions that can also be asynchronous which are used to update the state
    //For Mutating items within the store state, use actions
    actions:{
      async fetchcuisine(param){
        const params = {
          apikey: '8c12d249836f4974861f860603695b21',
          cuisine: param
      };
        const url = 'https://api.spoonacular.com/recipes/complexSearch?apiKey=8c12d249836f4974861f860603695b21&cuisine=Chinese';
        const options = {
            method: 'GET'
        };
      
        //fetching fetchFoodCategorie
        
        return this.reactiveFoodCuising = await fetch(url, options
          ).then(function (response) {
            console.log(response)
            return response.json();            
          }).catch(error => {
            //request failed
            console.log("error",error)
          });
       }
    }
  })
 
 