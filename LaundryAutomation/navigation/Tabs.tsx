import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Platform, View } from 'react-native';
import ShopsStack from './ShopsStack';

import { ShoppingBasket, GalleryVertical, MapPin, HomeIcon } from 'lucide-react-native';
import BasketStack from './BasketStack';
import HomeStack from './HomeStack';
import MapStack from './MapStack';
import { BlueColor } from '../constants/Colors';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        lazy: false,
        tabBarActiveTintColor: '#FFD130',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          {
            minHeight: 70,
            position: 'absolute',
            bottom: Platform.OS == 'android' ? 12 : 20,
            right: 20,
            left: 20,
            borderRadius: 40,
            paddingBottom: 30,
            backgroundColor: BlueColor,
            shadowColor: 'grey',
            shadowOpacity: 0.5,
            shadowRadius: 7,
            shadowOffset: {
              width: 0,
              height: 3,
            },
          }
        ]
      }}
    >
      <Tab.Screen name="HomeStack" component={HomeStack} options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ focused }) => (
          focused ?
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 13 }}>
              <HomeIcon
                size={30} color={focused ? '#FFD130' : 'white'} />
              <Image
                source={require('../assets/icons/dot.png')}
                style={{
                  marginTop: 7,
                  width: 10,
                  height: 10
                }}
              />
            </View>
            : <HomeIcon
              size={30} color={'white'} style={{ top: 13 }} />
        ),
      }} />
      <Tab.Screen name="BasketStack" component={BasketStack} options={{
        tabBarLabel: 'Basket',
        tabBarIcon: ({ focused }) => (
          focused ?
            <View style={{ alignItems: 'center', top: 13 }}>
              <ShoppingBasket
                size={33} color={focused ? '#FFD130' : 'white'} />
              <Image
                source={require('../assets/icons/dot.png')}
                style={{
                  marginTop: 7,
                  width: 10,
                  height: 10
                }}
              />
            </View>
            :
            <ShoppingBasket
              size={33} color={'white'} style={{ top: 13 }} />
        ),
      }} />
      <Tab.Screen name="MapStack" component={MapStack} options={{
        tabBarLabel: 'ShopsMap',
        tabBarIcon: ({ focused }) => (
          focused ?
            <View style={{ alignItems: 'center', top: 13 }}>
              <MapPin
                size={32} color={focused ? '#FFD130' : 'white'} />
              <Image
                source={require('../assets/icons/dot.png')}
                style={{
                  marginTop: 7,
                  width: 10,
                  height: 10
                }}
              />
            </View>
            : <MapPin
              size={32} color={'white'} style={{ top: 13 }} />
        ),
      }} />
      <Tab.Screen name="ShopsStack" component={ShopsStack} options={{
        tabBarLabel: 'Shops',
        tabBarIcon: ({ focused }) => (
          focused ?
            <View style={{ alignItems: 'center', top: 13 }}>
              <GalleryVertical
                size={28} color={focused ? '#FFD130' : 'white'} />
              <Image
                source={require('../assets/icons/dot.png')}
                style={{
                  marginTop: 7,
                  width: 10,
                  height: 10
                }}
              />
            </View>
            : <GalleryVertical
              size={28} color={'white'} style={{ top: 13 }} />
        ),
      }} />
    </Tab.Navigator >
  )
}

export default Tabs