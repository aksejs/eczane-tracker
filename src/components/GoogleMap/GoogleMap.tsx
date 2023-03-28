import { Status, Wrapper } from '@googlemaps/react-wrapper'
import { useCallback, useMemo } from 'react'
import Map from '../Map'
import { Pharmacy } from '@/config/types'
import CustomMarker from '../CustomMarker/CustomMarker'
import GoogleMapsMarker from './GoogleMarker'
import DistanceMatrix from './DistanceMatrix'
import DistanceMatrixService from './DistanceMatrixService'

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
  setDistance: (distance: any) => void
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
  setDistance,
}: GoogleMapProps) {
  const filtered = useMemo(() => {
    return markers?.filter((m) => m.lat && m.lng)
  }, [markers])

  const some = highlightedPharmacy && {
    lat: +highlightedPharmacy.lat,
    lng: +highlightedPharmacy.lng,
  }

  return (
    <div className="flex h-screen">
      <Wrapper apiKey={apiKey} render={render}>
        {some && (
          <DistanceMatrixService
            options={{
              origins: [center],
              destinations: [some],
              travelMode: google.maps.TravelMode.WALKING,
            }}
            callback={(res) => {}}
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
          <GoogleMapsMarker />
          {filtered?.map((pharmacy) => (
            <CustomMarker
              key={pharmacy.name}
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
