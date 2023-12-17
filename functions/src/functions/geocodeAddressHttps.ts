import * as functions from 'firebase-functions'
import axios from 'axios'
import { Client } from '@googlemaps/google-maps-services-js'

const googleAPI = new Client({})

export default functions.region('europe-west1').https.onCall(async (data) => {
  const { latlng, placeId } = data

  try {
    if (!latlng && !placeId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing arguments'
      )
    }

    const { data } = await googleAPI.geocode({
      params: {
        key: functions.config().google.secret,
        //@ts-ignore
        latlng,
        place_id: placeId,
      },
    })

    const cityObj = data.results[0].address_components.find((component) => {
      return component.types.some(
        (item) => item === 'administrative_area_level_1'
      )
    })
    const districtObj = data.results[0].address_components.find((component) => {
      return component.types.some(
        (item) => item === 'administrative_area_level_2'
      )
    })

    if (!data) {
      throw new functions.https.HttpsError('internal', 'Bad request')
    }

    return {
      fullAddress: data.results[0].formatted_address,
      city: cityObj?.short_name,
      district: districtObj?.short_name,
      location: data.results[0].geometry.location,
    }
  } catch (e) {
    throw new functions.https.HttpsError('internal', 'Bad request')
  }
})
