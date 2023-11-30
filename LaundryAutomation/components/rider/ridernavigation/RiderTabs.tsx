import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Platform, View } from 'react-native';

import { Star, BarChartBig, Bike, GanttChartSquare } from 'lucide-react-native';
import { BlueColor } from '../../../constants/Colors';
import RiderHomeStack from './RiderHomeStack';
import Rides from '../Rides';
import Ratings from '../../seller/Ratings';
import Manage from '../Manage';

const Tab = createBottomTabNavigator();

const RiderTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Rides"
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
      <Tab.Screen name="Rides" component={Rides} options={{
        tabBarLabel: 'Rides',
        tabBarIcon: ({ focused }) => (
          focused ?
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 13 }}>
              <Bike
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
            : <Bike
              size={32} color={'white'} style={{ top: 13 }} />
        ),
      }} />
      <Tab.Screen name="RatingsStack" component={Ratings} options={{
        tabBarLabel: 'Ratings',
        tabBarIcon: ({ focused }) => (
          focused ?
            <View style={{ alignItems: 'center', top: 13 }}>
              <Star
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
            <Star
              size={36} color={'white'} style={{ top: 13 }} />
        ),
      }} />
      <Tab.Screen name="ManageStack" component={Manage} options={{
        tabBarLabel: 'Manage',
        tabBarIcon: ({ focused }) => (
          focused ?
            <View style={{ alignItems: 'center', top: 13 }}>
              <GanttChartSquare
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
            : <GanttChartSquare
              size={35} color={'white'} style={{ top: 13 }} />
        ),
      }} />
      <Tab.Screen name="HomeStack" component={RiderHomeStack} options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ focused }) => (
          focused ?
            <View style={{ alignItems: 'center', top: 13 }}>
              <BarChartBig
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
            : <BarChartBig
              size={32} color={'white'} style={{ top: 13 }} />
        ),
      }} />
    </Tab.Navigator >
  )
}

export default RiderTabs