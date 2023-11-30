/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import messaging from '@react-native-firebase/messaging';
import notifee, {
  EventType,
} from '@notifee/react-native';

import { firebase } from '@react-native-firebase/messaging';

if(Platform.OS === 'ios'){
  const firebaseConfig = {
    apiKey: "AIzaSyCJAY-aIfbS-u_btrelJLXcZcAxOZh3IDw",
    authDomain: "laundryhub-acc7b.firebaseapp.com",
    databaseURL: "https://laundryhub-acc7b-default-rtdb.firebaseio.com",
    projectId: "laundryhub-acc7b",
    storageBucket: "laundryhub-acc7b.appspot.com",
    messagingSenderId: "389432286506",
    appId: "1:389432286506:ios:daf6adfc7ec65f3387d253",
    measurementId: "G-JSBZ0NSDW4"
  };
  
  firebase.initializeApp(firebaseConfig);
}

const onMessageReceived = async message => {
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
    });
  //const notification = JSON.parse(message);
  await notifee.displayNotification({
    title: message?.notification?.title,
    body: message?.notification?.body,
    android: {
        channelId,
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
            id: 'default',
        },
    },
});
};

messaging().setBackgroundMessageHandler(onMessageReceived);
messaging().onMessage(onMessageReceived);


notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;

  // Check if the user pressed the "Mark as read" action

  if (type === EventType.PRESS) {
    // Update external API

    // Remove the notification
    await notifee.cancelNotification(notification.id);
  }
});

notifee.onForegroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;

  if (type === EventType.PRESS) {

    await notifee.cancelNotification(notification.id);
  }
});

AppRegistry.registerComponent(appName, () => App);