"use client";
import { useLocalStorage } from "@/hooks/storage";
import useMarkerStore, { Marker } from "@/zustand/marker";
import { Button, Flex, Input, Stack, useToast, Text } from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

export default function AddLocation() {
  const [locationName, setLocationName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [color, setColor] = useState("#ff0000");
  const toast = useToast();
  const { marker, setMarker, clearLocations } = useMarkerStore();
  const [storage, setStorage] = useLocalStorage<Marker[]>("markers", []);

  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);

  const isValidLatLng = useMemo(
    () =>
      parsedLat > 90 || parsedLat < -90 || parsedLng > 180 || parsedLng < -180,
    [parsedLat, parsedLng]
  );

  const onClickAddLocation = useCallback(() => {
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

    const newMarker = {
      id: Math.floor(Math.random() * 100000000 + 999999999),
      lat: parsedLat,
      lng: parsedLng,
      color: color,
      locationName: locationName,
    };
    setStorage([...storage, newMarker]);

    setMarker({
      lat: null,
      lng: null,
      color: color,
      locationName: locationName,
    });
    setLocationName("");
  }, [
    setMarker,
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
      <h3 className="font-400 text-xl text-center">Add Location</h3>
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
      <Stack marginTop={5}>
        <Button colorScheme="blue" onClick={onClickAddLocation} size="sm">
          Add Location
        </Button>
      </Stack>
    </Flex>
  );
}
