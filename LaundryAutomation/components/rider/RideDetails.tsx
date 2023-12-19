import { X, MapPin, Banknote, LocateFixed, Navigation, Router, Phone, BikeIcon, Star, Reply } from 'lucide-react-native'
import React, { useEffect, useRef } from 'react'
import { Image, Linking, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Modal, Pressable, Text, View } from 'react-native';
import Toast from 'react-native-toast-notifications';
import { DarkGrey, LightGreen } from '../../constants/Colors';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useDistance } from '../../helpers/DistanceCalculator';
import { useAppSelector } from '../../hooks/Hooks';
import { axiosInstance } from '../../helpers/AxiosAPI';

interface propsTypes {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    modalVisible: boolean;
    isAccepted: boolean;
    ride: any;
    user: any;
    shop: any;
    navigation: any;
}

const RideDetails = ({ navigation, setModal, modalVisible, isAccepted, ride = { pCord: { lati: 0, longi: 0 }, dCord: { lati: 0, longi: 0 }, riderCords: { lati: 0, longi: 0 } }, user, shop }: propsTypes) => {
    const [rating, setRating] = React.useState<any>(null);
    const [rated, setRated] = React.useState(false);
    const toastRef = useRef<any>(null);
    const mapRef = useRef<any>(null);
    const distance = useDistance({ from: { latitude: ride?.pCord?.lati, longitude: ride?.pCord?.longi }, to: { latitude: ride?.dCord?.lati, longitude: ride?.dCord?.longi } });
    const suser: any = useAppSelector((state) => state.user.value);
    let away = useDistance({ from: { latitude: suser?.latitude, longitude: suser?.longitude }, to: { latitude: ride?.pCord?.lati, longitude: ride?.pCord?.longi } });
    let fare = Math.round(80 + distance * 10);

    const goToPickup = () => {
        mapRef?.current?.animateToRegion({ latitude: Number(ride?.pCord?.lati), longitude: Number(ride?.pCord?.longi), latitudeDelta: 0.025, longitudeDelta: 0.0121 }, 2000);
    };
    const goToDest = () => {
        mapRef?.current?.animateToRegion({ latitude: Number(ride?.dCord?.lati), longitude: Number(ride?.dCord?.longi), latitudeDelta: 0.025, longitudeDelta: 0.0121 }, 2000);
    };

    useEffect(() => {
        if (isAccepted)
            axiosInstance.get(`ratings/ride/${ride?._id}`)
                .then(function (response: any) {
                    if (response.data.length > 0) {
                        setRated(true);
                        setRating(response?.data[0]);
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
    }, [])

    const acceptRide = () => {
        axiosInstance.post(`rides/acceptRide/${ride._id}`, { rid: suser.user._id, status: 'Accepted' })
            .then((res) => {
                setModal(false);
                navigation.navigate("CRide", { ride, user, shop });
            })
            .catch((err) => {
                console.log(err.response.data);
            })
    }

    return (
        <Modal
            animationType="slide"
            presentationStyle={'pageSheet'}
            visible={modalVisible}
            onRequestClose={() => {
                setModal(!modalVisible);
            }}>
            <View style={{ backgroundColor: 'whte' }}>
                <Toast ref={toastRef} />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Pressable onPress={() => setModal(false)} style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center', margin: 5 }}>
                        <X color='black' strokeWidth={3} size={30} />
                    </Pressable>
                    <Text style={{ fontSize: 20, fontWeight: '500', color: 'black' }}>Ride Details</Text>
                    <View style={{ width: 50 }}></View>
                </View>
                <View style={{ height: 2, backgroundColor: '#e8e8e8', top: -3 }}></View>
                <ScrollView>
                    <View style={{ padding: 20, paddingTop: 5 }}>
                        {isAccepted ? null :
                            <View>
                                <View style={{ marginBottom: 10 }}>
                                    {ride?.pCord?.lati ?
                                        <MapView
                                            // ref={mapRef}
                                            ref={mapRef}
                                            style={{ width: '100%', height: 200, borderRadius: 10 }}
                                            initialRegion={{
                                                latitude: ride?.pCord?.lati ? Number(ride?.pCord?.lati) : 0,
                                                longitude: ride?.pCord?.longi ? Number(ride?.pCord?.longi) : 0,
                                                latitudeDelta: 0.0922,
                                                longitudeDelta: 0.0421,
                                            }}
                                            showsUserLocation={true}
                                            showsMyLocationButton={true}
                                        >
                                            <Marker
                                                coordinate={{ latitude: ride ? Number(ride?.pCord?.lati) : 0, longitude: ride ? Number(ride?.pCord?.longi) : 0 }}
                                                title={"Pickup"}
                                                description={ride?.pLoc}
                                            >
                                                <View style={{ padding: 5, backgroundColor: 'green', borderRadius: 50 }}>
                                                    <LocateFixed color='white' size={24} />
                                                </View>
                                            </Marker>
                                            <Marker
                                                coordinate={{ latitude: ride ? Number(ride?.dCord?.lati) : 0, longitude: ride ? Number(ride?.dCord?.longi) : 0 }}
                                                title={"Destination"}
                                                description={ride?.dLoc}
                                            >
                                                <View style={{ padding: 7, backgroundColor: 'green', borderRadius: 50 }}>
                                                    <Navigation style={{ right: 1, top: 1 }} color='white' size={20} />
                                                </View>
                                            </Marker>
                                            <Marker
                                                coordinate={{ latitude: ride?.riderCords?.lati ? Number(ride?.riderCords?.lati) : 0, longitude: ride?.riderCords?.longi ? Number(ride?.riderCords?.longi) : 0 }}
                                                title={"Bike"}
                                                description={"Your Current Location"}
                                            >
                                                <View style={{ padding: 7, backgroundColor: 'black', borderRadius: 50 }}>
                                                    <BikeIcon style={{ bottom: 1 }} color='white' size={25} />
                                                </View>
                                            </Marker>

                                            <Polyline
                                                coordinates={[{ latitude: Number(ride?.pCord?.lati), longitude: Number(ride?.pCord?.longi) }, { latitude: Number(ride?.dCord?.lati), longitude: Number(ride?.dCord?.longi) }]}
                                                strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                                                strokeColors={['#7F0000']}
                                                strokeWidth={4}
                                            />

                                        </MapView>
                                        : null}
                                </View>
                                <View>
                                    <TouchableOpacity onPress={acceptRide} style={{ alignItems: 'center', justifyContent: 'center', padding: 8, backgroundColor: 'green', borderRadius: 5, marginBottom: 10 }}>
                                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>Accept Ride</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                        <View style={{ marginVertical: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Image style={{ width: 50, height: 50, borderRadius: 50 }} defaultSource={require('../../assets/images/profileph.png')} source={user?.profile ? { uri: user?.profile } : require('../../assets/images/profileph.png')} />
                                <View style={{}}>
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginTop: 0 }}>{ride?.bkdBy == 'Shop' ? shop?.title : user?.name}</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>+92 {ride?.bkdBy == 'Shop' ? shop?.contact : user?.phone}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => Linking.openURL(`tel:+92 ${ride?.bkdBy == 'Shop' ? shop?.contact : user?.phone}`)} style={{ padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                                <Phone color='green' size={25} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ height: 1, backgroundColor: '#e8e8e8', marginVertical: 10 }}></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MapPin color='green' size={25} />
                                <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginLeft: 10 }}>{away} KM away</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Banknote color='green' size={25} />
                                <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginLeft: 10 }}>Fare: Rs {fare}</Text>
                            </View>
                        </View>
                        <View style={{ height: 1, backgroundColor: '#e8e8e8', marginVertical: 10 }}></View>
                        <View style={{ gap: 10 }}>
                            <TouchableOpacity onPress={goToPickup} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '85%' }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                                    <LocateFixed color='green' size={25} />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Pickup Location</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>{ride?.pLoc}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={goToDest} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '85%' }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                                    <Navigation color='green' size={25} />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Dropoff Location</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>{ride?.dLoc}</Text>
                                </View>
                            </TouchableOpacity>

                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '85%' }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                                    <Router color='green' size={25} />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Distance</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>{distance} KM</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ height: 1, backgroundColor: '#e8e8e8', marginVertical: 10 }}></View>
                        <Text style={{ fontSize: 16, marginBottom: 5 }}>Deliver To:</Text>
                        <View style={{ marginVertical: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Image style={{ width: 50, height: 50, borderRadius: 50 }} defaultSource={require('../../assets/images/profileph.png')} source={user?.profile ? { uri: user?.profile } : require('../../assets/images/profileph.png')} />
                                <View style={{}}>
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginTop: 0 }}>{ride?.bkdBy == 'Shop' ? user?.name : shop?.title}</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>+92 {ride?.bkdBy == 'Shop' ? user?.phone : shop?.contact}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => Linking.openURL(`tel:+92 ${ride?.bkdBy == 'Shop' ? user?.phone : shop?.contact}`)} style={{ padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                                <Phone color='green' size={25} />
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: 1, backgroundColor: '#e8e8e8', marginVertical: 10 }}></View>

                        {rating ?
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: '500' }}>Rating:</Text>
                                <View style={{ marginVertical: 3, padding: 10, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', borderWidth: 0.5, backgroundColor: 'white' }}>
                                    <View style={{ width: '80%', gap: 3 }}>
                                        <Text style={{ fontSize: 18, fontWeight: '500', color: 'black' }}>{rating?.uname}</Text>
                                        <Text style={{ fontSize: 12, fontWeight: '400', color: DarkGrey }}>{rating?.createdAt?.split('T')[0]} | {rating?.createdAt?.split('T')[1].split('.')[0]}</Text>
                                        <Text style={{ fontSize: 14, fontWeight: '500', color: 'black' }}>{rating?.review}</Text>
                                    </View>
                                    <View style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                                            <Star size={20} color='#FFD130' fill='#FFD130' />
                                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>{rating?.rating}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ height: 1, backgroundColor: '#e8e8e8', marginVertical: 10 }}></View>
                            </View>
                            : null}

                        <View>
                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'baseline' }}>
                                <Text style={{ fontSize: 18 }}>Items</Text>
                                <Text>x{ride?.oItems?.length}</Text>
                            </View>
                            <View style={{ alignItems: 'center', marginVertical: 10, justifyContent: 'center', gap: 5 }}>
                                {ride?.oItems?.map((item: any, index: number) => {
                                    return (
                                        <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '90%' }}>
                                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'baseline' }}>
                                                <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>{index + 1}.</Text>
                                                <Text style={{ fontSize: 18, fontWeight: '500', color: 'black' }}>{item.item}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', gap: 5 }}>
                                                {item.images.map((image: any, index: number) => {
                                                    return (
                                                        <Image key={index} style={{ width: 40, height: 40 }} source={{ uri: image }} />
                                                    )
                                                })
                                                }
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>

                    </View>
                    <View style={{ height: 70 }}></View>
                </ScrollView>
            </View>

        </Modal>
    )
}

const styles = StyleSheet.create({
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginVertical: 15,
        color: 'black'
    },
    btnText: {
        fontSize: 16,
        fontWeight: '400',
        color: 'black'
    }
})

export default RideDetails