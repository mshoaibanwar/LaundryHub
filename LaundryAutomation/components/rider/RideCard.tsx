import React from 'react'
import { Image, Text, View } from 'react-native'

const RideCard = ({ navigation, ride }: any) => {
    return (
        <View style={{ marginHorizontal: 20, marginTop: 5, borderColor: 'black', borderWidth: 1, borderRadius: 10, backgroundColor: 'white' }}>
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
            <View style={{ margin: 10, marginTop: 0 }}>
                <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Pickup Location</Text>
                <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>{ride.pLoc}</Text>

                <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Dropoff Location</Text>
                <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>{ride.dLoc}</Text>
            </View>
        </View>
    )
}

export default RideCard