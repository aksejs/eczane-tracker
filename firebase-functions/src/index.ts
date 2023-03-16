import admin from 'firebase-admin'

import parsePharmaciesFunction from './functions/parsePharmacies'

admin.initializeApp({ credential: admin.credential.applicationDefault() })

export const parsePharmacies = parsePharmaciesFunction
