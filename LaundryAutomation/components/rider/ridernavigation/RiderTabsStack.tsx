import React from 'react'

import { createStackNavigator } from '@react-navigation/stack';
import { BackgroundColor } from '../../../constants/Colors';
import CurrentRide from '../CurrentRide';
import RiderTabs from './RiderTabs';
import RideCompleted from '../RideCompleted';
import LocationTracker from '../LocationTracker';
import Chat from '../../Chat';
import AboutUs from '../../AboutUs';
import MainStack from '../../../navigation/MainStack';
const RiderTabsStack = () => {
    const stack = createStackNavigator();
    return (
        <>
            <LocationTracker>
                <stack.Navigator
                    initialRouteName='riderTabs'
                    screenOptions={{ cardStyle: { backgroundColor: BackgroundColor } }}
                >
                    <stack.Screen name='riderTabs' component={RiderTabs} options={{ headerShown: false }} />
                    <stack.Screen name='Chat' component={Chat} options={{ headerShown: false }} />
                    <stack.Screen name='CRide' component={CurrentRide} options={{ headerShown: false, gestureEnabled: false }} />
                    <stack.Screen name='RideComp' component={RideCompleted} options={{ headerShown: false, gestureEnabled: false }} />
                    <stack.Screen name='AboutUs' component={AboutUs} options={{ headerShown: false }} />
                    {/* <stack.Screen name='MainStack' component={MainStack} options={{ headerShown: false }} /> */}
                </stack.Navigator>
            </LocationTracker>
        </>
    )
}

export default RiderTabsStack