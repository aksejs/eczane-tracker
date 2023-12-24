import { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Pharmacy } from '@app/utils/types';
import { OverlayView } from '../OverlayView';

interface CustomMarkerProps {
  pharmacy: Pharmacy;
  map?: google.maps.Map;
  onClick: (payload: Pharmacy) => void;
  highlight?: boolean;
}

export default function CustomMarker({
  pharmacy,
  map,
  onClick,
  highlight,
}: CustomMarkerProps) {
  const handleClick = useCallback(() => {
    onClick(pharmacy);
  }, [onClick, pharmacy]);

  const highLightedStyles = useMemo(
    () => (highlight
      ? 'text-black bg-zinc-50 font-bold py-2 px-2.5'
      : 'bg-zinc-600 py-1.5 px-2 text-white'),
    [highlight],
  );

  return (
    <>
      {map && (
        <OverlayView
          position={{
            lat: +pharmacy.lat as number,
            lng: +pharmacy.lng as number,
          }}
          map={map}
          zIndex={highlight ? 99 : 0}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: Math.random() * 0.3 } }}
            exit={{ opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 20,
            }}
          >
            <button
              type="button"
              className={`${highLightedStyles} rounded-full drop-shadow text-xs`}
              onClick={handleClick}
            >
              {`${pharmacy.name}`}
            </button>
          </motion.div>
        </OverlayView>
      )}
    </>
  );
}
