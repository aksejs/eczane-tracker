import admin from 'firebase-admin'
// import parsePharmaciesFunction from './functions/parsePharmacies'
import googleMapsHttpsEndpointFunction from './functions/googleMapsHttpsEndpoint'

admin.initializeApp()

// export const parsePharmacies = parsePharmaciesFunction
export const googleMapsHttpsEndpoint = googleMapsHttpsEndpointFunction
