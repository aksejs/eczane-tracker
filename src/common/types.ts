import { Timestamp } from 'firebase/firestore'

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

export interface Pharmacy {
  lat: string
  lng: string
  name: string
  working_hours: Timestamp
}
