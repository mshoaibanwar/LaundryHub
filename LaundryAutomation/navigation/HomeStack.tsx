import React from 'react'

import { createStackNavigator } from '@react-navigation/stack';
import Home from '../components/Home';
import { BackgroundColor } from '../constants/Colors';
import Account from '../components/Account';
import MyAddresses from '../components/MyAddresses';
import AddAddress from '../components/AddAddress';
import MyOrders from '../components/MyOrders';
import OrderDetail from '../components/OrderDetail';
import ChangePswrd from '../components/ChangePswrd';
import Notifications from '../components/Notifications';
import MyRides from '../components/rider/MyRides';

const HomeStack = () => {
    const stack = createStackNavigator();
    return (
        <>
            <stack.Navigator
                initialRouteName='Home'
                screenOptions={{ cardStyle: { backgroundColor: BackgroundColor } }}
            >
                <stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
                <stack.Screen name='Account' component={Account} options={{ headerShown: false }} />
                <stack.Screen name='Addresses' component={MyAddresses} options={{ headerShown: false }} />
                <stack.Screen name='AddAddress' component={AddAddress} options={{ headerShown: false }} />
                <stack.Screen name='MyOrders' component={MyOrders} options={{ headerShown: false }} />
                <stack.Screen name='MyRides' component={MyRides} options={{ headerShown: false }} />
                <stack.Screen name='OrderDetail' component={OrderDetail} options={{ headerShown: false }} />
                <stack.Screen name='ChangePswrd' component={ChangePswrd} options={{ headerShown: false }} />
                <stack.Screen name='Noti' component={Notifications} options={{ headerShown: false }} />
            </stack.Navigator>
        </>
    )
}

export default HomeStack