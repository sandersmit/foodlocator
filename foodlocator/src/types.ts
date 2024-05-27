export interface ReactiveCordsIntFace {
   coords: {
        latitude: number
        longitude: number
    }
  }

export interface CountrySearchType {
    emoji: string,
    name: string
}

export interface ObjectResults {
  results:object
}

export interface ArrayResults {
  results:Array<string>
}

export interface clickedTitle {
  name:string
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

export interface ObjName {
  value:{
    name:string
  }
}

export type CuisineNameType = string
export type SearchedCountryType = string | undefined 

