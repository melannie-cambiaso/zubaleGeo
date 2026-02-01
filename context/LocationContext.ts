import { createContext, Dispatch, SetStateAction } from "react";

export interface Location {
  latitude: number;
  longitude: number;
}

export interface LocationContext {
  location: Location;
  setLocation: Dispatch<SetStateAction<Location>>;
}

const LocationContextDefaultValue: LocationContext = {
  location: {
    latitude: 0,
    longitude: 0,
  },
  setLocation: () => {},
};

export const LocationContext = createContext<LocationContext>(
  LocationContextDefaultValue,
);
