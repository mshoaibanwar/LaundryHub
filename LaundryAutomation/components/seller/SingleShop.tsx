import React, { useEffect, useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    TextInput,
    Platform,
    RefreshControl,
} from 'react-native';

import { ChevronLeft, Star, MapPin, Clock9, Phone, FileEdit } from 'lucide-react-native';
import { useAppSelector } from '../../hooks/Hooks';
import { useToast } from 'react-native-toast-notifications';
import { axiosInstance } from '../../helpers/AxiosAPI';
import TimeSelector from './TimeSelector';
import LottieView from 'lottie-react-native';
import { BlueColor } from '../../constants/Colors';

const SingleShop = (props: any) => {

    const user: any = useAppSelector((state) => state.user.value);
    const [shopData, setShopData] = useState<any>(null);
    const [timing, setTiming] = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);

    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');
    const [editable, setEditable] = useState(false);
    const [avgRating, setAvgRating] = useState(0);
    const [tratings, setTRatings] = useState<any>(0);
    const [minDelTime, setMinDelTime] = useState<any>(0);
    const [minOrderPrice, setMinOrderPrice] = useState<any>(0);
    const [shopLoc, setShopLoc] = useState<any>(null);

    useEffect(() => {
        axiosInstance.get(`/shops/user/${user.user._id}`)
            .then((res) => {
                setShopData(res.data[0]);
                setTiming(res.data[0].timing);
                setTitle(res.data[0].title);
                setAddress(res.data[0].address);
                setContact(res.data[0].contact);
                setMinDelTime(res.data[0].minDelTime);
                setMinOrderPrice(res.data[0].minOrderPrice);
                setShopLoc({ lati: res.data[0].lati, longi: res.data[0].longi });
            })
            .catch((err) => {
                console.log(err);
            })
        getAvgRating();
    }, [refreshing]);

    useEffect(() => {
        if (shopData?.timing != timing) {
            setRefreshing(true);
            axiosInstance.post(`/shops/updateTiming/${shopData?._id}`, { timing: timing })
                .then((res) => {
                    toast.show(res.data, {
                        type: "success",
                        placement: "top",
                        duration: 2000,
                    });
                    setRefreshing(false);
                })
                .catch((err) => {
                    console.log(err.response);
                    setRefreshing(false);
                })
        }
    }, [timing]);

    let today = new Date().getDay();

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const updateData = () => {
        setRefreshing(true);
        axiosInstance.post(`/shops/edit/${shopData?._id}`, { title: title, address: address, contact: contact })
            .then((res) => {
                toast.show(res.data, {
                    type: "success",
                    placement: "top",
                    duration: 2000,
                });
                setRefreshing(false);
                setEditable(false)
            })
            .catch((err) => {
                console.log(err.response);
                setRefreshing(false);
            })
    }

    const getShopRating = async (ratings: any) => {
        try {
            const shopRatings = ratings;
            if (shopRatings?.length > 0) {
                const avg = shopRatings.reduce((sum: any, item: any) => sum + item.rating, 0) / shopRatings.length;
                return avg;
            } else {
                return 0;
            }
        } catch (error) {
            console.error(`Error fetching ratings for shop ID : ${error}`);
            return 0;
        }
    };


    const getAvgRating = async () => {
        let ratings = await getShopRating(shopData?.ratings);
        setTRatings(ratings);
    }

    const updateMinimums = () => {
        setRefreshing(true);
        axiosInstance.post(`/shops/updateMinimums/${shopData?._id}`, { minDelTime: minDelTime, minOrderPrice: minOrderPrice })
            .then((res) => {
                toast.show(res.data, {
                    type: "success",
                    placement: "top",
                    duration: 1500,
                });
                setRefreshing(false);
            })
            .catch((err) => {
                setRefreshing(false);
            })
    }

    const toast = useToast();

    return (
        <View style={{ position: 'relative', height: '100%' }}>
            {shopData && timing ?
                <View>
                    <ImageBackground source={require('../../assets/images/bgimage.jpeg')} resizeMode='cover' style={[{ height: 230 }, Platform.OS === 'android' ? { height: 190 } : {}]}>
                        <View style={{ marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => { props.navigation.goBack() }} style={styles.backBtn}>
                                <ChevronLeft size={30} color='#0E1446' />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => props.navigation.navigate('EditShopDetails', { sid: shopData?._id, title: title, address: address, contact: contact })} style={styles.backBtn}>
                                <FileEdit size={30} color='#0E1446' />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>

                    <View style={{ backgroundColor: 'white', padding: 15, margin: 20, borderRadius: 20, top: -100, borderWidth: 0.3 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                            <TextInput editable={editable} style={[{ fontSize: 20, fontWeight: 'bold', color: 'black' }, Platform.OS === 'android' ? { padding: 0 } : {}, editable ? { borderBottomWidth: 1 } : {}]} value={title} onChangeText={setTitle} />
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                <Star size={25} color='#FFD130' fill='#FFD130' />
                                <Text style={{ fontSize: 20, color: 'black' }}>{avgRating}</Text>
                                <Text style={{ color: 'black', fontSize: 15 }}>({tratings})</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                            <MapPin size={20} color='#0E1446' />
                            <TextInput editable={editable} style={[{ color: 'black' }, editable ? { borderBottomWidth: 1 } : {}, Platform.OS === 'android' ? { padding: 2 } : {}]} value={address} onChangeText={setAddress} />
                        </View>
                        <View style={{ alignItems: 'center', flexDirection: 'row', gap: 5, marginTop: 10 }}>
                            <Clock9 size={20} color='#0E1446' />
                            <Text style={{ color: 'black' }}>{timing[today]?.time?.start} to {timing[today]?.time?.end}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 20, marginTop: 12 }}>
                            <TouchableOpacity style={[{ borderColor: 'red', borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, justifyContent: 'center', padding: 6 }, Platform.OS === 'android' ? { padding: 2 } : {}]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <Phone color='red' size={18} />
                                    <TextInput editable={editable} maxLength={11} style={[{ color: 'red' }, Platform.OS === 'android' ? { padding: 0 } : {}, editable ? { borderBottomWidth: 1 } : {}]} value={contact} onChangeText={setContact} />
                                </View>
                            </TouchableOpacity>
                        </View>

                        {editable ?
                            <TouchableOpacity onPress={updateData} style={{ backgroundColor: '#0E1446', padding: 8, borderRadius: 10, marginTop: 12 }}>
                                <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: '600' }}>Update Data</Text>
                            </TouchableOpacity>
                            : null}

                    </View>
                    <ScrollView style={{ top: -120 }} refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                        <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 10, color: 'black' }}>Update Map Location</Text>
                            <View style={{ borderWidth: 0.5, borderRadius: 10, padding: 10, gap: 6, backgroundColor: 'white' }}>
                                <TouchableOpacity onPress={() => props.navigation.navigate('UpdateLoc', { shopLoc, id: shopData?._id })} style={[{ backgroundColor: BlueColor, padding: 8, borderRadius: 6 }, Platform.OS === 'android' ? { padding: 7 } : {}]}>
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'white', textAlign: 'center' }}>Update Location</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 10, color: 'black' }}>Update Minimums</Text>
                            <View style={{ borderWidth: 0.5, borderRadius: 10, padding: 10, gap: 6, backgroundColor: 'white' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 16, color: 'black', fontWeight: '500' }}>Minimum Delivery Time</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                        <TextInput maxLength={1} value={minDelTime.toString()} onChangeText={setMinDelTime} inputMode='numeric' placeholder='2' style={[{ fontSize: 16, color: 'black', borderWidth: 0.5, padding: 5, borderRadius: 5, width: 50, textAlign: 'center' }, Platform.OS === 'android' ? { padding: 0 } : {}]} />
                                        <Text style={{ fontSize: 16, color: 'black', fontWeight: '500' }}>{minDelTime > 1 ? 'Days' : 'Day'}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 16, color: 'black', fontWeight: '500' }}>Minimum Order Price</Text>
                                    <TextInput maxLength={4} value={minOrderPrice.toString()} onChangeText={setMinOrderPrice} placeholder='2' inputMode='numeric' style={[{ fontSize: 16, color: 'black', borderWidth: 0.5, padding: 5, borderRadius: 5, width: 91, textAlign: 'center' }, Platform.OS === 'android' ? { padding: 0 } : {}]} />
                                </View>
                                <TouchableOpacity onPress={updateMinimums} style={[{ backgroundColor: BlueColor, padding: 8, borderRadius: 6 }, Platform.OS === 'android' ? { padding: 7 } : {}]}>
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'white', textAlign: 'center' }}>Update</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ padding: 20, paddingVertical: 10, position: 'relative', zIndex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 10, color: 'black' }}>Update Timings</Text>
                            <View style={{ position: 'relative', zIndex: 1, backgroundColor: 'white' }}>
                                <TimeSelector data={timing} setData={setTiming} />
                            </View>
                        </View>
                        <View style={{ padding: 20, paddingTop: 0 }}>
                            <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 10, color: 'black' }}>Update Prices</Text>
                            <View style={{ borderWidth: 0.5, borderRadius: 10, padding: 10, backgroundColor: 'white' }}>
                                <Text style={{ marginBottom: 5, fontSize: 14, color: 'black' }}>Manage your Shop services and update prices of them.</Text>
                                <TouchableOpacity onPress={() => props.navigation.navigate('ShopStack', { screen: 'Services', params: { uid: user.user._id } })} style={{ backgroundColor: BlueColor, padding: 8, borderRadius: 6 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'white', textAlign: 'center' }}>Manage Services</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[{ height: 400 }, Platform.OS === 'android' ? { height: 360 } : {}]}>
                        </View>
                    </ScrollView>
                </View>
                : null}

            {refreshing ?
                <View style={{ padding: 30, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView style={{ width: 150, height: 150 }} source={require('../../assets/animated/loading.json')} autoPlay loop />
                </View>
                : null}
        </View>
    )
}


const styles = StyleSheet.create(
    {
        backBtn:
        {
            top: Platform.OS === 'android' ? 30 : 70,
            backgroundColor: 'white',
            borderRadius: 15,
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center'
        }
    }
);

export default SingleShop