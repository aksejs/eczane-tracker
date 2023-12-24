import {
  createContext, useContext, useMemo, useState,
} from 'react';

type MapContextProps = {
  selectedId?: string;
  handleSetSelectedId: (selectedId: string) => void;
  center?: google.maps.LatLngLiteral;
  handleSetCenter: (center: google.maps.LatLngLiteral) => void;
  zoom: number;
  handleSetZoom: (zoom: number) => void;
};

export const MapContext = createContext<MapContextProps>({
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
    const handleSetZoom = (value: number) => {
      setZoom(value);
    };

    const handleSetSelectedId = (id: string) => {
      setSelectedId(id);
    };

    const handleSetCenter = (latlng: google.maps.LatLngLiteral) => {
      setCenter(latlng);
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
