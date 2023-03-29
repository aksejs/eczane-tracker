import { GOOGLE_API_KEY } from '@app/config/contants'
import { Address, Pharmacy, isLatLngLiteral } from '@app/config/types'
import { Card, GoogleMap } from '@app/components'
import { useCallback, useContext, useEffect, useState } from 'react'
import { AddressContext } from '@app/store/AddressContext'
import { Timestamp, collection, query, where } from 'firebase/firestore'
import { useFirestoreQueryData } from '@react-query-firebase/firestore'
import { db } from '@app/config/firebase'

function getStartOfToday() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const timestamp = Timestamp.fromDate(now)
  return timestamp
}

interface PharmaciesMapProps {
  address?: Address
  location: google.maps.LatLngLiteral
  distance?: string
}

export function PharmaciesMap({
  location,
  address,
  distance,
}: PharmaciesMapProps) {
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(location)
  const [zoom, setZoom] = useState<number>(15)

  const ref = query<any>(
    collection(db, 'pharmacies'),
    where('district', '==', address?.district || 'Kadıköy'),
    where('timestamp', '==', getStartOfToday())
  )

  const { data, isLoading, isError } = useFirestoreQueryData<'id', Pharmacy>(
    ['pharmacies', { district: address?.district }],
    ref,
    { idField: 'id', subscribe: false },
    { enabled: Boolean(address?.district) }
  )

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

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Failed to Pharmacies list</div>
  }

  return (
    <>
      <GoogleMap
        apiKey={GOOGLE_API_KEY}
        center={center}
        zoom={zoom}
        markers={data}
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
