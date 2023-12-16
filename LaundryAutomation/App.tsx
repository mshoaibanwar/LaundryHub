
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store, persistor } from './reduxStore/Store';
import { PersistGate } from 'redux-persist/integration/react'
import { ToastProvider } from 'react-native-toast-notifications'
import { CheckCircle, AlertCircle } from 'lucide-react-native';
import { LogBox } from 'react-native';
import Splash from './components/Splash';
import { BackgroundColor } from './constants/Colors';
import MainStack from './navigation/MainStack';

const App = () => {
  const stack = createStackNavigator();
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state', 'Sending'
    , 'Require cycle:'
  ]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastProvider
          successIcon={<CheckCircle color='white' />}
          dangerIcon={<AlertCircle color='white' />}
          warningIcon={<AlertCircle color='white' />}
        >
          <NavigationContainer independent={true}>
            <stack.Navigator
              initialRouteName='Splash'
              screenOptions={{ cardStyle: { backgroundColor: BackgroundColor } }}
            >
              <stack.Screen name='Splash' component={Splash} options={{ headerShown: false }} />
              <stack.Screen name='MainStack' component={MainStack} options={{ headerShown: false, gestureEnabled: false }} />
            </stack.Navigator>
          </NavigationContainer>
        </ToastProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
