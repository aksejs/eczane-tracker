import React, { FunctionComponent, useContext, useEffect, useMemo, useState } from 'react'
import * as _ from 'lodash'

import { Button, Map } from '../../components'
import { AddressContext } from '../../utils/AddressContext'

import styles from './styles.module.css'
import { useQuery } from 'react-query'
import { GOOGLE_API_KEY } from '../../utils/contants'

const AddressInput: React.FC<any> = () => {
  const [value, setValue] = useState<string>('')
  const debouncedHandler = useMemo(() => {}, [])

  const handleChange = (value: string) => {}

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Enter an address manually"
    />
  )
}

export const MainPage: FunctionComponent = () => {
  const { address, location } = useContext(AddressContext)
  const [isManually, setIsManually] = useState(false)

  useEffect(() => {
    fetch(`/place-api?key=${GOOGLE_API_KEY}&input=kadikoy`).then(res => res.json())
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
        {isManually && <AddressInput />}
        {renderMap()}
      </>
    </div>
  )
}
