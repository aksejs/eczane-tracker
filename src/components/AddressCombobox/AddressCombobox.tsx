import { useState } from 'react'
import { motion } from 'framer-motion'
import { Combobox } from '@headlessui/react'
import _ from 'lodash'

import { Address, Prediction } from '@app/utils/types'

import { Input } from './AddressCombobox.Input'
import { Options } from './AddressCombobox.Options'

const AddressCombobox: React.FC<{
  onTermChange: (term: string) => void
  onSearch: (term: string) => void
  selected: Address | null
  onSelect: (address: Address) => void
  inputRef?: React.Ref<HTMLInputElement>
  term: string
  predictions?: Prediction[]
}> = ({
  onTermChange,
  onSelect,
  onSearch,
  selected,
  term,
  predictions,
  inputRef,
}) => {
  const [isBig, setIsBig] = useState(false)

  return (
    <div className="flex absolute z-20 max-w-full">
      <Combobox value={selected} onChange={onSelect}>
        {() => (
          <motion.div
            className="relative my-2 mx-4"
            animate={{
              width: isBig ? '100vw' : '70vw',
            }}
          >
            <Input
              onChange={(e) => {
                onTermChange(e.target.value)
                onSearch(e.target.value)
              }}
              onBlur={() => setIsBig(false)}
              onFocus={() => setIsBig(true)}
              inputRef={inputRef}
            />
            <Options
              afterLeave={() => onTermChange('')}
              query={term}
              predictions={predictions}
            />
          </motion.div>
        )}
      </Combobox>
    </div>
  )
}

export default AddressCombobox
