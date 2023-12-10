import React, { useEffect, useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { axiosInstance } from '../../helpers/AxiosAPI';
import { useDistance } from '../../helpers/DistanceCalculator';
import { Calendar, LocateFixed, Navigation } from 'lucide-react-native';
import { LightGreen } from '../../constants/Colors';
import RideDetails from './RideDetails';

const RideCard = ({ navigation, ride }: any) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState<any>({});
    useEffect(() => {
        axiosInstance.get(`users/getUser/${ride.uid}`)
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                console.log(err.response.data);
            })
    }, []);

    const distance = useDistance({ from: { latitude: ride.pCord.lati, longitude: ride.pCord.longi }, to: { latitude: ride.dCord.lati, longitude: ride.dCord.longi } });
    let fare = 80 + distance * 10;
    return (
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginHorizontal: 20, marginTop: 5, borderColor: 'black', borderWidth: 1, borderRadius: 10, backgroundColor: 'white' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ margin: 10, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <Image style={{ width: 40, height: 40, borderRadius: 50 }} defaultSource={require('../../assets/images/profileph.png')} source={{ uri: user?.profile }} />
                    <View style={{}}>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginTop: 0 }}>{user?.name}</Text>
                        <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>+92 {user?.phone}</Text>
                    </View>
                </View>
                <View style={{ justifyContent: 'center', gap: 2 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, gap: 5 }}>
                        <Text style={{ fontSize: 16, color: 'black' }}>Distance:</Text>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>{distance} KM</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, gap: 5 }}>
                        <Text style={{ fontSize: 16, color: 'black' }}>Fare:</Text>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Rs. {fare}</Text>
                    </View>
                </View>
            </View>
            <View style={{ alignItems: 'center', gap: 10, margin: 10, marginTop: 0 }}>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '100%' }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                        <LocateFixed color='green' size={20} />
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Pickup Location</Text>
                        <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>{ride.pLoc}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '100%' }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                        <Navigation color='green' size={20} />
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Dropoff Location</Text>
                        <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>{ride.dLoc}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '100%' }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                        <Calendar color='green' size={20} />
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Date, Time</Text>
                        <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>{ride.createdAt.split('T')[0]} | {ride.createdAt.split('T')[1].split('.')[0]}</Text>
                    </View>
                </View>
            </View>
            <RideDetails navigation={navigation} setModal={setModalVisible} modalVisible={modalVisible} ride={ride} user={user} isAccepted={true} />
        </TouchableOpacity>
    )
}

export default RideCard