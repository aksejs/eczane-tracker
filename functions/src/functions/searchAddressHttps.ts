import * as functions from 'firebase-functions'
import axios from 'axios'

export default functions.region('europe-west1').https.onCall(async (data) => {
  const term = data.term
  try {
    const { data } = await axios.get<any>(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
      {
        params: {
          key: functions.config().google.secret,
          input: term,
        },
      }
    )

    if (!data) {
      throw new functions.https.HttpsError('internal', 'Bad request')
    }

    return data.predictions
  } catch (e) {
    throw new functions.https.HttpsError('internal', 'Bad request')
  }
})
