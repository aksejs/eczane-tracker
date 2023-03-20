import * as functions from 'firebase-functions'
import axios from 'axios'

export default functions.region('europe-west1').https.onCall(async (data) => {
  const { lat, lng } = data

  try {
    if (!lat || !lng) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing arguments'
      )
    }

    const { data } = await axios.get<any>(
      'https://maps.googleapis.com/maps/api/geocode/json',
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
  } catch (e) {
    throw new functions.https.HttpsError('internal', 'Bad request')
  }
})
