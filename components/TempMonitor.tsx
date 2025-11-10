import React from "react";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
export default function TempMonitor({ Temperature }: { Temperature: number }) {
  const [fill, setFill] = useState(0);
  useEffect(() => {
    const percent = calcTempPercentage(Temperature);
    setFill(percent);
  }, [Temperature]);

  function calcTempPercentage(temperature: number) {
    const min = 0;
    const max = 40;
    const percent = (temperature / max) * 100;
    return Math.min(Math.max(percent, 0), 100); // avoid overflow
  }

  return (
    <View>
      <AnimatedCircularProgress
        size={120}
        width={15}
        fill={fill}
        backgroundColor="#333"
        tintColor={fill > 80 ? "#F2340F" : "#00e0ff"}
        rotation={0}
        lineCap="round"
      >
        {() => <Text>{Temperature.toFixed(1)}°C</Text>}
      </AnimatedCircularProgress>
    </View>
  );
}
