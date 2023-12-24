import React from 'react';
import { useAddressContext } from '@app/store/AddressContext';
import { PageWrapper, Loader } from '@app/components';
import { PharmaciesMap } from '@app/features/PhamraciesMap';
import { LanguageSelect } from '@app/features/LanguageSelect';
import { SearchAddress } from '@app/features/SearchAddress';

export const MainPage: React.FC = () => {
  const { address, loading } = useAddressContext();

  if (loading || !address) {
    return (
      <PageWrapper>
        <Loader />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="h-[6%] min-h-[52px] flex items-center">
        <SearchAddress defaultAddress={address} />
        <LanguageSelect />
      </div>
      {address.location ? (
        <PharmaciesMap address={address} />
      ) : (
        <div>No location</div>
      )}
    </PageWrapper>
  );
};
