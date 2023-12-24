import React from 'react';
import { Combobox } from '@headlessui/react';
import { HiMapPin } from 'react-icons/hi2';
import type { Address } from '@app/utils/types';

export const Input: React.FC<{
  onFocus?: () => void;
  onBlur?: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef?: React.Ref<HTMLInputElement>;
}> = ({
  onChange, onBlur, onFocus, inputRef,
}) => (
  <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
    <Combobox.Input
      className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 focus-visible: outline-none"
      displayValue={(address: Address) => address.fullAddress || ''}
      ref={inputRef}
      autoCorrect="off"
      autoComplete="off"
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={onChange}
    />
    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
      <HiMapPin className="h-5 w-5 text-gray-500" aria-hidden="true" />
    </div>
  </div>
);
