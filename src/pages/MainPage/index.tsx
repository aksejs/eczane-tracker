import React, { FunctionComponent, useContext } from 'react'

import { Button, Map } from '../../components'
import { AddressContext } from '../../utils/AddressContext'

import styles from './styles.module.css'

export const MainPage: FunctionComponent = () => {
  const { address, location } = useContext(AddressContext)

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
          <Button>Yes</Button>
          <Button>No, enter it manually</Button>
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
        {renderMap()}
      </>
    </div>
  )
}
