import { HiMapPin } from 'react-icons/hi2';
import { useMapContext } from '@app/store/MapContext';
import { Pharmacy } from '@app/utils/types';

const distanceToKmString = (distance: number) => (distance / 1000).toFixed(1);

export const Item: React.FC<{
  pharmacy: Pharmacy;
  distance?: number;
}> = ({ pharmacy, distance }) => {
  const { handleSetSelectedId, handleSetCenter } = useMapContext();

  const handleSelectPlaceId = () => {
    handleSetSelectedId(pharmacy.id);
    handleSetCenter({
      lat: +pharmacy.lat,
      lng: +pharmacy.lng,
    });
  };

  const handleRedirectToGooglemaps = () => {
    window.open(
      `https://maps.google.com/?daddr=${pharmacy.lat},${pharmacy.lng}`,
    );
  };

  return (
    <div className="flex p-4 cursor-pointer" onClick={handleSelectPlaceId}>
      <div onClick={handleRedirectToGooglemaps}>
        <HiMapPin className="h-12 w-12 text-red-600" />
        {distance && (
        <div>
          {distanceToKmString(distance)}
          {' '}
          km
        </div>
        )}
      </div>
      <div className="ml-4">
        <div className="text-small font-semibold">{pharmacy.name}</div>
        <div className="text-small font-medium">{pharmacy.address}</div>
        <div>
          <div>{pharmacy.district}</div>
          <div />
        </div>
      </div>
    </div>
  );
};
