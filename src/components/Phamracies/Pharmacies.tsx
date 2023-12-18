import { useCallback, useEffect, useMemo, useState } from 'react'
import { Timestamp, collection, query, where } from 'firebase/firestore'
import { useFirestoreQueryData } from '@react-query-firebase/firestore'
import { Address, Pharmacy } from '@app/utils/types'
import { Card, GoogleMap, Loader } from '@app/components'
import { db, functions } from '@app/utils/firebase'
import { BottomSheet } from '../BottomSheet'
import { useQuery } from 'react-query'
import { httpsCallableFromURL } from 'firebase/functions'

interface PharmaciesMapProps {
  address: Address
  distance?: string
}

const fetchPharmaciesByAdress = async (address: Address) => {
  const res = await fetch(
    'http://127.0.0.1:5001/eczane-tracker/europe-west1/getPharmaciesByAddress',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(address),
    }
  )

  return res
}

export default function PharmaciesMap({ address }: PharmaciesMapProps) {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])

  useEffect(() => {
    fetchPharmaciesByAdress(address)
      .then((res) => res.json())
      .then((res) => {
        const pharmacies: Pharmacy[] = res.results
        setPharmacies(pharmacies)
      })
  }, [address.location.lat])

  return (
    <>
      <GoogleMap
        latLng={address.location}
        markers={pharmacies}
        onMarkerClick={() => {}}
      />
      {pharmacies.length && <BottomSheet pharmacies={pharmacies} />}
    </>
  )
}
