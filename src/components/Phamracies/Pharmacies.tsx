import { GOOGLE_API_KEY } from '@app/utils/contants'
import { Address, Pharmacy, isLatLngLiteral } from '@app/utils/types'
import { Card, GoogleMap } from '@app/components'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { AddressContext } from '@app/store/AddressContext'
import { Timestamp, collection, query, where } from 'firebase/firestore'
import { useFirestoreQueryData } from '@react-query-firebase/firestore'
import { db } from '@app/utils/firebase'

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

export default function PharmaciesMap({
  location,
  address,
  distance,
}: PharmaciesMapProps) {
  const [isExtendedQuery, setExtendedQuery] = useState(false)

  const firebaseQuery = query<any>(
    collection(db, 'pharmacies'),
    where('district', '==', address?.district || 'Kadıköy'),
    where('timestamp', '==', getStartOfToday())
  )

  const extendedFirebaseQuery = query<any>(
    collection(db, 'pharmacies'),
    where('timestamp', '==', getStartOfToday())
  )

  const {
    data: filteredPharmacies,
    isLoading: filteredLoading,
    isError: filteredError,
  } = useFirestoreQueryData<'id', Pharmacy>(
    ['pharmacies', { district: address?.district }],
    firebaseQuery,
    { idField: 'id', subscribe: false },
    {
      enabled: Boolean(address?.district) && !isExtendedQuery,
      onError: () => {
        setExtendedQuery(true)
      },
      onSuccess: (data) => {
        if (!data.length) {
          setExtendedQuery(true)
        }
      },
    }
  )

  const {
    data: extendedPharmacies,
    isLoading: extendedLoading,
    isError: extendedError,
  } = useFirestoreQueryData<'id', Pharmacy>(
    'pharmacies',
    extendedFirebaseQuery,
    {
      idField: 'id',
      subscribe: false,
    },
    {
      enabled: isExtendedQuery,
    }
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

  const pharmacies = useMemo(
    () =>
      filteredPharmacies?.length ? filteredPharmacies : extendedPharmacies,
    [filteredPharmacies, extendedPharmacies]
  )

  const handleClick = useCallback(() => {
    if (highlightedPharmacy) {
      window.open(
        `https://maps.google.com/?daddr=${highlightedPharmacy.lat},${highlightedPharmacy.lng}`
      )
    }
  }, [highlightedPharmacy])

  if (filteredLoading || extendedLoading) {
    return <div>Loading...</div>
  }

  if (filteredError || extendedError) {
    return <div>Failed to load Pharmacies list</div>
  }

  return (
    <>
      <GoogleMap
        latLng={location}
        apiKey={GOOGLE_API_KEY}
        markers={pharmacies}
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
