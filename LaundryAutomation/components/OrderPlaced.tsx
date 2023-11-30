import React from 'react'
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { BlueColor } from '../constants/Colors'

const OrderPlaced = (props: any) => {
    React.useEffect(
        () =>
            props?.navigation?.addListener('beforeRemove', (e: any) => {
                // Prevent default behavior of leaving the screen
                e.preventDefault();

                // Prompt the user before leaving the screen
            }),
        [props?.navigation]
    );
    return (
        <SafeAreaView>
            <View style={{ padding: 20, justifyContent: 'center', alignItems: 'center', height: '90%' }}>
                <Image source={require('../assets/images/orderplaced.png')} style={{ width: 250, height: 250 }} resizeMode='contain' />
                <Text style={{ fontSize: 32, color: 'black' }}>Order Placed</Text>
                <Text style={{ textAlign: 'center', marginHorizontal: 25, marginVertical: 15, color: 'black' }}>Your Order #{props?.route?.params?.id} was placed with success. You can see the status of order any time.</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('ShopsStack', { screen: 'Shops' })} style={{ backgroundColor: BlueColor, padding: 10, paddingHorizontal: 30, borderRadius: 10 }}>
                        <Text style={{ color: 'white', fontSize: 16 }}>Done</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => props.navigation.navigate('HomeStack', { screen: 'MyOrders' })} style={{ backgroundColor: BlueColor, padding: 10, paddingHorizontal: 30, borderRadius: 10 }}>
                        <Text style={{ color: 'white', fontSize: 16 }}>View Order</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default OrderPlaced