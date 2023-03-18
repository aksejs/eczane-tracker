import * as functions from 'firebase-functions'
import axios from 'axios'

export default functions.region('europe-west1').https.onCall(async (data) => {
  const { lat, lng } = data

  const res = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
      functions.config().google.secret
    }`
  )

  return res.data.results
})
