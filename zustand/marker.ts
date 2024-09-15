import { create } from "zustand";

export interface Marker {
  id?: number;
  locationName: string;
  lat: number | null;
  lng: number | null;
  color: string;
}

interface MarkerState {
  marker: Marker;
  setMarker: (marker: Marker) => void;
  savedLocations: Marker[];
  addLocation: (location: Marker) => void;
  removeLocation: (id: number) => void;
  clearLocations: () => void;
}

const useMarkerStore = create<MarkerState>((set) => ({
  marker: {
    locationName: "",
    lat: 0,
    lng: 0,
    color: "#ff0000",
  },
  savedLocations: [],
  setMarker: (marker) => set({ marker }),
  addLocation: (location) =>
    set((state) => ({
      savedLocations: [...state.savedLocations, location],
    })),
  removeLocation: (id) =>
    set((state) => ({
      savedLocations: state.savedLocations.filter((r) => r.id !== id),
    })),
  clearLocations: () => set({ savedLocations: [] }),
}));

export default useMarkerStore;
