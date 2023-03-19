import * as admin from 'firebase-admin'
admin.initializeApp()

// import parsePharmaciesFunction from './functions/parsePharmacies'
import searchAddressHttpsFunction from './functions/searchAddressHttps'
import geocodeAddressHttpsFunction from './functions/geocodeAddressHttps'
import googleApiEndpointHttpsFunction from './functions/googleApiEndpointHttps'

// export const parsePharmacies = parsePharmaciesFunction
export const searchAddressHttps = searchAddressHttpsFunction
export const geocodeAddressHttps = geocodeAddressHttpsFunction
export const googleApiEndpointHttps = googleApiEndpointHttpsFunction
