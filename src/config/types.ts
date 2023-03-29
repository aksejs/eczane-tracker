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
  fullAddress?: string
  district?: string
  placeId?: string
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

export const isLatLngLiteral = (obj: any): obj is google.maps.LatLngLiteral =>
  obj != null &&
  typeof obj === 'object' &&
  Number.isFinite(obj.lat) &&
  Number.isFinite(obj.lng)

export const isLatLngOrLatLngLiteral = (
  obj: any
): obj is google.maps.LatLng | google.maps.LatLngLiteral =>
  obj instanceof google.maps.LatLng || isLatLngLiteral(obj)
