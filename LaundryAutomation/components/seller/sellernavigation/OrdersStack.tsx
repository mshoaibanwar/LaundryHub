import React from 'react'

import { createStackNavigator } from '@react-navigation/stack';
import { BackgroundColor } from '../../../constants/Colors';
import Orders from '../Orders';
import OrderDetail from '../OrderDetail';
const OrdersStack = () => {
    const stack = createStackNavigator();
    return (
        <>
            <stack.Navigator
                initialRouteName='Orders'
                screenOptions={{ cardStyle: { backgroundColor: BackgroundColor } }}
            >
                <stack.Screen name='Orders' component={Orders} options={{ headerShown: false }} />
                <stack.Screen name='OrderDetail' component={OrderDetail} options={{ headerShown: false }} />
            </stack.Navigator>
        </>
    )
}

export default OrdersStack