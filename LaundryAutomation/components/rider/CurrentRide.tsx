import React, { useEffect, useState } from 'react'
import { BlueColor, DarkGrey, LightGreen } from '../../constants/Colors';

import {
    Text,
    View,
    Image,
    TouchableOpacity,
    Pressable,
} from 'react-native';

import { axiosInstance } from '../../helpers/AxiosAPI';
import LottieView from 'lottie-react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Banknote, Bike, BikeIcon, LocateFixed, MapIcon, MapPin, MessageCircle, MessageSquare, Navigation, Phone } from 'lucide-react-native';
// import MapViewDirections from 'react-native-maps-directions';
import { useRef } from "react";
import RideDetails from './RideDetails';
import ActionSheet from 'react-native-actionsheet'
import Geolocation from '@react-native-community/geolocation';
import { useAppSelector } from '../../hooks/Hooks';
import { useDistance } from '../../helpers/DistanceCalculator';

let locationWatchId: number;
let locationUpdateInterval: NodeJS.Timeout;

const CurrentRide = (props: any) => {
    const [ride, setRide] = useState<any>(props?.route?.params?.ride);
    const mapRef = useRef<any>(null);
    const actionSheetRef = useRef<any>(null);
    const texts = ['Set Arrived', 'Set Pickedup', 'Set Droppedoff', 'Set Completed']
    const [btnPressCount, setBtnPressCount] = useState(0);
    const [origin, setOrigin] = useState({ latitude: props?.route?.params?.ride?.pCord?.lati, longitude: props?.route?.params?.ride?.pCord?.longi });
    const [destination, setDestination] = useState({ latitude: props?.route?.params?.ride?.dCord?.lati, longitude: props?.route?.params?.ride?.dCord?.longi });
    const [currentLoc, setCurrentLoc] = useState({ latitude: 37.75125, longitude: -122.4524 });
    const [lastLoc, setLastLoc] = useState({ latitude: 0, longitude: 0 });
    // const GOOGLE_MAPS_APIKEY = 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY';
    const [modalVisible, setModalVisible] = useState(false);

    const user: any = useAppSelector((state) => state.user.value);
    let ruser = props?.route?.params?.user;

    const distance = useDistance({ from: { latitude: ride?.pCord?.lati, longitude: ride?.pCord?.longi }, to: { latitude: ride?.dCord?.lati, longitude: ride?.dCord?.longi } });
    let fare = distance * 20;

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
        if (btnPressCount == 3) {
            props.navigation.navigate('RideComp', { ride });
        }
    }

    const cancelRide = () => {
        actionSheetRef?.current?.show()
    }

    useEffect(() => {
        trackLocation();
    }, []);

    const trackLocation = () => {
        // Watch for location changes
        locationWatchId = Geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLoc({ latitude, longitude });
            },
            (error) => console.error(error),
            { enableHighAccuracy: true, distanceFilter: 5 } // Update only when the user moves more than 5 meters
        );

        // Send location to MongoDB API every 10 seconds
        locationUpdateInterval = setInterval(() => {
            if (
                currentLoc.latitude !== lastLoc.latitude ||
                currentLoc.longitude !== lastLoc.longitude
            ) {
                // Make API call to store coordinates in MongoDB
                saveCoordinatesToMongoDB(currentLoc);

                // Update last location
                setLastLoc(currentLoc);
            }
        }, 10000); // Update every 10 seconds
    };

    const saveCoordinatesToMongoDB = async (coordinates: { latitude: number; longitude: number }) => {
        const apiUrl = `/rides/updateLoc/${user.user._id}`;
        await axiosInstance.post(apiUrl, coordinates)
            .then(function (response: any) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return (
        <View style={{ height: '100%', backgroundColor: 'white' }}>
            <View style={{ height: '62%' }}>
                <MapView
                    ref={mapRef} //assign our ref to this MapView
                    style={{ flex: 1 }}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    loadingEnabled={true}
                    region={{
                        latitude: currentLoc.latitude,
                        longitude: currentLoc.longitude,
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
                        coordinate={currentLoc}
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
            </View>
            <View style={{ paddingHorizontal: 20, paddingVertical: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: 'white', bottom: 20 }}>
                <Pressable onTouchMove={() => setModalVisible(true)} onTouchStart={() => setModalVisible(true)} style={{ width: 90, height: 4, backgroundColor: DarkGrey, alignSelf: 'center', borderRadius: 10 }}></Pressable>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ margin: 5, marginTop: 0, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                        <Image style={{ width: 50, height: 50, borderRadius: 50 }} source={ruser ? { uri: ruser?.profile } : require('../../assets/images/profileph.png')} />
                        <View style={{}}>
                            <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginTop: 0 }}>{ruser?.name}</Text>
                            <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>{ruser?.phone}</Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'center', gap: 10, flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                        <TouchableOpacity style={{ backgroundColor: LightGreen, borderRadius: 10, padding: 10 }}>
                            <MessageSquare size={20} color={'green'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: LightGreen, borderRadius: 10, padding: 10 }}>
                            <Phone size={20} color={'green'} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ height: 1, width: '93%', backgroundColor: 'grey', marginHorizontal: 10, marginBottom: 8 }}>
                </View>
                <View style={{ alignItems: 'center', gap: 5 }}>
                    <Pressable onPress={goToPickup} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '95%' }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                            <LocateFixed color='green' size={20} />
                        </View>
                        <View style={{ width: '90%' }}>
                            <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Pickup Location</Text>
                            <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>{ride?.pLoc}</Text>
                        </View>
                    </Pressable>

                    <Pressable onPress={goToDest} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '95%' }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                            <Navigation color='green' size={20} />
                        </View>
                        <View style={{ width: '90%' }}>
                            <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Dropoff Location</Text>
                            <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>{ride?.dLoc}</Text>
                        </View>
                    </Pressable>
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
                onPress={(index: any) => { if (index == 0) props.navigation.navigate('RideComp', { ride, cancelled: true }) }}
            />

            <RideDetails setModal={setModalVisible} modalVisible={modalVisible} ride={ride} user={ruser} isAccepted={true} />
        </View>
    );
}
export default CurrentRide;