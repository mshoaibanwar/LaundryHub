import { ChevronLeft, CopySlash, MapPin } from 'lucide-react-native'
import React, { useRef, useState } from 'react'
import { Pressable, Text, TouchableOpacity, View } from 'react-native'
import MapView from 'react-native-maps'
import { BlueColor } from '../constants/Colors'
import { useToast } from 'react-native-toast-notifications'
import LottieView from 'lottie-react-native'
import { axiosInstance } from '../helpers/AxiosAPI'
import { useAppDispatch, useAppSelector } from '../hooks/Hooks'

const UpdateLoc = (props: any) => {
    const latitudeDelta = 0.025
    const longitudeDelta = 0.025
    const [stateD, setStateD] = useState<any>(props.route?.params?.shopLoc ? [Number(props.route.params.shopLoc.lati), Number(props.route.params.shopLoc.longi)] : null);
    const [loading, setLoading] = useState(false);
    const user: any = useAppSelector((state) => state.user.value);

    const state = {
        region: {
            latitudeDelta,
            longitudeDelta,
            latitude: props.route?.params?.shopLoc ? Number(props.route.params.shopLoc.lati) : 33.70395347266037,
            longitude: props.route?.params?.shopLoc ? Number(props.route.params.shopLoc.longi) : 73.04128451925754
        }
    }

    const mapRef = useRef<any>(null);
    const onRegionChange = (region: any) => {
        setStateD(region);
        props.route.params.shopLoc.lati = region.latitude;
        props.route.params.shopLoc.longi = region.longitude;
    }
    const toast = useToast();

    const SelectLoc = async () => {
        if (stateD) {
            setLoading(true);

            axiosInstance.post(`shops/updateLoc/${props.route.params.id}`, props.route.params.shopLoc)
                .then(function (response: any) {
                    // handle success
                    toast.show(response.data, {
                        type: "success",
                        placement: "top",
                        duration: 3000,
                        animationType: "slide-in",
                    });
                    setLoading(false);
                    props.navigation.goBack();
                })
                .catch(function (error) {
                    // handle error
                    setLoading(false);
                    toast.show(error.response.data.message, {
                        type: "danger",
                        placement: "top",
                        duration: 8000,
                        animationType: "slide-in",
                    });
                })
        }
        else {
            toast.show('Please select Location', {
                type: "danger",
                placement: "top",
                duration: 5000,
                animationType: "slide-in",
            });
        }
    }

    return (
        <View style={{ position: 'relative' }}>
            <MapView
                ref={mapRef}
                style={{ width: '100%', height: "100%" }}
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
            <View style={{ position: 'absolute', top: '46.8%', left: '46.1%' }}>
                <MapPin size={30} color='black' />
            </View>
            <TouchableOpacity onPress={SelectLoc} style={{ position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: BlueColor, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ padding: 15, textAlign: 'center', fontSize: 20, fontWeight: '500', color: 'white' }}>Update Shop Location</Text>
            </TouchableOpacity>

            <Pressable onPress={() => props.navigation.goBack()} style={{ position: 'absolute', top: 40, left: 20, backgroundColor: BlueColor, borderRadius: 10, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                <ChevronLeft size={30} color='white' />
            </Pressable>

            {loading ?
                <View style={{ padding: 30, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView style={{ width: 150, height: 150 }} source={require('../assets/animated/loading.json')} autoPlay loop />
                </View>
                : null}

        </View>
    )
}

export default UpdateLoc