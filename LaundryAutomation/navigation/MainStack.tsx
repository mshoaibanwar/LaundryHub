import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import { BackgroundColor } from '../constants/Colors';
import Login from '../components/Login';
import AddShopData from '../components/seller/AddShopData';
import AddRiderData from '../components/rider/AddRiderData';
import ShopLocation from '../components/seller/ShopLocation';
import UserTabsStack from './UserTabsStack';
import SellerTabsStack from '../components/seller/sellernavigation/SellerTabsStack';
import RiderTabsStack from '../components/rider/ridernavigation/RiderTabsStack';
import Register from '../components/Register';
import ForgotPswrd from '../components/ForgotPswrd';

const MainStack = () => {
    const stack = createStackNavigator();
    return (
        <stack.Navigator
            initialRouteName='Login'
            screenOptions={{ cardStyle: { backgroundColor: BackgroundColor } }}
        >
            <stack.Screen name='Login' component={Login} options={{ headerShown: false, gestureEnabled: false }} />
            <stack.Screen name='Register' component={Register} options={{ headerShown: false }} />
            <stack.Screen name='Forgot' component={ForgotPswrd} options={{ headerShown: false }} />
            <stack.Screen name='AddShopData' component={AddShopData} options={{ headerShown: false }} />
            <stack.Screen name='AddRiderData' component={AddRiderData} options={{ headerShown: false }} />
            <stack.Screen name='ShopLocation' component={ShopLocation} options={{ headerShown: false }} />
            <stack.Screen name='Tab' component={UserTabsStack} options={{ headerShown: false, gestureEnabled: false }} />
            <stack.Screen name='SellerTab' component={SellerTabsStack} options={{ headerShown: false, gestureEnabled: false }} />
            <stack.Screen name='RiderTab' component={RiderTabsStack} options={{ headerShown: false, gestureEnabled: false }} />
        </stack.Navigator>
    )
}

export default MainStack