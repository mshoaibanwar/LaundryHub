import React, { useEffect } from 'react'
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { BlueColor, LightGreen } from '../constants/Colors'
import { Bike, Check, CheckCheck } from 'lucide-react-native';
import { axiosInstance } from '../helpers/AxiosAPI';
import { useToast } from 'react-native-toast-notifications';
import socket from '../helpers/Socket';

const OrderPlaced = (props: any) => {
    const [confirmed, setConfirmed] = React.useState(false)
    const [cancelled, setCancelled] = React.useState(false)
    const [pickup, setPickup] = React.useState(false)
    React.useEffect(
        () =>
            props?.navigation?.addListener('beforeRemove', (e: any) => {
                // Prevent default behavior of leaving the screen
                e.preventDefault();

                // Prompt the user before leaving the screen
            }),
        [props?.navigation]
    );

    const toast = useToast();

    const bookRider = () => {
        setPickup(true)
        axiosInstance.post('rides/add', props?.route?.params?.RideData)
            .then(function (response: any) {
                toast.show('Ride Requested!', {
                    type: "success",
                    placement: "top",
                    duration: 2000,
                    animationType: "slide-in",
                });
                props.navigation.navigate("RideReq");
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }

    useEffect(() => {
        socket.onmessage = (e: any) => {
            const data = JSON.parse(e.data)
            console.log(data)
            if (data?.orderStatus && data?.oid === props?.route?.params?.id) {
                if (data?.orderStatus === 'confirmed')
                    setConfirmed(true)
                if (data?.orderStatus === 'cancelled')
                    setCancelled(true)
            }
        }
    }, [])
    return (
        <SafeAreaView>
            {cancelled && <View style={{ backgroundColor: 'red', padding: 10, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 18 }}>Order Cancelled</Text>
            </View>}
            <View style={{ padding: 20, justifyContent: 'space-around', alignItems: 'center', height: '100%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', alignItems: 'center' }}>
                    {/* placed */}
                    <View style={{ gap: 5, alignItems: 'center' }}>
                        <View style={{ backgroundColor: 'green', borderRadius: 50, padding: 10, width: 60, height: 60, alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={35} color={'white'} />
                        </View>
                        <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '500' }}>Placed</Text>
                    </View>
                    <View style={[{ width: 40, height: 2, backgroundColor: 'green', bottom: 10, left: 4 }, !confirmed ? { backgroundColor: 'grey' } : {}]}></View>
                    {/* confirmed */}
                    <View style={{ gap: 5, alignItems: 'center' }}>
                        <View style={[{ backgroundColor: 'green', borderRadius: 50, padding: 10, width: 60, height: 60, alignItems: 'center', justifyContent: 'center' }, !confirmed ? { backgroundColor: 'grey' } : {}]}>
                            <CheckCheck size={35} color={'white'} />
                        </View>
                        <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '500' }}>Confirmed</Text>
                    </View>
                    <View style={[{ width: 40, height: 2, backgroundColor: 'green', bottom: 10, left: -5 }, !pickup ? { backgroundColor: 'grey' } : {}]}></View>
                    {/* Pickup */}
                    <View style={{ gap: 5, alignItems: 'center' }}>
                        <View style={[{ backgroundColor: 'green', borderRadius: 50, padding: 10, width: 60, height: 60, alignItems: 'center', justifyContent: 'center' }, !pickup ? { backgroundColor: 'grey' } : {}]}>
                            <Bike size={35} color={'white'} />
                        </View>
                        <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '500' }}>Pickup</Text>
                    </View>
                </View>
                <Image source={require('../assets/images/orderplaced.png')} style={{ width: 250, height: 250 }} resizeMode='contain' />
                <View style={{ alignItems: 'center', bottom: 50 }}>
                    <Text style={{ fontSize: 32, color: 'black' }}>{!confirmed ? 'Order Placed' : 'Order Confirmed'}</Text>
                    {!confirmed ? <>
                        <Text style={{ textAlign: 'center', marginHorizontal: 25, marginVertical: 15, color: 'black' }}>Your Order #{props?.route?.params?.id} was placed with success. You can see the status of order any time.</Text>
                        {props?.route?.params?.ride ?
                            <Text style={{ textAlign: 'center', marginHorizontal: 25, marginBottom: 15, color: 'black' }}>
                                Please wait for the seller to Confirm your order.
                            </Text> :
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <TouchableOpacity onPress={() => props.navigation.navigate('ShopsStack', { screen: 'Shops' })} style={{ backgroundColor: BlueColor, padding: 10, paddingHorizontal: 30, borderRadius: 10 }}>
                                    <Text style={{ color: 'white', fontSize: 16 }}>Done</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => props.navigation.navigate('HomeStack', { screen: 'MyOrders' })} style={{ backgroundColor: BlueColor, padding: 10, paddingHorizontal: 30, borderRadius: 10 }}>
                                    <Text style={{ color: 'white', fontSize: 16 }}>View Order</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </> :
                        <View>
                            <Text style={{ textAlign: 'center', marginHorizontal: 25, marginVertical: 15, color: 'black' }}>Do you want to book pickup ride for your order now?</Text>
                            <View style={{ gap: 10 }}>
                                <TouchableOpacity onPress={bookRider} style={{ backgroundColor: BlueColor, padding: 10, paddingHorizontal: 30, borderRadius: 10 }}>
                                    <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>Book Rider Now!</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => props.navigation.navigate('ShopsStack', { screen: 'Shops' })} style={{ backgroundColor: BlueColor, padding: 10, paddingHorizontal: 30, borderRadius: 10 }}>
                                    <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>Skip for now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>}
                </View>
            </View>
        </SafeAreaView>
    )
}

export default OrderPlaced