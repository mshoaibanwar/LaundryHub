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

const Rides = ({ navigation }: any) => {
    const user: any = useAppSelector(state => state.user.value);
    const [isEnabled, setIsEnabled] = useState(true);
    const [rides, setRides] = useState([]);
    const dispatch = useAppDispatch();
    const [refreshing, setRefreshing] = useState(false);

    const getRides = () => {
        axiosInstance.get(`rides/`)
            .then((res) => {
                setRides(res.data.reverse());
                setRefreshing(false);
            })
            .catch((err) => {
                console.log(err.response.data);
            })
    }

    useEffect(() => {
        getRides();
    }, [refreshing]);

    useEffect(() => {
        axiosInstance.get(`riders/getDutyStatus/${user.user._id}`)
            .then((res) => {
                if (res.data === 'On') {
                    setIsEnabled(true);
                } else {
                    setIsEnabled(false);
                }
            })
            .catch((err) => {
                console.log(err.response.data);
            })

        getRides();
    }, []);
    const toggleSwitch = () => {
        socket.send(
            JSON.stringify({
                RiderStatus: !isEnabled,
            })
        );
        setIsEnabled(previousState => !previousState);
        axiosInstance.post(`riders/updateDutyStatus/${user.user._id}`, { status: isEnabled ? 'Off' : 'On' })
            .then((res) => {
                console.log(res.data);
                dispatch(addUser({ ...user, status: !isEnabled }));
            })
            .catch((err) => {
                console.log(err.response.data);
            })
        getRides();
    }
    useEffect(() => {
        socket.onmessage = (e) => {
            const message = JSON.parse(e.data);
            if (message?.newRide) {
                getRides();
            }
        }
    }, []);
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
                        renderItem={({ item }) => <RideReqCard navigation={navigation} ride={item} />}
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
            {isEnabled ? null :
                <View style={{ justifyContent: 'center', alignItems: 'center', height: '75%' }}>
                    <LottieView style={{ width: 250, height: 250 }} source={require('../../assets/animated/animation.json')} autoPlay loop />
                    <Text style={{ fontSize: 20, fontWeight: '500', color: 'black', marginTop: 10 }}>No Ride Requests!</Text>
                </View>
            }

        </SafeAreaView>
    );
}
export default Rides;