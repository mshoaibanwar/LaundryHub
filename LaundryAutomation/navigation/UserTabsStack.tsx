import React from 'react'

import { createStackNavigator } from '@react-navigation/stack';
import { BackgroundColor } from '../constants/Colors';
import Tabs from './Tabs';
import Chat from '../components/Chat';
import RideReq from '../components/RideReq';
import SocketReceiver from '../helpers/SocketReceiver';
import RideCompleted from '../components/RideCompleted';
import OrderPlaced from '../components/OrderPlaced';

const UserTabsStack = () => {
    const stack = createStackNavigator();
    return (
        <>
            <SocketReceiver>
                <stack.Navigator
                    initialRouteName='Tabs'
                    screenOptions={{ cardStyle: { backgroundColor: BackgroundColor } }}
                >
                    <stack.Screen name='Tabs' component={Tabs} options={{ headerShown: false }} />
                    <stack.Screen name='Chat' component={Chat} options={{ headerShown: false }} />
                    <stack.Screen name='OrderPlaced' component={OrderPlaced} options={{ headerShown: false, gestureEnabled: false }} />
                    <stack.Screen name='RideReq' component={RideReq} options={{ headerShown: false, gestureEnabled: false }} />
                    <stack.Screen name='RideComp' component={RideCompleted} options={{ headerShown: false, gestureEnabled: false }} />
                </stack.Navigator>
            </SocketReceiver>
        </>
    )
}

export default UserTabsStack