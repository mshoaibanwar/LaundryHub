import React, { useEffect, useState } from 'react'

import {
    Text,
    View,
    FlatList,
    SafeAreaView,
    RefreshControl,
} from 'react-native';

import { useAppDispatch, useAppSelector } from '../../hooks/Hooks';
import { axiosInstance } from '../../helpers/AxiosAPI';
import LottieView from 'lottie-react-native';
import { Switch } from 'react-native-gesture-handler';
import RideReqCard from './RideReqCard';
import socket from '../../helpers/Socket';
import { addUser } from '../../reduxStore/reducers/UserReducer';
import { rejectedRides } from './LocationTracker';
import { useToast } from 'react-native-toast-notifications';

const Rides = ({ navigation }: any) => {
    const user: any = useAppSelector(state => state.user.value);
    const [isEnabled, setIsEnabled] = useState(true);
    const [rides, setRides] = useState([]);
    const dispatch = useAppDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [status, setStatus] = useState('');

    const toast = useToast();

    const getRides = () => {
        axiosInstance.get(`rides/requests/`)
            .then((res) => {
                let nRides = res.data.reverse();
                setRides(nRides.filter((ride: any) => !rejectedRides.some((rejected: any) => rejected._id === ride._id)));
                setRefreshing(false);
            })
            .catch((err) => {
                console.log(err.response.data);
                setRefreshing(false);
            })
    }

    const rejectRide = (ride: any) => {
        rejectedRides.push(ride);
        setRides(rides.filter((ride: any) => !rejectedRides.some((rejected: any) => rejected._id === ride._id)));
    }

    useEffect(() => {
        axiosInstance.get(`riders/user/${user.user._id}`)
            .then((res) => {
                setStatus(res.data[0].status);
                if (res.data[0].status == 'Verified') {
                    getRides();
                }
                else {
                    setIsEnabled(false);
                }
                setRefreshing(false);
            })
            .catch((err) => {
                console.log(err.response.data);
                setRefreshing(false);
            })
    }, [refreshing]);

    useEffect(() => {
        axiosInstance.get(`riders/getDutyStatus/${user.user._id}`)
            .then((res) => {
                if (res.data === 'On') {
                    if (status == 'Verified')
                        setIsEnabled(true);
                } else {
                    setIsEnabled(false);
                }
            })
            .catch((err) => {
                console.log(err.response.data);
                setRefreshing(false);
            })

        getRides();

        axiosInstance.get(`rides/rider/${user.user._id}`)
            .then((res) => {
                if (res.data.length > 0) {
                    axiosInstance.get(`shops/shopInfo/${res.data[0]?.sid}`)
                        .then(function (response: any) {
                            // handle success
                            axiosInstance.get(`users/getUser/${res.data[0]?.uid}`)
                                .then((ures) => {
                                    navigation.navigate("CRide", { ride: res.data[0], user: ures?.data, shop: response?.data });
                                })
                                .catch((err) => {
                                    console.log(err.response.data);
                                })
                        })
                        .catch(function (error) {
                            // handle error
                            console.log(error.response.data);
                        })
                }
            })
            .catch((err) => {
                console.log(err.response.data);
            })
    }, []);
    const toggleSwitch = () => {
        if (status == 'Verified') {
            socket.send(
                JSON.stringify({
                    RiderStatus: !isEnabled,
                })
            );
            setIsEnabled(previousState => !previousState);
            axiosInstance.post(`riders/updateDutyStatus/${user.user._id}`, { status: isEnabled ? 'Off' : 'On' })
                .then((res) => {
                    dispatch(addUser({ ...user, status: !isEnabled }));
                })
                .catch((err) => {
                    console.log(err.response.data);
                })
            getRides();
        }
        else {
            toast.show("Your Account is not verified yet!", {
                type: "danger",
                placement: "top",
                duration: 2000,
                animationType: "slide-in",
            });
        }
    }

    socket.onmessage = (e) => {
        const message = JSON.parse(e.data);
        if (message?.newRide) {
            getRides();
        }
        else if (message?.rideStatus == "Accepted") {
            if (rides.some((ride: any) => ride._id == message?.rideId)) {
                setRides(rides.filter((ride: any) => ride._id != message?.rideId));
            }
        }
        else if (message?.delRide) {
            if (rides.some((ride: any) => ride._id == message?.rideId)) {
                setRides(rides.filter((ride: any) => ride._id != message?.rideId));
            }
        }
    }

    return (
        <SafeAreaView style={{ height: '100%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20, marginBottom: 0 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: '500', color: 'black' }}>Rides</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                    <Text style={{ fontSize: 16, color: 'black' }}>{isEnabled ? 'On Duty' : 'Off Duty'}</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
            </View>
            {isEnabled ?
                <View style={{ marginTop: 15 }}>
                    <FlatList
                        data={rides}
                        renderItem={({ item }) => <RideReqCard navigation={navigation} ride={item} rejectRide={rejectRide} />}
                        keyExtractor={item => item}
                        refreshControl={
                            <RefreshControl
                                refreshing={false}
                                onRefresh={() => { setRefreshing(true); }}
                            />
                        }
                    />
                </View>
                : null}
            {isEnabled && rides.length > 0 ? null :
                <View style={{ justifyContent: 'center', alignItems: 'center', height: '75%' }}>
                    <LottieView style={{ width: 250, height: 250 }} source={require('../../assets/animated/animation.json')} autoPlay loop />
                    <Text style={{ fontSize: 20, fontWeight: '500', color: 'black', marginTop: 10 }}>{isEnabled ? "No Ride Requests!" : "You duty status is Off!"}</Text>
                </View>
            }
        </SafeAreaView>
    );
}
export default Rides;