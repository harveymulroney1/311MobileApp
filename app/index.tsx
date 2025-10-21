import { useNavigation, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
export default function Index() {
  const navigation = useNavigation();
  const router=useRouter();
  
  return (
    <View>
      <View style={styles.deviceContainer}>
          <TouchableOpacity style={styles.DeviceBtn} onPress={() => router.push("/DeviceManager")}>Device #1</TouchableOpacity>
          <Text>Battery Percentage: 47%</Text>
        </View>     
    </View>
  );

}

  const styles= StyleSheet.create({
    urgentTxt:{
      color:"red",
      fontWeight:"bold",
    },
    DeviceBtn:{
      backgroundColor:"pink",
      textAlign:'center',
      
    },
    deviceContainer:{
      flexDirection:'row',
      flexWrap:'wrap',
      gap:12
    },
  card: {
    flex: 1,              // fills the column
    aspectRatio: 1,
    borderRadius: 10,
    padding:12,
    backgroundColor: '#a20c75ff',
    },
  });