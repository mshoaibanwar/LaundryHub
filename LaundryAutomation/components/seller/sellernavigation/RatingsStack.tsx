import React from 'react'

import { createStackNavigator } from '@react-navigation/stack';
import { BackgroundColor } from '../../../constants/Colors';
import Ratings from '../Ratings';

const RatingsStack = () => {
    const stack = createStackNavigator();
    return (
        <>
            <stack.Navigator
                initialRouteName='Ratings'
                screenOptions={{ cardStyle: { backgroundColor: BackgroundColor } }}
            >
                <stack.Screen name='Ratings' component={Ratings} options={{ headerShown: false }} />
            </stack.Navigator>
        </>
    )
}

export default RatingsStack