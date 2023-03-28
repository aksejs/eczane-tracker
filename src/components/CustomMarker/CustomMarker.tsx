import { useCallback, useMemo } from 'react'
import OverlayView from '../OverlayView'
import { motion } from 'framer-motion'
import { Pharmacy } from '@/config/types'

interface CustomMarkerProps {
  pharmacy: Pharmacy
  map?: google.maps.Map
  onClick: (payload: Pharmacy) => void
  highlight?: boolean
  distance?: any
}

export default function CustomMarker({
  pharmacy,
  map,
  onClick,
  highlight,
  distance,
}: CustomMarkerProps) {
  const handleClick = useCallback(() => {
    console.log('distance', distance)
    onClick(pharmacy)
  }, [onClick, pharmacy])

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
              className={`rounded-full bg-zinc-600 py-1.5 px-2 drop-shadow text-xs text-white ${
                highlight && 'text-black bg-zinc-50 font-bold py-2 px-2.5'
              }`}
              onClick={handleClick}
            >{`${pharmacy.name}`}</button>
          </motion.div>
        </OverlayView>
      )}
    </>
  )
}
