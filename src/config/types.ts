import { Timestamp } from 'firebase/firestore'

export interface Prediction {
  description: string
  place_id: string
  types?: Array<string>
  terms: Array<{
    offset: number
    value: string
  }>
}

export interface AutocompleteResponse {
  data: {
    predictions: Prediction[]
  }
}

export interface Address {
  fullAddress: string
  district: string
}

export interface Pharmacy {
  id: string
  address: string
  lat: string
  lng: string
  name: string
  working_hours: Timestamp
  district: string
}
