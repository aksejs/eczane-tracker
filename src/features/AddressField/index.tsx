import React, { useEffect, useState } from 'react'
import Geocode from 'react-geocode'

import { Button } from '../../components'
import { useGeolocation } from '../../utils/hooks'

import styles from './styles.module.css'

export const AddressField: React.FC<any> = () => {
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

  return (
    <div className={styles.container}>
      <p className={styles.addressTitle}>
        Ваш адрес: <strong>~{address}</strong> ?
      </p>
      <div className={styles.buttonsWrapper}>
        <Button>Yes</Button>
        <Button>No, enter it manually</Button>
      </div>
    </div>
  )
}
