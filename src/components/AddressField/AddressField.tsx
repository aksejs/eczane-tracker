import { useRef, useState, useCallback } from 'react'
import { useQuery, useMutation } from 'react-query'
import { httpsCallable } from 'firebase/functions'
import { motion } from 'framer-motion'
import { Combobox } from '@headlessui/react'
import _ from 'lodash'

import { functions } from '@app/utils/firebase'
import {
  Address,
  ApiGeocodeResponse,
  Prediction,
  isLatLngLiteral,
} from '@app/utils/types'
import { useAddressContext } from '@app/store/AddressContext'

import { Input } from './AdressField.Input'
import { Options } from './AddressField.Options'
import { geocodeAddress, searchAddress } from '@app/utils/api'

export default function AddressField({
  defaultAddress,
}: {
  defaultAddress?: Address
}) {
  const { setAddress } = useAddressContext()
  const inputRef = useRef<any>()
  const [selected, setSelected] = useState<Address | null>(
    defaultAddress || null
  )
  const [isBig, setIsBig] = useState(false)
  const [query, setQuery] = useState('')

  const {
    data: predictions,
    refetch: refetchPredictions,
    isError,
  } = useQuery<Prediction[]>(
    ['searchAddress', query],
    () => searchAddress(query),
    {
      enabled: false,
      initialData: [],
    }
  )

  const debouncedSearch = useCallback(
    _.debounce((q) => refetchPredictions(), 1000),
    [refetchPredictions]
  )

  const getLatLngMutation = useMutation(
    ['getLatLng'],
    (placeId: string) => geocodeAddress({ placeId }),
    {
      onSuccess: (res, placeId) => {
        const literal = res.location
        if (isLatLngLiteral(literal)) {
          setAddress({
            fullAddress: res.fullAddress,
            district: res.district,
            placeId,
            location: literal,
          })
          inputRef.current?.blur()
        }
      },
    }
  )

  const handleSelect = (selectedValue: Address | null) => {
    setSelected(selectedValue)

    if (selectedValue?.placeId) {
      getLatLngMutation.mutate(selectedValue.placeId)
    }
  }

  return (
    <div className="flex items-center justify-start h-full">
      <div className="flex absolute z-20 max-w-full">
        <Combobox value={selected} onChange={handleSelect}>
          {() => (
            <motion.div
              className="relative my-2 mx-4"
              animate={{
                width: isBig ? '100vw' : '70vw',
              }}
            >
              <Input
                onChange={(event) => {
                  setQuery(event.target.value)
                  debouncedSearch(event.target.value)
                }}
                onBlur={() => setIsBig(false)}
                onFocus={() => setIsBig(true)}
                inputRef={inputRef}
              />
              <Options
                afterLeave={() => setQuery('')}
                query={query}
                predictions={predictions}
              />
            </motion.div>
          )}
        </Combobox>
      </div>
    </div>
  )
}
