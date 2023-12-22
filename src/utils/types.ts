import { Timestamp } from 'firebase/firestore';

export interface Address {
  fullAddress: string;
  district?: string;
  placeId?: string;
  city?: string;
  location: google.maps.LatLngLiteral;
}

export interface Pharmacy {
  id: string;
  address: string;
  lat: string;
  lng: string;
  name: string;
  working_hours: Timestamp;
  district: string;
  distance?: number;
}

// eslint-disable-next-line
export const isLatLngLiteral = (obj: any): obj is google.maps.LatLngLiteral =>
  obj != null &&
  typeof obj === 'object' &&
  Number.isFinite(obj.lat) &&
  Number.isFinite(obj.lng);

export const isLatLngOrLatLngLiteral = (
  // eslint-disable-next-line
  obj: any
): obj is google.maps.LatLng | google.maps.LatLngLiteral =>
  obj instanceof google.maps.LatLng || isLatLngLiteral(obj);

export enum LanguageKind {
  EN = 'EN',
  TR = 'TR',
  RU = 'RU',
  UA = 'UA',
}

export type ApiGeocodeResponse = {
  fullAddress: string;
  city?: string;
  district?: string;
  location: google.maps.LatLngLiteral;
  placeId?: string;
};

export type Prediction = {
  fullAddress: string;
  placeId: string;
  district: string;
};
