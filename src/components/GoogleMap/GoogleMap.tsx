import { Status, Wrapper } from '@googlemaps/react-wrapper'
import { GOOGLE_API_KEY } from '@app/utils/contants'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Map } from '../Map'
import { Pharmacy, isLatLngLiteral } from '@app/utils/types'
import CustomMarker from '../CustomMarker/CustomMarker'
import GoogleMapsMarker from './GoogleMarker'
// import DistanceMatrix from './DistanceMatrix'
import DistanceMatrixService from './DistanceMatrixService'
import { AddressContext } from '@app/store/AddressContext'

const render = (status: Status) => {
  if (status === Status.FAILURE) {
    return <p>failed</p>
  }
  return <p>loading...</p>
}

interface GoogleMapProps {
  onClick?: (e: google.maps.MapMouseEvent) => void
  onMarkerClick: (payload: Pharmacy) => void
  markers?: Pharmacy[]
  highlightedPharmacy: Pharmacy | null
  latLng: google.maps.LatLngLiteral
}

export default function GoogleMap({
  onClick,
  latLng,
  markers,
  onMarkerClick,
  highlightedPharmacy,
}: GoogleMapProps) {
  const { setDistance } = useContext(AddressContext)
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(latLng)
  const [zoom, setZoom] = useState<number>(15)
  const filtered = useMemo(() => {
    return markers?.filter((m) => m.lat && m.lng)
  }, [markers])

  const highlightedPharmacyLatLng = highlightedPharmacy && {
    lat: +highlightedPharmacy.lat,
    lng: +highlightedPharmacy.lng,
  }

  const onIdle = (map: google.maps.Map) => {
    setZoom(map.getZoom()!)

    const nextCenter = map.getCenter()

    if (nextCenter) {
      setCenter(nextCenter.toJSON())
    }
  }

  useEffect(() => {
    if (isLatLngLiteral(latLng)) {
      setCenter(latLng)
    }
  }, [latLng])

  return (
    <div className="flex h-[94%]">
      <Wrapper apiKey={GOOGLE_API_KEY} render={render}>
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
