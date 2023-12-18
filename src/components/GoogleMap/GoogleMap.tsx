import { useEffect, useMemo } from 'react'
import { Status, Wrapper } from '@googlemaps/react-wrapper'

import { GOOGLE_API_KEY } from '@app/utils/contants'
import { Pharmacy, isLatLngLiteral } from '@app/utils/types'

import GoogleMapsMarker from './GoogleMarker'
import { Map } from '../Map'
import { Loader } from '../Loader'
import { CustomMarker } from '../CustomMarker'
import { useMapContext } from '@app/store/MapContext'

const render = (status: Status) => {
  if (status === Status.FAILURE) {
    return <p>failed</p>
  }

  return <Loader />
}

interface GoogleMapProps {
  onClick?: (e: google.maps.MapMouseEvent) => void
  onMarkerClick: (payload: Pharmacy) => void
  markers?: Pharmacy[]
  latLng: google.maps.LatLngLiteral
}

export default function GoogleMap({
  onClick,
  latLng,
  markers,
  onMarkerClick,
}: GoogleMapProps) {
  const { selectedId, center, handleSetCenter, zoom, handleSetZoom } =
    useMapContext()
  const filtered = useMemo(() => {
    return markers?.filter((m) => m.lat && m.lng)
  }, [markers])

  const onIdle = (map: google.maps.Map) => {
    handleSetZoom(map.getZoom()!)

    const nextCenter = map.getCenter()

    if (nextCenter) {
      handleSetCenter(nextCenter.toJSON())
    }
  }

  useEffect(() => {
    if (isLatLngLiteral(latLng)) {
      handleSetCenter(latLng)
    }
  }, [latLng])

  return (
    <div className="flex h-[94%] justify-center">
      <Wrapper apiKey={GOOGLE_API_KEY} render={render}>
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
          <GoogleMapsMarker key={latLng.lat} position={latLng} />
          {filtered?.map((pharmacy) => (
            <CustomMarker
              key={pharmacy.id}
              pharmacy={pharmacy}
              onClick={onMarkerClick}
              highlight={pharmacy.id == selectedId}
            />
          ))}
        </Map>
      </Wrapper>
    </div>
  )
}
