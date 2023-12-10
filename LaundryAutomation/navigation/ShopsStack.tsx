import React from 'react'
import Shops from '../components/Shops';
import SingleShop from '../components/SingleShop';

import { createStackNavigator } from '@react-navigation/stack';
import ColDelivery from '../components/ColDelivery';
import { BackgroundColor } from '../constants/Colors';
import Checkout from '../components/Checkout';
import SelectAddress from '../components/SelectAddress';
import OrderPlaced from '../components/OrderPlaced';
import RideReq from '../components/RideReq';

const ShopsStack = () => {
    const stack = createStackNavigator();
    return (
        <>
            <stack.Navigator
                initialRouteName='Shops'
                screenOptions={{ cardStyle: { backgroundColor: BackgroundColor } }}
            >
                <stack.Screen name='Shops' component={Shops} options={{ headerShown: false }} />
                <stack.Screen name='SingleShop' component={SingleShop} options={{ headerShown: false }} />
                <stack.Screen name='ColDel' component={ColDelivery} options={{ headerShown: false }} />
                <stack.Screen name='SelectAddress' component={SelectAddress} options={{ headerShown: false }} />
                <stack.Screen name='Checkout' component={Checkout} options={{ headerShown: false }} />
            </stack.Navigator>
        </>
    )
}

export default ShopsStack