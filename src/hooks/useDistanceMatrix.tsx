interface Location {
  lat: number
  lng: number
}

export function useDistanceMatrix({
  origin,
  destination,
}: {
  origin: Location
  destination?: Location
}) {
  const service = new google.maps.DistanceMatrixService()

  if (destination) {
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.WALKING,
        avoidHighways: true,
      },
      callback
    )
  }

  function callback(response: any) {
    console.log(response)
  }

  return null
}
