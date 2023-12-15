import * as Notifications from 'expo-notifications';

export async function scheduleNotification(time) {
 
 try{
  console.log("I am called schedule")
  await Notifications.setNotificationChannelAsync('alarmSound', {
    name: 'alarm sound',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'fart.mp3' // Provide ONLY the base filename
  });

  /* await Notifications.setNotificationHandler({
    handleNotification: async () => {
      console.log("Notification handler called");
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      };
    },
  }); */
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Hello! 📬",
      body: 'This is a local notification!',
      sound: "fart.mp3",
      data: { someData: 'goes here' },
    },
    trigger: {
      date: time, // time is a Date object
      channelId: "alarmSound"
    }
    
  })
  
}catch (error) {
    console.error("Error scheduling notification:", error);
  }

  
}