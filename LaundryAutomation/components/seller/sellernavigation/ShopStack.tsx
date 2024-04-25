import React from 'react'


import { createStackNavigator } from '@react-navigation/stack';
import { BackgroundColor } from '../../../constants/Colors';
import Services from '../Services';
import SingleShop from '../SingleShop';
import EditShopDetails from '../EditShopDetails';

const ShopStack = () => {
    const stack = createStackNavigator();
    return (
        <>
            <stack.Navigator
                initialRouteName='SingleShop'
                screenOptions={{ cardStyle: { backgroundColor: BackgroundColor } }}
            >
                <stack.Screen name='SingleShop' component={SingleShop} options={{ headerShown: false }} />
                <stack.Screen name='Services' component={Services} options={{ headerShown: false }} />
                <stack.Screen name='EditShopDetails' component={EditShopDetails} options={{ headerShown: false }} />
            </stack.Navigator>
        </>
    )
}

export default ShopStack