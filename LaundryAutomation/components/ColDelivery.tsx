import { ArrowLeft, ChevronRightCircle, X } from 'lucide-react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { verticalScale } from '../helpers/Metrics';
import { FlatList } from 'react-native-gesture-handler';
import { useAppDispatch } from '../hooks/Hooks'
import { useToast } from "react-native-toast-notifications";
import { mergeTempOrder } from '../reduxStore/reducers/TempOrderReducer';
import { BlueColor } from '../constants/Colors';
import Toast from "react-native-toast-notifications";
import { set } from 'react-hook-form';

const ColDelivery = (props: any) => {
    const [modalVisible, setModalVisible] = useState(false);
    const Months = ['Jan', 'Fab', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const Days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const [selcDay, setSelcDay] = useState<any>(null);
    const Times = ['8:00 AM - 9:00 AM', '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 11:59 AM', '12:00 PM - 1:00 PM', '1:00 PM - 2:00 PM', '2:00 PM - 3:00 PM', '3:00 PM - 4:00 PM', '4:00 PM - 5:00 PM', '5:00 PM - 6:00 PM', '6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM', '8:00 PM - 9:00 PM', '9:00 PM - 10:00 PM', '10:00 PM - 11:00 PM', '11:00 PM - 11:59 PM']
    const [selcTime, setSelcTime] = useState<any>(null);
    const [delData, setDelData] = useState<any>(null);
    const [colData, setColData] = useState<any>(null);
    const [isCol, setIsCol] = useState<any>(true);
    const toastRef = useRef<any>(null);
    const toDay = new Date();
    let minDeliveryTime = props?.route?.params?.minDelTime;
    let nextDates: any = [];
    for (let i = minDeliveryTime; nextDates.length < 7; i++) {
        let nextDate = new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000);
        if (props?.route?.params?.timing?.[nextDate.getDay()]?.status !== "off") {
            nextDates.push(nextDate);
        }
    }
    useEffect(() => {
        setSelcDay(nextDates[0]);
        setSelcTime(Times[toDay.getHours() - 8]);
        setDelData([nextDates[0], Times[toDay.getHours() - 8]]);
        setColData(Times[toDay.getHours() - 8]);
    }, []);

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
                isCol ?
                    setColData(selcTime) :
                    setDelData([selcDay, selcTime]);
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

    const dispatch = useAppDispatch();

    const toast = useToast();

    const onCheckout = () => {
        if (delData != null && props?.route?.params?.name != undefined) { //&& colData != null
            let delDate = delData[0].getDate() + "-" + (delData[0].getMonth() + 1) + "-" + new Date().getFullYear();
            const address = { name: props?.route?.params?.name, num: props?.route?.params?.num, add: props?.route?.params?.add, coordinates: { lati: props?.route?.params?.cords?.lat, longi: props?.route?.params?.cords?.lon } }
            const order: any = { collection: colData, delivery: { date: delDate, time: delData[1] }, address: address };
            dispatch(mergeTempOrder(order));
            props.navigation.navigate("ShopsStack", { screen: 'Checkout', params: order });
        }
        else {
            toast.show("Please add Everything!", {
                type: "danger",
                placement: "top",
                duration: 2000,
                animationType: "slide-in",
            });
        }
    }

    const onCollection = () => {
        if (Times.slice(toDay.getHours() - 8).toString() === "") {
            toast.show("Shop is closed!", {
                type: "danger",
                placement: "top",
                duration: 2000,
                animationType: "slide-in",
            });
        }
        else {
            setModalVisible(true);
            setIsCol(true)
        }
    }

    return (
        <SafeAreaView style={{ padding: 20, height: '100%' }}>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <ArrowLeft color='black' size={25} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', color: 'black', width: '87%', fontSize: 20, fontWeight: '700' }}>Collection & Delivery</Text>
            </View>
            <View style={{ marginTop: 20, width: '100%' }}>
                <Text style={{ fontSize: 20, fontWeight: '600', marginVertical: verticalScale(10), color: 'black' }}>Timing</Text>
                <TouchableOpacity onPress={onCollection} style={{ flexDirection: 'row', justifyContent: 'space-between', borderWidth: 0.5, padding: 20, alignItems: 'center', marginVertical: 10, borderRadius: 10, backgroundColor: 'white' }}>
                    <View style={{ gap: 5 }}>
                        <Text style={{ fontSize: 18, color: 'black' }}>Collection</Text>
                        <Text style={{ color: 'black' }}>{colData ? (Days[toDay?.getDay()] + ", " + toDay.getDate() + " " + Months[toDay.getMonth()] + " | " + colData) : (Days[toDay?.getDay()] + ", " + toDay.getDate() + " " + Months[toDay.getMonth()] + " | " + Times[toDay.getHours() - 8])}</Text>
                    </View>
                    <View >
                        <ChevronRightCircle color='black' />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setModalVisible(true); setIsCol(false) }} style={{ flexDirection: 'row', justifyContent: 'space-between', borderWidth: 0.5, padding: 20, alignItems: 'center', marginVertical: 10, borderRadius: 10, backgroundColor: 'white' }}>
                    <View style={{ gap: 5 }}>
                        <Text style={{ fontSize: 18, color: 'black' }}>Delivery</Text>
                        <Text style={{ color: 'black' }}>{delData ? (Days[delData[0]?.getDay()] + ", " + delData[0].getDate() + " " + Months[delData[0].getMonth()] + " | " + delData[1]) : (Days[nextDates[0]?.getDay()] + ", " + nextDates[0].getDate() + " " + Months[nextDates[0].getMonth()] + " | " + Times[5])}</Text>
                    </View>
                    <View >
                        <ChevronRightCircle color='black' />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: 10, width: '100%' }}>
                <Text style={{ fontSize: 20, fontWeight: '600', marginVertical: verticalScale(10), color: 'black' }}>Address</Text>
                <TouchableOpacity onPress={() => { props.navigation.navigate("ShopsStack", { screen: 'SelectAddress', params: props?.route?.params }) }} style={{ flexDirection: 'row', justifyContent: 'space-between', borderWidth: 0.5, padding: 20, alignItems: 'center', marginVertical: verticalScale(10), borderRadius: 10, backgroundColor: 'white' }}>
                    <View style={{ gap: 5 }}>
                        <Text style={{ fontSize: 18, color: 'black' }}>Add your address</Text>
                        {props?.route?.params?.add ?
                            <View>
                                <Text style={{ color: 'black' }}>{props?.route?.params?.name}</Text>
                                <Text style={{ color: 'black' }}>{props?.route?.params?.num}</Text>
                                <Text style={{ color: 'black' }}>{props?.route?.params?.add}</Text>
                            </View>
                            : null}
                    </View>
                    <View >
                        <ChevronRightCircle color='black' />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{ position: 'absolute', bottom: Platform.OS == 'android' ? 100 : 115, right: 20, left: 20 }}>
                <TouchableOpacity onPress={onCheckout} style={{ backgroundColor: '#0E1446', borderRadius: 10 }}>
                    <Text style={{ color: 'white', textAlign: 'center', padding: 12, fontSize: 18, fontWeight: '600' }}>Checkout</Text>
                </TouchableOpacity>
            </View>

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
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => setSelcDay(item)} style={item.getDate() == selcDay?.getDate() ? styles.selcWeekDayStyle : styles.weekDayStyle}>
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
                        data={isCol ? Times.slice(toDay.getHours() - 8) : Times}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => setSelcTime(item)} style={item == selcTime ? styles.selcTimeStyle : styles.timeStyle}>
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
                    <TouchableOpacity onPress={SelectData} style={{ backgroundColor: BlueColor, padding: 15, margin: 20, borderRadius: 10 }}>
                        <Text style={{ textAlign: 'center', color: 'white', fontSize: 22, fontWeight: '500' }}>Select</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
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

export default ColDelivery