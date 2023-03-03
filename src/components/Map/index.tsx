import React from 'react'
import GoogleMapReact from 'google-map-react'
import { GOOGLE_API_KEY } from '../../utils/contants'

const AnyReactComponent: React.FC<any> = ({ text }) => <div>{text}</div>

export const Map: React.FC<{
  lat: number
  lng: number
  zoom?: number
}> = ({ lat, lng, zoom = 16 }) => {
  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '40vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: GOOGLE_API_KEY }}
        defaultCenter={{ lat, lng }}
        defaultZoom={zoom}
      >
        <AnyReactComponent lat={29.955413} lng={30.337844} text="My Marker" />
      </GoogleMapReact>
    </div>
  )
}
