import React, { useEffect, useState } from 'react'
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native'
import { BlueColor, DarkGrey, LightGreen } from '../../constants/Colors'
import { LocateFixed, Navigation } from 'lucide-react-native'
import { axiosInstance } from '../../helpers/AxiosAPI'
import RideDetails from './RideDetails'
import { useDistance } from '../../helpers/DistanceCalculator'
import { useAppSelector } from '../../hooks/Hooks'
import LottieView from 'lottie-react-native'

const RideReqCard = ({ navigation, ride, rejectRide }: any) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [shop, setShop] = useState<any>({});
    useEffect(() => {
        axiosInstance.get(`users/getUser/${ride.uid}`)
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                console.log(err.response.data);
            })
        axiosInstance.get(`shops/shopInfo/${ride?.sid}`)
            .then(function (response: any) {
                // handle success
                setShop(response.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error.response.data);
            })
    }, []);

    const suser: any = useAppSelector((state) => state.user.value);
    const distance = useDistance({ from: { latitude: ride?.pCord?.lati, longitude: ride?.pCord?.longi }, to: { latitude: ride?.dCord?.lati, longitude: ride?.dCord?.longi } });
    const away = useDistance({ from: { latitude: ride?.pCord?.lati, longitude: ride?.pCord?.longi }, to: { latitude: suser?.latitude, longitude: suser?.longitude } });
    let fare = Math.round(80 + distance * 10);

    const acceptRide = () => {
        setLoading(true);
        axiosInstance.post(`rides/acceptRide/${ride._id}`, { rid: suser.user._id, status: 'Accepted' })
            .then((res) => {
                setLoading(false);
                navigation.navigate("CRide", { ride, user, shop });
            })
            .catch((err) => {
                console.log(err.response.data);
            })
    }

    return (
        <>
            <Pressable key={ride._id} onPress={() => setModalVisible(true)} style={{ marginHorizontal: 20, marginTop: 5, borderColor: 'black', borderWidth: 1, borderRadius: 10, backgroundColor: 'white' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ margin: 10, flexDirection: 'row', gap: 10, alignItems: 'center', width: '50%' }}>
                        <Image style={{ width: 40, height: 40, borderRadius: 50 }} defaultSource={require('../../assets/images/profileph.png')} source={user?.profile ? { uri: user?.profile } : require('../../assets/images/profileph.png')} />
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginTop: 0 }}>{ride?.bkdBy == 'Shop' ? shop?.title : user?.name}</Text>
                            <Text style={{ fontSize: 14, fontWeight: '300', color: 'black', flexWrap: 'wrap' }}>+92 {ride?.bkdBy == 'Shop' ? shop?.contact : user?.phone}</Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'center', gap: 2 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, gap: 5 }}>
                            <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>{away} KM</Text>
                            <Text style={{ fontSize: 16, color: 'black' }}>Away</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, gap: 5 }}>
                            <Text style={{ fontSize: 16, color: 'black' }}>Fare:</Text>
                            <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Rs. {fare}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ height: 1, backgroundColor: '#e8e8e8', marginBottom: 10 }}></View>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '88%' }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                            <LocateFixed color='green' size={20} />
                        </View>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Pickup Location</Text>
                            <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>{ride.pLoc}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', marginHorizontal: 40 }}>
                        <View style={{ height: 30, width: 2, backgroundColor: 'green' }}></View>
                        <Text style={{ fontSize: 16, fontWeight: '400', color: 'black' }}>{distance} KM</Text>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '88%' }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                            <Navigation color='green' size={20} />
                        </View>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Dropoff Location</Text>
                            <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>{ride.dLoc}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                    <TouchableOpacity onPress={() => rejectRide(ride)} style={{ backgroundColor: DarkGrey, width: '48%', borderRadius: 5, padding: 8 }}>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'white', textAlign: 'center' }}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={acceptRide} style={{ backgroundColor: BlueColor, width: '48%', borderRadius: 5, padding: 8 }}>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'white', textAlign: 'center' }}>Accept</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>

            {loading ?
                <View style={{ padding: 30, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView style={{ width: 150, height: 150 }} source={require('../../assets/animated/loading.json')} autoPlay loop />
                </View>
                : null}

            <RideDetails navigation={navigation} setModal={setModalVisible} modalVisible={modalVisible} ride={ride} user={user} isAccepted={false} shop={shop} />
        </>
    )
}

export default RideReqCard