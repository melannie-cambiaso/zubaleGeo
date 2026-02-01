import { useContext, useState } from "react";
import { Location, LocationContext } from "./LocationContext";

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [location, setLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });
  const [markerLocation, setMarkerLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });

  return (
    <LocationContext.Provider
      value={{ location, setLocation, markerLocation, setMarkerLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error(
      "useLocationContext must be used within a LocationProvider",
    );
  }
  return context;
};
