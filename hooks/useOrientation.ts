import { useLocationContext } from "@/context/LocationProvider";
import { Magnetometer } from "expo-sensors";
import { useEffect, useMemo, useState } from "react";

export const useOrientation = () => {
  const [heading, setHeading] = useState(0);
  const { location, markerLocation } = useLocationContext();

  useEffect(() => {
    // Set update interval (in ms)
    Magnetometer.setUpdateInterval(100);

    const subscription = Magnetometer.addListener((data) => {
      // Calculate heading from magnetometer data
      // atan2 gives us the angle in radians
      let angle = Math.atan2(data.y, data.x);

      // Convert to degrees and normalize to 0-360
      let degrees = angle * (180 / Math.PI);

      // Adjust for device orientation (portrait mode)
      degrees = (degrees + 360) % 360;

      // Convert back to radians for consistency
      const radians = (degrees * Math.PI) / 180;
      setHeading(radians);
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
    // Calculate the direction to point: bearing minus current heading
    let angle = bearing - heading;

    // Normalize angle between -π and π
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;

    return angle; // in radians
  }, [bearing, heading]);

  return {
    angle,
  };
};
