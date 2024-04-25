import { ArrowLeft } from 'lucide-react-native'
import React, { useState } from 'react'
import { Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { axiosInstance } from '../../helpers/AxiosAPI'
import { useToast } from 'react-native-toast-notifications'
import LottieView from 'lottie-react-native'
import { GreyColor } from '../../constants/Colors'

const EditShopDetails = (props: any) => {
    const [refreshing, setRefreshing] = useState(false);
    const [title, setTitle] = useState(props?.route?.params?.title);
    const [address, setAddress] = useState(props?.route?.params?.address);
    const [contact, setContact] = useState(props?.route?.params?.contact);
    const toast = useToast();
    const updateData = () => {
        setRefreshing(true);
        axiosInstance.post(`/shops/edit/${props?.route?.params?.sid}`, { title: title, address: address, contact: contact })
            .then((res) => {
                toast.show(res.data, {
                    type: "success",
                    placement: "top",
                    duration: 2000,
                });
                setRefreshing(false);
            })
            .catch((err) => {
                console.log(err.response);
                toast.show(err.response?.data, {
                    type: "warning",
                    placement: "top",
                    duration: 2000,
                });
                setRefreshing(false);
            })
    }
    return (
        <SafeAreaView style={{ height: '100%' }}>
            <View style={[{ flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 10, borderBottomWidth: 0.5, borderColor: 'grey', backgroundColor: 'white' }, Platform.OS == 'android' ? { paddingVertical: 15 } : null]}>
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <ArrowLeft color='black' size={25} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', color: 'black', width: '85%', fontSize: 18, fontWeight: '600' }}>Edit Shop Details</Text>
            </View>
            <View style={{ padding: 20 }}>
                <Text style={{ color: 'black', marginBottom: 5, fontSize: 15 }}>Shop Title:</Text>
                <TextInput value={title} onChangeText={setTitle} style={{ borderWidth: 0.5, padding: 5, borderRadius: 5, marginBottom: 10, color: 'black', backgroundColor: 'white' }} placeholder='Shop Name'></TextInput>
                <Text style={{ color: 'black', marginBottom: 5, fontSize: 15 }}>Address:</Text>
                <TextInput value={address} onChangeText={setAddress} style={{ borderWidth: 0.5, padding: 5, borderRadius: 5, marginBottom: 10, color: 'black', backgroundColor: 'white' }} placeholder='Shop Address'></TextInput>
                <Text style={{ color: 'black', marginBottom: 5, fontSize: 15 }}>Contact:</Text>
                <TextInput value={contact} onChangeText={setContact} style={{ borderWidth: 0.5, padding: 5, borderRadius: 5, marginBottom: 10, color: 'black', backgroundColor: 'white' }} placeholder='Shop Contact'></TextInput>
                <TouchableOpacity onPress={updateData} style={{ backgroundColor: '#0E1446', padding: 8, borderRadius: 5, marginTop: 12 }}>
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: '600' }}>Update Details</Text>
                </TouchableOpacity>
            </View>
            {refreshing ?
                <View style={{ padding: 30, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView style={{ width: 150, height: 150 }} source={require('../../assets/animated/loading.json')} autoPlay loop />
                </View>
                : null}
        </SafeAreaView>
    )
}

export default EditShopDetails