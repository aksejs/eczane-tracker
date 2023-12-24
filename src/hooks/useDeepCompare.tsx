import { createCustomEqual, deepEqual } from 'fast-equals';
import { useEffect, useRef } from 'react';
import { isLatLngLiteral } from '@app/utils/types';
import type { EffectCallback } from 'react';

const deepCompareEqualsForMaps = createCustomEqual(() => ({
  areObjectsEqual(a, b) {
    if (
      isLatLngLiteral(a)
      || a instanceof google.maps.LatLng
      || isLatLngLiteral(b)
      || b instanceof google.maps.LatLng
    ) {
      return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
    }

    return deepEqual(a, b);
  },
}));

export function useDeepCompareEffectForMaps(
  callback: EffectCallback,
  // eslint-disable-next-line
  dependencies: any[]
) {
  // eslint-disable-next-line
  useEffect(callback, dependencies.map(useDeepCompareMemorize))
}

// eslint-disable-next-line
function useDeepCompareMemorize(value: any) {
  const ref = useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}
