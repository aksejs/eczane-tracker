import { Pharmacy } from '@app/utils/types'
import React, { useRef, useState, FunctionComponent } from 'react'
import { HiMapPin } from 'react-icons/hi2'
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet'

import 'react-spring-bottom-sheet/dist/style.css'

const Item: FunctionComponent<{
  pharmacy: Pharmacy
  distance?: number
}> = ({ pharmacy, distance }) => {
  return (
    <div className="flex p-4">
      <div>
        <HiMapPin className="h-12 w-12 text-red-600" />
        <div>{distance}</div>
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
        {pharmacies.map((pharmacy) => (
          <Item
            key={pharmacy.address}
            pharmacy={pharmacy}
            distance={pharmacy.distance}
          />
        ))}
      </div>
    </BottomSheet>
  )
}
