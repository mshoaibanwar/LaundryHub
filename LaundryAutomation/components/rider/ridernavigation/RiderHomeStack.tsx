import React from 'react'

import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Home';
import { BackgroundColor } from '../../../constants/Colors';
import Account from '../../Account';
import ChangePswrd from '../../ChangePswrd';
import Notifications from '../../Notifications';
import MyRides from '../MyRides';

const RiderHomeStack = () => {
    const stack = createStackNavigator();
    return (
        <>
            <stack.Navigator
                initialRouteName='Home'
                screenOptions={{ cardStyle: { backgroundColor: BackgroundColor } }}
            >
                <stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
                <stack.Screen name='Account' component={Account} options={{ headerShown: false }} />
                <stack.Screen name='ChangePswrd' component={ChangePswrd} options={{ headerShown: false }} />
                <stack.Screen name='Noti' component={Notifications} options={{ headerShown: false }} />
                <stack.Screen name='MyRides' component={MyRides} options={{ headerShown: false }} />
            </stack.Navigator>
        </>
    )
}

export default RiderHomeStack