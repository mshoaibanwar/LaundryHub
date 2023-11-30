import React, { useEffect, useRef, useState } from 'react'
import { BackgroundColor, BlueColor, DarkGrey } from '../../constants/Colors';

import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    SafeAreaView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';

import StatsCard from './StatsCard';

import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

import { useAppSelector } from '../../hooks/Hooks';
import Menu from '.././Menu';
import { axiosInstance } from '../../helpers/AxiosAPI';

import { Bell, Box, PackageCheck, Star } from 'lucide-react-native';
import LottieView from 'lottie-react-native';

const Home = ({ navigation }: any) => {
    const [modalVisible, setModalVisible] = useState(false);

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
                count: 4,
                img: <Box size={45} color='red' fill='orange' />
            },
            {
                id: '1',
                name: 'Orders',
                count: 187,
                img: <PackageCheck size={45} color='green' fill='orange' />
            },
            {
                id: '2',
                name: 'Ratings',
                count: 976,
                img: <Star size={45} color='orange' fill='orange' />
            },
            {
                id: '3',
                name: 'Avg. Rating',
                count: 4.7,
                img: <Star size={45} color={BlueColor} fill='orange' />
            },
        ];

    const user: any = useAppSelector((state) => state.user.value);
    const shopData: any = useAppSelector((state) => state.shopdata.value);

    const [notiCount, setNotiCount] = useState(0);
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        axiosInstance.get(`notifications/seller/count/unread/${user.user._id}`)
            .then(function (response: any) {
                setNotiCount(response.data.Count);
            })
            .catch(function (error) {
                // handle error
            })
    }, [refreshing, navigation,])

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
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconimg}>
                        <Image
                            style={styles.iconimg}
                            source={require('../../assets/icons/user.png')}
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
                        <StatsCard navigation={navigation} name={item.name} count={item.count} img={item.img} />
                    )}
                    //Setting the number of column
                    numColumns={2}
                    keyExtractor={item => item.id}

                    ListHeaderComponent={
                        <View>
                            {shopData && shopData[0]?.status != "Approved" ?
                                <View style={{ marginTop: 5, padding: 15, borderWidth: 0.5, borderColor: 'orange', borderRadius: 10, gap: 5, marginBottom: 8, backgroundColor: 'white', shadowColor: 'orange', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 3 }}>
                                    <Text style={{ fontSize: 20, fontWeight: '500', color: 'black' }}>Your Shop is not Live Yet!</Text>
                                    <Text style={{ fontSize: 16, fontWeight: '400', color: BlueColor }}>Your Shop is {shopData?.status}.</Text>
                                    <Text style={{ fontSize: 16, fontWeight: '400', color: DarkGrey }}>Please wait for the admin to approve your shop.</Text>
                                </View>
                                : null}
                            <Text style={{ marginVertical: 10, fontSize: 20, fontWeight: '600', color: 'black' }}>Your Stats</Text>
                        </View>
                    }
                    ListFooterComponent={
                        <View>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 10, color: 'black' }}>Update Prices</Text>
                                <View style={{ borderRadius: 10, padding: 10, backgroundColor: 'white', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 5 }}>
                                    <Text style={{ marginBottom: 5, fontSize: 14, color: 'black' }}>Manage your Shop services and update prices of them.</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('ShopStack', { screen: 'Services', params: { uid: user.user._id } })} style={{ backgroundColor: BlueColor, padding: 8, borderRadius: 6 }}>
                                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'white', textAlign: 'center' }}>Manage Services</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Text style={{ marginTop: 12, fontSize: 20, fontWeight: '600', color: 'black' }}>Your Shop Location</Text>

                            <TouchableOpacity style={{ borderRadius: 15, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 5 }}>
                                <MapView
                                    style={{ width: "100%", height: 250, marginVertical: 20, borderRadius: 15 }}
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


                            <View style={{ height: 290 }}></View>
                        </View>
                    }
                />
            </View>

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
            width: 3,
            height: 3,
        },
        shadowRadius: 5,
        shadowOpacity: 0.5,
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
    }
});

export default Home