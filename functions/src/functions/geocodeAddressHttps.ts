import * as functions from 'firebase-functions'
import axios from 'axios'

export default functions
  .region('europe-west1')
  .https.onCall(async ({ lat, lng }) => {
    if (!lat || !lng) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing arguments'
      )
    }

    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?`,
      {
        params: {
          latlng: `${lat},${lng}`,
          key: functions.config().google.secret,
        },
      }
    )

    if (!data) {
      throw new functions.https.HttpsError('internal', 'Bad request')
    }

    return data.results
  })
