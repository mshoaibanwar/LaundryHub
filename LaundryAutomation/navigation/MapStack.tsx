import React from 'react'

import { createStackNavigator } from '@react-navigation/stack';
import ShopsMap from '../components/ShopsMap';
import { BackgroundColor } from '../constants/Colors';

const MapStack = () => {
    const stack = createStackNavigator();
    return (
        <>
            <stack.Navigator
                initialRouteName='ShopsMap'
                screenOptions={{ cardStyle: { backgroundColor: BackgroundColor } }}
            >
                <stack.Screen name='ShopsMap' component={ShopsMap} options={{ headerShown: false }} />
            </stack.Navigator>
        </>
    )
}

export default MapStack