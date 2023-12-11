import { ArrowLeft, MessageSquare, Phone, TimerReset, X } from 'lucide-react-native'
import React, { useEffect, useRef, useState } from 'react'
import { FlatList, Image, Modal, Pressable, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { BlueColor, DarkGrey } from '../constants/Colors'
import StarRating from 'react-native-star-rating-widget';
import { axiosInstance } from '../helpers/AxiosAPI'
import { useToast } from 'react-native-toast-notifications'
import { useAppSelector } from '../hooks/Hooks'
import LottieView from 'lottie-react-native'
import { Linking } from 'react-native'
import Toast from "react-native-toast-notifications";

const OrderDetail = (props: any) => {
    const [rating, setRating] = useState(0);
    const [rated, setRated] = useState(false);
    const [review, setReview] = useState('');
    const [refreshing, setRefreshing] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const [ShopData, setShopData] = useState<any>([]);

    const [canChangePickup, setCanChangePickup] = useState<any>(false);
    const [showBookRide, setShowBookRide] = useState<any>(false);

    const toast = useToast();
    const user: any = useAppSelector((state) => state.user.value);
    let services: string[] = [];
    const isServiceUnique = (service: string) => {
        let isUnique = true;
        services.map((item: string) => {
            if (service === item) {
                isUnique = false;
                return;
            }
        })
        return isUnique;
    }

    useEffect(() => {
        axiosInstance.get(`/shops/shop/${props?.route?.params?.shopid}`)
            .then(function (response: any) {
                setShopData(response.data);
                isShopOpen(response.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error.response);
            })
    }, [refreshing]);

    useEffect(() => {
        axiosInstance.get(`ratings/order/${props?.route?.params?.shopid}/${props?.route?.params?._id}`)
            .then(function (response: any) {
                if (response.data.length > 0) {
                    setLoading(false);
                    setRated(true);
                    setRating(response?.data[0]?.rating);
                    setReview(response?.data[0]?.review);
                }
            })
            .catch(function (error) {
                // handle error
                setLoading(false);
            })
    }, [refreshing])

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const onStarRatingPress = () => {
        if (rating == 0) {
            toast.show('Please Rate First!', {
                type: "danger",
                placement: "top",
                duration: 3000,
                animationType: "slide-in",
            });
            return;
        }
        services = [];
        props?.route?.params?.items.map((item: any) => {
            if (isServiceUnique(item.serType)) {
                services.push(item.serType);
            }
        })

        axiosInstance.post('ratings/add', { rating: rating, review: review, oid: props?.route?.params?._id, uid: user.user._id, shopid: props?.route?.params?.shopid, uname: user?.user.name, services: services })
            .then(function (response: any) {
                toast.show(response.data, {
                    type: "success",
                    placement: "top",
                    duration: 2000,
                    animationType: "slide-in",
                });
                setLoading(false);
                setRated(true);
            })
            .catch(function (error) {
                // handle error
                setLoading(false);
                toast.show(error.response.data.message, {
                    type: "danger",
                    placement: "top",
                    duration: 3000,
                    animationType: "slide-in",
                });
            })
            .then(function () {
                // always executed
            });
    }

    //Reschedule Modal
    const [modalVisible, setModalVisible] = useState(false);
    const Months = ['Jan', 'Fab', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const Days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const [selcDay, setSelcDay] = useState<any>(null);
    const Times = ['12:00 AM - 1:00 AM', '1:00 AM - 2:00 AM', '2:00 AM - 3:00 AM', '3:00 AM - 4:00 AM', '4:00 AM - 5:00 AM', '5:00 AM - 6:00 AM', '6:00 AM - 7:00 AM', '7:00 AM - 8:00 AM', '8:00 AM - 9:00 AM', '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 11:59 AM', '12:00 PM - 01:00 PM', '01:00 PM - 02:00 PM', '02:00 PM - 03:00 PM', '03:00 PM - 04:00 PM', '04:00 PM - 05:00 PM', '05:00 PM - 06:00 PM', '06:00 PM - 07:00 PM', '07:00 PM - 08:00 PM', '08:00 PM - 09:00 PM', '9:00 PM - 10:00 PM', '10:00 PM - 11:00 PM', '11:00 PM - 11:59 PM']
    const [selcTime, setSelcTime] = useState<any>(null);
    const [delData, setDelData] = useState<any>(null);
    const [colData, setColData] = useState<any>(null);
    const [isCol, setIsCol] = useState<any>(true);

    const [nowTime, setNowTime] = useState<any>(7);
    const [shopCloseTime, setShopCloseTime] = useState<any>(22);
    const toastRef = useRef<any>(null);
    const toDay = new Date();
    let minDeliveryTime = ShopData?.minDelTime ? ShopData?.minDelTime : 2;
    let nextDates: any = [];
    for (let i = minDeliveryTime; nextDates.length < 7; i++) {
        let nextDate = new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000);
        if (ShopData?.timing?.[nextDate.getDay()]?.status !== "off") {
            nextDates.push(nextDate);
        }
    }

    useEffect(() => {
        let today = new Date().getDay();
        let shopCloseTime = (ShopData?.timing?.[today - 1]?.time?.end);
        let shopCloseHour = shopCloseTime?.split(':')[0];
        let timezone = shopCloseTime?.split(' ')[1];
        if (timezone == 'PM') {
            shopCloseHour = parseInt(shopCloseHour) + 12;
        }
        setShopCloseTime(shopCloseHour);

        let nowTime = new Date().getHours() + 1;
        setNowTime(nowTime);

        if (nowTime >= 7 && nowTime < shopCloseHour) {
            setCanChangePickup(true);
        }
        else {
            setCanChangePickup(false);
        }

    }, [ShopData]);

    const SelectData = () => {
        if (isCol) {
            if (selcTime != null) {
                setColData(selcTime)
                setModalVisible(false);
            }
            else {
                toastRef?.current?.show("Please Select Time!", {
                    type: "danger",
                    placement: "top",
                    duration: 2000,
                    animationType: "slide-in",
                });
            }
        }
        else {
            if (selcDay != null && selcTime != null) {
                setLoading(true);
                if (isCol) {
                    setColData(selcTime);
                    axiosInstance.post(`orders/reschedule/collection/${props?.route?.params?._id}`, { collection: selcTime })
                        .then(function (response: any) {
                            toast.show(response.data, {
                                type: "success",
                                placement: "top",
                                duration: 2000,
                                animationType: "slide-in",
                            });
                            setLoading(false);
                        })
                        .catch(function (error) {
                            // handle error
                            setLoading(false);
                            toast.show(error.response.data.message, {
                                type: "danger",
                                placement: "top",
                                duration: 3000,
                                animationType: "slide-in",
                            });
                        })
                }
                else {
                    setDelData([selcDay, selcTime]);
                    let delDate = selcDay.getDate() + "-" + (selcDay.getMonth() + 1) + "-" + new Date().getFullYear();
                    axiosInstance.post(`orders/reschedule/delivery/${props?.route?.params?._id}`, { delivery: { date: delDate, time: selcTime } })
                        .then(function (response: any) {
                            toast.show(response.data, {
                                type: "success",
                                placement: "top",
                                duration: 2000,
                                animationType: "slide-in",
                            });
                            setLoading(false);
                        })
                        .catch(function (error) {
                            // handle error
                            setLoading(false);
                            toast.show(error.response.data.message, {
                                type: "danger",
                                placement: "top",
                                duration: 3000,
                                animationType: "slide-in",
                            });
                        })
                }
                setModalVisible(false);
            }
            else {
                toastRef?.current?.show("Please Select Date and Time!", {
                    type: "danger",
                    placement: "top",
                    duration: 2000,
                    animationType: "slide-in",
                });
            }
        }
    }

    const [shopStatus, setShopStatus] = useState('Closed');

    const isShopOpen = (ShopData: any) => {
        const date = new Date();
        const today = date.getDay();
        const hourNow = date.getHours();
        const shopTiming = ShopData?.timing[today]?.time;
        if (!shopTiming || ShopData?.timing[today].status == 'off') {
            // Handle case where shopTiming is not available for the current day
            setShopStatus('Closed');
        } else {
            const startTime = convertToMinutes(shopTiming?.start);
            const endTime = convertToMinutes(shopTiming?.end);
            const currentTime = convertToMinutes(`${hourNow}:${date.getMinutes()} ${hourNow >= 12 ? 'PM' : 'AM'}`);
            if (currentTime >= startTime && currentTime <= endTime) {
                setShopStatus('Open');
            } else {
                setShopStatus('Closed');
            }
        }
    }
    function convertToMinutes(timeString: any) {
        const [hour, minute] = timeString.match(/\d+/g).map(Number);
        const isPM = /PM/i.test(timeString);
        const adjustedHour = (hour % 12) + (isPM ? 12 : 0);
        return adjustedHour * 60 + minute;
    }

    useEffect(() => {
        if (props?.route?.params?.status == 'Confirmed') {
            const date = new Date();
            let time = date.getHours();
            const nampm = time >= 12 ? 'PM' : 'AM';
            const ampm = (props?.route?.params?.ocollection)?.split(':')[1]?.split(' ')[1];
            let colTime = (props?.route?.params?.ocollection)?.split(':')[0];
            colTime = colTime + ampm;
            time = time % 12;
            time = time ? time : 12;
            const currentTime = time + nampm;
            const isCurrentTimeGreaterThanColTime = currentTime.localeCompare(colTime) > 0;
            //Date
            const dateString = props?.route?.params?.orderDate;
            const targetDate = new Date(dateString);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Set time to midnight for comparison
            const isToday = targetDate.toDateString() === currentDate.toDateString();
            const isPast = targetDate < currentDate;
            if (isToday) {
                if (isCurrentTimeGreaterThanColTime) {
                    setShowBookRide(true);
                }
            }
            else if (isPast) {
                setShowBookRide(true);
            }
        }
        else {
            setShowBookRide(false);
        }
    }, []);

    const BookRide = () => {
        let rideData = { uid: user?.user?._id, sid: props?.route?.params?.shopid, pLoc: props?.route?.params?.address?.add, dLoc: ShopData?.address, pCord: props?.route?.params?.address?.coordinates ? props?.route?.params?.address?.coordinates : props?.route?.params?.address?.cords, dCord: { lati: ShopData?.lati, longi: ShopData?.longi }, oItems: props?.route?.params?.items, pMethod: props?.route?.params?.pMethod, fare: props?.route?.params?.delFee, bkdBy: 'Customer' };
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
        <SafeAreaView>
            <View style={{ padding: 20 }}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <ArrowLeft color='black' size={25} />
                    </TouchableOpacity>
                    <Text style={{ textAlign: 'center', color: 'black', width: '85%', fontSize: 20, fontWeight: '700' }}>Order Details</Text>
                </View>
                <ScrollView refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                    {props?.route?.params?.status == 'Delivered' ?
                        <View style={{ marginTop: 15, justifyContent: 'center', alignItems: 'center', width: '100%', padding: 20, borderWidth: 0.5, borderRadius: 10, gap: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: '500', color: 'black' }}>Rate Your Experience!</Text>
                            <StarRating
                                rating={rating}
                                onChange={!rated ? setRating : () => { }}
                            />
                            <TextInput editable={rated ? false : true} value={review} onChangeText={setReview} multiline={true} style={{ width: '100%', height: 50, textAlign: 'left', padding: 10, borderWidth: 0.5, borderRadius: 10, color: rated ? 'grey' : 'black' }} placeholder='How was your Experience?...' />
                            <TouchableOpacity disabled={rated ? true : false} onPress={onStarRatingPress} style={{ width: '100%', padding: 10, borderRadius: 10, backgroundColor: rated ? 'grey' : BlueColor }}>
                                <Text style={{ color: 'white', fontSize: 16, fontWeight: '500', textAlign: 'center' }}>{rated ? 'Reviewed' : 'Submit'}</Text>
                            </TouchableOpacity>
                        </View>
                        : null}

                    <View style={{ marginTop: 15 }}>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Shop Details</Text>
                        <View style={{ marginVertical: 10, padding: 10, borderWidth: 0.5, borderRadius: 10, backgroundColor: 'white' }}>
                            <View style={{ gap: 5 }}>
                                <Text style={{ fontSize: 18, color: BlueColor }}>{ShopData?.title}</Text>
                                <View style={{}}>
                                    <Text style={{ color: 'black' }}>{ShopData?.address}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', borderTopWidth: 0.5, borderColor: 'grey', paddingTop: 8, marginTop: 10 }}>
                                <TouchableOpacity onPress={() => Linking.openURL(`tel:${ShopData?.contact}`)} style={{ justifyContent: 'center', flexDirection: 'row', width: '50%', gap: 10, alignItems: 'center', borderRightWidth: 0.5, borderColor: 'grey' }}>
                                    <Phone color='black' size={20} />
                                    <Text style={{ textAlign: 'center', fontSize: 16, color: 'black' }}>Phone</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => props?.navigation.navigate('Chat', ShopData.uid)} style={{ justifyContent: 'center', flexDirection: 'row', width: '50%', gap: 10, alignItems: 'center' }}>
                                    <MessageSquare color='black' size={20} />
                                    <Text style={{ textAlign: 'center', fontSize: 16, color: 'black' }}>Chat</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Ship & Bill To</Text>
                        <View style={{ flexDirection: 'row', marginVertical: 10, padding: 10, borderWidth: 0.5, borderRadius: 10, backgroundColor: 'white' }}>
                            <View style={{ gap: 5 }}>
                                <View style={{ gap: 2 }}>
                                    <Text style={{ color: BlueColor }}>{props?.route?.params?.address.name}</Text>
                                    <Text style={{ color: BlueColor }}>{props?.route?.params?.address.num}</Text>
                                </View>
                                <Text style={{ color: 'black' }}>{props?.route?.params?.address.add}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Order Details</Text>
                        <View style={{ flexDirection: 'row', marginVertical: 10, padding: 10, borderWidth: 0.5, borderRadius: 10, backgroundColor: 'white' }}>
                            <View style={{ gap: 5 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 18, color: BlueColor }}>Order # {props?.route?.params?._id.slice(props?.route?.params?._id.length - 5, props?.route?.params?._id.length)}</Text>
                                </View>
                                <View style={{ gap: 2 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%' }}>
                                        <Text style={{ color: 'black' }}>Pickup On: </Text>
                                        <Text style={{ color: 'black' }}>{props?.route?.params?.orderDate} | {props?.route?.params?.ocollection}</Text>
                                    </View>
                                    {showBookRide && shopStatus == 'Open' ?
                                        <TouchableOpacity onPress={BookRide} style={{ padding: 5, backgroundColor: BlueColor, borderRadius: 5, marginRight: 10 }}>
                                            <Text style={{ textAlign: 'center', color: 'white', fontSize: 16 }}>Book Rider for Pickup</Text>
                                        </TouchableOpacity>
                                        : null}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%' }}>
                                        <Text style={{ color: 'black' }}>{props?.route?.params?.status != 'delivered' ? 'Delivery On:' : 'Delivered On: '}</Text>
                                        <Text style={{ color: 'black' }}>{props?.route?.params?.delivery.date} | {props?.route?.params?.delivery.time}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: 'black', fontWeight: '500', fontSize: 16 }}>Status: </Text>
                                        <Text style={{ color: 'blue', fontWeight: '500', fontSize: 16 }}>{props?.route?.params?.status}</Text>
                                    </View>
                                    <Text style={{ fontSize: 16, marginTop: 3, color: 'black' }}>ReSchedule Your Order</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', borderTopWidth: 0.5, borderColor: 'grey', paddingTop: 8 }}>
                                        {canChangePickup ?
                                            <TouchableOpacity onPress={() => { setModalVisible(true); setIsCol(true) }} style={{ justifyContent: 'center', flexDirection: 'row', width: '50%', gap: 10, alignItems: 'center', borderRightWidth: 0.5, borderColor: 'grey' }}>
                                                <TimerReset color='black' size={20} />
                                                <Text style={{ textAlign: 'center', fontSize: 16, color: 'black' }}>Pickup</Text>
                                            </TouchableOpacity>
                                            : <View style={{ width: '50%', justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.5, borderColor: 'grey' }}>
                                                <Text style={{}}>Can't Change Pickup</Text>
                                            </View>}
                                        <TouchableOpacity onPress={() => { setModalVisible(true); setIsCol(false) }} style={{ justifyContent: 'center', flexDirection: 'row', width: '50%', gap: 10, alignItems: 'center' }}>
                                            <TimerReset color='black' size={20} />
                                            <Text style={{ textAlign: 'center', fontSize: 16, color: 'black' }}>Delivery</Text>
                                        </TouchableOpacity>
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
                                        <Image defaultSource={require('../assets/images/Logo.png')} source={{ uri: item.images[0].toString() }} style={{ width: 40, height: 40, borderRadius: 10 }} resizeMode='cover' />
                                        <Text style={{ color: 'black' }}>{item.item}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', width: '50%', justifyContent: 'space-between' }}>
                                        <Text style={{ color: 'black' }}>{item.serType}</Text>
                                        <Text style={{ color: 'black' }}>Rs. {props?.route?.params?.prices[index]}</Text>
                                    </View>
                                </View>
                            ))}
                            <View style={{ height: 1, backgroundColor: 'grey', marginVertical: 10 }}></View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: DarkGrey, fontSize: 16 }}>Items</Text>
                                <Text style={{ color: 'black', fontSize: 16 }}>x {props?.route?.params?.items.length}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: DarkGrey }}>Subtotal</Text>
                                <Text style={{ color: 'black' }}>Rs. {props?.route?.params?.tprice - props?.route?.params?.delFee}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: DarkGrey }}>Delivery Fee</Text>
                                <Text style={{ color: 'black' }}>Rs. {props?.route?.params?.delFee}</Text>
                            </View>
                            <View style={{ height: 1, backgroundColor: 'grey', marginVertical: 10 }}></View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: 'black' }}>Total</Text>
                                <Text style={{ color: 'black' }}>Rs. {props?.route?.params?.tprice}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                <Text style={{ color: 'black' }}>Payment</Text>
                                <Text style={{ color: 'black' }}>{props?.route?.params?.pMethod}</Text>
                            </View>

                        </View>
                    </View>
                    <View style={{ height: 130 }}></View>
                </ScrollView>
            </View >
            {loading ?
                <View style={{ padding: 30, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView style={{ width: 150, height: 150 }} source={require('../assets/animated/loading.json')} autoPlay loop />
                </View>
                : null}

            <Modal
                animationType="slide"
                presentationStyle={'pageSheet'}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={{ padding: 20, justifyContent: 'center' }}>
                    <Toast ref={toastRef} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.3, paddingVertical: 10 }}>
                        <Pressable onPress={() => setModalVisible(!modalVisible)} style={{ backgroundColor: '#F1F1F0', padding: 10, borderRadius: 20, width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <X color='black' />
                        </Pressable>
                        <Text style={{ width: '80%', textAlign: 'center', fontSize: 25, fontWeight: '700', color: 'black' }}>{isCol ? "Collection Time" : "Delivery Date & Time"}</Text>
                    </View>

                    {isCol ? null :
                        <>
                            <Text style={{ fontSize: 20, fontWeight: '600', marginVertical: 30, color: 'black' }}>Select Weekday</Text>
                            <FlatList
                                data={nextDates}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity key={index} onPress={() => setSelcDay(item)} style={item.getDate() == selcDay?.getDate() ? styles.selcWeekDayStyle : styles.weekDayStyle}>
                                        <View style={{ padding: 15, alignItems: 'center' }}>
                                            <Text style={{ fontSize: 18, fontWeight: '500', color: 'black' }}>{Days[item.getDay()]}</Text>
                                            <Text style={{ color: 'black' }}>{item.getDate() + " " + Months[item.getMonth()]}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                horizontal={true}
                                keyExtractor={item => item.getDate().toString()}
                            />
                        </>
                    }
                    <Text style={{ fontSize: 20, fontWeight: '600', marginVertical: 30, color: 'black' }}>Select Time</Text>
                    <FlatList
                        data={isCol ? Times.slice(nowTime, shopCloseTime) : Times.slice(8, shopCloseTime)}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity key={index} onPress={() => setSelcTime(item)} style={item == selcTime ? styles.selcTimeStyle : styles.timeStyle}>
                                <View style={{ paddingVertical: 15, padding: 10, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 15, color: 'black' }}>{item}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        horizontal={true}
                        keyExtractor={item => item}
                    />
                </View>
                <View style={{ position: 'absolute', bottom: 20, width: '100%' }}>
                    <TouchableOpacity onPress={() => SelectData} style={{ backgroundColor: BlueColor, padding: 15, margin: 20, borderRadius: 10 }}>
                        <Text style={{ textAlign: 'center', color: 'white', fontSize: 22, fontWeight: '500' }}>ReSchedule</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView >
    )
}
const styles = StyleSheet.create({
    weekDayStyle: {
        borderWidth: 0.5,
        borderColor: 'grey',
        margin: 4,
        borderRadius: 6
    },
    selcWeekDayStyle: {
        backgroundColor: '#F0F8FF',
        borderWidth: 1,
        borderColor: 'black',
        margin: 4,
        borderRadius: 6
    },
    timeStyle: {
        borderWidth: 0.5,
        borderColor: 'grey',
        margin: 4,
        borderRadius: 6
    },
    selcTimeStyle: {
        backgroundColor: '#F0F8FF',
        borderWidth: 1,
        borderColor: 'black',
        margin: 4,
        borderRadius: 6
    }
});
export default OrderDetail