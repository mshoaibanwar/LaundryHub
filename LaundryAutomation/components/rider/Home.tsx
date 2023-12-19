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
    RefreshControl,
    ScrollView,
} from 'react-native';

import { useAppDispatch, useAppSelector } from '../../hooks/Hooks';
import Menu from '../Menu';
import { axiosInstance } from '../../helpers/AxiosAPI';

import { Banknote, Bell, Bike, BikeIcon, Box, PackageCheck, PiggyBank, Star } from 'lucide-react-native';
import LottieView from 'lottie-react-native';
import StatsCard from '../seller/StatsCard';
import { addShopData } from '../../reduxStore/reducers/ShopDataReducer';

const Home = ({ navigation }: any) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [ridesCount, setRidesCount] = useState(0);
    const [cancelledCount, setCancelledCount] = useState(0);
    const [ratingsCount, setRatingsCount] = useState(0);
    const [avgRating, setAvgRating] = useState(0);
    const [codEarnings, setCodEarnings] = useState(0);
    const [totalEarnings, setTotalEarnings] = useState(0);

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
                name: 'Rides',
                count: ridesCount,
                img: <BikeIcon size={45} color='green' fill='orange' />
            },
            {
                id: '1',
                name: 'Cancelled',
                count: cancelledCount,
                img: <Bike size={45} color='red' fill='orange' />
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
                name: 'COD Earnings',
                count: codEarnings,
                img: <Banknote size={45} color={BlueColor} fill='green' />
            },
            {
                id: '5',
                name: 'Total Earnings',
                count: totalEarnings,
                img: <PiggyBank size={45} color={BlueColor} fill='yellow' />
            },
        ];

    const user: any = useAppSelector((state) => state.user.value);
    const shopData: any = useAppSelector((state) => state.shopdata.value);

    const dispatch = useAppDispatch();

    const [notiCount, setNotiCount] = useState(0);
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        axiosInstance.get(`riders/user/${user.user._id}`)
            .then(function (response: any) {
                dispatch(addShopData(response.data[0]));
            })
            .catch(function (error: any) {
                // handle error
                console.log(error.response.data);
            })

        axiosInstance.get(`notifications/rider/count/unread/${user.user._id}`)
            .then(function (response: any) {
                setNotiCount(response.data.Count);
            })
            .catch(function (error) {
                // handle error
            })

        axiosInstance.get('rides/user/count/' + user.user._id)
            .then(function (response: any) {
                setRidesCount(response.data.Count);
            })
            .catch(function (error: any) {
                // handle error
                console.log(error.response.data);
            })

        axiosInstance.get('rides/user/cancelled/count/' + user.user._id)
            .then(function (response: any) {
                setCancelledCount(response.data.Count);
            })
            .catch(function (error: any) {
                // handle error
                console.log(error.response.data);
            })

        axiosInstance.get('ratings/shop/countAvg/' + user.user._id)
            .then(function (response: any) {
                setRatingsCount(response.data.ratings);
                setAvgRating(response.data.avg);
            })
            .catch(function (error: any) {
                // handle error
                console.log(error.response.data);
            })

        axiosInstance.get('rides/rider/earnings/' + user.user._id)
            .then(function (response: any) {
                setCodEarnings(response.data.COD);
                setTotalEarnings(response.data.TotalEarnings);
            })
            .catch(function (error: any) {
                // handle error
                console.log(error.response.data);
            })

    }, [refreshing, navigation])

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
                <View>
                    {shopData && shopData?.status != "Verified" ?
                        <View style={{ marginTop: 5, padding: 15, borderWidth: 0.5, borderColor: 'orange', borderRadius: 10, gap: 5, marginBottom: 8, backgroundColor: 'white', shadowColor: 'orange', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 3 }}>
                            <Text style={{ fontSize: 20, fontWeight: '500', color: 'black' }}>Your Profile is not Active Yet!</Text>
                            <Text style={{ fontSize: 16, fontWeight: '400', color: BlueColor }}>Your Profile is {shopData?.status}.</Text>
                            <Text style={{ fontSize: 16, fontWeight: '400', color: DarkGrey }}>Please wait for the admin to approve your Profile.</Text>
                        </View>
                        : null}
                    <Text style={{ marginVertical: 0, marginHorizontal: 20, fontSize: 20, fontWeight: '600', color: 'black' }}>Your Stats</Text>
                </View>

                <View style={{ marginHorizontal: 20, marginVertical: 5 }}>
                    {Data.map((item, index) => (
                        <StatsCard navigation={navigation} key={index} name={item.name} count={item.count} img={item.img} />
                    ))}
                </View>

                <View style={{ height: 200 }}></View>

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
            width: 3,
            height: 3,
        },
        shadowRadius: 4,
        shadowOpacity: 0.3,
        elevation: 5,
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