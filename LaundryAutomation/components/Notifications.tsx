import { ArrowLeft, Paintbrush } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { Platform, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { axiosInstance } from '../helpers/AxiosAPI'
import { useAppSelector } from '../hooks/Hooks'
import LottieView from 'lottie-react-native'
import { DarkGrey, GreyColor } from '../constants/Colors'
import socket from '../helpers/Socket'

const Notifications = (props: any) => {
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<any>([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const user: any = useAppSelector((state) => state.user.value);
    let geturl = `notifications/${user.userType == 'user' ? 'user' : user.userType == 'seller' ? 'seller' : 'rider'}/${user.user._id}`;
    let setReadUrl = `notifications/${user.userType == 'user' ? 'user' : user.userType == 'seller' ? 'seller' : 'rider'}/setread/${user.user._id}`;

    const fetchNotifications = () => {
        setLoading(true);
        axiosInstance.get(geturl)
            .then(function (response: any) {
                setNotifications(response.data);
                setRefreshing(false);
                setLoading(false);
            })
            .catch(function (error) {
                // handle error
                setRefreshing(false);
                setLoading(false);
            })
    }
    useEffect(() => {
        fetchNotifications();
    }, [refreshing])

    socket.onmessage = (e: any) => {
        const data = JSON.parse(e.data)
        if (data?.notification) {
            fetchNotifications();
        }
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const markAsRead = () => {
        setRefreshing(true);
        axiosInstance.post(setReadUrl)
            .then(function (response: any) {
                setRefreshing(false);
            })
            .catch(function (error) {
                // handle error
                setRefreshing(false);
            })
    }

    notifications.reverse();
    return (
        <SafeAreaView style={{ backgroundColor: 'white' }}>
            <View style={[{ paddingHorizontal: 20, paddingBottom: 10, borderBottomWidth: 0.5, borderColor: 'grey' }, Platform.OS == 'android' ? { paddingVertical: 15 } : null]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                    <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <ArrowLeft color='black' size={25} />
                    </TouchableOpacity>
                    <Text style={{ textAlign: 'center', color: 'black', fontSize: 18, fontWeight: '600' }}>Notifications</Text>
                    <View style={{ width: 25 }}></View>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity onPress={markAsRead} style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Paintbrush color='grey' size={20} />
                        <Text style={{}}>Mark all as read</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={{ paddingVertical: 10, backgroundColor: GreyColor, paddingHorizontal: 15 }} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                {notifications.map((noti: any, key: any) => (
                    <View key={key} style={noti?.status === 'unread' ? styles.unreadnoti : styles.readnoti}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={{ fontSize: 18, fontWeight: '700', color: 'black' }}>{noti?.title}</Text>
                            {noti?.status === 'unread' ?
                                <View style={{ width: 10, height: 10, backgroundColor: 'green', borderRadius: 50 }}></View>
                                : null}
                        </View>
                        <Text style={{ fontSize: 10, fontWeight: '300', color: DarkGrey }}>{noti?.createdAt.split('T')[0]} | {noti?.createdAt.split('T')[1].split('.')[0]}</Text>
                        <Text style={{ fontSize: 14, fontWeight: '400', color: 'black' }}>{noti?.body}</Text>
                    </View>
                ))}
                <View style={{ height: 220 }}></View>
            </ScrollView>
            {refreshing || loading ?
                <View style={{ padding: 30, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView style={{ width: 150, height: 150 }} source={require('../assets/animated/loading.json')} autoPlay loop />
                </View>
                : null}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    readnoti: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        gap: 2,
        marginTop: 5,
        borderColor: 'black',
        backgroundColor: 'white'
    },
    unreadnoti: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        gap: 2,
        marginTop: 5,
        borderColor: 'green',
        backgroundColor: 'white'
    }

})

export default Notifications