import { createContext, useContext, useMemo, useState } from 'react';

export const MapContext = createContext<{
  selectedId?: string;
  handleSetSelectedId: (id: string) => void;
  center?: google.maps.LatLngLiteral;
  handleSetCenter: (latlng: google.maps.LatLngLiteral) => void;
  zoom: number;
  handleSetZoom: (zoom: number) => void;
}>({
  selectedId: undefined,
  handleSetSelectedId: () => {},
  center: undefined,
  handleSetCenter: () => {},
  zoom: 15,
  handleSetZoom: () => {},
});

export const MapContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selectedId, setSelectedId] = useState<string>();
  const [center, setCenter] = useState<google.maps.LatLngLiteral>();
  const [zoom, setZoom] = useState<number>(15);

  const api = useMemo(() => {
    const handleSetZoom = (zoom: number) => {
      setZoom(zoom);
    };

    const handleSetSelectedId = (selectedId: string) => {
      setSelectedId(selectedId);
    };

    const handleSetCenter = (center: google.maps.LatLngLiteral) => {
      setCenter(center);
    };

    return { handleSetZoom, handleSetSelectedId, handleSetCenter };
  }, []);

  return (
    <MapContext.Provider
      value={{
        selectedId,
        center,
        zoom,
        ...api,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => useContext(MapContext);
