import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function deviceManager() {
    const [lastUpdated,setlastUpdated] = useState("");
    const [batteryPercentage,setbatteryPercentage] = useState("");
    
    useEffect(()=>
    {
        setlastUpdated("14 Minutes Ago");
        setbatteryPercentage("53%");
    }
    ,[])
    
    return (
        
        <View>
            <Text>Hello this is the device Manager</Text>
            <Text>Battery Percentage: {batteryPercentage}</Text>
            <Text>Last Updated: {lastUpdated}</Text>
            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.safeModeBtn}>Safe Mode</TouchableOpacity>
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