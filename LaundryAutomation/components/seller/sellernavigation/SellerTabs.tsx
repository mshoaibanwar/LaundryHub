import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Platform, View } from 'react-native';
import ShopStack from './ShopStack';

import { HomeIcon, Box, Store, Star } from 'lucide-react-native';
import OrdersStack from './OrdersStack';
import HomeStack from './SellerHomeStack';
import { BlueColor } from '../../../constants/Colors';
import RatingsStack from './RatingsStack';

const Tab = createBottomTabNavigator();

const SellerTabs = () => {
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
                size={32} color={focused ? '#FFD130' : 'white'} />
              <Image
                source={require('../../../assets/icons/dot.png')}
                style={{
                  marginTop: 7,
                  width: 10,
                  height: 10
                }}
              />
            </View>
            : <HomeIcon
              size={32} color={'white'} style={{ top: 13 }} />
        ),
      }} />
      <Tab.Screen name="OrdersStack" component={OrdersStack} options={{
        tabBarLabel: 'Orders',
        tabBarIcon: ({ focused }) => (
          focused ?
            <View style={{ alignItems: 'center', top: 13 }}>
              <Box
                size={36} color={focused ? '#FFD130' : 'white'} />
              <Image
                source={require('../../../assets/icons/dot.png')}
                style={{
                  marginTop: 7,
                  width: 10,
                  height: 10
                }}
              />
            </View>
            :
            <Box
              size={36} color={'white'} style={{ top: 13 }} />
        ),
      }} />
      <Tab.Screen name="RatingsStack" component={RatingsStack} options={{
        tabBarLabel: 'Ratings',
        tabBarIcon: ({ focused }) => (
          focused ?
            <View style={{ alignItems: 'center', top: 13 }}>
              <Star
                size={35} color={focused ? '#FFD130' : 'white'} />
              <Image
                source={require('../../../assets/icons/dot.png')}
                style={{
                  marginTop: 7,
                  width: 10,
                  height: 10
                }}
              />
            </View>
            : <Star
              size={35} color={'white'} style={{ top: 13 }} />
        ),
      }} />
      <Tab.Screen name="ShopStack" component={ShopStack} options={{
        tabBarLabel: 'Shop',
        tabBarIcon: ({ focused }) => (
          focused ?
            <View style={{ alignItems: 'center', top: 13 }}>
              <Store
                size={32} color={focused ? '#FFD130' : 'white'} />
              <Image
                source={require('../../../assets/icons/dot.png')}
                style={{
                  marginTop: 7,
                  width: 10,
                  height: 10
                }}
              />
            </View>
            : <Store
              size={32} color={'white'} style={{ top: 13 }} />
        ),
      }} />
    </Tab.Navigator >
  )
}

export default SellerTabs