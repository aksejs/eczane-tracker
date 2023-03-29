import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import _ from 'lodash'
import {
  Timestamp,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'
import { useHttpsCallable } from 'react-firebase-hooks/functions'

import { AddressContext } from '@/store/AddressContext'
import { Address, Pharmacy, Prediction } from '@/config/types'
import { app, db } from '@/config/firebase'
import { PharmaciesMap } from '@/features/PharmaciesMap'
import { useFirestoreQueryData } from '@react-query-firebase/firestore'
import { Card } from '@/components/Card'
import AddressField from '@/components/AddressField/AddressField'

function getStartOfToday() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const timestamp = Timestamp.fromDate(now)
  return timestamp // ex. 1631246400
}

const getPharmacies = async (address: Address) => {
  const pharmaciesQuery = query(
    collection(db, 'pharmacies'),
    where('district', '==', address?.district),
    where('timestamp', '==', getStartOfToday())
  )

  const querySnapshot = await getDocs(pharmaciesQuery)
  let pharmacies: any = []

  querySnapshot.forEach((doc) => {
    if (doc.data()) {
      pharmacies.push(doc.data())
    }
  })

  if (pharmacies.length) {
    return pharmacies
  }

  return null
}

const AddressInput: React.FC<{ defaultValue?: string }> = ({
  defaultValue,
}) => {
  const [predictions, setPredictions] = useState<Prediction[]>()
  const [value, setValue] = useState<string>(defaultValue || '')
  const [executeCallable, loading, error] = useHttpsCallable<any, Prediction[]>(
    getFunctions(app, 'europe-west1'),
    'searchAddressHttps'
  )

  const search = async (value: string) => {
    const resp = await executeCallable({ term: value })

    if (!resp) {
      return []
    }

    return resp.data
  }

  const debouncedSearch = React.useRef(
    _.debounce(async (criteria) => {
      setPredictions(await search(criteria))
    }, 1000)
  ).current

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    debouncedSearch(e.target.value)
  }

  const renderPredictions = () => {
    if (!predictions?.length || loading || error) {
      return <React.Fragment />
    }

    return (
      <div>
        {predictions.map((prediction) => (
          <div
            onClick={() => {
              setValue(prediction.description)
            }}
            key={prediction.place_id}
          >
            {prediction.description}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div>
        <div>
          <label htmlFor="address">Address</label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="Your address"
            onFocus={(e) => e.target.select()}
            value={value}
            onChange={handleChange}
          />
        </div>
        <button onClick={() => {}}>Find</button>
      </div>
      {renderPredictions()}
    </div>
  )
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

  const renderAddress = () => {
    if (!address) {
      return <div>Введите адрес вручную</div>
    }

    return (
      <div className="h-[5vh]">
        <AddressField />
      </div>
    )
  }

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
      <>
        {renderAddress()}
        {renderMap()}
      </>
    </div>
  )
}
