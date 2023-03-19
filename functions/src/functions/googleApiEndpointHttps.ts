import * as functions from 'firebase-functions'
import express from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()

app.use(cors({ origin: true }))

app.get('/searchAddress', async (req: any, res) => {
  const { term } = req.query

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
      res.status(500)
    }

    res.status(200).send(data.predictions)
  } catch (e) {
    res.status(500)
  }
})

app.get('/geocodeAddress', async (req: any, res) => {
  const { lat, lng } = req.query
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

  res.send(data.results)
})

export default functions.region('europe-west1').https.onRequest(app)
