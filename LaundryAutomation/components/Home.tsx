import React, { useEffect, useRef, useState } from 'react'
import { BackgroundColor, BlueColor } from '../constants/Colors';
import socket from '../helpers/Socket';

import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    RefreshControl,
    Platform,
} from 'react-native';

import ServiceCard from './ServiceCard';

import Carousel from 'react-native-snap-carousel';
import ShopCardCarousel from './ShopCardCarousel';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

import { useAppDispatch, useAppSelector } from '../hooks/Hooks';
import { CalcPrices } from '../helpers/PriceCalculator';
import Menu from './Menu';
import { axiosInstance } from '../helpers/AxiosAPI';

import { Bell } from 'lucide-react-native';
import LottieView from 'lottie-react-native';
import GetLocation from 'react-native-get-location';
import { addUser } from '../reduxStore/reducers/UserReducer';

const Home = ({ navigation }: any) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [notiCount, setNotiCount] = useState(0);
    const [refreshing, setRefreshing] = React.useState(false);
    const [ShopData, setShopData] = useState<any>([]);
    const [location, setLocation] = useState<any>({ latitude: 33.70395347266037, longitude: 73.04128451925754 });
    const path =
    {
        wash: require("../assets/icons/washin.png"),
        iron: require("../assets/icons/iron.png"),
        dry: require("../assets/icons/clothes.png"),
        carpet: require("../assets/icons/carpet.png"),
    }

    useEffect(() => {

        axiosInstance.get(`/shops/getShops/`)
            .then(function (response: any) {
                setShopData(response.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }, [refreshing]);

    React.useEffect(
        () => {
            navigation?.addListener('beforeRemove', (e: any) => {
                // Prevent default behavior of leaving the screen
                e.preventDefault();
            });

        }, [navigation]);
    const Data =
        [
            {
                id: '0',
                name: 'Washing',
                desc: 'Wash clean, smell good,but not ironed',
                img: path.wash
            },
            {
                id: '1',
                name: 'Dry Cleaning',
                desc: 'Dry clean, smell good,but and also ironed',
                img: path.dry
            },
            {
                id: '2',
                name: 'Ironing',
                desc: 'Ironing, smell good.',
                img: path.iron
            },
            {
                id: '3',
                name: 'Carpet',
                desc: 'Wash clean, smell good,and neat and clean.',
                img: path.carpet
            },
        ];

    const user: any = useAppSelector((state) => state.user.value);

    const basketItems: any = useAppSelector((state) => state.basket.value);
    const { pricelist, allShopsPriceList } = CalcPrices(ShopData, basketItems);

    const _renderItem = ({ item, index }: { item: any, index: number }) => {
        return (
            <ShopCardCarousel props={navigation} itemsdet={item} bprice={pricelist[index]} plist={allShopsPriceList[index]} />
        );
    }

    const SLIDER_WIDTH = Dimensions.get('window').width / 1.11;
    const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1 / 2);

    const getNotiCount = () => {
        axiosInstance.get(`notifications/user/count/unread/${user.user._id}`)
            .then(function (response: any) {
                setNotiCount(response.data.Count);
            })
            .catch(function (error) {
                // handle error
            })
    }
    useEffect(() => {
        getNotiCount();
    }, [refreshing, navigation])

    socket.onmessage = (event: any) => {
        const data = JSON.parse(event.data);
        if (data?.userId === user.user._id) {
            getNotiCount();
        }
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    useEffect(() => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 1000,
        })
            .then(location => {
                getAddress(location);
                setLocation({ latitude: location.latitude, longitude: location.longitude });
            })
            .catch(error => {
                const { code, message } = error;
                console.warn(code, message);
            })
    }, [refreshing]);

    const dispatch = useAppDispatch();
    const mapRef = useRef<any>(null);
    const getAddress = (loc: any) => {
        mapRef.current?.addressForCoordinate({ latitude: loc?.latitude, longitude: loc?.longitude }).then((address: any) => {
            let moduser: any = { ...user, cadd: address.name, ccord: loc };
            dispatch(addUser(moduser));
        })
    }

    return (
        <SafeAreaView style={{ position: 'relative', backgroundColor: BackgroundColor }}>
            <View style={styles.topView}>
                <View>
                    <Text style={styles.welText}>Welcome,</Text>
                    <Text style={styles.nameText}>{user?.user?.name.split(' ')[0]}</Text>
                </View>
                <View style={styles.iconView}>
                    <TouchableOpacity onPress={() => { navigation.navigate("HomeStack", { screen: 'Noti' }); }} style={styles.icon}>
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
                            defaultSource={require('../assets/icons/user.png')}
                            source={user?.user?.profile ? { uri: user?.user?.profile } : require('../assets/icons/user.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{}}>
                <FlatList
                    style={{ paddingHorizontal: 20 }}
                    data={Data}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    renderItem={({ item }) => (
                        <ServiceCard navigation={navigation} name={item.name} desc={item.desc} img={item.img} />
                    )}
                    //Setting the number of column
                    numColumns={2}
                    keyExtractor={item => item.id}

                    ListHeaderComponent={
                        <>
                            <View style={{}}>
                                <View style={{ padding: 15, borderWidth: 0.5, borderColor: 'grey', borderRadius: 15, gap: 8, marginBottom: 8, backgroundColor: 'white', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2 }}>
                                    <Text style={{ fontSize: 18, fontWeight: '500', color: 'black' }}>Lets begin your order!</Text>
                                    <TouchableOpacity onPress={() => { navigation.navigate("BasketStack", { screen: 'Basket' }) }} style={{ padding: 10, backgroundColor: BlueColor, borderRadius: 10 }}>
                                        <Text style={{ color: 'white', fontSize: 18, fontWeight: '300', textAlign: 'center' }}>Add Items in the Basket</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{}}>
                                <View style={{ padding: 15, borderWidth: 0.5, borderColor: 'grey', borderRadius: 15, gap: 8, marginBottom: 8, backgroundColor: 'white', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '400', color: 'black' }}>View, reschedule, and book riders for your orders effortlessly by viewing orders.</Text>
                                    <TouchableOpacity onPress={() => { navigation.navigate('MyOrders') }} style={{ padding: 10, backgroundColor: BlueColor, borderRadius: 10 }}>
                                        <Text style={{ color: 'white', fontSize: 18, fontWeight: '300', textAlign: 'center' }}>View My Orders</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={{ marginVertical: 10, fontSize: 18, fontWeight: '600', color: 'black' }}>Top Services</Text>
                            </View>
                        </>
                    }
                    ListFooterComponent={
                        <View style={{}}>
                            <Text style={{ marginTop: 10, fontSize: 18, fontWeight: '600', color: 'black' }}>Top 10 Laundry Shops</Text>
                            <View style={{}}>
                                <Carousel layout={'default'}
                                    slideStyle={{ padding: 4 }}
                                    sliderWidth={SLIDER_WIDTH}
                                    itemWidth={ITEM_WIDTH}
                                    inactiveSlideScale={1}
                                    activeSlideAlignment='start'
                                    data={ShopData}
                                    renderItem={_renderItem}
                                    inactiveSlideShift={0}
                                    useScrollView={true}
                                    inactiveSlideOpacity={1}
                                />
                            </View>

                            <Text style={{ fontSize: 18, fontWeight: '600', color: 'black' }}>Laundry Shops Near You</Text>

                            <TouchableOpacity onPress={() => { navigation.navigate("MapStack") }} style={[{ borderRadius: 15, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 4, marginVertical: 15, borderWidth: 0.5, borderColor: 'grey' }, Platform.OS == 'android' ? { overflow: 'hidden' } : null]}>
                                <MapView
                                    ref={mapRef}
                                    style={{ width: "100%", height: 250, borderRadius: 15 }}
                                    initialRegion={{
                                        latitude: Number(location?.latitude),
                                        longitude: Number(location?.longitude),
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}
                                    showsUserLocation={true}
                                    cacheEnabled
                                >
                                    {ShopData?.map((item: any, index: any) => (
                                        <Marker
                                            key={index}
                                            coordinate={{ latitude: item ? Number(item?.lati) : 33.70395347266037, longitude: item ? Number(item?.longi) : 73.04128451925754 }}
                                            title={"Title of Marker"}
                                            description={'description'}
                                        />
                                    ))}
                                </MapView>

                                <View style={{ padding: 10, alignItems: 'center', backgroundColor: 'white', bottom: 30, position: 'absolute', left: 20, right: 20, borderRadius: 10, borderWidth: 1 }}>
                                    <Text style={{ color: 'black', fontSize: 18 }}>Explore More</Text>
                                </View>
                            </TouchableOpacity>


                            <View style={{ height: 290 }}></View>
                        </View>
                    }
                />
            </View>

            <Menu setModal={setModalVisible} modalVisible={modalVisible} navigation={navigation} />

            {refreshing ?
                <View style={{ padding: 30, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView style={{ width: 150, height: 150 }} source={require('../assets/animated/loading.json')} autoPlay loop />
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
        shadowRadius: 5,
        shadowOpacity: 0.2,
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
        gap: 15
    },
    iconimg:
    {
        width: 55,
        height: 55,
        borderRadius: 20,
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowRadius: 5,
        shadowOpacity: 0.3
    }
});

export default Home