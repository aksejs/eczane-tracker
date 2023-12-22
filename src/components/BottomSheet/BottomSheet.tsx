import { useMapContext } from '@app/store/MapContext'
import { Pharmacy } from '@app/utils/types'
import { useFirestoreQueryData } from '@react-query-firebase/firestore'
import React, { useRef, useState, FunctionComponent, useMemo } from 'react'
import { HiMapPin } from 'react-icons/hi2'
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet'
import { Item } from './BottomSheet.Input'

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
