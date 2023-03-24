import { Status, Wrapper } from '@googlemaps/react-wrapper'
import { useMemo } from 'react'
import Map from '../NewMap'
import { Pharmacy } from '@/common/types'
import CustomMarker from '../CustomMarker/CustomMarker'

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
  highlightedMarkerId?: string
}

export default function GoogleMap({
  apiKey,
  onClick,
  onIdle,
  zoom,
  center,
  markers,
  onMarkerClick,
  highlightedMarkerId,
}: GoogleMapProps) {
  const filtered = useMemo(() => {
    return markers?.filter((m) => m.lat && m.lng)
  }, [markers])

  return (
    <div className="flex h-full">
      <Wrapper apiKey={apiKey} render={render}>
        <Map
          className="grow h-full"
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
          {filtered?.map((pharmacy) => (
            <CustomMarker
              key={pharmacy.name}
              pharmacy={pharmacy}
              onClick={onMarkerClick}
              highlight={pharmacy.name === highlightedMarkerId}
            />
          ))}
        </Map>
      </Wrapper>
    </div>
  )
}
