import React, { Fragment } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { HiCheckCircle } from 'react-icons/hi2'

import type { Prediction } from '@app/utils/types'

export const Options: React.FC<{
  afterLeave: () => void
  predictions?: Prediction[]
  query: string
}> = ({ afterLeave, predictions, query }) => {
  return (
    <Transition
      as={Fragment}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      afterLeave={afterLeave}
    >
      <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm focus-visible: outline-none">
        {predictions?.length === 0 && query !== '' ? (
          <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
            Loading...
          </div>
        ) : (
          predictions?.map((prediction) => (
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
                      <HiCheckCircle className="h-5 w-5" aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              )}
            </Combobox.Option>
          ))
        )}
      </Combobox.Options>
    </Transition>
  )
}
