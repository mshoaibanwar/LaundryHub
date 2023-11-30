import React from 'react'


import { createStackNavigator } from '@react-navigation/stack';
import { BackgroundColor } from '../../../constants/Colors';


const ShopStack = () => {
    const stack = createStackNavigator();
    return (
        <>
            <stack.Navigator
                initialRouteName='SingleShop'
                screenOptions={{ cardStyle: { backgroundColor: BackgroundColor } }}
            >
            </stack.Navigator>
        </>
    )
}

export default ShopStack