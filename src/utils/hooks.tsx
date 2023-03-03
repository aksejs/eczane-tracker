import React, { useEffect, useState } from "react";

interface UseGeolocation {
  location?: GeolocationPosition;
  isDisabled: boolean;
}

export function useGeolocation(): UseGeolocation {
  const [location, setLocation] = useState<GeolocationPosition>();
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position);
      },
      () => setIsError(true)
    );
  }, []);

  return {
    location: location,
    isDisabled: isError,
  };
}
