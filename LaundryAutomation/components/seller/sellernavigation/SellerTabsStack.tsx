import React from 'react'

import { createStackNavigator } from '@react-navigation/stack';
import { BackgroundColor } from '../../../constants/Colors';
import Chat from '../../Chat';
import SellerTabs from './SellerTabs';

const UserTabsStack = () => {
    const stack = createStackNavigator();
    return (
        <>
            <stack.Navigator
                initialRouteName='Tabs'
                screenOptions={{ cardStyle: { backgroundColor: BackgroundColor } }}
            >
                <stack.Screen name='Tabs' component={SellerTabs} options={{ headerShown: false }} />
                <stack.Screen name='Chat' component={Chat} options={{ headerShown: false }} />
            </stack.Navigator>
        </>
    )
}

export default UserTabsStack