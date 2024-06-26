import React, { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react-native'
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { BlueColor } from '../../constants/Colors'
import { useAppSelector } from '../../hooks/Hooks'
import { axiosInstance } from '../../helpers/AxiosAPI'
import LottieView from 'lottie-react-native'
import RideCard from './RideCard'

const MyRides = (props: any) => {
    const [tab, setTab] = useState('Completed');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [rides, setRides] = useState([]);
    const user: any = useAppSelector((state) => state.user.value);
    const [ridesfilt, setRidesFilt] = useState(rides.filter((item: any) => (item.status == 'Completed')));

    useEffect(() => {
        axiosInstance.get(`rides/rider/completed/${user.user._id}`)
            .then(function (response: any) {
                setRides(response.data);
                setRidesFilt(response.data.filter((item: any) => (item.status == 'Completed')));
                setLoading(false);
            })
            .catch(function (error) {
                // handle error
                console.log(error.response.data);
                setLoading(false);
            })
    }, [refreshing])

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const changeTab = (name: any) => {
        if (name === 'Cancelled') {
            setTab('Cancelled');
            setRidesFilt(rides.filter((item: any) => (item.status == 'Cancelled')));
        }
        else if (name === 'Completed') {
            setTab('Completed');
            setRidesFilt(rides.filter((item: any) => (item.status == 'Completed')));
        }
    }
    return (
        <SafeAreaView style={{ height: '100%' }}>
            <View style={{ flexDirection: 'row', padding: 20, justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <ArrowLeft color='black' size={25} />
                </TouchableOpacity>
                <Text style={{ width: '85%', right: 27, textAlign: 'center', position: 'relative', color: 'black', fontSize: 20, fontWeight: '700' }}>My Rides</Text>
            </View>
            <View style={{ paddingHorizontal: 20, flexDirection: 'row', minWidth: '100%' }}>
                <TouchableOpacity onPress={() => changeTab('Completed')} style={tab == 'Completed' ? [styles.btnLeft, styles.btnActive] : styles.btnLeft}>
                    <Text style={tab == 'Completed' ? styles.btntextact : styles.btntxt}>Completed</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeTab('Cancelled')} style={tab == 'Cancelled' ? [styles.btnRight, styles.btnActive] : styles.btnRight}>
                    <Text style={tab == 'Cancelled' ? styles.btntextact : styles.btntxt}>Cancelled</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={{ marginTop: 10 }} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                {ridesfilt.map((item: any, index: number) => (
                    <RideCard key={index} ride={item} />
                ))}
                <View style={{ height: 120 }}></View>
            </ScrollView>
            {loading ?
                <View style={{ padding: 30, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView style={{ width: 150, height: 150 }} source={require('../../assets/animated/loading.json')} autoPlay loop />
                </View>
                : null}
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    btnLeft: {
        width: '50%',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: BlueColor,
        padding: 15,
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50
    },
    btnRight: {
        width: '50%',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: BlueColor,
        padding: 15,
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50
    },
    btnActive: {
        backgroundColor: BlueColor,
    },
    btntxt:
    {
        textAlign: 'center',
        color: BlueColor,
        fontSize: 16
    },
    btntextact: {
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    },
    ordertxtLeft: {
        fontSize: 15,
        fontWeight: '600',
        color: 'black'
    },
    ordertxtRight: {
        fontSize: 15,
        color: 'black'
    },
    orderView:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 3,
        alignItems: 'center'
    }
})

export default MyRides