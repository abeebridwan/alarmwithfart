import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, StatusBar, useColorScheme, LogBox } from 'react-native';

import Main from './src/screens/Main';
import List from './src/screens/List';
import AlarmCreator from './src/screens/AlarmCreator';
import { Audio } from 'expo-av';

import { Database } from "./api/Database";
import MyContext from './context';
import { getDay } from './api/Utils';
import * as Notifications from 'expo-notifications';
const Stack = createNativeStackNavigator();
LogBox.ignoreAllLogs();

const App = () => {
  let audioPlaying = false
  const [stopAlarm, setStopAlarm] = useState(false)
  
  
  const [sound, setSound] = useState()

  useEffect(() => { Database.createTable(); console.log('created database') }, [])
  useEffect(() => {
    let interval

    if(stopAlarm){
        interval = setTimeout(() => {
        audioPlaying = false
        stopSound(); 
        setStopAlarm(!stopAlarm)
      }, 60000)
    }

    return () => {
      clearInterval(interval);
    };
  }, [stopAlarm])

 


  useEffect(() => {
    audioPlaying = false
    console.log("I am called register")
    registerForPushNotificationsAsync();
   
    Notifications.setNotificationHandler({
      handleNotification: async () => {
        console.log("Notification handler called");
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        };
      },
    });

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      //console.log("I am called inside")
      // get all alarms from the db
      Database.getAll().then((all) => {
        //console.log(JSON.parse(all), "new here");

        const storedAlarms = JSON.parse(all)
        let count = 0 // stop multiple same time alarms
        console.log({storedAlarms})
        const currentDay = getDay()[0]['id']
        const currentHour = new Date().getHours()
        const currentMinute = new Date().getMinutes()
        storedAlarms.rows._array.forEach(alarm => {
          const day = JSON.parse(alarm.days).filter(day => day.id == currentDay).length > 0
          //console.log({day})
          //console.log(Boolean(alarm.music), {day}, {currentHour}, {alarmHour: alarm.hour}, {currentMinute}, {minute: alarm.minute}, {count} )
          if (Boolean(alarm.music) && day && currentHour == alarm.hour && currentMinute == alarm.minute && count < 1) {
            count += 1
            if (!audioPlaying) {
              console.log("i reach before play")
                playSound()
            }
          }
        })

    }); 
  });

  
     
  Notifications.addNotificationResponseReceivedListener(response => {
    console.log({response});
  });

  return () => subscription.remove();
  }, [])

  // Request permission and get token
  async function registerForPushNotificationsAsync() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission for notifications was denied');
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log({token}); // For testing: log the token
  }

  
  const isDarkMode = useColorScheme() === 'dark'

  const playSound = async () => {
    audioPlaying = true
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(require('./assets/sounds/fart.mp3'), { shouldPlay: true });
    setSound(sound);
    setStopAlarm(!stopAlarm)
    console.log('Playing Sound');
    //await sound.playAsync();
}

   const stopSound = async () => { await sound.pauseAsync(); setSound(undefined); }


  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="main" screenOptions={{ navigationBarColor: themes.colors.white, textAlign: 'center' }}>
          <Stack.Screen name="main" component={Main} options={{ headerShown: false }} />
          <Stack.Screen name="list" component={List} options={{ title: 'Alarm clock list', headerStyle: { backgroundColor: '#1f1f1f' }, headerTintColor: '#fff', }} />
          <Stack.Screen name="creator" component={AlarmCreator} options={{ title: 'Add new alarm', headerStyle: { backgroundColor: '#1f1f1f' }, headerTintColor: '#fff', }} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const themes = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  colors: { black: '#000', white: 'white' }
});

export default App;