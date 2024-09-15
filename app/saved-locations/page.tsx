"use client";
import { useLocalStorage } from "@/hooks/storage";
import useMarkerStore, { Marker } from "@/zustand/marker";
import { Flex, Input, Spinner } from "@chakra-ui/react";
import { Trash, Edit, Eye, EyeOff, MapPin } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useMemo, useState } from "react";

type ListActionType = {
  onClickRemoveShowLocation: (marker: Marker) => void;
  onClickDeleteLocation: (marker: Marker) => void;
  isExist: boolean;
};

function LocationList(props: Marker & ListActionType) {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const fetchLocationData = async (lat: string, lng: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      const country = data.address.country;
      const city =
        data.address.city || data.address.town || data.address.village;
      setCountry(country);
      setCity(city);
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  fetchLocationData(props?.lat?.toString()!, props?.lng?.toString()!);

  return (
    <div className="w-full h-16 border border-gray-400 rounded-md flex flex-row items-center justify-between p-2">
      <div className="w-full flex flex-row gap-2 items-center">
        <span
          className="block min-w-4 min-h-4 max-w-4 max-h-4 rounded-full"
          style={{ background: props.color }}
        />
        <div className="w-full flex flex-col gap-1">
          <span className="text-xs font-bold">{props.locationName}</span>
          <span className="text-xs">
            {props.lat?.toFixed(2)}, {props.lng?.toFixed(2)}
          </span>
          {country || city ? (
            <span className="flex flex-row items-center text-xs">
              <MapPin size={12} /> {country || ""}, {city || ""}
            </span>
          ) : (
            <Spinner size="xs" />
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 max-w-[100px] w-full">
        {props.isExist ? (
          <EyeOff
            size={19}
            className="cursor-pointer"
            onClick={() => props.onClickRemoveShowLocation(props!)}
          />
        ) : (
          <Eye
            size={19}
            className="cursor-pointer"
            onClick={() => props.onClickRemoveShowLocation(props!)}
          />
        )}
        <Link href={`/edit-location/${props.id}`}>
          <Edit size={19} className="cursor-pointer" />
        </Link>
        <Trash
          size={19}
          color="red"
          className="cursor-pointer"
          onClick={() => props.onClickDeleteLocation(props!)}
        />
      </div>
    </div>
  );
}

export default function SavedLocations() {
  const locations = localStorage.getItem("markers")
    ? (JSON.parse(localStorage.getItem("markers")!) as Marker[])
    : [];
  const [storage, setStorage] = useLocalStorage<Marker[]>("markers", locations);
  const [search, setSearch] = useState("");
  const filteredLocations = useMemo(() => {
    const searchTerm = search.toLocaleLowerCase();
    return storage.filter(
      (items) =>
        items.locationName.toLocaleLowerCase().includes(searchTerm) ||
        items.color.toLocaleLowerCase().includes(searchTerm) ||
        items.lat?.toString().toLocaleLowerCase().includes(searchTerm) ||
        items.lng?.toString().toLocaleLowerCase().includes(searchTerm)
    );
  }, [search, storage]);

  const { savedLocations, addLocation, removeLocation } = useMarkerStore();

  const onClickRemoveShowLocation = useCallback(
    (marker: Marker) => {
      const isMarkerExist = savedLocations.find((r) => r.id === marker.id);
      if (isMarkerExist) {
        removeLocation(marker?.id!);
      } else {
        addLocation({
          ...marker,
        });
      }
    },
    [savedLocations, addLocation, removeLocation]
  );

  const onClickDeleteLocation = useCallback(
    (marker: Marker) => {
      const updatedMarkers = storage.filter((item) => item.id !== marker.id);
      setStorage(updatedMarkers);
      removeLocation(marker?.id!);
    },
    [storage, setStorage, removeLocation]
  );

  return (
    <Flex
      rounded="xl"
      w="100%"
      position="relative"
      flexDirection="column"
      p={1}
      gap={2}
    >
      <Input
        placeholder="Search..."
        size="sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <span className="text-xs">Locations: {filteredLocations.length}</span>
      <Flex
        w="100%"
        flexDirection="column"
        gap={2}
        overflowX="hidden"
        overflowY="auto"
        maxHeight={500}
        height="100%"
        borderBottom="1px solid gray"
      >
        {filteredLocations.length > 0 ? (
          filteredLocations.map((items) => (
            <LocationList
              {...items}
              key={items.id}
              isExist={Boolean(savedLocations.find((r) => r.id === items.id))}
              onClickRemoveShowLocation={() => onClickRemoveShowLocation(items)}
              onClickDeleteLocation={() => onClickDeleteLocation(items)}
            />
          ))
        ) : (
          <span className="text-sm font-bold">Location not found!</span>
        )}
      </Flex>
    </Flex>
  );
}
