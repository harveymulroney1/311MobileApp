import { useLocalSearchParams } from "expo-router";
import DeviceManager from "../DeviceManager";

export default function DevicePage() {
  const { id } = useLocalSearchParams();

  const deviceID = Array.isArray(id) ? id[0] : id;

  return <DeviceManager deviceID={deviceID} />;
}