import { useState, useEffect } from "react";
import { Dimensions } from "react-native";
import { WindowSize } from "../src/navigation/types";

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>(
    Dimensions.get("window")
  );

  useEffect(() => {
    const updateSize = () => setWindowSize(Dimensions.get("window"));
    const subscription = Dimensions.addEventListener("change", updateSize);
    return () => subscription.remove();
  }, []);

  return windowSize;
}
