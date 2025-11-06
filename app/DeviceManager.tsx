import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function deviceManager() {
    
    
    const [lastUpdated,setlastUpdated] = useState("");
    const [batteryPercentage,setbatteryPercentage] = useState("");
    
    //const host = '10.45.1.14';
    const host = '192.168.0.50'; //Joe - changed to work on my wifi
    //MOBILE
    //const host = '172.20.10.6';
    const [redStatus,setredStatus] = useState(Boolean);
    const [greenStatus,setgreenStatus] = useState(Boolean);
    const [blueStatus, setblueStatus] = useState(Boolean);
    const [lowPowerMode, setLowPowerMode] = useState(false);
    const [climateData,setclimateData] = useState("");
    const [temp,setTemp] = useState("");
    const [humidity,setHumidity] = useState("");
    const [pressure,setPressure] = useState("");
    const router = useRouter();
    useEffect(()=>
    {
        setlastUpdated("14 Minutes Ago");
        setbatteryPercentage("53%");
    }
    ,[])
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
            axios.get("http://" + host + "/getClimateData")
            .then(function (response){
                var arr = response.data.split(",");
                setTemp(arr[0]??"");
                setHumidity(arr[1]??"");
                setPressure(arr[2]??"");
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
    
    useEffect(()=>
    {
        let intervalTime = 0;
        if (lowPowerMode) {
            intervalTime = 1800000;
        }
        else {
            intervalTime = 60000;
        }
        const interval = setInterval(()=>
        {
            fetchClimateData();
            fetchBattery();
            fetchLowPower();
        }
        ,intervalTime);
        return () => clearInterval(interval);
    }
    ,[lowPowerMode]);
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
            <Text>Battery Percentage: {batteryPercentage}</Text>
            <Text>Last Updated: {lastUpdated}</Text>
            <Text>Low Power Mode: {lowPowerMode ? "Enabled" : "Disabled"}</Text>
            <View style={styles.btnContainer}>
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
            </View>
            <View>
                <Text>Light Controller</Text>
                <TouchableOpacity
                onPress={()=>toggleRed()}
                ><Text>Red ON</Text></TouchableOpacity>
                <Text>Light Controller</Text>
                <TouchableOpacity
                onPress={()=>toggleGreen()}
                ><Text>Green Toggle</Text></TouchableOpacity>
                <Text>Light Controller</Text>
                <TouchableOpacity
                onPress={()=>toggleBlue()}
                ><Text>Blue Toggle</Text></TouchableOpacity>
            </View>
            <View>
                <Text>Climate Data:</Text>
                <Text>Temperature: {temp} °C</Text>
                <Text>Humidity: {humidity} %</Text>
                <Text>Pressure: {pressure} hPa</Text>
                <TouchableOpacity>
                    <Text onPress={()=>fetchTemp()}>Fetch Climate Data</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text onPress={()=>fetchClimateData()}>Fetch Full Climate Data</Text>
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
    )
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
            fontWeight:600,
            fontSize:16
        },
        btnContainer:{
            flex:1,
            alignContent:'center',
            justifyContent:'center',
            paddingHorizontal: 24,

        }
    }
)