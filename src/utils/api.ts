import { httpsCallable } from 'firebase/functions';

import { functions } from './firebase';
import { Address, ApiGeocodeResponse, Pharmacy } from './types';

const API_URL =
  'http://127.0.0.1:5001/eczane-tracker/europe-west1/getPharmaciesByAddress';

export const fetchPharmaciesByAddress = async (
  address: Address,
): Promise<Pharmacy[]> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(address),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data.results;
};

export async function searchAddress(term: string) {
  const searchAddressFn = httpsCallable<
    { term: string },
    google.maps.places.AutocompletePrediction[]
  >(functions, 'searchAddressHttps');
  try {
    const response = await searchAddressFn({ term });
    return response.data.map((prediction) => ({
      placeId: prediction.place_id,
      fullAddress: prediction.description,
      district: prediction.terms[3]?.value,
    }));
  } catch (error) {
    console.error('Error calling searchAddressHttps:', error);
    throw error;
  }
}

export async function geocodeAddress(
  params:
    | {
        placeId: string;
      }
    | { latlng: string },
) {
  const geocodeAddressFn = httpsCallable<
    { placeId: string } | { latlng: string },
    ApiGeocodeResponse
  >(functions, 'geocodeAddressHttps');
  try {
    const response = await geocodeAddressFn({ ...params });
    return response.data;
  } catch (error) {
    console.error('Error calling geocodeAddressHttps:', error);
    throw error;
  }
}
