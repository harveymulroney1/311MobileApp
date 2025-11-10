import axios from "axios";
import { useEffect, useState } from "react";

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
export default function deviceManager({ deviceID }: { deviceID?: string }) {
  const [lastUpdated, setlastUpdated] = useState("");
  const [batteryPercentage, setbatteryPercentage] = useState("");
  const [host, setHost] = useState("");
  //const host = '10.45.1.14';

  const device1 = "10.45.1.14";
  const device2 = "10.45.1.15";
  const device3 = "10.45.1.16";
  useEffect(() => {
    if (deviceID == "1") {
      console.log("Device ID 1 selected");
      setHost(device1);
    } else if (deviceID == "2") {
      console.log("Device ID 2 selected");
      setHost(device2);
    } else if (deviceID == "3") {
      console.log("Device ID 3 selected");
      setHost(device3);
    } else {
      console.log("No Device ID Found");
      setHost(device1); // default for testing *DEBUG*
      console.log("Host:", host, "Device1:", device1);
    }
  }, []);
  useEffect(() => {
    console.log("Host updated:", host);
  }, [host]);

  useEffect(() => {
    if (!deviceID) return;

    if (deviceID === "1") setHost(device1);
    else if (deviceID === "2") setHost(device2);
    else if (deviceID === "3") setHost(device3);
    else setHost(device1);
  }, [deviceID]);
  //MOBILE
  //const host = '172.20.10.6';
  const [redStatus, setredStatus] = useState<boolean>(false);
  const [imgUri, setImgUri] = useState<string | null>(null);
  const [greenStatus, setgreenStatus] = useState<boolean>(false);
  const [blueStatus, setblueStatus] = useState<boolean>(false);
  const [climateData, setclimateData] = useState("");
  const [rgbcData, setrgbcData] = useState("");
  const [temp, setTemp] = useState("");
  const [R, setR] = useState("");
  const [G, setG] = useState("");
  const [B, setB] = useState("");
  const [C, setC] = useState("");
  const [humidity, setHumidity] = useState("");
  const [pressure, setPressure] = useState("");
  const [noiseLvl, setNoiseLvl] = useState("");
  const [lightLvl, setLightLvl] = useState("");
  const [motion, setMotion] = useState(false);
  /* useEffect(()=>
    {
        setlastUpdated("14 Minutes Ago");
        setbatteryPercentage("53");
    }
    ,[]) */
  const getBattery = () => {
    axios
      .get("http://" + host + "/getBattery")
      .then(function (response) {
        console.log("Battery Fetched: ", response.data);
        setbatteryPercentage(response.data);
        const now = new Date();
        setlastUpdated(now.getHours() + ":" + now.getMinutes());
      })
      .catch(function (error) {
        console.error("Error in fetching battery data: ", error);
      });
  };
  const fetchNoise = () => {
    axios
      .get("http://" + host + "/getSoundLevel")
      .then(function (response) {
        console.log("Noise Fetched: ", response.data);
        setNoiseLvl(response.data);
      })
      .catch(function (error) {
        console.error("Error in fetching noise data: ", error);
      });
  };
  const getHourClimateData = () => {
    axios
      .get(`http://127.0.0.1:5000/getHourClimateData?zone=Zone%20${deviceID}`, {
        responseType: "blob",
      })
      .then(async function (response) {
        console.log("Hourly Climate Data Fetched: ", response.data);
        const blob = response.data;
        const reader = new FileReader();
        reader.onloadend = () => setImgUri(reader.result as string);
        reader.readAsDataURL(blob);
      })
      .catch(function (error) {
        console.error("Error in fetching hourly climate data: ", error);
      });
  };
  const sanityCheck = () => {
    axios
      .get("http://" + host + "/sanityCheck")
      .then(function (response) {
        console.log("Sanity Check Response: ", response.data);
      })
      .catch(function (error) {
        console.error("Error in Sanity Check: ", error);
      });
  };
  const fetchTemp = () => {
    axios
      .get("http://" + host + "/getTemp")
      .then(function (response) {
        console.log(response.data);
        console.log("Temp Fetched: ", response.data);
        setTemp(response.data);
      })
      .catch(function (error) {
        console.error("Error in fetching temp data: ", error);
      });
  };
  const fetchClimateData = () => {
    try {
      if (host.length < 1) {
        console.log("Host not set yet");
        return;
      }
      axios
        .get("http://" + host + "/getClimateData")
        .then(function (response) {
          var arr = response.data.split(",");
          setTemp(arr[0] ?? "");
          setNoiseLvl(arr[1] ?? "");
          setLightLvl(arr[2] ?? "");
          const motionStatus = arr[3] ?? "false";
          setMotion(motionStatus === "true");
          console.log(
            "Temp:",
            arr[0],
            "Noise:",
            arr[1],
            "Light:",
            arr[2],
            "Motion: ",
            arr[3]
          );
          //setHumidity(arr[1]??"");
          //setPressure(arr[2]??"");
          const now = new Date();
          console.log(
            "Climate Data Fetched: ",
            response.data,
            "Time:",
            now.getHours() + ":" + now.getMinutes()
          );
          setlastUpdated(now.getHours() + ":" + now.getMinutes());
        })
        .catch(function (error) {
          console.error("Error in fetching climate data: ", error);
        });
    } catch (error) {
      console.error("Error fetching climate data: ", error);
    }
  };
  const fetchRGBCData = () => {
    axios
      .get("http://" + host + "/getRGBC")
      .then(function (response) {
        console.log("RGBC Data Fetched: ", response.data);
        setrgbcData(response.data);
        var arr = response.data.split(",");
        setR(arr[0]);
        setG(arr[1]);
        setB(arr[2]);
        setC(arr[3]);
      })
      .catch(function (error) {
        console.error("Error in fetching RGBC data: ", error);
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchClimateData();
      getBattery();
    }, 60000);
    return () => clearInterval(interval);
  }, [host]);
  const toggleRed = () => {
    if (redStatus == false) {
      axios
        .get("http://" + host + "/redON")
        .then(function (response) {
          console.log("Setting Red ON");
        })
        .catch(function (error) {
          console.error("error turning on RED: ", error);
        });

      setredStatus(true);
    } else {
      axios
        .get("http://" + host + "/redOFF")
        .then(function (response) {
          console.log("Setting Red OFF");
          setredStatus(false);
        })
        .catch(function (error) {
          setredStatus(false);
          console.error("error turning OFF red: ", error);
        });
    }
  };
  const toggleGreen = () => {
    if (greenStatus == false) {
      axios
        .get("http://" + host + "/greenON")
        .then(function (response) {
          console.log("Setting Green ON");
        })
        .catch(function (error) {
          console.error("error turning on GREEN: ", error);
        });
      setgreenStatus(true);
    } else {
      axios
        .get("http://" + host + "/greenOFF")
        .then(function (response) {
          console.log("Setting Green OFF");
          setgreenStatus(false);
        })
        .catch(function (error) {
          console.error("error turning OFF GREEN: ", error);
          setgreenStatus(false);
        });
    }
  };
  const toggleBlue = () => {
    if (blueStatus == false) {
      axios
        .get("http://" + host + "/blueON")
        .then(function (response) {
          console.log("Setting Blue ON");
        })
        .catch(function (error) {
          console.error("error turning on BLUE: ", error);
        });
      console.log("Setting Blue ON");
      setblueStatus(true);
    } else {
      axios
        .get("http://" + host + "/blueOFF")
        .then(function (response) {
          console.log("Setting Blue OFF");
          setblueStatus(false);
        })
        .catch(function (error) {
          setblueStatus(false);
          console.error("error turning OFF BLUE: ", error);
        });
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Zone {deviceID} Manager</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status</Text>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Battery:</Text>
          <Text style={styles.dataValue}>{batteryPercentage}%</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Last Updated:</Text>
          <Text style={styles.dataValue}>{lastUpdated}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => sanityCheck()}>
          <Text style={styles.buttonText}>Check for Stale Data</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => getBattery()}
        >
          <Text style={styles.buttonTextSecondary}>Refresh Battery</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Climate Data</Text>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Temperature:</Text>
          <Text style={styles.dataValue}>{temp} °C</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Noise Level:</Text>
          <Text style={styles.dataValue}>{noiseLvl} dB</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Light Level:</Text>
          <Text style={styles.dataValue}>{lightLvl}</Text>
        </View>
        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => fetchClimateData()}
        >
          <Text style={styles.buttonTextSecondary}>Refresh Climate</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Last Hour Graph</Text>
        {imgUri ? (
          <Image source={{ uri: imgUri }} style={styles.graphImage} />
        ) : (
          <Text style={styles.placeholderText}>No Image Available</Text>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => getHourClimateData()}
        >
          <Text style={styles.buttonText}>Load Graph</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Light Controller</Text>
        <TouchableOpacity style={styles.buttonRed} onPress={() => toggleRed()}>
          <Text style={styles.buttonText}>Toggle Red</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => toggleGreen()}>
          <Text style={styles.buttonText}>Toggle Green</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => toggleBlue()}>
          <Text style={styles.buttonText}>Toggle Blue</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>RGBC Data</Text>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Red:</Text>
          <Text style={styles.dataValue}>{R}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Green:</Text>
          <Text style={styles.dataValue}>{G}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Blue:</Text>
          <Text style={styles.dataValue}>{B}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Clear:</Text>
          <Text style={styles.dataValue}>{C}</Text>
        </View>
        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => fetchRGBCData()}
        >
          <Text style={styles.buttonTextSecondary}>Refresh RGBC</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111",
    marginBottom: 12,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dataLabel: {
    fontSize: 16,
    color: "#555",
  },
  dataValue: {
    fontSize: 16,
    color: "#111",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonSecondary: {
    backgroundColor: "#e5e7eb",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonTextSecondary: {
    color: "#111",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonRed: {
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 8,
  },
  graphImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#eee",
    resizeMode: "contain",
  },
  placeholderText: {
    textAlign: "center",
    color: "#888",
    marginVertical: 40,
  },
});
