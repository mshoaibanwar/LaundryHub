import { X, UserCog, MapPin, Folder, Languages, BadgeInfo, Lock, LogOut, Bike, Banknote, LocateFixed, Navigation, Router, Phone, Scroll } from 'lucide-react-native'
import React, { useRef } from 'react'
import { Image, ScrollView, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { Modal, Pressable, Text, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Toast from 'react-native-toast-notifications';
import { CommonActions, StackActions, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../hooks/Hooks';
import { LightGreen } from '../../constants/Colors';
import MapView from 'react-native-maps';

interface propsTypes {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    modalVisible: boolean;
    navigation: any;
    isAccepted: boolean;
}

const RideDetails = ({ setModal, modalVisible, navigation, isAccepted }: propsTypes) => {
    const user: any = useAppSelector((state) => state.user.value);

    const toastRef = useRef<any>(null);

    const items = [1, 2, 3, 4, 5, 6]
    const onMyOrder = () => {
        if (user?.userType == "user")
            navigation.navigate("HomeStack", { screen: 'MyOrders' });
        else if (user?.userType == "seller")
            navigation.navigate("OrdersStack", { screen: 'Orders' });
        else if (user?.userType == "rider")
            navigation.navigate("HomeStack", { screen: 'MyRides' });
        setModal(false)
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
                                    <MapView
                                        style={{ width: '100%', height: 200, borderRadius: 10 }}
                                        initialRegion={{
                                            latitude: 33.6844,
                                            longitude: 73.0479,
                                            latitudeDelta: 0.0922,
                                            longitudeDelta: 0.0421,
                                        }}
                                        showsUserLocation={true}
                                        showsMyLocationButton={true}
                                    />
                                </View>
                                <View>
                                    <TouchableOpacity onPress={onMyOrder} style={{ alignItems: 'center', justifyContent: 'center', padding: 8, backgroundColor: 'green', borderRadius: 5, marginBottom: 10 }}>
                                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>Accept Ride</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                        <View style={{ marginVertical: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Image style={{ width: 50, height: 50, borderRadius: 50 }} source={require('../../assets/images/profileph.png')} />
                                <View style={{}}>
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginTop: 0 }}>Wali M.</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>wali@gmail.com</Text>
                                </View>
                            </View>
                            <View style={{ padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                                <Phone color='green' size={25} />
                            </View>
                        </View>
                        <View style={{ height: 1, backgroundColor: '#e8e8e8', marginVertical: 10 }}></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MapPin color='green' size={25} />
                                <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginLeft: 10 }}>5 KM away</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Banknote color='green' size={25} />
                                <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginLeft: 10 }}>Fare: Rs 150</Text>
                            </View>
                        </View>
                        <View style={{ height: 1, backgroundColor: '#e8e8e8', marginVertical: 10 }}></View>
                        <View style={{ gap: 10 }}>
                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '85%' }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                                    <LocateFixed color='green' size={25} />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Pickup Location</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>House# 123, Street# 123, Sector# 123, Islamabad, 440000</Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '85%' }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                                    <Navigation color='green' size={25} />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Dropoff Location</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>House# 123, Street# 123, Sector# 123, Islamabad</Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '85%' }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                                    <Router color='green' size={25} />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Distance</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>10 KM</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ height: 1, backgroundColor: '#e8e8e8', marginVertical: 10 }}></View>
                        <View>
                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'baseline' }}>
                                <Text style={{ fontSize: 18 }}>Items</Text>
                                <Text>x3</Text>
                            </View>
                            <View style={{ alignItems: 'center', marginVertical: 10, justifyContent: 'center', gap: 5 }}>
                                {items.map((item, index) => {
                                    return (
                                        <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '90%' }}>
                                            <View>
                                                <Text style={{ fontSize: 18, fontWeight: '500', color: 'black' }}>Shirt</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', gap: 5 }}>
                                                <Image style={{ width: 40, height: 40 }} source={require('../../assets/icons/clothes.png')} />
                                                <Image style={{ width: 40, height: 40 }} source={require('../../assets/icons/clothes.png')} />
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