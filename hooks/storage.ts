"use client";
import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    const jsonValue = window.localStorage.getItem(key);
    try {
      if (jsonValue != null) {
        return JSON.parse(jsonValue);
      }
      if (typeof initialValue === "function") {
        return (initialValue as () => T)();
      } else {
        return initialValue;
      }
    } catch (e) {
      console.error("Error parsing localStorage value", e);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue] as [typeof value, typeof setValue];
}
