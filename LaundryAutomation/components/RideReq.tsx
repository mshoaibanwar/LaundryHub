import { Banknote, Bike, BikeIcon, LocateFixed, MapPin, MessageSquare, Navigation, Phone } from 'lucide-react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Image, Platform, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'
import { BlueColor, DarkGrey, LightGreen } from '../constants/Colors'
import { axiosInstance } from '../helpers/AxiosAPI'
import { useAppDispatch, useAppSelector } from '../hooks/Hooks'
import { useDistance } from '../helpers/DistanceCalculator'
import socket from '../helpers/Socket'
import { emptyMsg } from '../reduxStore/reducers/MessagesReducer'

const RideReq = ({ navigation }: any) => {
    const [rideAccepted, setRideAccepted] = React.useState(false)
    const mapRef = useRef<any>(null);
    const [rideData, setRideData] = useState<any>({});
    const [rider, setRider] = useState<any>({});
    const [riderLocation, setRiderLocation] = useState<any>({ latitude: 0, longitude: 0 });
    const [disableBtn, setDisableBtn] = useState(false);

    const user: any = useAppSelector((state) => state.user.value);

    const distance = useDistance({ from: { latitude: rideData?.pCord?.lati, longitude: rideData?.pCord?.longi }, to: { latitude: rideData?.dCord?.lati, longitude: rideData?.dCord?.longi } });
    let fare = distance * 20;

    const goToRider = () => {
        //Animate the user to new region. Complete this animation in 3 seconds
        mapRef?.current?.animateToRegion({ latitude: riderLocation?.latitude, longitude: riderLocation?.longitude, latitudeDelta: 0.025, longitudeDelta: 0.0121 }, 2000);
    };

    const goToPickup = () => {
        //Animate the user to new region. Complete this animation in 3 seconds
        mapRef?.current?.animateToRegion({ latitude: Number(rideData?.pCord?.lati), longitude: Number(rideData?.pCord?.longi), latitudeDelta: 0.025, longitudeDelta: 0.0121 }, 2000);
    };
    const goToDest = () => {
        //Animate the user to new region. Complete this animation in 3 seconds
        mapRef?.current?.animateToRegion({ latitude: Number(rideData?.dCord?.lati), longitude: Number(rideData?.dCord?.longi), latitudeDelta: 0.025, longitudeDelta: 0.0121 }, 2000);
    };

    // function goToPickup(): void {
    //     ws?.send(JSON.stringify({
    //         msg: 'SomeThing',
    //     })); // send a message
    // }

    useEffect(() => {
        axiosInstance.get(`rides/user/${user.user._id}`)
            .then((res) => {
                // console.log(res.data[0])
                setRideData(res.data[0])
                setRideAccepted(res.data[0].status !== 'Pending')

                axiosInstance.get(`users/getUser/${res.data[0].rid}`)
                    .then((res) => {
                        setRider(res.data);
                    })
                    .catch((err) => {
                        console.log(err.response.data);
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }, [rideAccepted]);

    useEffect(() => {
        socket.onmessage = (e) => {
            const message = JSON.parse(e.data);
            if (message.riderLocation) {
                setRiderLocation(message.riderLocation);
            }
            if (message.rideStatus) {
                if (message.rideStatus == 'Set Arrived') {
                    setDisableBtn(true);
                }
                if (message.rideStatus == 'Set Completed') {
                    navigation.navigate('RideComp', { ride: rideData });
                }
            }
        }
    }, [])

    const dispatch = useAppDispatch();
    const cancelRide = () => {
        dispatch(emptyMsg([]));
        navigation.goBack();
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {rideAccepted ?
                <View>
                    <View style={Platform.OS == 'android' ? { height: '60.5%' } : { height: '66%' }}>
                        {rideData ?
                            <MapView
                                ref={mapRef} //assign our ref to this MapView
                                style={{ flex: 1 }}
                                // showsUserLocation={true}
                                followsUserLocation={true}
                                loadingEnabled={true}
                                region={{
                                    latitude: riderLocation ? Number(riderLocation?.latitude) : 0,
                                    longitude: riderLocation ? Number(riderLocation?.longitude) : 0,
                                    latitudeDelta: 0.105,
                                    longitudeDelta: 0.0321,
                                }}
                            >
                                <Marker
                                    coordinate={{ latitude: rideData?.pCord ? Number(rideData?.pCord?.lati) : 1, longitude: rideData?.pCord ? Number(rideData?.pCord?.longi) : 1 }}
                                    title={"Pickup"}
                                    description={"House 2, street 132, G11/4"}
                                >
                                    <View style={{ padding: 5, backgroundColor: 'green', borderRadius: 50 }}>
                                        <LocateFixed color='white' size={24} />
                                    </View>
                                </Marker>
                                <Marker
                                    coordinate={{ latitude: rideData?.dCord ? Number(rideData?.dCord?.lati) : 0, longitude: rideData?.dCord ? Number(rideData?.dCord?.longi) : 0 }}
                                    title={"Destination"}
                                    description={"Shop 2, street 132, G11/4"}
                                >
                                    <View style={{ padding: 7, backgroundColor: 'green', borderRadius: 50 }}>
                                        <Navigation style={{ right: 1, top: 1 }} color='white' size={20} />
                                    </View>
                                </Marker>
                                <Marker
                                    coordinate={{ latitude: riderLocation ? Number(riderLocation?.latitude) : 0, longitude: riderLocation ? Number(riderLocation?.longitude) : 0 }}
                                    title={"Bike"}
                                    description={"Your Current Location"}
                                >
                                    <View style={{ padding: 7, backgroundColor: 'black', borderRadius: 50 }}>
                                        <BikeIcon style={{ bottom: 1 }} color='white' size={25} />
                                    </View>
                                </Marker>
                                <Polyline
                                    coordinates={[{ latitude: rideData?.pCord ? Number(rideData?.pCord?.lati) : 0, longitude: rideData?.pCord ? Number(rideData?.pCord?.longi) : 0 }, { latitude: rideData?.dCord ? Number(rideData?.dCord?.lati) : 0, longitude: rideData?.dCord ? Number(rideData?.dCord?.longi) : 0 }]}
                                    strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                                    strokeColors={['#7F0000']}
                                    strokeWidth={4}
                                />
                            </MapView>
                            : null}
                    </View>
                    <View style={{ paddingHorizontal: 20, paddingVertical: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: 'white', bottom: 20, height: '34%' }}>
                        <Pressable style={{ width: 90, height: 4, backgroundColor: DarkGrey, alignSelf: 'center', borderRadius: 10 }}></Pressable>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ margin: 5, marginTop: 0, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                <Image style={{ width: 45, height: 45, borderRadius: 50 }} defaultSource={require('../assets/images/profileph.png')} source={rider?.profile ? { uri: rider?.profile } : require('../assets/images/profileph.png')} />
                                <View style={{}}>
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginTop: 0 }}>{rider?.name}</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>+92 {rider?.phone}</Text>
                                </View>
                            </View>
                            <View style={{ justifyContent: 'center', gap: 10, flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                                <TouchableOpacity onPress={() => navigation.navigate('Chat', rider?._id)} style={{ backgroundColor: LightGreen, borderRadius: 10, padding: 10 }}>
                                    <MessageSquare size={20} color={'green'} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: LightGreen, borderRadius: 10, padding: 10 }}>
                                    <Phone size={20} color={'green'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ height: 1, width: '93%', backgroundColor: 'grey', marginHorizontal: 10, marginBottom: 8 }}>
                        </View>
                        <ScrollView>
                            <View style={{ alignItems: 'center', gap: 10, height: 10 }}>
                                <TouchableOpacity onPress={goToRider} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '95%' }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                                        <Bike color='green' size={20} />
                                    </View>
                                    <View style={{ width: '90%' }}>
                                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Rider Location</Text>
                                        <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>Click to View</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={goToPickup} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '95%' }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                                        <LocateFixed color='green' size={20} />
                                    </View>
                                    <View style={{ width: '90%' }}>
                                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Pickup Location</Text>
                                        <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>{rideData?.pLoc}</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={goToDest} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '95%' }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                                        <Navigation color='green' size={20} />
                                    </View>
                                    <View style={{ width: '90%' }}>
                                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Dropoff Location</Text>
                                        <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>{rideData.dLoc}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                        <View style={{ position: 'absolute', bottom: 5, alignSelf: 'center', backgroundColor: 'white', width: '100%', paddingHorizontal: 10 }}>
                            <View style={{ height: 1, width: '100%', backgroundColor: 'grey', marginVertical: 8 }}>
                            </View>
                            <View style={{ alignItems: 'center', width: '90%' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <MapPin color='green' size={25} />
                                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginLeft: 10 }}>{distance} KM Distance</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Banknote color='green' size={25} />
                                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginLeft: 10 }}>Fare: Rs {fare}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ height: 1, width: '100%', backgroundColor: 'grey', marginVertical: 8 }}>
                            </View>
                            <TouchableOpacity disabled={disableBtn} onPress={cancelRide} style={disableBtn ? { width: '100%', padding: 8, backgroundColor: 'grey', borderRadius: 10, alignSelf: 'center' } : { width: '100%', padding: 8, backgroundColor: 'red', borderRadius: 10, alignSelf: 'center' }}>
                                <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '500', color: 'white' }}>Cancel Ride</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                :
                <View>
                    <View style={{ marginTop: 40 }}>
                        <Text style={{ fontSize: 18, textAlign: 'center', fontWeight: '500' }}>Pickup Ride</Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <View>
                            <Text style={{ fontSize: 18, top: -80 }}>Finding Rider...</Text>
                        </View>
                        <Pressable onPress={goToDest} style={{ padding: 5, backgroundColor: 'red' }}>
                            <Text style={{ fontSize: 18 }}>Update Ride</Text>
                        </Pressable>
                    </View>
                </View>
            }
        </View >
    )
}

export default RideReq