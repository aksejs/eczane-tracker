import { GOOGLE_API_KEY } from '@/config/contants'
import { Pharmacy, isLatLngLiteral } from '@/config/types'
import GoogleMap from '@/components/GoogleMap/GoogleMap'
import { useCallback, useContext, useEffect, useState } from 'react'
import { AddressContext } from '@/store/AddressContext'
import { Card } from '@/components/Card'

interface PharmaciesMapProps {
  pharmacies: Pharmacy[]
  location: google.maps.LatLngLiteral
  distance?: string
}

export function PharmaciesMap({
  pharmacies,
  location,
  distance,
}: PharmaciesMapProps) {
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(location)
  const [zoom, setZoom] = useState<number>(15)

  const [highlightedPharmacy, sethighlightedPharmacy] =
    useState<Pharmacy | null>(null)

  const onMarkerClick = useCallback(
    (payload: Pharmacy) => {
      if (highlightedPharmacy && highlightedPharmacy.id === payload.id) {
        sethighlightedPharmacy(null)
      } else {
        sethighlightedPharmacy(payload)
      }
    },
    [highlightedPharmacy]
  )

  const onIdle = (map: google.maps.Map) => {
    setZoom(map.getZoom()!)

    const nextCenter = map.getCenter()

    if (nextCenter) {
      setCenter(nextCenter.toJSON())
    }
  }

  useEffect(() => {
    if (isLatLngLiteral(location)) {
      setCenter(location)
    }
  }, [location])

  const handleClick = useCallback(() => {
    if (highlightedPharmacy) {
      window.open(
        `https://maps.google.com/?daddr=${highlightedPharmacy.lat},${highlightedPharmacy.lng}`
      )
    }
  }, [highlightedPharmacy])

  return (
    <>
      <GoogleMap
        apiKey={GOOGLE_API_KEY}
        center={center}
        zoom={zoom}
        markers={pharmacies}
        onIdle={onIdle}
        onMarkerClick={onMarkerClick}
        highlightedPharmacy={highlightedPharmacy}
      />
      {highlightedPharmacy && (
        <Card
          name={highlightedPharmacy.name}
          distance={distance}
          stars={5}
          address={highlightedPharmacy.address}
          onClick={handleClick}
        />
      )}
    </>
  )
}
