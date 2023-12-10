import { ArrowLeft, Banknote, CreditCard } from 'lucide-react-native';
import React, { useEffect, useState } from 'react'
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView, View } from 'react-native'
import { useAppDispatch, useAppSelector } from '../hooks/Hooks';
import { BlueColor } from '../constants/Colors';
import { useToast } from "react-native-toast-notifications";
import { addOrder } from '../reduxStore/reducers/OrderReducer';
import { axiosInstance } from '../helpers/AxiosAPI';
import LottieView from 'lottie-react-native';
import { emptyBasket } from '../reduxStore/reducers/BasketReducer';
import { useDistance } from '../helpers/DistanceCalculator';
import { Switch } from 'react-native-gesture-handler';

const Checkout = (props: any) => {
    const [payMethod, setPayMehod] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingCount, setUploadingCount] = useState(1);
    const orderDetails: any = useAppSelector((state) => state.temporder.value);
    const user: any = useAppSelector((state) => state.user.value);
    const [bookRider, setBookRider] = useState(false);

    const [basketItem, setBasketItem] = useState<any>([]);
    const [shopAddress, setShopAddress] = useState<any>({});

    orderDetails.address.coordinates
    shopAddress.cords
    const distance = useDistance({ from: orderDetails.address.coordinates, to: shopAddress.cords });

    let subTotal = 0;
    orderDetails.prices.forEach((num: any) => {
        subTotal += num;
    })
    let delFee = 0;
    let tPrice = 0;
    if (bookRider) {
        delFee = 80 + distance * 10;
        tPrice = subTotal + delFee + delFee;
    }
    else
        tPrice = subTotal;
    const toast = useToast();
    const dispatch = useAppDispatch();
    const basketItems: any = useAppSelector((state) => state.basket.value);

    useEffect(() => {
        axiosInstance.get(`shops/address/${orderDetails.shopid}`)
            .then((res) => {
                setShopAddress(res.data);
            })
            .catch((err) => {
                console.log(err.response.data);
            })
    }, [])

    const cloudinaryUpload = async (photo: any) => {
        const data = new FormData();
        data.append('file', photo);
        data.append('upload_preset', 'photoupload');
        data.append('cloud_name', 'dwsekopqu');

        try {
            const response: any = await fetch("https://api.cloudinary.com/v1_1/dwsekopqu/image/upload", {
                method: "post",
                body: data
            });
            const imgdata = await response.json();
            return imgdata.url;
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    const updateBasketItems = async () => {
        setUploading(true);
        const updatedBasketItems = await Promise.all(
            basketItems.map(async (item: any) => {
                const imageUrls = await Promise.all(
                    item.images.map(async (image: any) => {
                        const uri = image.uri;
                        const type = image.type;
                        const name = image.fileName;
                        const source = {
                            uri,
                            type,
                            name,
                        };
                        const imageUrl = await cloudinaryUpload(source);
                        setUploadingCount((prev) => prev + 1);
                        return imageUrl;
                    })
                );
                return { ...item, images: imageUrls };
            })
        );

        // Set the updated basket items after all images have been uploaded
        setBasketItem(updatedBasketItems);
        return updatedBasketItems;
    };

    const date = new Date();
    let time = date.getHours();
    const nampm = time >= 12 ? 'PM' : 'AM';
    const ampm = (orderDetails.collection).split(':')[1].split(' ')[1];
    let colTime = (orderDetails.collection).split(':')[0];
    colTime = colTime + ampm;
    time = time % 12;
    time = time ? time : 12;
    const currentTime = time + nampm;

    const placeOrder = async () => {
        setLoading(true);
        const ubasketItems = await updateBasketItems();
        setUploading(false);
        if (payMethod != '') {
            const date = new Date();
            let orderDate = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
            const newOrder: any = { address: orderDetails.address, ocollection: orderDetails.collection, delivery: orderDetails.delivery, items: ubasketItems, shopid: orderDetails.shopid, prices: orderDetails.prices, delFee: delFee, tprice: tPrice, pMethod: payMethod, status: 'Pending', orderDate: orderDate, uid: user.user._id, ride: bookRider };

            axiosInstance.post('orders/add', newOrder)
                .then(function (response: any) {
                    dispatch(addOrder(newOrder));
                    toast.show(response.data, {
                        type: "success",
                        placement: "top",
                        duration: 2000,
                        animationType: "slide-in",
                    });
                    setLoading(false);
                    dispatch(emptyBasket([]));
                    if (currentTime == colTime) {
                        let rideData = { uid: user.user._id, sid: orderDetails.shopid, pLoc: orderDetails.address.add, dLoc: shopAddress.add, pCord: orderDetails.address.coordinates, dCord: shopAddress.cords, oItems: ubasketItems, pMethod: payMethod };
                        props.navigation.navigate('OrderPlaced', { newOrder, RideData: rideData, ride: bookRider });
                    }
                    else
                        props.navigation.navigate('OrderPlaced', { newOrder, ride: bookRider });
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
            toast.show("Please Select Payment Method!", {
                type: "danger",
                placement: "top",
                duration: 2000,
                animationType: "slide-in",
            });
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={{ height: '100%' }}>
            <View style={{ padding: 20 }}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <ArrowLeft color='black' size={25} />
                    </TouchableOpacity>
                    <Text style={{ textAlign: 'center', color: 'black', width: '85%', fontSize: 20, fontWeight: '700' }}>Checkout</Text>
                </View>
                <ScrollView style={{}}>
                    <View style={{ marginTop: 20, width: '100%' }}>
                        <Text style={{ fontSize: 18, fontWeight: '500', color: 'black' }}>Payment Method</Text>
                        <View style={{ gap: 5, marginVertical: 15 }}>
                            <TouchableOpacity onPress={() => setPayMehod('Card')} style={payMethod === 'Card' ? styles.activeBtn : styles.payBtn}>
                                <View style={{ gap: 5 }}>
                                    <Text style={{ fontSize: 16, color: 'black' }}>Card Payment</Text>
                                </View>
                                <View >
                                    <CreditCard color={payMethod === "Card" ? '#03a9f4' : 'black'} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setPayMehod('Cash')} style={payMethod === 'Cash' ? styles.activeBtn : styles.payBtn}>
                                <View style={{ gap: 5 }}>
                                    <Text style={{ fontSize: 16, color: 'black' }}>Cash On Delivery</Text>
                                </View>
                                <View >
                                    <Banknote color={payMethod === "Cash" ? '#03a9f4' : 'black'} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: 'black', fontSize: 16 }}>Book Rider for Pickup and Delivery</Text>
                        <Switch value={bookRider} onValueChange={() => setBookRider(!bookRider)} />
                    </View>
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: '500', color: 'black' }}>Order Summary</Text>
                        <View style={{ borderWidth: 0.5, borderRadius: 10, padding: 20, marginVertical: 10, backgroundColor: 'white' }}>
                            {basketItems.map((item: any, index: number) => (
                                <View key={index} style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <Text style={{ color: 'black' }}>{item.item}</Text>
                                    <Text style={{ color: 'black' }}>Rs. {orderDetails.prices[index]}</Text>
                                </View>
                            ))}
                            <View style={{ height: 1, backgroundColor: 'grey', marginVertical: 10 }}></View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: 'black' }}>Subtotal</Text>
                                <Text style={{ color: 'black' }}>Rs. {subTotal}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: 'black' }}>Delivery Fee (x2)</Text>
                                <Text style={{ color: 'black' }}>Rs. {delFee}</Text>
                            </View>
                            <View style={{ height: 1, backgroundColor: 'grey', marginVertical: 10 }}></View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: 'black' }}>Total</Text>
                                <Text style={{ color: 'black' }}>Rs. {tPrice}</Text>
                            </View>

                        </View>
                    </View>
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: '500', color: 'black' }}>Delivery Address</Text>
                        <View style={{ flexDirection: 'row', marginVertical: 10, padding: 20, borderWidth: 0.5, borderRadius: 10, backgroundColor: 'white' }}>
                            <View style={{ gap: 5 }}>
                                <Text style={{ color: 'black' }}>{orderDetails.address.add}</Text>
                                <View style={{ gap: 2 }}>
                                    <Text style={{ color: BlueColor }}>{orderDetails.address.name}</Text>
                                    <Text style={{ color: BlueColor }}>{orderDetails.address.num}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ height: 200 }}></View>
                </ScrollView>
            </View>
            <View style={{ position: 'absolute', bottom: Platform.OS == 'android' ? 100 : 115, right: 20, left: 20 }}>
                <TouchableOpacity onPress={placeOrder} style={{ backgroundColor: '#0E1446', borderRadius: 10 }}>
                    <Text style={{ color: 'white', textAlign: 'center', padding: 12, fontSize: 18, fontWeight: '600' }}>Place Order</Text>
                </TouchableOpacity>
            </View>
            {loading ?
                <View style={{ padding: 30, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView style={{ width: 150, height: 150 }} source={require('../assets/animated/loading.json')} autoPlay loop />
                    {uploading ?
                        <Text style={{ fontSize: 18, fontWeight: '600', color: 'green', backgroundColor: 'white', padding: 10, marginTop: -20 }}>Uploading Image {uploadingCount} ...</Text>
                        : null}
                </View>
                : null}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    activeBtn:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1.5,
        borderColor: '#03a9f4',
        padding: 16,
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'white'
    },

    payBtn:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 0.5,
        padding: 16,
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'white'
    }
})

export default Checkout