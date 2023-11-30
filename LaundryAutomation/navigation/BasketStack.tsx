import React from 'react'

import { createStackNavigator } from '@react-navigation/stack';
import ViewBasket from '../components/ViewBasket';
import Basket from '../components/Basket';
import { BackgroundColor } from '../constants/Colors';
const BasketStack = () => {
    const stack = createStackNavigator();
    return (
        <>
            <stack.Navigator
                initialRouteName='ViewBasket'
                screenOptions={{ cardStyle: { backgroundColor: BackgroundColor } }}
            >
                <stack.Screen name='ViewBasket' component={ViewBasket} options={{ headerShown: false }} />
                <stack.Screen name='Basket' component={Basket} options={{ headerShown: false }} />
            </stack.Navigator>
        </>
    )
}

export default BasketStack