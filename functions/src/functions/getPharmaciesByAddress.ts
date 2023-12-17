import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
const cors = require('cors')({ origin: true })
import { Client, UnitSystem } from '@googlemaps/google-maps-services-js'
import {
  Address,
  GetPharmaciesByAdressResponse,
  Pharmacy,
  isCorrectAddress,
} from '../utils/types'

const client = new Client({})

// Function to get pharmacies based on district
async function getPharmacies(address: Address) {
  const query = address.district
    ? admin
        .firestore()
        .collection('pharmacies')
        .where('district', '==', address.district)
        .get()
    : admin.firestore().collection('pharmacies').get()

  return (await query).docs.map((doc) => doc.data()) as Pharmacy[]
}

// Function to calculate distances
async function calculateDistances(address: Address, pharmacies: Pharmacy[]) {
  const distanceResponse = await client.distancematrix({
    params: {
      key: functions.config().google.secret,
      origins: [address.location],
      units: UnitSystem.metric,
      destinations: pharmacies.map((pharmacy) => ({
        lat: pharmacy.lat,
        lng: pharmacy.lng,
      })),
    },
  })

  return distanceResponse.data.rows[0].elements.map(
    (element) => element.distance.value
  )
}

export default functions.region('europe-west1').https.onRequest((req, res) => {
  cors(req, res, async () => {
    console.log('Request body:', req.body)
    const address: Address = req.body

    if (!isCorrectAddress(address)) {
      res.status(400).send('Invalid address format')
      return
    }

    try {
      const pharmacies = await getPharmacies(address)

      if (!pharmacies.length) {
        res.status(200).send({
          results: [],
          message: 'No pharmacies found',
        })
        return
      }

      if (address.district && address.location) {
        const distances = await calculateDistances(address, pharmacies)

        const results: GetPharmaciesByAdressResponse = {
          results: pharmacies.map((pharmacy, index) => ({
            ...pharmacy,
            distance: distances[index],
          })),
        }

        res.status(200).send(results)
      } else {
        res.status(200).send({ results: pharmacies })
      }
    } catch (error) {
      console.error('Error fetching pharmacies:', error)
      res.status(500).send('Error processing request')
    }
  })
})
