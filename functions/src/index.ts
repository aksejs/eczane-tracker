import * as admin from 'firebase-admin'
admin.initializeApp()

// import parsePharmaciesFunction from './functions/parsePharmacies'
import googleMapsHttpsEndpointFunction from './functions/googleMapsHttpsEndpoint'
import searchAddressHttpsFunction from './functions/searchAddressHttps'

// export const parsePharmacies = parsePharmaciesFunction
export const googleMapsHttpsEndpoint = googleMapsHttpsEndpointFunction
export const searchAddressHttps = searchAddressHttpsFunction
