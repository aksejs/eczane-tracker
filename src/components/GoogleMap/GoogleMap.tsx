import { Status, Wrapper } from '@googlemaps/react-wrapper'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import Map from '../Map'
import { Pharmacy } from '@app/config/types'
import CustomMarker from '../CustomMarker/CustomMarker'
import GoogleMapsMarker from './GoogleMarker'
import DistanceMatrix from './DistanceMatrix'
import DistanceMatrixService from './DistanceMatrixService'
import { AddressContext } from '@app/store/AddressContext'

const render = (status: Status) => {
  if (status === Status.FAILURE) {
    return <p>failed</p>
  }
  return <p>loading...</p>
}

interface GoogleMapProps {
  onIdle?: (map: google.maps.Map) => void
  onClick?: (e: google.maps.MapMouseEvent) => void
  onMarkerClick: (payload: Pharmacy) => void
  markers?: Pharmacy[]
  center: google.maps.LatLngLiteral
  zoom: number
  apiKey: string
  highlightedPharmacy: Pharmacy | null
}

export default function GoogleMap({
  apiKey,
  onClick,
  onIdle,
  zoom,
  center,
  markers,
  onMarkerClick,
  highlightedPharmacy,
}: GoogleMapProps) {
  const { setDistance, latLng } = useContext(AddressContext)
  const filtered = useMemo(() => {
    return markers?.filter((m) => m.lat && m.lng)
  }, [markers])

  const highlightedPharmacyLatLng = highlightedPharmacy && {
    lat: +highlightedPharmacy.lat,
    lng: +highlightedPharmacy.lng,
  }

  return (
    <div className="flex h-[95vh]">
      <Wrapper apiKey={apiKey} render={render}>
        {highlightedPharmacyLatLng && latLng && (
          <DistanceMatrixService
            options={{
              origins: [latLng],
              destinations: [highlightedPharmacyLatLng],
              travelMode: google.maps.TravelMode.WALKING,
            }}
            callback={(res) => {
              if (res) {
                setDistance(res?.rows[0].elements[0].distance)
              }
            }}
          />
        )}
        <Map
          className="grow h-screen"
          gestureHandling="greedy"
          center={center}
          zoom={zoom}
          minZoom={2}
          maxZoom={18}
          onIdle={onIdle}
          onClick={onClick}
          fullscreenControl={false}
          streetViewControl={false}
          mapTypeControl={false}
          zoomControl={false}
          clickableIcons={false}
        >
          <GoogleMapsMarker key={latLng?.lat} position={latLng} />
          {filtered?.map((pharmacy) => (
            <CustomMarker
              key={pharmacy.id}
              pharmacy={pharmacy}
              onClick={onMarkerClick}
              highlight={pharmacy.id === highlightedPharmacy?.id}
            />
          ))}
        </Map>
      </Wrapper>
    </div>
  )
}
