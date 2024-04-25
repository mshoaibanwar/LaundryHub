import { ArrowLeft, MessageSquare, Phone } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { Image, Linking, Platform, RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { BlueColor, DarkGrey, GreyColor } from '../../constants/Colors'
import { axiosInstance } from '../../helpers/AxiosAPI'
import { useToast } from 'react-native-toast-notifications'
import LottieView from 'lottie-react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { useAppSelector } from '../../hooks/Hooks'

const OrderDetail = (props: any) => {
    const [refreshing, setRefreshing] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const [openStatusSelc, setOpenStatusSelc] = useState(false);
    const toast = useToast();
    const [showBookRide, setShowBookRide] = useState<any>(true);
    const [disableBookRide, setDisableBookRide] = useState<any>(true);
    const [orderData, setOrderData] = useState<any>([]);
    const [statusValue, setStatusValue] = useState(orderData?.status ? orderData?.status : props?.route?.params?.status);

    const ShopData: any = useAppSelector((state) => state.shopdata.value);

    const [statuses, setStatuses] = useState([
        { label: 'Pending', value: 'Pending' },
        { label: 'Confirmed', value: 'Confirmed' },
        { label: 'Received', value: 'Received' },
        { label: 'Processing', value: 'Processing' },
        { label: 'Ready', value: 'Ready' },
        { label: 'Delivered', value: 'Delivered' },
        { label: 'Pending Payment', value: 'Pending Payment' },
        { label: 'Cancelled', value: 'Cancelled' },
    ]);

    useEffect(() => {
        setLoading(true);
        axiosInstance.get(`/orders/order/${props?.route?.params?._id}`)
            .then(function (response: any) {
                setLoading(false);
                setOrderData(response.data);
                setStatusValue(response.data?.status);
            })
            .catch(function (error) {
                // handle error
                console.log(error.response);
            })
    }, [refreshing]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const updateStatus = (nstatus: any) => {
        setLoading(true);
        axiosInstance.post(`/orders/update/${orderData?._id}`, { status: nstatus })
            .then((res) => {
                setLoading(false);
                setStatusValue(nstatus);
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

    let ddate = orderData?.delivery?.date;
    let dtime = orderData?.delivery?.time;
    let dhour = parseInt(dtime?.split(':')[0]) + 12;

    let pdate = orderData?.orderDate;
    let ptime = orderData?.ocollection;
    let phour = parseInt(ptime?.split('-')[1]?.split(':')[0]) + 12;

    const ptargetTime = new Date(pdate?.slice(6, 10), pdate?.slice(3, 5) - 1, pdate?.slice(0, 2), phour, 0, 0, 0);
    const dtargetTime = new Date(ddate?.slice(6, 10), ddate?.slice(3, 5) - 1, ddate?.slice(0, 2), dhour, 0, 0, 0);

    const [ptimeRemaining, setPTimeRemaining] = useState("");
    const [dtimeRemaining, setDTimeRemaining] = useState("");

    const updateTimeRemaining = (target: any, isp: any) => {
        const currentTime: any = new Date();
        const timeDiff = target - currentTime;

        if (timeDiff > 0) {
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            if (isp == 'p')
                setPTimeRemaining(`${Math.floor(hours / 24)} day(s) ${hours % 24} hour(s) ${minutes} min(s)`);
            else
                setDTimeRemaining(`${Math.floor(hours / 24)} day(s) ${hours % 24} hour(s) ${minutes} min(s)`);
        } else {
            if (isp == 'p')
                setPTimeRemaining('Time is up!');
            else {
                if ((ddate?.split('-')[0] - new Date().getDate()) <= 0)
                    setDTimeRemaining('Time is up!');
                else
                    setDTimeRemaining(ddate?.split('-')[0] - new Date().getDate() + ' day(s)');
            }
        }
    };
    useEffect(() => {
        updateTimeRemaining(ptargetTime, 'p');
        updateTimeRemaining(dtargetTime, 'd');
    }, [refreshing]);


    useEffect(() => {
        if (statusValue == 'Ready') {
            const date = new Date();
            let time = date.getHours();
            const nampm = time >= 12 ? 'PM' : 'AM';
            const ampm = (orderData?.delivery?.time)?.split(':')[1]?.split(' ')[1];
            let delTime = (orderData?.delivery?.time)?.split(':')[0];
            delTime = delTime + ampm;
            time = time % 12;
            time = time ? time : 12;
            const currentTime = time + nampm;
            const isCurrentTimeGreaterThanDelTime = currentTime.localeCompare(delTime) > 0;
            //Date
            const dateString = orderData?.delivery?.date;
            const targetDate = new Date(dateString);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Set time to midnight for comparison
            const isToday = targetDate.toDateString() === currentDate.toDateString();
            const isFuture = targetDate > currentDate;
            if (isToday) {
                if (isCurrentTimeGreaterThanDelTime) {
                    setDisableBookRide(false);
                }
            }
            else if (isFuture) {
                setDisableBookRide(false);
            }
        }
        else {
            setShowBookRide(false);
        }
    }, [statusValue, refreshing]);


    const BookRide = () => {
        let rideData = { uid: orderData?.uid, sid: orderData?.shopid, dLoc: orderData?.address?.add, pLoc: ShopData?.address, dCord: orderData?.address?.coordinates ? orderData?.address?.coordinates : orderData?.address?.cords, pCord: { lati: ShopData?.lati, longi: ShopData?.longi }, oItems: orderData?.items, pMethod: orderData?.pMethod, fare: orderData?.delFee, bkdBy: 'Shop' };
        setLoading(true);
        axiosInstance.post('rides/add', rideData)
            .then(function (response: any) {
                setLoading(false);
                toast.show('Ride Requested!', {
                    type: "success",
                    placement: "top",
                    duration: 2000,
                    animationType: "slide-in",
                });
                props.navigation.navigate("RideReq");
            })
            .catch(function (error) {
                // handle error
                console.log(error.response);
            })
    }

    return (
        <SafeAreaView style={{ backgroundColor: 'white' }}>
            <View style={[{ flexDirection: 'row', paddingBottom: 10, paddingHorizontal: 20, borderBottomWidth: 0.5, borderColor: 'grey' }, Platform.OS == 'android' ? { paddingVertical: 15 } : null]}>
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <ArrowLeft color='black' size={25} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', color: 'black', width: '85%', fontSize: 18, fontWeight: '600' }}>Order Details</Text>
            </View>
            <View style={{ paddingHorizontal: 20, backgroundColor: GreyColor }}>
                <ScrollView refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                    <View style={{ marginTop: 15 }}>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Ship & Bill To</Text>
                        <View style={{ flexDirection: 'row', marginVertical: 10, padding: 10, borderWidth: 0.5, borderRadius: 10, backgroundColor: 'white' }}>
                            <View style={{ gap: 5 }}>
                                <View style={{ gap: 2 }}>
                                    <Text style={{ color: BlueColor, fontSize: 16 }}>{orderData?.address?.name}</Text>
                                    <Text style={{ color: BlueColor, fontSize: 16 }}>+92 {orderData?.address?.num}</Text>
                                </View>
                                <Text style={{ color: 'black', fontSize: 16 }}>{orderData?.address?.add}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', borderTopWidth: 0.5, borderColor: 'grey', paddingTop: 8, marginTop: 4 }}>
                                    <TouchableOpacity onPress={() => Linking.openURL(`tel:+92 ${orderData?.address?.num}`)} style={{ justifyContent: 'center', flexDirection: 'row', width: '50%', gap: 10, alignItems: 'center', borderRightWidth: 0.5, borderColor: 'grey' }}>
                                        <Phone color='black' size={20} />
                                        <Text style={{ textAlign: 'center', fontSize: 16, color: 'black' }}>Phone</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => props?.navigation.navigate('Chat', { uid: orderData?.uid, id: orderData?._id })} style={{ justifyContent: 'center', flexDirection: 'row', width: '50%', gap: 10, alignItems: 'center' }}>
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
                                <Text style={{ fontSize: 17, color: BlueColor }}>Order # {orderData?._id?.slice(orderData?._id?.length - 5, orderData?._id?.length)}</Text>
                                <View style={{ gap: 2 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ color: DarkGrey, fontSize: 14, fontWeight: '600' }}>Pickup On: </Text>
                                        <Text style={{ color: DarkGrey, fontSize: 14, fontWeight: '500' }}>{orderData?.orderDate} | {orderData?.ocollection}</Text>
                                    </View>
                                    {statusValue == 'Pending' || statusValue == 'Confirmed' ?
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ color: DarkGrey, fontSize: 14, fontWeight: '600' }}>Time to Pickup: </Text>
                                            <Text style={{ color: 'red', fontSize: 14, fontWeight: '500' }}>{ptimeRemaining}</Text>
                                        </View>
                                        : null}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ color: 'black', fontSize: 14, fontWeight: '600' }}>{orderData?.status != 'delivered' ? 'Delivery On:' : 'Delivered On: '}</Text>
                                        <Text style={{ color: 'black', fontSize: 14, fontWeight: '500' }}>{orderData?.delivery?.date} | {orderData?.delivery?.time}</Text>
                                    </View>
                                    {showBookRide && orderData?.ride ?
                                        <TouchableOpacity disabled={disableBookRide} onPress={BookRide} style={[{ padding: 5, backgroundColor: BlueColor, borderRadius: 5, marginVertical: 5 }, disableBookRide ? { backgroundColor: 'grey' } : null]}>
                                            <Text style={{ textAlign: 'center', color: 'white', fontSize: 18 }}>Book Rider for Delivery</Text>
                                        </TouchableOpacity>
                                        : null}
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
                            {orderData?.items?.map((item: any, index: number) => (
                                <View key={index} style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginVertical: 5 }}>
                                    <View style={{ alignItems: 'center', flexDirection: 'row', gap: 20 }}>
                                        <Image defaultSource={require('../../assets/images/Logo.png')} source={{ uri: item.images[0].toString() }} style={{ width: 40, height: 40, borderRadius: 10 }} resizeMode='cover' />
                                        <View>
                                            <Text style={{ color: 'black', fontSize: 17, fontWeight: '600' }}>{item.item}</Text>
                                            <Text style={{ color: 'black', fontSize: 13 }}>{item.serType}</Text>
                                        </View>
                                    </View>
                                    <View >
                                        <Text style={{ color: 'black', fontSize: 18 }}>Rs. {orderData?.prices[index]}</Text>
                                    </View>
                                </View>
                            ))}
                            <View style={{ height: 1, backgroundColor: 'grey', marginVertical: 10 }}></View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: DarkGrey, fontSize: 16 }}>Items</Text>
                                <Text style={{ color: 'black', fontSize: 16 }}>x {orderData?.items?.length}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: DarkGrey, fontSize: 16 }}>Subtotal</Text>
                                <Text style={{ color: 'black', fontSize: 16 }}>Rs. {orderData?.tprice - (orderData?.delFee * 2)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: DarkGrey, fontSize: 16 }}>Delivery Fee (x2)</Text>
                                <Text style={{ color: 'black', fontSize: 16 }}>Rs. {orderData?.delFee}</Text>
                            </View>
                            <View style={{ height: 1, backgroundColor: 'grey', marginVertical: 10 }}></View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: 'black', fontSize: 16 }}>Total</Text>
                                <Text style={{ color: BlueColor, fontSize: 16, fontWeight: '500' }}>Rs. {orderData?.tprice}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                <Text style={{ color: 'black', fontSize: 16 }}>Payment</Text>
                                <Text style={{ color: 'black', fontSize: 16 }}>{orderData?.pMethod}</Text>
                            </View>

                        </View>
                    </View>
                    <View style={{ height: 190 }}></View>
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