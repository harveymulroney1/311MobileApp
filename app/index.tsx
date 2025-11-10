import axios from "axios";
import { useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const pythonDB = "127.0.0.1"; // I will need to replace this with the correct IP when it all comes together

interface DeviceData {
  id: string;
  name: string;
  battery: number;
  motion: boolean;
}

export default function Index() {
  const navigation = useNavigation();
  const router = useRouter();

  const [devices, setDevices] = useState<DeviceData[]>([
    { id: "1", name: "Zone 1", battery: 0, motion: false },
    { id: "2", name: "Zone 2", battery: 0, motion: false },
    { id: "3", name: "Zone 3", battery: 0, motion: false },
  ]);

  const fetchAllData = useCallback(async () => {
    try {
      const requests = devices.map((device) => {
        const zoneName = "Zone ${device.id}";
        return Promise.all([
          axios.get(`http://${pythonDB}:5000/getLatestMotion?zone=${zoneName}`),
          axios.get(
            `http://${pythonDB}:5000/getLatestBattery?zone=${zoneName}`
          ),
        ]);
      });

      const responses = await Promise.all(requests);

      const newDeviceData = responses.map((responses, index) => {
        const motionData = responses[0].data;
        const batteryData = responses[1].data;

        return {
          ...devices[index],
          motion: motionData.motion === 1,
          battery: Math.floor(batteryData.battery_percent),
        };
      });

      setDevices(newDeviceData);
    } catch (err) {
      console.error("Error fetching data: ", err);
      setDevices((prev) => prev.map((d) => ({ ...d, motion: false })));
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    // 5 second timer is appropriate
    const interval = setInterval(fetchAllData, 5000);

    // This is for when you leave the page
    return () => clearInterval(interval);
  }, [fetchAllData]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Device Dashboard</Text>

      <View style={styles.listContainer}>
        {devices.map((device) => (
          <TouchableOpacity
            key={device.id}
            style={[styles.card]}
            onPress={() => router.push(`/device/${device.id}`)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{device.name}</Text>
              <View
                style={[
                  styles.motionCircle,
                  device.motion ? styles.motionActive : styles.motionIdle,
                ]}
              />
            </View>
            <Text style={styles.cardSubtitle}>Battery: {device.battery}%</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f2f5",
    flex: 1,
  },
  header: {
    color: "#111",
    fontSize: 32,
    fontWeight: "700",
    paddingTop: 60,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "column",
    justifyContent: "space-between",
    elevation: 3,
    minHeight: 120,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  motionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
  },
  cardTitle: {
    color: "#111",
    fontSize: 18,
    fontWeight: "600",
  },
  cardSubtitle: {
    color: "#555",
    fontSize: 14,
    marginTop: 4,
  },
  cardArrow: {
    color: "#aaa",
    fontSize: 24,
  },
  motionIdle: {
    borderColor: "#4b5563",
  },
  motionActive: {
    backgroundColor: "#ef4444",
    borderColor: "#ef4444",
  },
});
