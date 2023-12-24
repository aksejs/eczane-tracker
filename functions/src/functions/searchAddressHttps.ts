import * as functions from 'firebase-functions'
import { Client } from '@googlemaps/google-maps-services-js'

const googleAPI = new Client({})

export default functions.region('europe-west1').https.onCall(async (data) => {
  const term = data.term
  try {
    const res = await googleAPI.placeAutocomplete({
      params: {
        key: functions.config().google.secret,
        input: term,
      },
    })

    if (!res.data) {
      throw new functions.https.HttpsError('internal', 'Bad request')
    }

    return res.data.predictions
  } catch (e) {
    throw new functions.https.HttpsError('internal', 'Bad request')
  }
})
