import { Pharmacy } from '@/common/types'
import GoogleMap from '@/components/GoogleMap/GoogleMap'
import { useState } from 'react'

interface PharmaciesMapProps {
  pharmacies: Pharmacy[]
  location: GeolocationPosition['coords']
}

export default function PharmaciesMap({
  pharmacies,
  location,
}: PharmaciesMapProps) {
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: location.latitude,
    lng: location.longitude,
  })

  const [zoom, setZoom] = useState<number>(15)

  const onIdle = (map: google.maps.Map) => {
    setZoom(map.getZoom()!)

    const nextCenter = map.getCenter()

    if (nextCenter) {
      setCenter(nextCenter.toJSON())
    }
  }

  return <GoogleMap />
}
