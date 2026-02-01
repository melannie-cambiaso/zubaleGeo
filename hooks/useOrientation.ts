import { useLocationContext } from "@/context/LocationProvider";
import { DeviceMotion } from "expo-sensors";
import { useEffect, useMemo, useState } from "react";

export const useOrientation = () => {
  const [orientation, setOrientation] = useState(0);
  const { location, markerLocation } = useLocationContext();

  useEffect(() => {
    // Set update interval (in ms)
    DeviceMotion.setUpdateInterval(100);

    const subscription = DeviceMotion.addListener((data) => {
      if (data.rotation) {
        // Alpha is the rotation around Z-axis (compass heading)
        const alpha = data.rotation.alpha; // in radians
        setOrientation(alpha);
      }
    });

    return () => subscription.remove();
  }, []);

  const bearing = useMemo(() => {
    const currentLat = location.latitude;
    const currentLng = location.longitude;
    const markerLat = markerLocation.latitude;
    const markerLng = markerLocation.longitude;
    const φ1 = (currentLat * Math.PI) / 180;
    const φ2 = (markerLat * Math.PI) / 180;
    const Δλ = ((markerLng - currentLng) * Math.PI) / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x =
      Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    const θ = Math.atan2(y, x);

    return θ; // in radians (0 = North)
  }, [location, markerLocation]);

  const angle = useMemo(() => {
    let angle = bearing - orientation;

    // Normalize angle between -π and π
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;

    return angle * (180 / Math.PI); // convert to degrees
  }, [bearing, orientation]);

  return {
    angle,
  };
};
