import { createContext, Dispatch, SetStateAction } from "react";

export interface Location {
  latitude: number;
  longitude: number;
}

export interface LocationContext {
  location: Location;
  setLocation: Dispatch<SetStateAction<Location>>;
  markerLocation: Location;
  setMarkerLocation?: Dispatch<SetStateAction<Location>>;
}

const LocationContextDefaultValue: LocationContext = {
  location: {
    latitude: 0,
    longitude: 0,
  },
  setLocation: () => {},
  markerLocation: {
    latitude: 0,
    longitude: 0,
  },
  setMarkerLocation: () => {},
};


export const LocationContext = createContext<LocationContext>(
  LocationContextDefaultValue,
);
