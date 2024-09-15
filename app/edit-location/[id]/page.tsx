"use client";
import { useLocalStorage } from "@/hooks/storage";
import useMarkerStore, { Marker } from "@/zustand/marker";
import { Button, Flex, Input, Stack, Text, useToast } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

export default function EditLocation() {
  const locations = typeof localStorage !== 'undefined' && localStorage.getItem("markers")
    ? (JSON.parse(localStorage.getItem("markers")!) as Marker[])
    : [];
  const [storage, setStorage] = useLocalStorage<Marker[]>("markers", locations);
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const selectedMarker = useMemo(
    () => storage.find((item) => item?.id?.toString() === params?.id),
    []
  );
  const { marker, setMarker, clearLocations } = useMarkerStore();
  const [locationName, setLocationName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [color, setColor] = useState("#ff0000");
  const toast = useToast();
  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);
  const isValidLatLng = useMemo(
    () =>
      parsedLat > 90 || parsedLat < -90 || parsedLng > 180 || parsedLng < -180,
    [parsedLat, parsedLng]
  );

  const onClickEditLocation = useCallback(() => {
    if (locationName.length === 0 || lat.length === 0 || lng.length === 0) {
      return toast({
        position: "top-right",
        title: "Error",
        description: "Please fill all fields!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    if (isValidLatLng) {
      return toast({
        position: "top-right",
        title: "Error",
        description: "Please enter valid latitude and longitude!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }

    const updatedMarker = {
      id: selectedMarker?.id,
      lat: parsedLat,
      lng: parsedLng,
      color: color,
      locationName: locationName,
    };

    const updatedMarkers = storage.map((marker) =>
      marker.id === updatedMarker.id ? updatedMarker : marker
    );
    setStorage(updatedMarkers);
    setMarker({
      lat: null,
      lng: null,
      color: color,
      locationName: "",
    });
    router.push("/saved-locations");
    toast({
      position: "top-right",
      title: "Success",
      description: "Marker updated successfully!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  }, [
    setStorage,
    storage,
    toast,
    parsedLat,
    parsedLng,
    locationName,
    lat,
    lng,
    color,
    isValidLatLng,
  ]);

  useEffect(() => {
    setLat(marker?.lat?.toString() ?? "");
    setLng(marker?.lng?.toString() ?? "");
  }, [marker]);

  const onClickCancel = useCallback(() => {
    setMarker({
      lat: null,
      lng: null,
      color: color,
      locationName: "",
    });
    router.push("/saved-locations");
  }, []);

  useEffect(() => {
    if (!selectedMarker) {
      return;
    }
    setLocationName(selectedMarker.locationName);
    setLat(selectedMarker.lat?.toString() || "");
    setLng(selectedMarker.lng?.toString() || "");
    setColor(selectedMarker.color);
  }, []);

  useEffect(() => {
    if (isValidLatLng) {
      return;
    }
    if (lat && lng) {
      setMarker({
        ...marker,
        lat: parsedLat,
        lng: parsedLng,
        color: color,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, color, setMarker]);

  useEffect(() => {
    clearLocations();
  }, []);

  return (
    <Flex
      border="1px solid lightgray"
      rounded="xl"
      w="100%"
      flexDirection="column"
      p={3}
      gap={2}
    >
      <h3 className="font-400 text-xl text-center">Edit Location</h3>
      <Stack spacing={5}>
        <Input
          placeholder="Location name"
          size="sm"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
        />
        <Input
          placeholder="Lat"
          size="sm"
          min={-90}
          max={90}
          isInvalid={isValidLatLng}
          errorBorderColor="red.300"
          type="number"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
        />
        <Input
          placeholder="Long"
          size="sm"
          min={-180}
          max={180}
          isInvalid={isValidLatLng}
          errorBorderColor="red.300"
          type="number"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
        />
        <Stack spacing={1}>
          <Text mt="5px" color="#666666" fontSize="13px">
            Marker Color
          </Text>
          <Input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </Stack>
      </Stack>
      <Stack
        marginTop={5}
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Button colorScheme="red" size="sm" onClick={onClickCancel}>
          Cancel
        </Button>
        <Button colorScheme="blue" size="sm" onClick={onClickEditLocation}>
          Save Location
        </Button>
      </Stack>
    </Flex>
  );
}
