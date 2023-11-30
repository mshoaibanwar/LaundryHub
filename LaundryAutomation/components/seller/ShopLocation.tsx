import { ChevronLeft, MapPin } from 'lucide-react-native'
import React, { useRef, useState } from 'react'
import { Pressable, Text, TouchableOpacity, View } from 'react-native'
import MapView from 'react-native-maps'
import { BlueColor } from '../../constants/Colors'
import { useToast } from 'react-native-toast-notifications'
import LottieView from 'lottie-react-native'
import { axiosInstance } from '../../helpers/AxiosAPI'
import { useAppDispatch, useAppSelector } from '../../hooks/Hooks'
import { addShopData } from '../../reduxStore/reducers/ShopDataReducer'

const ShopLocation = (props: any) => {
    const latitudeDelta = 0.025
    const longitudeDelta = 0.025
    const [stateD, setStateD] = useState<any>(props.route?.params?.data?.lati ? [props.route.params.data.lati, props.route.params.data.longi] : null);
    const [uploading, setUploading] = useState(false);
    const [uploadingCount, setUploadingCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const user: any = useAppSelector((state) => state.user.value);

    const state = {
        region: {
            latitudeDelta,
            longitudeDelta,
            latitude: props.route?.params?.data?.lati ? props.route.params.data.lati : 33.70395347266037,
            longitude: props.route?.params?.data?.longi ? props.route.params.data.longi : 73.04128451925754
        }
    }

    const mapRef = useRef<any>(null);
    const onRegionChange = (region: any) => {
        setStateD(region);
        props.route.params.data.lati = region.latitude;
        props.route.params.data.longi = region.longitude;
    }

    const toast = useToast();

    const cloudinaryUpload = async (photo: any) => {
        const data = new FormData();
        data.append('file', photo);
        data.append('upload_preset', 'photoupload');
        data.append('cloud_name', 'dwsekopqu');

        try {
            const response: any = await fetch("https://api.cloudinary.com/v1_1/dwsekopqu/image/upload", {
                method: "post",
                body: data
            });
            const imgdata = await response.json();
            return imgdata.url;
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    const updateCnicImages = async () => {
        setUploading(true);
        const updatedCnicImages = await Promise.all(
            props.route.params.data.cnicimgs.map(async (item: any) => {
                const uri = item.uri;
                const type = item.type;
                const name = item.fileName;
                const source = {
                    uri,
                    type,
                    name,
                };
                const imageUrl = await cloudinaryUpload(source);
                setUploadingCount((prev) => prev + 1);
                return imageUrl;
            })
        );
        return updatedCnicImages; // Return the updated images array
    };

    const dispatch = useAppDispatch();

    const SelectLoc = async () => {
        if (stateD) {
            setLoading(true);
            let cnicdata = await updateCnicImages();
            props.route.params.data.cnicimgs = cnicdata;
            props.route.params.data.status = 'Under Review';
            props.route.params.data.uid = user.user._id;

            axiosInstance.post('shops/add', props.route.params.data)
                .then(function (response: any) {
                    // handle success
                    toast.show(response.data, {
                        type: "success",
                        placement: "top",
                        duration: 3000,
                        animationType: "slide-in",
                    });
                    setLoading(false);
                    dispatch(addShopData(props.route.params.data));
                    props.navigation.navigate("SellerTab");
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
                <Text style={{ padding: 20, textAlign: 'center', fontSize: 24, fontWeight: '500', color: 'white' }}>Select Shop Location</Text>
            </TouchableOpacity>

            <Pressable onPress={() => props.navigation.goBack()} style={{ position: 'absolute', top: 40, left: 20, backgroundColor: BlueColor, borderRadius: 10, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                <ChevronLeft size={30} color='white' />
            </Pressable>

            {loading ?
                <View style={{ padding: 30, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView style={{ width: 150, height: 150 }} source={require('../../assets/animated/loading.json')} autoPlay loop />
                    {uploading ?
                        <Text style={{ fontSize: 18, fontWeight: '600', color: 'orange', padding: 5, marginTop: -20 }}>Uploading CNIC Side {uploadingCount} ...</Text>
                        : null}
                </View>
                : null}

        </View>
    )
}

export default ShopLocation