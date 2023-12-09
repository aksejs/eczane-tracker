import * as admin from 'firebase-admin'
import serviceAccount from '../service-account-credentials.json'

//@ts-ignore
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

import parsePharmaciesFunction from './functions/parsePharmacies'
import searchAddressHttpsFunction from './functions/searchAddressHttps'
import geocodeAddressHttpsFunction from './functions/geocodeAddressHttps'
import geocodePlaceIdHttpsFunction from './functions/geocodePlaceIdHttps'
import deletePharmaciesScheduleFunction from './functions/deletePharmaciesSchedule'

export const parsePharmacies = parsePharmaciesFunction
export const searchAddressHttps = searchAddressHttpsFunction
export const geocodeAddressHttps = geocodeAddressHttpsFunction
export const geocodePlaceIdHttps = geocodePlaceIdHttpsFunction
export const deletePharmaciesSchedule = deletePharmaciesScheduleFunction
