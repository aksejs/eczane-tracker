import { distance } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function DistanceMatrix({
  origin,
  destination,
  setDistance,
}: {
  origin: google.maps.LatLngLiteral
  destination: google.maps.LatLngLiteral | null
  setDistance: (distance: any) => void
}) {
  useEffect(() => {
    ;() => {
      console.log('unmount')
    }
  }, [])

  useEffect(() => {
    const service = new google.maps.DistanceMatrixService()

    function callback(response: google.maps.DistanceMatrixResponse | null) {
      if (response) {
        console.log(response.rows[0].elements[0].distance)
        setDistance(response.rows[0].elements[0].distance)
      }
    }
    if (destination) {
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.WALKING,
          avoidHighways: true,
        },
        callback
      )
    }
  }, [destination])

  return null
}
