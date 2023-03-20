import React, { useState } from 'react'
import GoogleMapReact from 'google-map-react'
import MainPin from '../../assets/pin.png'
import PharmacyPin from '../../assets/pharnacy-pin.png'
import { GOOGLE_API_KEY } from '../../common/contants'
import { Box } from 'rebass'
import { Pharmacy } from '@/common/types'

const Marker: React.FC<any> = ({ opacity, onClick, isMain = true }) => {
  const pinSrc = isMain ? MainPin : PharmacyPin

  return (
    <div
      onClick={onClick}
      style={{
        textAlign: 'center',
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
        opacity,
      }}
    >
      <img style={{ width: '48px', height: '100%' }} src={pinSrc} />
    </div>
  )
}

export const Map: React.FC<{
  lat: number
  lng: number
  zoom?: number
  pharmacies?: Pharmacy[]
}> = ({ lat, lng, zoom = 18, pharmacies }) => {
  const [opacity, setOpacity] = useState(1)

  const renderPhamracies = () => {
    if (!pharmacies?.length) {
      return <React.Fragment />
    }

    return pharmacies.map((pharmacy) => (
      <Marker
        onClick={() => console.log('fired')}
        key={pharmacy.name}
        lat={pharmacy.lat}
        lng={pharmacy.lng}
        isMain={false}
      />
    ))
  }

  return (
    <Box flexGrow="1">
      <GoogleMapReact
        options={{
          minZoom: 15,
          maxZoom: 18,
        }}
        onDrag={() => setOpacity(0)}
        onDragEnd={() => setOpacity(1)}
        bootstrapURLKeys={{ key: GOOGLE_API_KEY }}
        defaultCenter={{ lat, lng }}
        defaultZoom={zoom}
      >
        <Marker
          style={{ opacity: opacity }}
          lat={lat}
          lng={lng}
          opacity={opacity}
        />
        {renderPhamracies()}
      </GoogleMapReact>
    </Box>
  )
}
