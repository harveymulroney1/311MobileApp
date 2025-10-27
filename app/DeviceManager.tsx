import axios from 'axios';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function deviceManager() {
    const [lastUpdated,setlastUpdated] = useState("");
    const [batteryPercentage,setbatteryPercentage] = useState("");
    
    const host = '10.45.1.14';
    const [redStatus,setredStatus] = useState(Boolean);
    const [greenStatus,setgreenStatus] = useState(Boolean);
    const [blueStatus,setblueStatus] = useState(Boolean);
    const [climateData,setclimateData] = useState("");
    const [temp,setTemp] = useState("");
    const [humidity,setHumidity] = useState("");
    const [pressure,setPressure] = useState("");
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
    const fetchClimateData = ( async ()=> {
        try{
            axios.get("http://" + host + "/getClimateData")
            .then(function (response){
                var arr = response.data.split(",");
                setTemp(arr[0]??"");
                setHumidity(arr[1]??"");
                setPressure(arr[2]??"");
                console.log("Climate Data Fetched: ",response.data);
                
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
    useEffect(()=>
    {
        const interval = setInterval(()=>
        {
            fetchClimateData();
        }
        ,60000);
        return () => clearInterval(interval);
    }
    ,[]);
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
            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.safeModeBtn}>Safe Mode</TouchableOpacity>
            </View>
            <View>
                <Text>Light Controller</Text>
                <TouchableOpacity
                onPress={()=>toggleRed()}
                >Red ON</TouchableOpacity>
                <Text>Light Controller</Text>
                <TouchableOpacity
                onPress={()=>toggleGreen()}
                >Green Toggle</TouchableOpacity>
                <Text>Light Controller</Text>
                <TouchableOpacity
                onPress={()=>toggleBlue()}
                >Blue Toggle</TouchableOpacity>
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