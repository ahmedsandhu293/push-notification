import { StatusBar } from "expo-status-bar";
import { Alert, Button, Platform, StyleSheet, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
// import * as Permissions from "expo-permissions";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  useEffect(() => {
    const confiugurePushNotification = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;
      console.log(status)
      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission required",
          "Push notification need permissions"
        );
        return;
      }
      const pushTokenData = await Notifications.getExpoPushTokenAsync();
      console.log(pushTokenData, 'hhh')

      if(Platform.OS === 'android'){
        Notifications.setNotificationChannelAsync('default',{
          name:'default',
          importance: Notifications.AndroidImportance.DEFAULT
        })
      }

    };
    confiugurePushNotification();
  }, []);
  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("MOtification Recieved");
        console.log(notification);
      }
    );

    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification Response");
        console.log(response);
      }
    );

    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);
  // useEffect(() => {
  //   // Ask for notification permissions
  //   const requestPermissions = async () => {
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     if (status !== "granted") {
  //       alert("You need to grant notification permissions.");
  //     }
  //   };

  //   requestPermissions();
  // }, []);

  const scheduleNotificationHandler = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "My first local notification",
        body: "This is the body of the notification",
        data: { userName: "Max" },
      },
      trigger: {
        seconds: 5,
      },
    });
  };



  const sendPushNotificationHandler = ()=>{
    fetch('https://exp.host/--/api/v2/push/send',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        to:'',
        title:'Sent to device',
        body:'Testing'
      })
    })
  }

  return (
    <View style={styles.container}>
      <Button title="Schedule" onPress={scheduleNotificationHandler} />
      <Text>Open up App.js to start working on your app!</Text>
      <Button title="Send Push Notification" onPress={sendPushNotificationHandler}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
