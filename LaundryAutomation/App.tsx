
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './navigation/Tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store, persistor } from './reduxStore/Store';
import { PersistGate } from 'redux-persist/integration/react'
import { ToastProvider } from 'react-native-toast-notifications'
import { CheckCircle, AlertCircle } from 'lucide-react-native';
import { LogBox } from 'react-native';
import GetStart from './components/GetStart';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPswrd from './components/ForgotPswrd';
import Splash from './components/Splash';
import AddShopData from './components/seller/AddShopData';
import ShopLocation from './components/seller/ShopLocation';
import { BackgroundColor } from './constants/Colors';
import AddRiderData from './components/rider/AddRiderData';
import RiderTabsStack from './components/rider/ridernavigation/RiderTabsStack';
import UserTabsStack from './navigation/UserTabsStack';
import SellerTabsStack from './components/seller/sellernavigation/SellerTabsStack';

const App = () => {

  const stack = createStackNavigator();
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state', 'Sending'
  ]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastProvider
          successIcon={<CheckCircle color='white' />}
          dangerIcon={<AlertCircle color='white' />}
          warningIcon={<AlertCircle color='white' />}
        >
          <NavigationContainer>
            <stack.Navigator
              initialRouteName='Splash'
              screenOptions={{ cardStyle: { backgroundColor: BackgroundColor } }}
            >
              <stack.Screen name='Splash' component={Splash} options={{ headerShown: false }} />
              <stack.Screen name='GetStart' component={GetStart} options={{ headerShown: false }} />
              <stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
              <stack.Screen name='Register' component={Register} options={{ headerShown: false }} />
              <stack.Screen name='Forgot' component={ForgotPswrd} options={{ headerShown: false }} />
              <stack.Screen name='AddShopData' component={AddShopData} options={{ headerShown: false }} />
              <stack.Screen name='AddRiderData' component={AddRiderData} options={{ headerShown: false }} />
              <stack.Screen name='ShopLocation' component={ShopLocation} options={{ headerShown: false }} />
              <stack.Screen name='Tab' component={UserTabsStack} options={{ headerShown: false, gestureEnabled: false }} />
              <stack.Screen name='SellerTab' component={SellerTabsStack} options={{ headerShown: false, gestureEnabled: false }} />
              <stack.Screen name='RiderTab' component={RiderTabsStack} options={{ headerShown: false, gestureEnabled: false }} />
            </stack.Navigator>
          </NavigationContainer>
        </ToastProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
