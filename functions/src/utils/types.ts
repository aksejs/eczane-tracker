export type Pharmacy = {
  district: string
  address: string
  tel: string
  lat: number
  lng: number
  name: string
  working_hours?: string
}

export type GetPharmaciesByAdressResponse = {
  results: Array<Pharmacy & { distance?: number }>
}

export type Address = {
  fullAddress: string
  district?: string
  placeId: string
  location: google.maps.LatLngLiteral
}

export const isCorrectAddress = (obj: any): obj is Address =>
  obj?.fullAddress !== undefined
