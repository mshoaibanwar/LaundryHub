import React, { useEffect, useState } from 'react'

import {
    Text,
    View,
    FlatList,
    SafeAreaView,
    RefreshControl,
} from 'react-native';

import { useAppSelector } from '../../hooks/Hooks';
import { axiosInstance } from '../../helpers/AxiosAPI';
import LottieView from 'lottie-react-native';
import { Switch } from 'react-native-gesture-handler';
import RideReqCard from './RideReqCard';

const Rides = ({ navigation }: any) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
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
            <View style={{ marginTop: 15 }}>
                <FlatList
                    data={[1, 2, 3, 4, 5, 6]}
                    renderItem={({ item }) => <RideReqCard navigation={navigation} />}
                    keyExtractor={item => item.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => { }}
                        />
                    }
                />
            </View>

            {/* <View style={{ justifyContent: 'center', alignItems: 'center', height: '80%' }}>
                <LottieView style={{ width: 250, height: 250 }} source={require('../../assets/animated/animation.json')} autoPlay loop />
                <Text style={{ fontSize: 20, fontWeight: '500', color: 'black', marginTop: 10 }}>No Ride Requests</Text>
            </View> */}
        </SafeAreaView>
    );
}
export default Rides;