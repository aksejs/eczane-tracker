import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import axios from 'axios'
import * as _ from 'lodash'

import { Button, Map } from '@/components'
import { AddressContext } from '../../common/AddressContext'

import styles from './styles.module.css'
import { GOOGLE_API_KEY } from '../../common/contants'
import { Prediction } from '@/common/types'

const AddressInput: React.FC<{ defaultValue?: string }> = ({
  defaultValue,
}) => {
  const [predictions, setPredictions] = useState<Prediction[]>()
  const [value, setValue] = useState<string>(defaultValue || '')

  const search = async (value: string) => {
    const {
      data: { predictions },
    } = await axios.get('/place-api', {
      params: {
        key: GOOGLE_API_KEY,
        input: value,
      },
    })

    return predictions
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
    if (!predictions?.length) {
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
    <div className={styles.addressFieldContainer}>
      <div className={styles.formGroup} id="address-mini-form">
        <div className={styles.addressField}>
          <label>Your Address</label>
          <input
            onFocus={(e) => e.target.select()}
            value={value}
            onChange={handleChange}
            type="text"
            className={styles.addressInput}
          />
        </div>
        <Button>Find</Button>
      </div>
      {renderPredictions()}
    </div>
  )
}

export const MainPage: FunctionComponent = () => {
  const { address, location } = useContext(AddressContext)
  const [isManually, setIsManually] = useState(false)

  useEffect(() => {
    fetch(`/place-api?key=${GOOGLE_API_KEY}&input=kadikoy`).then((res) =>
      res.json()
    )
  }, [])

  const renderAddress = () => {
    if (!address) {
      return <div>Введите адрес вручную</div>
    }

    return (
      <div className={styles.container}>
        <p className={styles.addressTitle}>
          Is it your address: <strong>{address}</strong> ?
        </p>
        <div className={styles.buttonsWrapper}>
          <Button onClick={() => setIsManually(false)}>Yes</Button>
          <Button onClick={() => setIsManually(true)}>
            No, enter it manually
          </Button>
        </div>
      </div>
    )
  }

  const renderMap = () => {
    if (!location) {
      return React.Fragment
    }

    return <Map lat={location.lat} lng={location.lng} />
  }

  return (
    <div className="App">
      <>
        {renderAddress()}
        <AddressInput defaultValue={address} />
        {renderMap()}
      </>
    </div>
  )
}
