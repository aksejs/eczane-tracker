import { createCustomEqual, deepEqual } from 'fast-equals';
import { useEffect, useRef } from 'react';
import type { EffectCallback } from 'react';

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

// https://github.com/googlemaps/js-typescript-guards/blob/main/src/lat-lng.ts
// eslint-disable-next-line
const isLatLngLiteral = (obj: any): obj is google.maps.LatLngLiteral =>
  obj != null &&
  typeof obj === 'object' &&
  Number.isFinite(obj.lat) &&
  Number.isFinite(obj.lng);

const deepCompareEqualsForMaps = createCustomEqual(() => ({
  areObjectsEqual(a, b) {
    if (
      isLatLngLiteral(a) ||
      a instanceof google.maps.LatLng ||
      isLatLngLiteral(b) ||
      b instanceof google.maps.LatLng
    ) {
      return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
    }

    return deepEqual(a, b);
  },
}));
