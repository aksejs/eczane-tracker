import { useQuery } from 'react-query';

import { BottomSheet } from '../../components/BottomSheet';

import { GoogleMap, Loader } from '@app/components';
import { Address } from '@app/utils/types';
import { fetchPharmaciesByAddress } from '@app/utils/api';

const PharmaciesMap: React.FC<{ address: Address }> = ({ address }) => {
  const {
    data: pharmacies,
    isLoading,
    isError,
  } = useQuery(
    ['pharmacies', address.location.lat, address.location.lng],
    () => fetchPharmaciesByAddress(address),
    {
      enabled: !!address.location.lat && !!address.location.lng,
      staleTime: 1000 * 60 * 60,
      cacheTime: 1000 * 60 * 60,
    }
  );

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !pharmacies?.length) {
    return (
      <div className="flex items-center justify-center">
        Error loading pharmacies.
      </div>
    );
  }

  return (
    <>
      <GoogleMap
        latLng={address.location}
        markers={pharmacies}
        onMarkerClick={() => {}}
      />
      <BottomSheet pharmacies={pharmacies} />
    </>
  );
};

export default PharmaciesMap;
