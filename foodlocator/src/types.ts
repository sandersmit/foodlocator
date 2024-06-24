export interface ReactiveCordsIntFace {
   coords: {
        latitude: number
        longitude: number
    }
  }

  export interface ReactivePosIntFace
  {
         name: string,
         country: string,
         state: string
   }
  
  export interface LatlngClickIntFace {
    latlng:{
      lat:number
      lng:number
    }
  }

  export interface LatlngIntFace {
    results:[{
      position:{
            lat:number,
            lon:number
      }
    }]
  }

export interface CountrySearchType {
    emoji: string,
    name: string
}
export interface TitleType {
  title: string,
}

export interface ObjectResults {
  results:object
}

export interface ArrayResults {
  results:Array<object>
}

export interface ArrayObjects {
  results:Array<object>
}
export interface ObjDataCountries {
  data:{
    countries:Array<object>
  }
}
export interface ObjData {
  data:{
    countries:Array<object>
  }
}

export type CuisineNameType = string | null
export type SearchedCountryType = string | null 

