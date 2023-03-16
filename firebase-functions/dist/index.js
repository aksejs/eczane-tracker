import admin from 'firebase-admin';
import parsePharmaciesFunction from './functions/parsePharmacies';
import googleMapsHttpsEndpointFunction from './functions/googleMapsHttpsEndpoint';
admin.initializeApp({ credential: admin.credential.applicationDefault() });
export const parsePharmacies = parsePharmaciesFunction;
export const googleMapsHttpsEndpoint = googleMapsHttpsEndpointFunction;
//# sourceMappingURL=index.js.map