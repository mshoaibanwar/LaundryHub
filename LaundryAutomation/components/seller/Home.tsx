import React, { useEffect, useState } from 'react'
import { BlueColor, DarkGrey } from '../../constants/Colors';

import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    ScrollView,
    RefreshControl,
} from 'react-native';

import StatsCard from './StatsCard';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { useAppSelector } from '../../hooks/Hooks';
import Menu from '.././Menu';
import { axiosInstance } from '../../helpers/AxiosAPI';
import { Banknote, Bell, Box, PackageCheck, Star } from 'lucide-react-native';
import LottieView from 'lottie-react-native';
import socket from '../../helpers/Socket';

const Home = ({ navigation }: any) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [ratingsCount, setRatingsCount] = useState(0);
    const [avgRating, setAvgRating] = useState(0);
    const [ordersCount, setOrdersCount] = useState(0);
    const [activeOrdersCount, setActiveOrdersCount] = useState(0);
    const [earnings, setEarnings] = useState(0);

    React.useEffect(
        () => {
            navigation?.addListener('beforeRemove', (e: any) => {
                // Prevent default behavior of leaving the screen
                e.preventDefault();

                // Prompt the user before leaving the screen
            });

        }, [navigation]);
    const Data =
        [
            {
                id: '0',
                name: 'Active Orders',
                count: activeOrdersCount,
                img: <Box size={45} color={BlueColor} fill='orange' />
            },
            {
                id: '1',
                name: 'Orders',
                count: ordersCount,
                img: <PackageCheck size={45} color='green' fill='orange' />
            },
            {
                id: '2',
                name: 'Ratings',
                count: ratingsCount,
                img: <Star size={45} color='orange' fill='orange' />
            },
            {
                id: '3',
                name: 'Avg. Rating',
                count: avgRating,
                img: <Star size={45} color={BlueColor} fill='orange' />
            },
            {
                id: '4',
                name: 'Earnings',
                count: `Rs. ${earnings}`,
                img: <Banknote size={45} color={BlueColor} />
            },
        ];

    const user: any = useAppSelector((state) => state.user.value);
    const shopData: any = useAppSelector((state) => state.shopdata.value);

    const [notiCount, setNotiCount] = useState(0);
    const [refreshing, setRefreshing] = React.useState(false);

    const getNotiCount = () => {
        axiosInstance.get(`notifications/seller/count/unread/${user.user._id}`)
            .then(function (response: any) {
                setNotiCount(response.data.Count);
            })
            .catch(function (error) {
                // handle error
            })
    }

    useEffect(() => {
        getNotiCount();
        axiosInstance.get('ratings/shop/countAvg/' + shopData._id)
            .then(function (response: any) {
                setAvgRating(response.data.avg);
                setRatingsCount(response.data.ratings);
            })
            .catch(function (error: any) {
                // handle error
                console.log(error.response.data);
            })

        axiosInstance.get('orders/shop/dashValuesCount/' + shopData._id)
            .then(function (response: any) {
                setOrdersCount(response.data.orders);
                setActiveOrdersCount(response.data.ordersActive);
                setEarnings(response.data.earnings);
            })
            .catch(function (error: any) {
                // handle error
                console.log(error.response.data);
            })

    }, [refreshing, navigation,])

    socket.onmessage = (e: any) => {
        const data = JSON.parse(e.data)
        console.log(data)
        if (data?.notification) {
            getNotiCount();
        }
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <SafeAreaView style={{ position: 'relative' }}>
            <View style={styles.topView}>
                <View>
                    <Text style={styles.welText}>Welcome,</Text>
                    <Text style={styles.nameText}>{user?.user?.name.split(' ')[0]}</Text>
                </View>
                <View style={styles.iconView}>
                    <TouchableOpacity onPress={() => navigation.navigate("HomeStack", { screen: 'Noti' })} style={styles.icon}>
                        <Bell size={35} color='orange' fill='orange' />
                        {notiCount > 0 ?
                            <View style={{ position: 'absolute', top: -3, right: -3, backgroundColor: 'green', borderRadius: 50, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontWeight: '600', fontSize: 12 }}>{notiCount}</Text>
                            </View>
                            : null
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.icon}>
                        <Image
                            style={styles.iconimg}
                            defaultSource={require('../../assets/icons/user.png')}
                            source={user?.user?.profile ? { uri: user?.user?.profile } : require('../../assets/icons/user.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View style={{ paddingHorizontal: 20 }}>
                    {shopData && shopData?.status != "Verified" ?
                        <View style={{ marginTop: 5, padding: 15, borderWidth: 0.5, borderColor: 'orange', borderRadius: 10, gap: 5, marginBottom: 8, backgroundColor: 'white', shadowColor: 'orange', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 3, elevation: 5 }}>
                            <Text style={{ fontSize: 20, fontWeight: '500', color: 'black' }}>Your Shop is not Live Yet!</Text>
                            <Text style={{ fontSize: 16, fontWeight: '400', color: BlueColor }}>Your Shop is {shopData?.status}.</Text>
                            <Text style={{ fontSize: 16, fontWeight: '400', color: DarkGrey }}>Please wait for the admin to approve your shop.</Text>
                        </View>
                        : null}
                    <Text style={{ marginTop: 10, fontSize: 20, fontWeight: '600', color: 'black' }}>Your Stats</Text>
                </View>
                <View style={{ marginHorizontal: 20, marginVertical: 5 }}>
                    {Data.map((item, index) => (
                        <StatsCard navigation={navigation} key={index} name={item.name} count={item.count} img={item.img} />
                    ))}
                </View>
                <View style={{ paddingHorizontal: 20 }}>
                    <View style={{}}>
                        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 10, color: 'black' }}>Update Prices</Text>
                        <View style={{ borderRadius: 10, padding: 10, backgroundColor: 'white', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 4, borderWidth: 0.5, borderColor: 'grey', elevation: 5 }}>
                            <Text style={{ marginBottom: 5, fontSize: 14, color: 'black' }}>Manage your Shop services and update prices of them.</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('ShopStack', { screen: 'Services', params: { uid: user.user._id } })} style={{ backgroundColor: BlueColor, padding: 8, borderRadius: 6 }}>
                                <Text style={{ fontSize: 16, fontWeight: '500', color: 'white', textAlign: 'center' }}>Manage Services</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={{ marginTop: 12, fontSize: 20, fontWeight: '600', color: 'black' }}>Your Shop Location</Text>

                    <TouchableOpacity style={[{ marginVertical: 10, borderRadius: 15, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 4, borderWidth: 0.5, borderColor: 'grey' }, Platform.OS == 'android' ? { overflow: 'hidden', elevation: 5 } : null]}>
                        <MapView
                            style={{ width: "100%", height: 250, borderRadius: 15 }}
                            initialRegion={{
                                latitude: shopData ? Number(shopData?.lati) : 24.8607,
                                longitude: shopData ? Number(shopData?.longi) : 67.0011,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                            showsUserLocation
                        >
                            <Marker
                                coordinate={{ latitude: shopData ? Number(shopData?.lati) : 24.8607, longitude: shopData ? Number(shopData?.longi) : 67.0011 }}
                                title={shopData[0]?.title}
                            />
                        </MapView>
                    </TouchableOpacity>


                    <View style={{ height: 200 }}></View>
                </View>
            </ScrollView>

            <Menu setModal={setModalVisible} modalVisible={modalVisible} navigation={navigation} />

            {refreshing ?
                <View style={{ padding: 30, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView style={{ width: 150, height: 150 }} source={require('../../assets/animated/loading.json')} autoPlay loop />
                </View>
                : null}

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    topView:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20
    },
    welText:
    {
        fontSize: 17,
        color: 'black'
    },
    nameText:
    {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'black'
    },
    icon:
    {
        backgroundColor: 'white',
        borderRadius: 20,
        width: 55,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowRadius: 3,
        shadowOpacity: 0.3,
        elevation: 5
    },
    notiIcon:
    {
        width: 30,
        height: 30
    },
    iconView:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 15,
    },
    iconimg:
    {
        width: 55,
        height: 55,
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowRadius: 5,
        shadowOpacity: 0.1,
        borderRadius: 20,
    }
});

export default Home