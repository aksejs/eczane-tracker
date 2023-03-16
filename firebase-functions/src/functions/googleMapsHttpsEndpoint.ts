import functions from 'firebase-functions'
import express, { Request } from 'express'
import axios from 'axios'

require('dotenv').config()

const app = express()

app.get('/api/search', async (req: Request<{ term: string }>, res) => {
  try {
    const term = req.query.term
    const { data } = await axios.get<any>(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
      {
        params: {
          key: process.env.GOOGLE_API_KEY,
          input: term,
        },
      }
    )

    if (!data) {
      res.status(500)
    }

    res.status(200)
    res.send(data.predictions)
  } catch (e) {
    res.status(500)
  }
})

export default functions.https.onRequest(app)
