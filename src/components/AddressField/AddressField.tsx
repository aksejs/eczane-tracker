import { Fragment, useContext, useRef, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { HiMapPin, HiCheckCircle } from 'react-icons/hi2'
import { useHttpsCallable } from 'react-firebase-hooks/functions'
import { functions } from '@app/utils/firebase'
import { isLatLngLiteral } from '@app/utils/types'
import _ from 'lodash'
import { AddressContext } from '@app/store/AddressContext'

interface Address {
  placeId?: string
  fullAddress?: string
  district?: string
}

export default function AddressField({
  defaultAddress,
}: {
  defaultAddress?: Address
}) {
  const [predictions, setPredictions] = useState<Address[]>([])
  const [executeSearchAddress, loading, error] = useHttpsCallable<
    { term: string },
    google.maps.places.AutocompletePrediction[]
  >(functions, 'searchAddressHttps')
  const inputRef = useRef<any>()
  const [executeGetLatLng] = useHttpsCallable<any, any>(
    functions,
    'geocodePlaceIdHttps'
  )

  const { setAddress, setLatLng } = useContext(AddressContext)
  const [selected, setSelected] = useState<Address | null>(
    defaultAddress || null
  )
  const [query, setQuery] = useState('')

  const search = async (value: string) => {
    const resp = await executeSearchAddress({ term: value })

    if (!resp) {
      return []
    }

    return resp.data
  }

  const debouncedSearch = useRef(
    _.debounce(async (criteria) => {
      const predictions = await search(criteria)

      setPredictions(
        predictions.map((prediction) => ({
          placeId: prediction.place_id,
          fullAddress: prediction.description,
          district: prediction.terms[3].value,
        }))
      )
    }, 1000)
  ).current

  const handleSelect = async (selectedValue: Address | null) => {
    setSelected(selectedValue)

    if (selectedValue?.placeId) {
      const res = await executeGetLatLng({ placeId: selectedValue.placeId })
      const literal = res?.data[0].geometry.location

      if (isLatLngLiteral(literal)) {
        setAddress({
          fullAddress: selectedValue?.fullAddress,
          district: selectedValue?.district,
        })
        setLatLng(literal)
      }

      inputRef.current?.blur()
    }
  }

  return (
    <div className="h-[6%] flex items-center justify-end">
      <div className="flex absolute z-10">
        <Combobox value={selected} onChange={handleSelect}>
          <div className="relative my-2 mr-4 w-[50vw]">
            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
              <Combobox.Input
                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                displayValue={(address: Address) => address.fullAddress || ''}
                ref={inputRef}
                onFocus={(event) => {
                  event.target.select()
                }}
                onChange={(event) => {
                  setQuery(event.target.value)
                  debouncedSearch(event.target.value)
                }}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <HiMapPin
                  className="h-5 w-5 text-gray-500"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery('')}
            >
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {predictions.length === 0 && query !== '' ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Loading...
                  </div>
                ) : (
                  predictions.map((prediction) => (
                    <Combobox.Option
                      key={prediction.placeId}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-teal-600 text-white' : 'text-gray-900'
                        }`
                      }
                      value={prediction}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {prediction.fullAddress}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-white' : 'text-teal-600'
                              }`}
                            >
                              <HiCheckCircle
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>
    </div>
  )
}
