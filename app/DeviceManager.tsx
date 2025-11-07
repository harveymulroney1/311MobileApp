import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';


import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function deviceManager({deviceID}: {deviceID?: string}) {
    
    
    const [lastUpdated,setlastUpdated] = useState("");
    const [batteryPercentage,setbatteryPercentage] = useState("");
    const [host,setHost] = useState("");
    //const host = '10.45.1.14';
    
    //const host = '10.45.1.14';
    //const host = '192.168.0.50'; //Joe - changed to work on my wifi
    //MOBILE
    //const host = '172.20.10.6';
    //const [redStatus,setredStatus] = useState(Boolean);
    //const [greenStatus,setgreenStatus] = useState(Boolean);
    //const [blueStatus, setblueStatus] = useState(Boolean);
    const [lowPowerMode, setLowPowerMode] = useState(false);
    const device1 = '192.168.0.50';
    const device2 = '10.45.1.15';
    const device3 = '10.45.1.16';
    useEffect(()=>
    {
        if(deviceID=="1")
        {
            console.log("Device ID 1 selected");
            setHost(device1);
        }
        else if(deviceID=="2")
        {
            console.log("Device ID 2 selected");
            setHost(device2);
        }
        else if(deviceID=="3")
        {
            console.log("Device ID 3 selected");
            setHost(device3);
        }
        else{
            console.log("No Device ID Found");
            setHost(device1); // default for testing *DEBUG*
            console.log("Host:",host, "Device1:",device1);
        }
    },[]);
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
    const [redStatus,setredStatus] = useState<boolean>(false);
    const [imgUri, setImgUri] = useState<string | null>(null);
    const [greenStatus,setgreenStatus] = useState<boolean>(false);
    const [blueStatus,setblueStatus] = useState<boolean>(false);
    const [climateData,setclimateData] = useState("");
    const [rgbcData,setrgbcData] = useState("");
    const [temp,setTemp] = useState("");
    const [R,setR] = useState("");
    const [G,setG] = useState("");
    const [B,setB] = useState("");
    const [C,setC] = useState("");
    const [humidity,setHumidity] = useState("");
    const [pressure,setPressure] = useState("");
    const router = useRouter();
    const [noiseLvl, setNoiseLvl] = useState("");
    const [lightLvl, setLightLvl] = useState("");
    /* useEffect(()=>
    {
        setlastUpdated("14 Minutes Ago");
        setbatteryPercentage("53");
    }
    ,[]) */
    const getBattery = (()=>{
        axios.get("http://" + host + "/getBattery")
        .then(function (response){
            console.log("Battery Fetched: ",response.data);
            setbatteryPercentage(response.data);
            const now = new Date
            setlastUpdated(now.getHours() + ":" + now.getMinutes());
        })
        .catch(function (error){
            console.error("Error in fetching battery data: ",error);
        });
    });
    const fetchNoise = (()=>{
        axios.get("http://" + host + "/getSoundLevel")
        .then(function (response){
            console.log("Noise Fetched: ",response.data);
            setNoiseLvl(response.data);
        })
        .catch(function (error){
            console.error("Error in fetching noise data: ",error);
        });
    });
    const getHourClimateData = (()=>{
        axios.get(`http://127.0.0.1:5000/getHourClimateData?zone=Zone%20${deviceID}`,{responseType:"blob"} )
        .then(async function (response){
            console.log("Hourly Climate Data Fetched: ",response.data);
            const blob = response.data;
            const reader = new FileReader();
            reader.onloadend = () => setImgUri(reader.result as string);
            reader.readAsDataURL(blob);

            

        })
        .catch(function (error){
            console.error("Error in fetching hourly climate data: ",error);
        });
    });
    const sanityCheck = (()=>{
        axios.get("http://" + host + "/sanityCheck")
        .then(function (response){
            console.log("Sanity Check Response: ",response.data);
            
        })
        .catch(function (error){
            console.error("Error in Sanity Check: ",error);
        });
    });
    const fetchTemp = (()=>{
            axios.get("http://" + host + "/getTemp")
            .then(function (response){
                
                console.log(response.data);
                console.log("Temp Fetched: ",response.data);
                setTemp(response.data);
            })
            .catch(function (error){
                console.error("Error in fetching temp data: ",error);
                
            });
    });
    const fetchClimateData = ( () => {
        try{
            if(host.length<1){
                console.log("Host not set yet");
                return;
            }
            axios.get("http://" + host + "/getClimateData")
            .then(function (response){
                var arr = response.data.split(",");
                setTemp(arr[0]??"");
                setNoiseLvl(arr[1]??"");
                setLightLvl(arr[2]??"");
                console.log("Temp:",arr[0],"Noise:",arr[1],"Light:",arr[2]);
                //setHumidity(arr[1]??"");
                //setPressure(arr[2]??"");
                const now = new Date();
                console.log("Climate Data Fetched: ",response.data, "Time:",now.getHours() + ":" + now.getMinutes());
                setlastUpdated(now.getHours() + ":" + now.getMinutes());
                
            })
            .catch(function (error){
                console.error("Error in fetching climate data: ",error);
            });
            
            
        }
        catch(error)
        {
            console.error("Error fetching climate data: ",error);
        }   
    });

    const fetchBattery = (() => {
        axios.get("http://" + host + "/getBattery")
            .then(function (response) {
                const now = new Date();
                console.log("Battery Fetched:", response.data, "Time:", now.getHours() + ":" + now.getMinutes());
                setbatteryPercentage(response.data + "%");
            })
            .catch(function (error) {
                console.error("Error fetching battery percentage: ", error);
            });
    });

    const fetchLowPower = () => {
        axios.get("http://" + host + "/getLowPower")
            .then((response) => {
                const now = new Date();
                console.log("Low Power Mode", response.data, "Time:", now.getHours() + ":" + now.getMinutes());
                if (response.data == true) {
                    setLowPowerMode(true);
                    console.log("setLowPowerMode has been changed to true");
                }
                else {
                    setLowPowerMode(false);
                    console.log("setLowPowerMode has been changed to false");
                }
            })
            .catch((error) => {
                console.error("Error fetching low power mode:", error);
            });
    };
    const fetchRGBCData = (()=>{
        axios.get("http://" + host + "/getRGBC")
        .then(function (response){
            console.log("RGBC Data Fetched: ",response.data);
            setrgbcData(response.data);
            var arr = response.data.split(",");
            setR(arr[0]);
            setG(arr[1]);
            setB(arr[2]);
            setC(arr[3]);
        })
        .catch(function (error){
            console.error("Error in fetching RGBC data: ",error);
        });
    });
    
    useEffect(() => {
        let intervalTime = 0;
        if (lowPowerMode) {
            intervalTime = 1800000;
        }
        else {
            intervalTime = 60000;
        }
        const interval = setInterval(() => {
            fetchClimateData();
            fetchBattery();
            fetchLowPower();
            getBattery();
        }
            , intervalTime);
        return () => clearInterval(interval);
    }
        , [lowPowerMode]);
    const toggleRed = ( ()=> {
        if(redStatus == false)
        {
            axios.get("http://" + host +"/redON")
            .then(function (response){

            
                console.log("Setting Red ON");
            })
            .catch(function(error){
                console.error("error turning on RED: ",error);
            })
            
            setredStatus(true);
        }
        else{
            axios.get("http://" + host +"/redOFF")
        .then(function(response)
        {
            console.log("Setting Red OFF");
            setredStatus(false);
        })
        .catch(function(error){
            
            setredStatus(false);
            console.error("error turning OFF red: ",error);
        })
        }
    }
    );
    const toggleGreen = ( ()=> {
        if(greenStatus == false)
        {
            axios.get("http://" + host +"/greenON")
            .then(function(response){
                console.log("Setting Green ON");
                
            }
            ).catch(function(error){
                console.error("error turning on GREEN: ",error);
            });
            setgreenStatus(true);
        }
        else{
            axios.get("http://" + host +"/greenOFF").then(function(response){
                console.log("Setting Green OFF");
                setgreenStatus(false);
            }).catch(function(error){
                console.error("error turning OFF GREEN: ",error);
                setgreenStatus(false);
            });
        }
    }
    );
        const toggleBlue = ( ()=> {
        if(blueStatus == false)
        {
            axios.get("http://" + host +"/blueON").then(function(response){
                console.log("Setting Blue ON");
            }).catch(function(error){
                console.error("error turning on BLUE: ",error);
                
            });
            console.log("Setting Blue ON");
            setblueStatus(true);
        }
        else{
            axios.get("http://" + host +"/blueOFF").then(function(response){
                console.log("Setting Blue OFF");
                setblueStatus(false);
            }).catch(function(error){
                setblueStatus(false);
                console.error("error turning OFF BLUE: ",error);
            });

        }
    }
    );
    return (
        <View>
            <Text>Hello this is the device Manager</Text>
            <Text>Battery Percentage: {batteryPercentage}%</Text>
            <Text>Last Updated: {lastUpdated}</Text>
            <Text>Low Power Mode: {lowPowerMode ? "Enabled" : "Disabled"}</Text>
            <View>
                <TouchableOpacity
                    style={styles.safeModeBtn}
                    onPress={() => {
                        axios.get("http://" + host + "/lowPowerModeOn")
                            .then((response) => {
                                console.log("Enable low power response:", response.data);
                            })
                            .catch((error) => {
                                console.error("Error enabling low power mode:", error);
                            });
                        fetchLowPower();
                    }}>
                    <Text style={styles.btnText}>Enable Low Power Mode</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.safeModeBtn}
                    onPress={() => {
                        axios.get("http://" + host + "/lowPowerModeOff")
                            .then((response) => {
                                console.log("Disable low power response:", response.data);
                            })
                            .catch((error) => {
                                console.error("Error disabling low power mode:", error);
                            });
                        fetchLowPower();
                    }}>
                    <Text style={styles.btnText}>Disable Low Power Mode</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.safeModeBtn}
                    onPress={() => {
                        axios.get("http://" + host + "/autoLowPowerModeOn")
                            .then((response) => {
                                console.log("Enable automatic low power mode response:", response.data);
                            })
                            .catch((error) => {
                                console.error("Error enabling automatic low power mode:", error);
                            });
                        fetchLowPower();
                    }}>
                    <Text style={styles.btnText}>Enable Automatic Power Saving</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.safeModeBtn}
                    onPress={() => {
                        axios.get("http://" + host + "/autoLowPowerModeOff")
                            .then((response) => {
                                console.log("Disable automatic low power mode response:", response.data);
                            })
                            .catch((error) => {
                                console.error("Error disabling automatic low power mode:", error);
                            });
                        fetchLowPower();
                    }}>
                    <Text style={styles.btnText}>Disable Automatic Power Saving</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.safeModeBtn}
                    onPress={() => {
                        fetchLowPower();
                    }}>
                    <Text style={styles.btnText}>Fetch low power status</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={()=>sanityCheck()}
                >
                    <Text>Check for Stale Data</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Text>Light Controller</Text>
                <TouchableOpacity onPress={()=>toggleRed()}>
                    <Text>Red Toggle</Text>
                </TouchableOpacity>
                <Text>Light Controller</Text>
                <TouchableOpacity onPress={()=>toggleGreen()}>
                    <Text>Green Toggle</Text>
                </TouchableOpacity>
                <Text>Light Controller</Text>
                <TouchableOpacity onPress={()=>toggleBlue()}>
                    <Text>Blue Toggle</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity onPress={()=>getHourClimateData()}>
                    <Text>Get Last Hour Climate Data Graph</Text>
                </TouchableOpacity>
                {
                    imgUri?(
                        <Image source={{uri:imgUri}} style={{width:300,height:200}}/>
                    )
                    :(<Text>No Image Available</Text>
                    )
                }
            </View>
            <View>
                <Text>Climate Data:</Text>
                <Text>Temperature: {temp} °C</Text>
                <Text>Noise Level: {noiseLvl}</Text>
                <Text>Light Level: {lightLvl}</Text>
                <TouchableOpacity onPress={()=>fetchTemp()}>
                    <Text>Fetch Climate Data</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>fetchClimateData()}>
                    <Text>Fetch Full Climate Data</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>getBattery()}>
                    <Text>Fetch Battery Percentage</Text>
                </TouchableOpacity>
                <Text>RGBC Data:</Text>
                <Text>R: {R}</Text>
                <Text>G: {G}</Text>
                <Text>B: {B}</Text>
                <Text>C: {C}</Text>
                <TouchableOpacity onPress={()=>fetchRGBCData()}>
                    <Text>Fetch RGBC Data</Text>
                </TouchableOpacity>
                <Text>Noise Level: {noiseLvl} dB</Text>
                <TouchableOpacity onPress={()=>fetchNoise()}>
                    <Text>Fetch Noise Data</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity
                  onPress={() => router.push(`/ImageDisplay?url=http://127.0.0.1:5000/getHourClimateData?zone=Zone%201`)}>
                    <Text>View Climate Data Chart</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push(`/ImageDisplay?url=http://127.0.0.1:5000/getHourBatteryData?zone=Zone%201`)}>
                    <Text>View Battery Chart</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push(`/ImageDisplay?url=http://127.0.0.1:5000/getHourMotionData?zone=Zone%201`)}>
                    <Text>View Motion Chart</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create(
    {
        safeModeBtn:{
            backgroundColor:'red',
            paddingHorizontal:22,
            justifyContent:'center',
            borderRadius:14,
            paddingVertical:14,
        },
        btnText:{
            color:'#fff',
            fontWeight: '600',
            fontSize:16
        },
    }
)