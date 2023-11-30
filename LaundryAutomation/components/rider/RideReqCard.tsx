import React from 'react'
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native'
import { BlueColor, DarkGrey, LightGreen } from '../../constants/Colors'
import { LocateFixed, Navigation } from 'lucide-react-native'

const RideReqCard = ({ navigation, setModal }: any) => {
    return (
        <Pressable onPress={() => setModal(true)} style={{ marginHorizontal: 20, marginTop: 5, borderColor: 'black', borderWidth: 1, borderRadius: 10, backgroundColor: 'white' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ margin: 10, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <Image style={{ width: 50, height: 50, borderRadius: 50 }} source={require('../../assets/images/profileph.png')} />
                    <View style={{}}>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginTop: 0 }}>Wali M.</Text>
                        <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>wali@gmail.com</Text>
                    </View>
                </View>
                <View style={{ justifyContent: 'center', gap: 2 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, gap: 5 }}>
                        <Text style={{ fontSize: 16, color: 'black' }}>Distance:</Text>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>5 KM</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, gap: 5 }}>
                        <Text style={{ fontSize: 16, color: 'black' }}>Fare:</Text>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Rs. 120</Text>
                    </View>
                </View>
            </View>
            <View style={{ alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '88%' }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                        <LocateFixed color='green' size={20} />
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Pickup Location</Text>
                        <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>House# 123, Street# 123, Sector# 123, Islamabad, 440000</Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '88%' }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                        <Navigation color='green' size={20} />
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Dropoff Location</Text>
                        <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>House# 123, Street# 123, Sector# 123, Islamabad</Text>
                    </View>
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                <TouchableOpacity style={{ backgroundColor: DarkGrey, width: '48%', borderRadius: 5, padding: 8 }}>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'white', textAlign: 'center' }}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("CRide")} style={{ backgroundColor: BlueColor, width: '48%', borderRadius: 5, padding: 8 }}>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'white', textAlign: 'center' }}>Accept</Text>
                </TouchableOpacity>
            </View>
        </Pressable>
    )
}

export default RideReqCard