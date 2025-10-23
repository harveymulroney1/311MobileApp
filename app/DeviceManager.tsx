import axios from 'axios';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function deviceManager() {
    const [lastUpdated,setlastUpdated] = useState("");
    const [batteryPercentage,setbatteryPercentage] = useState("");
    
    const host = '192.168.4.1';
    const port = 3000;
    const [redStatus,setredStatus] = useState(Boolean);
    const [greenStatus,setgreenStatus] = useState(Boolean);
    const [blueStatus,setblueStatus] = useState(Boolean);

    useEffect(()=>
    {
        setlastUpdated("14 Minutes Ago");
        setbatteryPercentage("53%");
    }
    ,[])
    const toggleRed = ( ()=> {
        if(redStatus == false)
        {
            axios.get("http://" + host +"/redON")
            console.log("Setting Red ON");
            setredStatus(true);
        }
        else{
            axios.get("http://" + host + ":" + port+"/redOFF")
            console.log("Setting Red OFF");
            setredStatus(false);
        }
    }
    );
    const toggleGreen = ( ()=> {
        if(greenStatus == false)
        {
            axios.get("http://" + host +"/greenON")
            console.log("Setting Red ON");
            setredStatus(true);
        }
        else{
            axios.get("http://" + host +"/greenOFF")
            console.log("Setting Red OFF");
            setredStatus(false);
        }
    }
    );
        const toggleBlue = ( ()=> {
        if(blueStatus == false)
        {
            axios.get("http://" + host +"/blueON")
            console.log("Setting Red ON");
            setredStatus(true);
        }
        else{
            axios.get("http://" + host +"/blueOFF")
            console.log("Setting Red OFF");
            setredStatus(false);
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
                >{redStatus?"Red On":"Red Off"}</TouchableOpacity>
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