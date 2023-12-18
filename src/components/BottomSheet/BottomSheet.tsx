import { useMapContext } from '@app/store/MapContext'
import { Pharmacy } from '@app/utils/types'
import { useFirestoreQueryData } from '@react-query-firebase/firestore'
import React, { useRef, useState, FunctionComponent, useMemo } from 'react'
import { HiMapPin } from 'react-icons/hi2'
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet'

import 'react-spring-bottom-sheet/dist/style.css'

const distanceToKmString = (distance: number) => (distance / 1000).toFixed(1)

const Item: FunctionComponent<{
  pharmacy: Pharmacy
  distance?: number
}> = ({ pharmacy, distance }) => {
  const { handleSetSelectedId, handleSetCenter } = useMapContext()

  const handleSelectPlaceId = () => {
    handleSetSelectedId(pharmacy.id)
    handleSetCenter({
      lat: +pharmacy.lat,
      lng: +pharmacy.lng,
    })
  }

  const handleRedirectToGooglemaps = () => {
    window.open(
      `https://maps.google.com/?daddr=${pharmacy.lat},${pharmacy.lng}`
    )
  }

  return (
    <div className="flex p-4 cursor-pointer" onClick={handleSelectPlaceId}>
      <div onClick={handleRedirectToGooglemaps}>
        <HiMapPin className="h-12 w-12 text-red-600" />
        {distance && <div>{distanceToKmString(distance)} km</div>}
      </div>
      <div className="ml-4">
        <div className="text-small font-semibold">{pharmacy.name}</div>
        <div className="text-small font-medium">{pharmacy.address}</div>
        <div>
          <div>{pharmacy.district}</div>
          <div></div>
        </div>
      </div>
    </div>
  )
}

export default function BottomSheetComponent({
  pharmacies,
}: {
  pharmacies: Pharmacy[]
}) {
  const [isOpen, setIsOpen] = useState(true)
  const sortedPharmacies = useMemo(() => {
    return pharmacies.sort((a, b) => {
      const compA = a.distance ? a.distance : -1
      const compB = b.distance ? b.distance : -1

      return compA - compB
    })
  }, [pharmacies])

  return (
    //@ts-ignore
    <BottomSheet
      open={isOpen}
      onDismiss={() => setIsOpen(false)}
      blocking={false}
      header={
        <h1 className="flex items-center text-xl justify-center font-bold text-gray-800">
          Pharmacies
        </h1>
      }
      snapPoints={({ maxHeight }) => [maxHeight / 4, maxHeight * 0.6]}
    >
      <div className="flex flex-col divide-y">
        {sortedPharmacies.map((pharmacy) => (
          <Item
            key={pharmacy.id}
            pharmacy={pharmacy}
            distance={pharmacy.distance}
          />
        ))}
      </div>
    </BottomSheet>
  )
}
