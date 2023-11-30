import React from 'react'

import { createStackNavigator } from '@react-navigation/stack';
import { BackgroundColor } from '../../../constants/Colors';
import CurrentRide from '../CurrentRide';
import RiderTabs from './RiderTabs';
const RiderTabsStack = () => {
    const stack = createStackNavigator();
    return (
        <>
            <stack.Navigator
                initialRouteName='riderTabs'
                screenOptions={{ cardStyle: { backgroundColor: BackgroundColor } }}
            >
                <stack.Screen name='riderTabs' component={RiderTabs} options={{ headerShown: false }} />
                <stack.Screen name='CRide' component={CurrentRide} options={{ headerShown: false }} />
            </stack.Navigator>
        </>
    )
}

export default RiderTabsStack