import { Banknote, CheckCheck, CreditCard, Cross, LocateFixed, MapPin, Navigation, X } from 'lucide-react-native'
import React from 'react'
import { Alert, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { BlueColor, GreyColor, LightGreen } from '../../constants/Colors'

const RideCompleted = (props: any) => {
    const onDone = () => {
        props?.navigation.navigate("riderTabs")
    }
    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ padding: 20, marginHorizontal: 30, shadowOffset: { width: 1, height: 1 }, backgroundColor: 'white', borderRadius: 10, shadowOpacity: 0.5 }}>
                {props?.route?.params?.cancelled ?
                    <View style={{ alignItems: 'center' }}>
                        <View style={{ padding: 15, backgroundColor: 'red', borderRadius: 50 }}>
                            <X size={30} color='white' />
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: '500', marginVertical: 10 }}>Your Trip has been Cancelled!</Text>
                    </View>
                    :
                    <View style={{ alignItems: 'center' }}>
                        <View style={{ padding: 15, backgroundColor: LightGreen, borderRadius: 50 }}>
                            <CheckCheck size={30} color='green' />
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: '500', marginVertical: 10 }}>Your Trip has Completed!</Text>
                    </View>
                }
                <View style={{ height: 2, width: '100%', backgroundColor: GreyColor, marginVertical: 10 }}></View>
                <View>
                    <Text style={{ fontWeight: '500' }}>{Date()}</Text>
                    <View style={{ alignItems: 'center', marginVertical: 5 }}>
                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '100%' }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                                <LocateFixed color='green' size={20} />
                            </View>
                            <View style={{ width: '90%' }}>
                                <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Pickup Location</Text>
                                <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>House# 123, Street# 123, Sector# 123, Islamabad, 440000</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '100%' }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                                <Navigation color='green' size={20} />
                            </View>
                            <View style={{ width: '90%' }}>
                                <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Dropoff Location</Text>
                                <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>House# 123, Street# 123, Sector# 123, Islamabad</Text>
                            </View>
                        </View>
                    </View>
                </View>
                {props?.route?.params?.cancelled ? null :
                    <View>
                        <View style={{ height: 2, width: '100%', backgroundColor: GreyColor, marginVertical: 10 }}></View>
                        <View style={{ alignItems: 'center', marginVertical: 5, gap: 10 }}>
                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '100%' }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                                    <MapPin color='green' size={20} />
                                </View>
                                <View style={{ width: '90%' }}>
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Distance Travelled</Text>
                                    <Text style={{ fontSize: 18, fontWeight: '300', color: 'black' }}>8 KM</Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '100%' }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                                    <Banknote color='green' size={20} />
                                </View>
                                <View style={{ width: '90%' }}>
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Earned</Text>
                                    <Text style={{ fontSize: 18, fontWeight: '300', color: 'black' }}>Rs. 180</Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '100%' }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                                    <CreditCard color='green' size={20} />
                                </View>
                                <View style={{ width: '90%' }}>
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Payment Method</Text>
                                    <Text style={{ fontSize: 18, fontWeight: '300', color: 'black' }}>Credit Card</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                }
                <View style={{ height: 2, width: '100%', backgroundColor: GreyColor, marginVertical: 10 }}></View>
                <TouchableOpacity onPress={onDone} style={{ padding: 10, backgroundColor: BlueColor, borderRadius: 10 }}>
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 18, fontWeight: '500' }}>Done</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView >
    )
}

export default RideCompleted