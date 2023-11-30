import React, { useEffect, useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    FlatList,
    Modal,
    Pressable,
    Dimensions,
    Platform,
} from 'react-native';

import { ChevronLeft, Star, MapPin, Clock9, Phone, Navigation, X, CornerLeftUp } from 'lucide-react-native';
import ServiceCard from './ServiceCard';
import SShopItem from './SShopItem';
import { useAppDispatch, useAppSelector } from '../hooks/Hooks';
import { useToast } from 'react-native-toast-notifications';
import { addTempOrder } from '../reduxStore/reducers/TempOrderReducer';
import Carousel from 'react-native-snap-carousel';
import { BlueColor, DarkGrey, LightBlueColor } from '../constants/Colors';
import { CalcPrices } from '../helpers/PriceCalculator';

const SingleShop = (props: any) => {
    const path =
    {
        wash: require("../assets/icons/washin.png"),
        iron: require("../assets/icons/iron.png"),
        dry: require("../assets/icons/clothes.png"),
        carpet: require("../assets/icons/carpet.png"),
    }
    const Data =
        [
            {
                id: '0',
                name: 'Washing',
                desc: 'Wash clean, smell good,but not ironed',
                img: path.wash
            },
            {
                id: '1',
                name: 'Dry Cleaning',
                desc: 'Dry clean, smell good,but and also ironed',
                img: path.wash
            },
            {
                id: '2',
                name: 'Ironing',
                desc: 'Ironing, smell good.',
                img: path.wash
            },
            {
                id: '3',
                name: 'Carpet',
                desc: 'Wash clean, smell good,and neat and clean.',
                img: path.wash
            },
        ];

    const [modalVisible, setModalVisible] = useState(false);
    const [shopStatus, setShopStatus] = useState('Open');

    const basketItems = useAppSelector((state) => state.basket.value);
    const dispatch = useAppDispatch();
    const toast = useToast();

    const date = new Date();
    let today = date.getDay();
    let hourNow = date.getHours();
    let startTime = props.route.params?.itemsdet?.timing[today].time?.start.split(':')[0];
    let endTime = props.route.params?.itemsdet?.timing[today].time?.end.split(':')[0];

    useEffect(() => {
        // Update the document title using the browser API
        if (props.route.params?.itemsdet?.timing[today].status == 'off') {
            setShopStatus('Closed');
        }
        else {
            setShopStatus('Open');
        }
        if (hourNow > 12) {
            hourNow = hourNow - 12;
        }
        if (hourNow >= endTime) {
            setShopStatus('Closed');
        }
        if (hourNow < startTime) {
            setShopStatus('Closed');
        }
    }, []);

    const OnSelectDateTime = () => {
        if (shopStatus == 'Open') {
            if (pricelist[0] != 0) {
                if (props.route.params?.itemsdet?.minOrderPrice <= pricelist[0]) {
                    let upBasketItems: any = [];
                    if (basketItems.length != allShopsPriceList[0].length) {
                        basketItems.map((item: any, index: any) => {
                            if (allShopsPriceList[0][index] != undefined)
                                upBasketItems.push(item);
                        });
                    }
                    else {
                        upBasketItems = basketItems;
                    }
                    const tempOrder: any = { prices: props.route.params?.plist, items: upBasketItems, shopid: props.route.params?.itemsdet ? props.route.params?.itemsdet._id : props.route.params?.itemdet._id };
                    dispatch(addTempOrder(tempOrder))
                    props.navigation.navigate("ShopsStack", { screen: 'ColDel', params: props.route.params?.itemsdet })
                }
                else {
                    toast.show("Basket Price is less than Minimum Order Price Limit. Add more items in basket!", {
                        type: 'warning',
                        placement: "top",
                        duration: 4000,
                        animationType: "slide-in",
                    });
                }
            }
            else {
                toast.show("Basket is Empty!", {
                    type: 'warning',
                    placement: "top",
                    duration: 2000,
                    animationType: "slide-in",
                });
            }
        }
        else {
            toast.show("Shop is Closed!", {
                type: 'warning',
                placement: "top",
                duration: 2000,
                animationType: "slide-in",
            });
        }
    }

    const _renderItem = ({ item, index }: { item: any, index: number }) => {
        return (
            <View key={index}>
                <View key={index} style={{ borderWidth: 0.5, padding: 10, borderRadius: 10, backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>{item.uname}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <Star size={20} color='#FFD130' fill='#FFD130' />
                            <Text style={{ fontSize: 18, color: 'black' }}>{item.rating.toFixed(1)}</Text>
                        </View>
                    </View>
                    <Text style={{ color: 'grey', fontSize: 13 }}>{item.createdAt.split('T')[0]}</Text>
                    <Text style={{ color: 'black', fontSize: 16 }}>{item.review}</Text>
                    <View style={{ flexDirection: 'row', gap: 5, marginTop: 6 }}>
                        {item?.services?.map((item: any, key: any) => (
                            <View key={key} style={{ paddingHorizontal: 7, paddingVertical: 5, borderWidth: 0.5, borderRadius: 20, backgroundColor: LightBlueColor }}>
                                <Text style={{ color: 'black', fontSize: 12 }}>{item}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                {item?.feedback ?
                    <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginVertical: 3 }}>
                        <CornerLeftUp size={30} color='grey' />
                        <Text style={{ width: '70%', fontSize: 15, fontWeight: '500', color: 'black', padding: 10, borderWidth: 0.7, borderRadius: 10 }}>{item?.feedback}</Text>
                    </View> : null
                }
            </View >
        );
    }

    const SLIDER_WIDTH = Dimensions.get('window').width;
    const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1 / 1.115);

    const { pricelist, allShopsPriceList } = CalcPrices([props.route.params?.itemsdet], basketItems);

    return (
        <View>
            <ImageBackground source={require('../assets/images/bgimage.jpeg')} resizeMode='cover' style={[{ height: 250 }, Platform.OS === 'android' ? { height: 210 } : {}]}>
                <View>
                    <TouchableOpacity onPress={() => { props.navigation.goBack() }} style={styles.backBtn}>
                        <ChevronLeft size={30} color='#0E1446' />
                    </TouchableOpacity>

                </View>
            </ImageBackground>

            <View style={{ backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 20, top: -115, borderWidth: 0.3 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>
                        {props.route.params?.itemsdet ? props.route.params?.itemsdet.title : props.route.params?.itemdet.title}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Star size={22} color='#FFD130' fill='#FFD130' />
                        <Text style={{ fontSize: 20, color: 'black' }}>{props?.route?.params?.avgRating?.toFixed(1)}</Text>
                        <Text style={{ color: 'black', fontSize: 15 }}>({props?.route?.params?.ratings?.length})</Text>
                    </View>
                </View>
                <View style={{ alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                    <MapPin size={20} color='#0E1446' />
                    <Text style={{ color: 'black' }}>{props.route.params?.itemsdet ? props.route.params?.itemsdet.address : props.route.params?.itemdet.address}</Text>
                </View>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ alignItems: 'center', flexDirection: 'row', gap: 5, marginTop: 10 }}>
                        <Clock9 size={20} color='#0E1446' />
                        <Text style={{ color: 'black' }}>{props.route.params?.itemsdet?.timing[today].time?.start} - {props.route.params?.itemsdet?.timing[today].time?.end}</Text>
                    </View>
                    <Text style={shopStatus == 'Closed' ? { color: 'red', fontSize: 16, fontWeight: '600' } : { color: 'green', fontSize: 16, fontWeight: '600' }}>{shopStatus}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 20, marginTop: 20 }}>
                    <TouchableOpacity style={{ borderColor: 'red', borderWidth: 1, borderRadius: 20, paddingHorizontal: 20, justifyContent: 'center', padding: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Phone color='red' size={20} />
                            <Text style={{ color: 'red' }}>Call</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { props.navigation.navigate("MapStack", { screen: 'ShopsMap', params: { prop: props.route.params.itemsdet, prop1: props.route.params.itemdet } }) }} style={{ borderColor: 'red', borderWidth: 1, borderRadius: 20, paddingHorizontal: 20, justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Navigation color='red' size={20} />
                            <Text style={{ color: 'red' }}>Locate</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>

            <View style={{ top: -143, padding: 20 }}>
                <FlatList
                    data={Data}
                    renderItem={({ item, index }) => (
                        <ServiceCard key={index} navigation={Navigation} name={item.name} desc={item.desc} img={item.img} />
                    )}
                    //Setting the number of column
                    numColumns={2}
                    keyExtractor={item => item.id}
                    ListHeaderComponent={
                        <View>
                            {
                                pricelist[0] == 0 ?
                                    <View>
                                        <View style={{ padding: 20, backgroundColor: LightBlueColor, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 0.4, marginBottom: 10 }}>
                                            <View>
                                                <Text style={{ fontSize: 20, color: 'black', fontWeight: '500' }}>Laundry Basket</Text>
                                                <Text style={{ fontSize: 16, color: DarkGrey, marginVertical: 5 }}>Creating a basket will help you compare prices across laundry shops.</Text>
                                                <TouchableOpacity onPress={() => { props.navigation.navigate("BasketStack", { screen: 'Basket' }) }}>
                                                    <Text style={{ fontSize: 16, fontWeight: '500', color: BlueColor }}>Create Basket</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                    : null
                            }
                            <View>
                                <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 0.4 }}>
                                    <View>
                                        <Text style={{ fontSize: 25, color: 'black' }}>Rs. {pricelist[0]}</Text>
                                        <TouchableOpacity onPress={() => { props.navigation.navigate("BasketStack", { screen: 'ViewBasket' }) }}>
                                            <Text style={{ textDecorationLine: 'underline', color: 'black' }}>View Basket</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity onPress={OnSelectDateTime} style={{ backgroundColor: '#0E1446', borderRadius: 10 }}>
                                        <Text style={{ color: 'white', padding: 20, fontSize: 16, fontWeight: 'bold' }}>Select date & time</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {basketItems.length != allShopsPriceList[0].length && pricelist[0] !== 0 ?
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ color: 'red', fontWeight: '500' }}>Note: There are some items in basket on which this shop not provides service. Those items will not be added in your order. You can view those items by clicking the below button!</Text>
                                </View>
                                : null}
                            {pricelist[0] == 0 ?
                                null
                                :
                                <View>
                                    <TouchableOpacity onPress={() => setModalVisible(true)} style={{ flex: 1, backgroundColor: '#0E1446', borderRadius: 10, marginTop: 10 }}>
                                        <Text style={{ color: 'white', padding: 12, fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>View Item Wise Price</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            {props?.route?.params?.ratings?.length > 0 ?
                                <View style={{ marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', marginBottom: 8 }}>
                                        <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'black' }}>Ratings</Text>
                                        <Text style={{ fontSize: 15, color: 'black' }}>({props?.route?.params?.ratings?.length})</Text>
                                    </View>
                                    <Carousel layout={'default'}
                                        slideStyle={{ padding: 2 }}
                                        sliderWidth={SLIDER_WIDTH}
                                        itemWidth={ITEM_WIDTH}
                                        inactiveSlideScale={1}
                                        activeSlideAlignment='start'
                                        data={props?.route?.params?.ratings}
                                        renderItem={_renderItem}
                                        inactiveSlideShift={0}
                                        useScrollView={true}
                                        inactiveSlideOpacity={1}
                                    />
                                </View>
                                : null}

                            <Text style={{ marginVertical: 13, fontSize: 17, fontWeight: 'bold', color: 'black' }}>Shop Services</Text>
                        </View>
                    }
                    ListFooterComponent={<View style={[{ height: 910 }, Platform.OS === 'android' ? { height: 810 } : {}]}></View>}
                />
            </View>

            <Modal
                animationType="slide"
                presentationStyle={'pageSheet'}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 20, marginBottom: 0 }}>
                        <Pressable onPress={() => setModalVisible(!modalVisible)} style={{ backgroundColor: '#F1F1F0', padding: 10, borderRadius: 15, width: 45, height: 45, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.5, shadowRadius: 5 }}>
                            <X color='black' />
                        </Pressable>
                        <Text style={{ textAlign: 'center', width: '78%', fontSize: 18, fontWeight: '600' }}>Item Wise Prices</Text>
                    </View>
                    {basketItems.length != allShopsPriceList[0].length ?
                        <Text style={{ marginHorizontal: 20, marginTop: 20, fontWeight: '500', fontSize: 15, color: 'red' }}>Note: Highlighted items are those on which this shop not provides service. Highlighted items will not be added in your order!</Text>
                        : null}
                    <View style={{ margin: 20, borderRadius: 10, backgroundColor: 'white', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.25, shadowRadius: 3 }}>
                        <FlatList
                            style={{ marginVertical: 5 }}
                            data={basketItems}
                            renderItem={({ item, index }: any) => (
                                <SShopItem key={index} name={item.item} type={item.serType} img={item.images[0]} id={item.id} price={allShopsPriceList[0][index]} />
                            )}
                            keyExtractor={(item: any) => item.id}
                            ItemSeparatorComponent={() => <View style={{ height: 2, backgroundColor: '#F1F1F0' }}></View>}
                        />
                    </View>
                </View>
            </Modal>

        </View>
    )
}


const styles = StyleSheet.create(
    {
        backBtn:
        {
            top: Platform.OS == "android" ? 40 : 80,
            left: 20,
            backgroundColor: 'white',
            borderRadius: 15,
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center'
        }
    }
);

export default SingleShop