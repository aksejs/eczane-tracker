import { Fragment, useEffect, useRef, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { HiChevronUpDown, HiCheckCircle } from 'react-icons/hi2'
import { useHttpsCallable } from 'react-firebase-hooks/functions'
import { functions } from '@/config/firebase'
import { Prediction } from '@/config/types'
import _ from 'lodash'

const people: Array<{ id: number; name: string }> = [
  { id: 1, name: 'Wade Cooper' },
  { id: 2, name: 'Arlene Mccoy' },
  { id: 3, name: 'Devon Webb' },
  { id: 4, name: 'Tom Cook' },
  { id: 5, name: 'Tanya Fox' },
  { id: 6, name: 'Hellen Schmidt' },
]

export default function AddressField({
  defaultValue,
}: {
  defaultValue?: string
}) {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [executeCallable, loading, error] = useHttpsCallable<any, Prediction[]>(
    functions,
    'searchAddressHttps'
  )
  const [selected, setSelected] = useState(defaultValue)
  const [query, setQuery] = useState('')

  const search = async (value: string) => {
    const resp = await executeCallable({ term: value })

    if (!resp) {
      return []
    }

    return resp.data
  }

  const debouncedSearch = useRef(
    _.debounce(async (criteria) => {
      setPredictions(await search(criteria))
    }, 1000)
  ).current

  return (
    <div className="h-[5vh]">
      <div className="flex absolute z-10">
        <Combobox
          value={selected}
          onChange={(selectedValue) => {
            setSelected(selectedValue)
          }}
        >
          <div className="relative m-1 w-96">
            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
              <Combobox.Input
                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                displayValue={(prediction: Prediction) =>
                  prediction.description
                }
                onChange={(event) => {
                  setQuery(event.target.value)
                  debouncedSearch(event.target.value)
                }}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <HiChevronUpDown
                  className="h-5 w-5 text-gray-400"
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
                      key={prediction.place_id}
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
                            {prediction.description}
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
