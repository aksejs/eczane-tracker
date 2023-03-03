import React, { FunctionComponent, useEffect, useState } from 'react'
import Geocode from 'react-geocode'

import { Button, Map } from '../../components'
import { useGeolocation } from '../../utils/hooks'

import styles from './styles.module.css'

export const MainPage: FunctionComponent = () => {
  const [address, setAddress] = useState()
  const { location } = useGeolocation()

  useEffect(() => {
    if (location) {
      Geocode.fromLatLng(
        location.coords.latitude.toString(),
        location.coords.longitude.toString()
      ).then(
        (response) => {
          const address = response.results[0].formatted_address
          setAddress(address)
        },
        (error) => {
          console.error(error)
        }
      )
    }
  }, [location])

  const renderAddress = () => {
    if (!address) {
      return <div>Введите адрес вручную</div>
    }

    return (
      <div className={styles.container}>
        <p className={styles.addressTitle}>
          Your address is: <strong>~{address}</strong> ?
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

    return (
      <Map lat={location.coords.latitude} lng={location.coords.longitude} />
    )
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
