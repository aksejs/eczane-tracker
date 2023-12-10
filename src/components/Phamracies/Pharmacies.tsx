import { useCallback, useMemo, useState } from 'react'
import { Timestamp, collection, query, where } from 'firebase/firestore'
import { useFirestoreQueryData } from '@react-query-firebase/firestore'
import { Address, Pharmacy } from '@app/utils/types'
import { Card, GoogleMap, Loader } from '@app/components'
import { db } from '@app/utils/firebase'

function getStartOfToday(): Timestamp {
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  return Timestamp.fromDate(now)
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

  const firebaseQuery = useMemo(() => {
    return query<any>(
      collection(db, 'pharmacies'),
      where('district', '==', address?.district || 'Kadıköy'),
      where('timestamp', '==', getStartOfToday())
    )
  }, [address?.district])

  const extendedFirebaseQuery = useMemo(() => {
    return query<any>(
      collection(db, 'pharmacies'),
      where('timestamp', '==', getStartOfToday())
    )
  }, [])

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

  const [highlightedPharmacy, setHighlightedPharmacy] =
    useState<Pharmacy | null>(null)

  const onMarkerClick = useCallback((payload: Pharmacy) => {
    setHighlightedPharmacy((prev) => (prev?.id === payload.id ? null : payload))
  }, [])

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

  // if (filteredLoading || extendedLoading) {
  //   return <Loader>Loading map...</Loader>;
  // }

  // if (filteredError || extendedError) {
  //   return <div>Failed to load Pharmacies list</div>;
  // }

  return (
    <>
      <GoogleMap
        latLng={location}
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
