export interface Prediction {
  description: string
  place_id: string
  types?: Array<string>
}

export interface AutocompleteResponse {
  data: {
    predictions: Prediction[]
  }
}
