import { ArrowLeft, Bed, Building2, FileEdit, Home, Trash2 } from 'lucide-react-native'
import React, { useEffect } from 'react'
import { Platform, Pressable, RefreshControl, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { BlueColor, GreyColor } from '../constants/Colors'
import { useAppSelector } from '../hooks/Hooks'
import { ScrollView } from 'react-native-gesture-handler'
import { axiosInstance } from '../helpers/AxiosAPI'
import { useToast } from 'react-native-toast-notifications'
import LottieView from 'lottie-react-native'

const MyAddresses = (props: any) => {
    const [addresses, setAddresses] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);

    const toast = useToast();
    const deleteAddress = (id: any) => {
        setLoading(true);
        axiosInstance.post(`addresses/delete/${id}`)
            .then(function (response: any) {
                setLoading(false);
                toast.show(response.data, {
                    type: "success",
                    placement: "top",
                    duration: 2000,
                    animationType: "slide-in",
                });
            })
            .catch(function (error) {
                // handle error
                setLoading(false);
                toast.show(error.response.data, {
                    type: "danger",
                    placement: "top",
                    duration: 2000,
                    animationType: "slide-in",
                });
            })
    }

    const user: any = useAppSelector((state) => state.user.value);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    useEffect(() => {
        axiosInstance.get(`addresses/user/${user.user._id}`)
            .then(function (response: any) {
                setLoading(false);
                setAddresses(response.data);
            })
            .catch(function (error) {
                // handle error
                setLoading(false);
            })
    }, [refreshing, props?.route?.params, loading]);

    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: 'white' }}>
            <View style={[{ flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 10, borderBottomWidth: 0.5, borderColor: 'grey', justifyContent: 'space-between', alignItems: 'center' }, Platform.OS == 'android' ? { paddingVertical: 15 } : null]}>
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <ArrowLeft color='black' size={25} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', position: 'relative', left: 10, color: 'black', fontSize: 18, fontWeight: '600' }}>My Addresses</Text>
                <TouchableOpacity onPress={() => props.navigation.navigate("HomeStack", { screen: 'AddAddress' })}>
                    <Text style={{ fontSize: 18, fontWeight: '400', color: 'black' }}>+ Add</Text>
                </TouchableOpacity>
            </View>
            <View style={{ backgroundColor: GreyColor, height: '100%', paddingVertical: 10 }}>
                <ScrollView style={{ maxWidth: '100%' }} refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                    {addresses.map((item: any) => (
                        <View key={item._id} style={{ flexDirection: 'row', marginHorizontal: 15, marginVertical: 5, padding: 10, borderWidth: 0.5, borderRadius: 10, gap: 10, backgroundColor: 'white' }}>
                            <View>
                                {item.type == 'Home' ?
                                    <Home color='black' />
                                    : item.type == 'Hotel' ?
                                        <Bed color='black' />
                                        : item.type == 'Work' ?
                                            <Building2 color='black' /> : null}
                            </View>
                            <View style={{ gap: 5, width: '85%' }}>
                                <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>{item.type}</Text>
                                <Text style={{ color: 'black' }}>{item.add}</Text>
                                <View style={{ gap: 2, marginBottom: 20 }}>
                                    <Text style={{ color: BlueColor }}>{item.name}</Text>
                                    <Text style={{ color: BlueColor }}>{item.num}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', gap: 30, position: 'absolute', bottom: 0, right: 0 }}>
                                    <Pressable onPress={() => props.navigation.navigate("HomeStack", { screen: 'AddAddress', params: item })}>
                                        {/* <Text style={{ textDecorationLine: 'underline', fontSize: 15 }}>Edit</Text> */}
                                        <FileEdit color='green' size={22} />
                                    </Pressable>
                                    <TouchableOpacity onPress={() => deleteAddress(item._id)}>
                                        <Trash2 color='red' size={22} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                    <View style={{ height: 180 }}></View>
                </ScrollView>
            </View>
            {!loading && addresses.length == 0 ?
                <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', marginTop: 100, top: 0, bottom: 100, right: 0, left: 0 }}>
                    <Text style={{ fontSize: 18, fontWeight: '400', color: 'black' }}>No Addresses Found!</Text>
                </View>
                : null}
            {loading ?
                <View style={{ padding: 30, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView style={{ width: 150, height: 150 }} source={require('../assets/animated/loading.json')} autoPlay loop />
                </View>
                : null}
        </SafeAreaView>
    )
}

export default MyAddresses