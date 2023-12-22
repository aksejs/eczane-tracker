import _ from 'lodash';

import React, { useCallback, useRef, useState } from 'react';

import { useMutation, useQuery } from 'react-query';

import { AddressCombobox } from '@app/components';
import { useAddressContext } from '@app/store/AddressContext';
import { geocodeAddress, searchAddress } from '@app/utils/api';
import { Address, Prediction, isLatLngLiteral } from '@app/utils/types';

export const SearchAddress: React.FC<{ defaultAddress: Address }> = ({
  defaultAddress,
}) => {
  const { setAddress } = useAddressContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<Address | null>(
    defaultAddress || null
  );
  const [query, setQuery] = useState('');

  const { data: predictions, refetch: refetchPredictions } = useQuery<
    Prediction[]
  >(['searchAddress', query], () => searchAddress(query), {
    enabled: false,
    initialData: [],
  });

  const debouncedSearch = useCallback(
    _.debounce(() => refetchPredictions(), 1000),
    [refetchPredictions]
  );

  const getLatLngMutation = useMutation(
    ['getLatLng'],
    (placeId: string) => geocodeAddress({ placeId }),
    {
      onSuccess: (res, placeId) => {
        const literal = res.location;
        if (isLatLngLiteral(literal)) {
          setAddress({
            fullAddress: res.fullAddress,
            district: res.district,
            placeId,
            location: literal,
          });
          inputRef.current?.blur();
        }
      },
    }
  );

  const handleSelect = (selectedValue: Address | null) => {
    setSelected(selectedValue);

    if (selectedValue?.placeId) {
      getLatLngMutation.mutate(selectedValue.placeId);
    }
  };

  return (
    <div className="flex items-center justify-start h-full">
      <AddressCombobox
        onTermChange={setQuery}
        onSearch={debouncedSearch}
        onSelect={handleSelect}
        term={query}
        selected={selected}
        predictions={predictions}
        inputRef={inputRef}
      />
    </div>
  );
};
