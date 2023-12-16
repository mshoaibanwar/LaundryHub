import React from 'react'

import { createStackNavigator } from '@react-navigation/stack';
import { BackgroundColor } from '../../../constants/Colors';
import Chat from '../../Chat';
import SellerTabs from './SellerTabs';
import AboutUs from '../../AboutUs';
import SocketReceiver from '../../../helpers/SocketReceiver';

const UserTabsStack = () => {
    const stack = createStackNavigator();
    return (
        <>
            <SocketReceiver>
                <stack.Navigator
                    initialRouteName='Tabs'
                    screenOptions={{ cardStyle: { backgroundColor: BackgroundColor } }}
                >
                    <stack.Screen name='Tabs' component={SellerTabs} options={{ headerShown: false }} />
                    <stack.Screen name='Chat' component={Chat} options={{ headerShown: false }} />
                    <stack.Screen name='AboutUs' component={AboutUs} options={{ headerShown: false }} />
                </stack.Navigator>
            </SocketReceiver>
        </>
    )
}

export default UserTabsStack