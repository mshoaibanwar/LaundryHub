
import { Bed, Building2, Home, MapPin, X } from 'lucide-react-native'
import React, { useRef, useState } from 'react'
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BlueColor, FrontColor, GreyColor } from '../constants/Colors'
import MapView from 'react-native-maps'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { useToast } from "react-native-toast-notifications";
import { useAppDispatch, useAppSelector } from '../hooks/Hooks'
import { axiosInstance } from '../helpers/AxiosAPI'

const AddAddress = (props: any) => {
    const latitudeDelta = 0.025
    const longitudeDelta = 0.025

    const [name, setName] = useState(props.route.params?.name);
    const [num, setNum] = useState(props.route.params?.num.toString());
    const [add, setAdd] = useState(props.route.params?.add);
    const [stateD, setStateD] = useState<any>(props.route.params?.cords);
    const [home, setHome] = useState(props?.route?.params ? (props?.route?.params?.type == 'Home' ? true : false) : true);
    const [hotel, setHotel] = useState(props?.route?.params ? (props?.route?.params?.type == 'Hotel' ? true : false) : false);
    const [work, setWork] = useState(props?.route?.params ? (props?.route?.params?.type == 'Work' ? true : false) : false);
    const isUpdating = props?.route?.params ? true : false;
    const [loading, setLoading] = useState(false);

    const state = {
        region: {
            latitudeDelta,
            longitudeDelta,
            latitude: props?.route?.params ? props?.route?.params?.cords?.lat : 33.70395347266037,
            longitude: props?.route?.params ? props?.route?.params?.cords?.lon : 73.04128451925754
        }
    }

    const mapRef = useRef<any>(null);
    const onRegionChange = (region: any) => {
        setStateD(region);
    }

    const user: any = useAppSelector((state) => state.user.value);

    const toast = useToast();
    const AddAddress = () => {
        if (name != undefined && add != undefined && num != undefined && stateD != null) {
            //props.navigation.navigate("ShopsStack", { screen: 'ColDel', params: { name, num, add, stateD } });
            const addressObj: any = { type: home ? 'Home' : hotel ? 'Hotel' : work ? 'Work' : 'Home', name: name, num: num, add: add, cords: { lat: stateD.latitude, lon: stateD.longitude }, uid: user?.user?._id }
            if (isUpdating) {
                axiosInstance.post(`addresses/update/${props?.route?.params?._id}`, addressObj)
                    .then(function (response: any) {
                        toast.show(response.data, {
                            type: "success",
                            placement: "top",
                            duration: 2000,
                            animationType: "slide-in",
                        });
                        setLoading(false);
                        props.navigation.navigate("HomeStack", { screen: 'Addresses', params: { name: name } })
                    })
                    .catch(function (error) {
                        // handle error
                        setLoading(false);
                        toast.show(error.response.data.message, {
                            type: "danger",
                            placement: "top",
                            duration: 3000,
                            animationType: "slide-in",
                        });
                    })
            }
            else {

                axiosInstance.post('addresses/add', addressObj)
                    .then(function (response: any) {
                        toast.show(response.data, {
                            type: "success",
                            placement: "top",
                            duration: 2000,
                            animationType: "slide-in",
                        });
                        setLoading(false);
                        props.navigation.navigate("HomeStack", { screen: 'Addresses', params: { name: '' } })
                    })
                    .catch(function (error) {
                        // handle error
                        setLoading(false);
                        toast.show(error.response.data.message, {
                            type: "danger",
                            placement: "top",
                            duration: 3000,
                            animationType: "slide-in",
                        });
                    })
            }
        }
        else {
            toast.show("Please Fill all Fields!", {
                type: "danger",
                placement: "top",
                duration: 2000,
                animationType: "slide-in",
            });
        }
    }

    const OnHome = () => {
        setHome(true);
        setHotel(false);
        setWork(false);
    }
    const OnHotel = () => {
        setHome(false);
        setHotel(true);
        setWork(false);
    }
    const OnWork = () => {
        setHome(false);
        setHotel(false);
        setWork(true);
    }

    return (
        <SafeAreaView style={{ backgroundColor: 'white' }}>
            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 10, borderBottomWidth: 0.5, borderColor: 'grey' }, Platform.OS == 'android' ? { paddingVertical: 15 } : null]}>
                <TouchableOpacity onPress={() => { props.navigation.goBack() }}>
                    <X color='black' width={25} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '600', color: 'black' }}>Address</Text>
                <View style={{ width: 25 }} />
            </View>
            <View style={{ backgroundColor: GreyColor, paddingHorizontal: 20, height: '100%' }}>
                <ScrollView >
                    <View style={{ gap: 10, marginVertical: 20 }}>
                        <View style={{ gap: 10 }}>
                            <Text style={{ color: 'black' }}>Full Name</Text>
                            <TextInput
                                style={{ backgroundColor: 'white', padding: 15, borderRadius: 10 }}
                                onChangeText={text => setName(text)}
                                value={name}
                                placeholder="Full Name"
                            />
                            <Text style={{ color: 'black' }}>Mobile Number</Text>
                            <TextInput
                                style={{ backgroundColor: 'white', padding: 15, borderRadius: 10 }}
                                onChangeText={text => setNum(text)}
                                value={num}
                                placeholder="Mobile Number"
                                keyboardType='numeric'
                            />
                        </View>
                        <Text style={{ color: 'black' }}>Full Address</Text>
                        <TextInput
                            style={{ backgroundColor: 'white', padding: 15, borderRadius: 10 }}
                            onChangeText={text => setAdd(text)}
                            value={add}
                            placeholder="Full Address"
                        />
                    </View>
                    <View style={{ marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Pressable onPress={OnHome} style={home ? styles.sbtnsActive : styles.sbtns}>
                            <Home color='black' size={23} />
                            <Text style={{ fontSize: 17, fontWeight: '500', color: 'black' }}>Home</Text>
                        </Pressable>
                        <Pressable onPress={OnHotel} style={hotel ? styles.sbtnsActive : styles.sbtns}>
                            <Bed color='black' size={23} />
                            <Text style={{ fontSize: 17, fontWeight: '500', color: 'black' }}>Hotel</Text>
                        </Pressable>
                        <Pressable onPress={OnWork} style={work ? styles.sbtnsActive : styles.sbtns}>
                            <Building2 color='black' size={23} />
                            <Text style={{ fontSize: 17, fontWeight: '500', color: 'black' }}>Work</Text>
                        </Pressable>
                    </View>
                    <View style={[{ borderRadius: 15, borderWidth: 0.5, borderColor: 'grey' }, Platform.OS == 'android' ? { overflow: 'hidden', elevation: 1 } : null]}>
                        <MapView //provider='google'
                            ref={mapRef}
                            style={{ width: '100%', height: 250, borderRadius: 15 }}
                            initialRegion={state.region}
                            showsUserLocation={true}
                            showsMyLocationButton={true}
                            //followsUserLocation={true}
                            showsCompass={true}
                            scrollEnabled={true}
                            zoomEnabled={true}
                            pitchEnabled={true}
                            rotateEnabled={true}
                            onRegionChangeComplete={onRegionChange}>
                        </MapView>
                        <View style={{ position: 'absolute', top: '40%', left: '45.7%' }}>
                            <MapPin size={30} color='black' />
                        </View>
                    </View>
                    <TouchableOpacity onPress={AddAddress} style={{ marginTop: 10, padding: 10, backgroundColor: BlueColor, borderRadius: 10 }}>
                        <Text style={{ textAlign: 'center', color: 'white', fontSize: 18, fontWeight: '500' }}>{isUpdating ? 'Update' : 'Add'}</Text>
                    </TouchableOpacity>
                    <View style={{ height: 100 }}>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    sbtns:
    {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 20,
        gap: 8,
        paddingHorizontal: 12,
        backgroundColor: 'white'
    },
    sbtnsActive:
    {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        borderWidth: 1.5,
        borderColor: 'black',
        borderRadius: 20,
        gap: 8,
        paddingHorizontal: 12,
        backgroundColor: 'white'
    }
});

export default AddAddress