import { GOOGLE_API_KEY } from '@/config/contants'
import { Pharmacy } from '@/config/types'
import GoogleMap from '@/components/GoogleMap/GoogleMap'
import { useState } from 'react'

interface PharmaciesMapProps {
  pharmacies: Pharmacy[]
  location: google.maps.LatLngLiteral
  onMarkerClick: (payload: Pharmacy) => void
  highlightedPharmacy: Pharmacy | null
  setDistance: (distance: any) => void
}

export function PharmaciesMap({
  pharmacies,
  location,
  onMarkerClick,
  highlightedPharmacy,
  setDistance,
}: PharmaciesMapProps) {
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(location)
  const [zoom, setZoom] = useState<number>(15)

  const onIdle = (map: google.maps.Map) => {
    setZoom(map.getZoom()!)

    const nextCenter = map.getCenter()

    if (nextCenter) {
      setCenter(nextCenter.toJSON())
    }
  }

  return (
    <GoogleMap
      apiKey={GOOGLE_API_KEY}
      center={center}
      zoom={zoom}
      markers={pharmacies}
      onIdle={onIdle}
      onMarkerClick={onMarkerClick}
      highlightedPharmacy={highlightedPharmacy}
      setDistance={setDistance}
    />
  )
}
