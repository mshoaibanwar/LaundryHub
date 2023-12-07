import { ArrowLeft, MessageSquare, Phone } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { Image, Linking, RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { BlueColor, DarkGrey, DarkPurple, LightPurple } from '../../constants/Colors'
import { axiosInstance } from '../../helpers/AxiosAPI'
import { useToast } from 'react-native-toast-notifications'
import LottieView from 'lottie-react-native'
import DropDownPicker from 'react-native-dropdown-picker'

const OrderDetail = (props: any) => {
    const [refreshing, setRefreshing] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const [openStatusSelc, setOpenStatusSelc] = useState(false);
    const [statusValue, setStatusValue] = useState(props?.route?.params?.status);
    const toast = useToast();

    const [statuses, setStatuses] = useState([
        { label: 'Pending', value: 'Pending' },
        { label: 'Confirmed', value: 'Confirmed' },
        { label: 'Pending Payment', value: 'Pending Payment' },
        { label: 'Processing', value: 'Processing' },
        { label: 'Cancelled', value: 'Cancelled' },
        { label: 'Delivering', value: 'Delivering' },
        { label: 'Delivered', value: 'Delivered' },
    ]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const updateStatus = (nstatus: any) => {
        setLoading(true);
        axiosInstance.post(`/orders/update/${props?.route?.params?._id}`, { status: nstatus })
            .then((res) => {
                setLoading(false);
                toast.show(res.data, {
                    type: "success",
                    placement: "top",
                    duration: 2000,
                });
            })
            .catch((err) => {
                setLoading(false);
                toast.show(err.data, {
                    type: "danger",
                    placement: "top",
                    duration: 2000,
                });
            })
    }

    let ddate = props?.route?.params?.delivery.date;
    let dtime = props?.route?.params?.delivery.time;
    let dhour = parseInt(dtime.split(':')[0]) + 12;

    let pdate = props?.route?.params?.orderDate;
    let ptime = props?.route?.params?.ocollection;
    let phour = parseInt(ptime.split('-')[1].split(':')[0]) + 12;

    const ptargetTime = new Date(pdate.slice(6, 10), pdate.slice(3, 5) - 1, pdate.slice(0, 2), phour, 0, 0, 0);
    const dtargetTime = new Date(ddate.slice(6, 10), ddate.slice(3, 5) - 1, ddate.slice(0, 2), dhour, 0, 0, 0);

    const [ptimeRemaining, setPTimeRemaining] = useState("");
    const [dtimeRemaining, setDTimeRemaining] = useState("");

    const updateTimeRemaining = (target: any, isp: any) => {
        const currentTime: any = new Date();
        const timeDiff = target - currentTime;

        if (timeDiff > 0) {
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            if (isp == 'p')
                setPTimeRemaining(`${Math.floor(hours / 24)} days ${hours % 24} hour ${minutes} min`);
            else
                setDTimeRemaining(`${Math.floor(hours / 24)} days ${hours % 24} hour ${minutes} min`);
        } else {
            if (isp == 'p')
                setPTimeRemaining('Time is up!');
            else
                setDTimeRemaining('Time is up!');
        }
    };
    useEffect(() => {
        updateTimeRemaining(ptargetTime, 'p');
        updateTimeRemaining(dtargetTime, 'd');
    }, [refreshing]);

    return (
        <SafeAreaView style={{ padding: 20 }}>
            <View style={{ paddingHorizontal: 20 }}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <ArrowLeft color='black' size={25} />
                    </TouchableOpacity>
                    <Text style={{ textAlign: 'center', color: 'black', width: '85%', fontSize: 20, fontWeight: '700' }}>Order Details</Text>
                </View>
                <ScrollView refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                    <View style={{ marginTop: 15 }}>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Ship & Bill To</Text>
                        <View style={{ flexDirection: 'row', marginVertical: 10, padding: 10, borderWidth: 0.5, borderRadius: 10, backgroundColor: 'white' }}>
                            <View style={{ gap: 5 }}>
                                <View style={{ gap: 2 }}>
                                    <Text style={{ color: BlueColor, fontSize: 16 }}>{props?.route?.params?.address.name}</Text>
                                    <Text style={{ color: BlueColor, fontSize: 16 }}>{props?.route?.params?.address.num}</Text>
                                </View>
                                <Text style={{ color: 'black', fontSize: 16 }}>{props?.route?.params?.address.add}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', borderTopWidth: 0.5, borderColor: 'grey', paddingTop: 8, marginTop: 4 }}>
                                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${props?.route?.params?.phone}`)} style={{ justifyContent: 'center', flexDirection: 'row', width: '50%', gap: 10, alignItems: 'center', borderRightWidth: 0.5, borderColor: 'grey' }}>
                                        <Phone color='black' size={20} />
                                        <Text style={{ textAlign: 'center', fontSize: 16, color: 'black' }}>Phone</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ justifyContent: 'center', flexDirection: 'row', width: '50%', gap: 10, alignItems: 'center' }}>
                                        <MessageSquare color='black' size={20} />
                                        <Text style={{ textAlign: 'center', fontSize: 16, color: 'black' }}>Chat</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{ position: 'relative', zIndex: 2 }}>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Order Details</Text>
                        <View style={{ flexDirection: 'row', marginVertical: 10, padding: 10, borderWidth: 0.5, borderRadius: 10, backgroundColor: 'white' }}>
                            <View style={{ gap: 5, width: '100%' }}>
                                <Text style={{ fontSize: 17, color: BlueColor }}>Order # {props?.route?.params?._id.slice(props?.route?.params?._id.length - 5, props?.route?.params?._id.length)}</Text>
                                <View style={{ gap: 2 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ color: DarkGrey, fontSize: 14, fontWeight: '600' }}>Pickup On: </Text>
                                        <Text style={{ color: DarkGrey, fontSize: 14, fontWeight: '500' }}>{props?.route?.params?.orderDate} | {props?.route?.params?.ocollection}</Text>
                                    </View>
                                    {statusValue == 'Pending' || statusValue == 'Confirmed' ?
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ color: DarkGrey, fontSize: 14, fontWeight: '600' }}>Time to Pickup: </Text>
                                            <Text style={{ color: 'red', fontSize: 14, fontWeight: '500' }}>{ptimeRemaining}</Text>
                                        </View>
                                        : null}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ color: 'black', fontSize: 14, fontWeight: '600' }}>{props?.route?.params?.status != 'delivered' ? 'Delivery On:' : 'Delivered On: '}</Text>
                                        <Text style={{ color: 'black', fontSize: 14, fontWeight: '500' }}>{props?.route?.params?.delivery.date} | {props?.route?.params?.delivery.time}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ color: 'black', fontSize: 14, fontWeight: '600' }}>Time to Deliver: </Text>
                                        <Text style={{ color: 'green', fontSize: 14, fontWeight: '600' }}>{dtimeRemaining}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                                        <Text style={{ color: 'black', fontWeight: '500', fontSize: 15 }}>Status:</Text>
                                        <DropDownPicker
                                            containerStyle={{ width: '40%' }}
                                            style={{ backgroundColor: BlueColor, borderRadius: 8, padding: 15, height: 35 }}
                                            textStyle={{ color: 'white', fontSize: 15, fontWeight: '600' }}
                                            placeholder='Kurta'
                                            dropDownContainerStyle={{ backgroundColor: BlueColor, borderRadius: 10, borderTopColor: 'grey' }}
                                            open={openStatusSelc}
                                            theme='DARK'
                                            value={statusValue}
                                            items={statuses}
                                            setOpen={setOpenStatusSelc}
                                            setValue={setStatusValue}
                                            setItems={setStatuses}
                                            autoScroll={true}
                                            onChangeValue={(value) => { updateStatus(value) }}
                                            listMode='SCROLLVIEW'
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Order Summary</Text>
                        <View style={{ borderWidth: 0.5, borderRadius: 10, padding: 10, marginVertical: 10, backgroundColor: 'white' }}>
                            {props?.route?.params?.items.map((item: any, index: number) => (
                                <View key={index} style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginVertical: 5 }}>
                                    <View style={{ alignItems: 'center', flexDirection: 'row', gap: 20 }}>
                                        <Image defaultSource={require('../../assets/images/Logo.png')} source={{ uri: item.images[0].toString() }} style={{ width: 40, height: 40, borderRadius: 10 }} resizeMode='cover' />
                                        <Text style={{ color: 'black', fontSize: 18 }}>{item.item}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', width: '50%', justifyContent: 'space-between' }}>
                                        <Text style={{ color: 'black', fontSize: 16 }}>{item.serType}</Text>
                                        <Text style={{ color: 'black', fontSize: 16 }}>Rs. {props?.route?.params?.prices[index]}</Text>
                                    </View>
                                </View>
                            ))}
                            <View style={{ height: 1, backgroundColor: 'grey', marginVertical: 10 }}></View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: DarkGrey, fontSize: 16 }}>Items</Text>
                                <Text style={{ color: 'black', fontSize: 16 }}>x {props?.route?.params?.items.length}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: DarkGrey, fontSize: 16 }}>Subtotal</Text>
                                <Text style={{ color: 'black', fontSize: 16 }}>Rs. {props?.route?.params?.tprice - props?.route?.params?.delFee}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: DarkGrey, fontSize: 16 }}>Delivery Fee</Text>
                                <Text style={{ color: 'black', fontSize: 16 }}>Rs. {props?.route?.params?.delFee}</Text>
                            </View>
                            <View style={{ height: 1, backgroundColor: 'grey', marginVertical: 10 }}></View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: 'black', fontSize: 16 }}>Total</Text>
                                <Text style={{ color: BlueColor, fontSize: 16, fontWeight: '500' }}>Rs. {props?.route?.params?.tprice}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                <Text style={{ color: 'black', fontSize: 16 }}>Payment</Text>
                                <Text style={{ color: 'black', fontSize: 16 }}>{props?.route?.params?.pMethod}</Text>
                            </View>

                        </View>
                    </View>
                    <View style={{ height: 130 }}></View>
                </ScrollView>
            </View >
            {loading ?
                <View style={{ padding: 30, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView style={{ width: 150, height: 150 }} source={require('../../assets/animated/loading.json')} autoPlay loop />
                </View>
                : null}
        </SafeAreaView >
    )
}

export default OrderDetail