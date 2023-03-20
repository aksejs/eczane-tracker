import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import axios from 'axios'
import _ from 'lodash'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'
import { useHttpsCallable } from 'react-firebase-hooks/functions'

import { Map, PageContainer } from '@/components'
import { Box, Button, Flex } from 'rebass'
import { AddressContext } from '@/common/AddressContext'
import { Address, Pharmacy, Prediction } from '@/common/types'
import { app, db } from '@/common/firebase'
import { Input, Label } from '@rebass/forms'

const getPharmacies = async (address: Address) => {
  const pharmaciesQuery = query(
    collection(db, 'pharmacies'),
    where('district', '==', address?.district)
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
            onClick={() => setValue(prediction.description)}
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
      <Flex flexDirection="column" justifyContent="center">
        <Box p={3} width={1}>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            type="text"
            placeholder="Your address"
            onFocus={(e) => e.target.select()}
            value={value}
            onChange={handleChange}
          />
        </Box>
        <Button m={2}>Find</Button>
      </Flex>
      {renderPredictions()}
    </div>
  )
}

export const MainPage: FunctionComponent = () => {
  const { address, location } = useContext(AddressContext)
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>()

  useEffect(() => {
    if (address?.district) {
      getPharmacies(address).then((res: Pharmacy[]) => {
        setPharmacies(res)
      })
    }
  }, [address])

  const renderAddress = () => {
    if (!address) {
      return <div>Введите адрес вручную</div>
    }

    return (
      <div>
        <AddressInput defaultValue={address.fullAddress} />
      </div>
    )
  }

  const renderMap = () => {
    if (!location) {
      return React.Fragment
    }

    return (
      <Map
        lat={location.latitude}
        lng={location.longitude}
        pharmacies={pharmacies}
      />
    )
  }

  return (
    <PageContainer>
      <>
        {renderAddress()}
        {renderMap()}
      </>
    </PageContainer>
  )
}
