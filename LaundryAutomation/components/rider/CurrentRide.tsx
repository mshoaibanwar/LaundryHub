import React, { useEffect, useState } from 'react'
import { BlueColor, DarkGrey, LightGreen } from '../../constants/Colors';

import {
    Text,
    View,
    Image,
    TouchableOpacity,
    Pressable,
    Linking,
} from 'react-native';

import { axiosInstance } from '../../helpers/AxiosAPI';
import LottieView from 'lottie-react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Banknote, BikeIcon, LocateFixed, MapPin, MessageSquare, Navigation, Phone } from 'lucide-react-native';
// import MapViewDirections from 'react-native-maps-directions';
import { useRef } from "react";
import RideDetails from './RideDetails';
import ActionSheet from 'react-native-actionsheet'
import { useAppDispatch, useAppSelector } from '../../hooks/Hooks';
import { useDistance } from '../../helpers/DistanceCalculator';
import socket from '../../helpers/Socket';
import { emptyMsg } from '../../reduxStore/reducers/MessagesReducer';
import { on } from 'events';

let locationUpdateInterval: NodeJS.Timeout;

const CurrentRide = (props: any) => {
    const [ride, setRide] = useState<any>(props?.route?.params?.ride);
    const mapRef = useRef<any>(null);
    const actionSheetRef = useRef<any>(null);
    const texts = ['Set Arrived', 'Set Pickedup', 'Set Droppedoff', 'Set Completed', 'Completed']
    const [btnPressCount, setBtnPressCount] = useState(0);
    const [origin, setOrigin] = useState({ latitude: Number(props?.route?.params?.ride?.pCord?.lati), longitude: Number(props?.route?.params?.ride?.pCord?.longi), latitudeDelta: 0.025, longitudeDelta: 0.0121 });
    const [destination, setDestination] = useState({ latitude: Number(props?.route?.params?.ride?.dCord?.lati), longitude: Number(props?.route?.params?.ride?.dCord?.longi), latitudeDelta: 0.025, longitudeDelta: 0.0121 });
    const [shop, setShop] = useState<any>(props?.route?.params?.shop);
    const [modalVisible, setModalVisible] = useState(false);
    const [isPicked, setIsPicked] = useState(false);

    const user: any = useAppSelector((state) => state.user.value);
    let ruser = props?.route?.params?.user;

    const dispatch = useAppDispatch();

    const distance = useDistance({ from: { latitude: ride?.pCord?.lati, longitude: ride?.pCord?.longi }, to: { latitude: ride?.dCord?.lati, longitude: ride?.dCord?.longi } });
    let fare = Math.round(80 + distance * 10);

    const goToMyLoc = () => {
        //Animate the user to new region. Complete this animation in 3 seconds
        mapRef?.current?.animateToRegion({ latitude: Number(user?.latitude), longitude: Number(user?.longitude), latitudeDelta: 0.025, longitudeDelta: 0.0121 }, 2000);
    };

    const goToPickup = () => {
        //Animate the user to new region. Complete this animation in 3 seconds
        mapRef?.current?.animateToRegion(origin, 2000);
    };
    const goToDest = () => {
        //Animate the user to new region. Complete this animation in 3 seconds
        mapRef?.current?.animateToRegion(destination, 2000);
    };

    const onRideBtnPress = () => {
        setBtnPressCount(btnPressCount + 1);
        socket.send(JSON.stringify({
            rideStatus: texts[btnPressCount],
            to: ruser._id,
        }))
        if (btnPressCount == 1) {
            setIsPicked(true);
        }
        if (btnPressCount == 3) {
            dispatch(emptyMsg());
            axiosInstance.post(`rides/updateStatus/${ride._id}`, { status: 'Completed' })
                .then((res) => {
                    props.navigation.navigate('RideComp', { ride, distance });
                })
                .catch((err) => {
                    console.log(err.response.data);
                })
        }
    }

    const cancelRide = () => {
        actionSheetRef?.current?.show()
    }

    useEffect(() => {
        socket.send(JSON.stringify({
            riderLocation: { latitude: user?.latitude, longitude: user?.longitude },
            to: ruser._id,
        }));
        trackLocation();
        return () => {
            clearInterval(locationUpdateInterval);
        };
    }, []);

    const trackLocation = () => {
        locationUpdateInterval = setInterval(() => {
            socket.send(JSON.stringify({
                riderLocation: { latitude: user?.latitude, longitude: user?.longitude },
                to: ruser._id,
            }))
        }, 10000);
    };

    const onRideCancel = () => {
        dispatch(emptyMsg());
        axiosInstance.post(`rides/updateStatus/${ride._id}`, { status: 'Cancelled' })
            .then((res) => {
                props.navigation.navigate('RideComp', { ride, cancelled: true });
            })
            .catch((err) => {
                console.log(err.response.data);
            })
    }

    return (
        <View style={{ height: '100%', backgroundColor: 'white' }}>
            <View style={{ height: '62%' }}>
                <MapView
                    ref={mapRef} //assign our ref to this MapView
                    style={{ flex: 1 }}
                    // showsUserLocation={true}
                    followsUserLocation={true}
                    loadingEnabled={true}
                    region={{
                        latitude: Number(user?.latitude),
                        longitude: Number(user?.longitude),
                        latitudeDelta: 0.105,
                        longitudeDelta: 0.0321,
                    }}
                >
                    <Marker
                        coordinate={origin}
                        title={"Pickup"}
                        description={"House 2, street 132, G11/4"}
                    >
                        <View style={{ padding: 5, backgroundColor: 'green', borderRadius: 50 }}>
                            <LocateFixed color='white' size={24} />
                        </View>
                    </Marker>
                    <Marker
                        coordinate={destination}
                        title={"Destination"}
                        description={"Shop 2, street 132, G11/4"}
                    >
                        <View style={{ padding: 7, backgroundColor: 'green', borderRadius: 50 }}>
                            <Navigation style={{ right: 1, top: 1 }} color='white' size={20} />
                        </View>
                    </Marker>
                    <Marker
                        coordinate={{ latitude: Number(user?.latitude), longitude: Number(user?.longitude) }}
                        title={"Bike"}
                        description={"Your Current Location"}
                    >
                        <View style={{ padding: 7, backgroundColor: 'black', borderRadius: 50 }}>
                            <BikeIcon style={{ bottom: 1 }} color='white' size={25} />
                        </View>
                    </Marker>
                    <Polyline
                        coordinates={[origin, destination]}
                        strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                        strokeColors={['#7F0000']}
                        strokeWidth={4}
                    />
                    {/* <MapViewDirections
                        origin={origin}
                        destination={destination}
                        apikey={GOOGLE_MAPS_APIKEY}
                    /> */}
                </MapView>

                <TouchableOpacity onPress={goToMyLoc}
                    style={{ position: 'absolute', bottom: 35, left: 10, backgroundColor: 'white', padding: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <Navigation fill='blue' size={25} color='blue' />
                </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 20, paddingVertical: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: 'white', bottom: 20 }}>
                <Pressable onTouchMove={() => setModalVisible(true)} onTouchStart={() => setModalVisible(true)} style={{ width: 90, height: 4, backgroundColor: DarkGrey, alignSelf: 'center', borderRadius: 10 }}></Pressable>
                {isPicked ?
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ margin: 5, marginTop: 0, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                            <Image style={{ width: 50, height: 50, borderRadius: 50 }} defaultSource={require('../../assets/images/profileph.png')} source={ruser?.profile ? { uri: ruser?.profile } : require('../../assets/images/profileph.png')} />
                            <View style={{}}>
                                <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginTop: 0 }}>{ride?.bkdBy == 'Shop' ? ruser?.name : shop?.title}</Text>
                                <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>{ride?.bkdBy == 'Shop' ? ruser?.phone : shop?.contact}</Text>
                            </View>
                        </View>
                        <View style={{ justifyContent: 'center', gap: 10, flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                            <TouchableOpacity onPress={() => props.navigation.navigate('Chat', ride?.bkdBy == 'Shop' ? ruser._id : shop.uid)} style={{ backgroundColor: LightGreen, borderRadius: 10, padding: 10 }}>
                                <MessageSquare size={20} color={'green'} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL(`tel:+92 ${ride?.bkdBy == 'Shop' ? ruser?.phone : shop?.contact}`)} style={{ backgroundColor: LightGreen, borderRadius: 10, padding: 10 }}>
                                <Phone size={20} color={'green'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ margin: 5, marginTop: 0, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                            <Image style={{ width: 50, height: 50, borderRadius: 50 }} defaultSource={require('../../assets/images/profileph.png')} source={ruser?.profile ? { uri: ruser?.profile } : require('../../assets/images/profileph.png')} />
                            <View style={{}}>
                                <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginTop: 0 }}>{ride?.bkdBy == 'Shop' ? shop?.title : ruser?.name}</Text>
                                <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>{ride?.bkdBy == 'Shop' ? shop?.contact : ruser?.phone}</Text>
                            </View>
                        </View>
                        <View style={{ justifyContent: 'center', gap: 10, flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                            <TouchableOpacity onPress={() => props.navigation.navigate('Chat', ride?.bkdBy == 'Shop' ? shop.uid : ruser._id)} style={{ backgroundColor: LightGreen, borderRadius: 10, padding: 10 }}>
                                <MessageSquare size={20} color={'green'} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL(`tel:+92 ${ride?.bkdBy == 'Shop' ? shop?.contact : ruser?.phone}`)} style={{ backgroundColor: LightGreen, borderRadius: 10, padding: 10 }}>
                                <Phone size={20} color={'green'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                <View style={{ height: 1, width: '93%', backgroundColor: 'grey', marginHorizontal: 10, marginBottom: 8 }}>
                </View>
                <View style={{ alignItems: 'center', gap: 5 }}>
                    <TouchableOpacity onPress={goToPickup} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '95%' }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                            <LocateFixed color='green' size={20} />
                        </View>
                        <View style={{ width: '90%' }}>
                            <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Pickup Location</Text>
                            <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>{ride?.pLoc}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={goToDest} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '95%' }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                            <Navigation color='green' size={20} />
                        </View>
                        <View style={{ width: '90%' }}>
                            <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Dropoff Location</Text>
                            <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>{ride?.dLoc}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 1, width: '93%', backgroundColor: 'grey', marginHorizontal: 10, marginVertical: 8 }}>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%' }}>
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
                <View style={{ height: 1, width: '93%', backgroundColor: 'grey', marginHorizontal: 10, marginVertical: 8 }}>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={{ backgroundColor: BlueColor, borderRadius: 5, padding: 6, marginHorizontal: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'white', textAlign: 'center' }}>View Details</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10, marginTop: 5 }}>
                    <TouchableOpacity onPress={onRideBtnPress} style={{ backgroundColor: BlueColor, width: '65%', borderRadius: 5, padding: 8 }}>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'white', textAlign: 'center' }}>{texts[btnPressCount]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={cancelRide} style={{ backgroundColor: 'red', width: '33%', borderRadius: 5, padding: 8 }}>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'white', textAlign: 'center' }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ActionSheet
                ref={actionSheetRef}
                title={'Do you really want to Cancel this Ride ?'}
                options={['Yes, Cancel', 'No']}
                cancelButtonIndex={1}
                destructiveButtonIndex={0}
                onPress={(index: any) => { if (index == 0) { onRideCancel() } }}
            />

            <RideDetails navigation={props.navigation} setModal={setModalVisible} modalVisible={modalVisible} ride={ride} user={ruser} isAccepted={true} shop={props?.route?.params?.shop} />
        </View>
    );
}
export default CurrentRide;