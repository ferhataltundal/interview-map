"use client";
import useUIModelStore from "@/zustand/ui";
import { Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { useUserLocation } from "@/hooks/location";
import useMarkerStore from "@/zustand/marker";
import { useEffect } from "react";

export default function Home() {
  const { isClosed } = useUIModelStore();
  const { latitude, longitude, error, loading } = useUserLocation();
  const { marker, setMarker } = useMarkerStore();

  useEffect(() => {
    if (!loading && !error) {
      setMarker({
        ...marker,
        lat: latitude,
        lng: longitude,
      });
    }
  }, [loading, error, latitude, longitude]);
  return (
    <>
      {!isClosed && (
        <Flex w="100%" flexDirection="column" gap={2} marginTop={4}>
          <Link href="/add-location">
            <Button size="sm" variant="outline" colorScheme="blue" w="100%">
              Add Location
            </Button>
          </Link>
          <Link href="/saved-locations">
            <Button size="sm" variant="outline" colorScheme="blue" w="100%">
              Saved Locations
            </Button>
          </Link>
        </Flex>
      )}
    </>
  );
}
