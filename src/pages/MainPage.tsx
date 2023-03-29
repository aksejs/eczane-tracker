import { FunctionComponent, useContext } from 'react'
import _ from 'lodash'
import { Timestamp, collection, query, where } from 'firebase/firestore'
import { useFirestoreQueryData } from '@react-query-firebase/firestore'

import { AddressContext } from '@/store/AddressContext'
import { Pharmacy } from '@/config/types'
import { db } from '@/config/firebase'
import { PharmaciesMap } from '@/features/PharmaciesMap'
import AddressField from '@/components/AddressField/AddressField'

function getStartOfToday() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const timestamp = Timestamp.fromDate(now)
  return timestamp // ex. 1631246400
}

export const MainPage: FunctionComponent = () => {
  const { address, district, latLng, distance } = useContext(AddressContext)
  const ref = query<any>(
    collection(db, 'pharmacies'),
    where('district', '==', 'Kadıköy'),
    where('timestamp', '==', getStartOfToday())
  )

  const { data } = useFirestoreQueryData<'id', Pharmacy>(
    ['pharmacies', { district }],
    ref,
    { idField: 'id' },
    { enabled: Boolean(district) }
  )

  const renderMap = () => {
    if (!latLng) {
      return <div>Please pick location</div>
    }

    if (!data) {
      return <div>Loading...</div>
    }

    return (
      <PharmaciesMap pharmacies={data} location={latLng} distance={distance} />
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 h-screen dark:text-zinc-300">
      {address && <AddressField defaultValue={address} />}
      {renderMap()}
    </div>
  )
}
