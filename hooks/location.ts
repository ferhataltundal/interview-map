import { useState, useEffect } from "react";

export const useUserLocation = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLoading(false);
        },
        (error) => {
          setError("Location error!");
          setLoading(false);
        }
      );
    } else {
      setError("Browser is not supported!");
      setLoading(false);
    }
  }, []);

  return { latitude, longitude, error, loading };
};
