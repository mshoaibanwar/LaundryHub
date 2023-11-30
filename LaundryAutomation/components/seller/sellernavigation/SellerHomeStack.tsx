import React from 'react'

import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Home';
import { BackgroundColor } from '../../../constants/Colors';
import Account from '../../../components/Account';
import OrderDetail from '../../../components/OrderDetail';
import ChangePswrd from '../../../components/ChangePswrd';
import Notifications from '../../../components/Notifications';
import Orders from '../Orders';

const SellerHomeStack = () => {
    const stack = createStackNavigator();
    return (
        <>
            <stack.Navigator
                initialRouteName='Home'
                screenOptions={{ cardStyle: { backgroundColor: BackgroundColor } }}
            >
                <stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
                <stack.Screen name='Account' component={Account} options={{ headerShown: false }} />
                <stack.Screen name='Orders' component={Orders} options={{ headerShown: false }} />
                <stack.Screen name='OrderDetail' component={OrderDetail} options={{ headerShown: false }} />
                <stack.Screen name='ChangePswrd' component={ChangePswrd} options={{ headerShown: false }} />
                <stack.Screen name='Noti' component={Notifications} options={{ headerShown: false }} />
            </stack.Navigator>
        </>
    )
}

export default SellerHomeStack