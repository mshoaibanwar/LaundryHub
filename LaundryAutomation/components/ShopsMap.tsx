import React, { useEffect, useRef, useState } from 'react'
import {
    View,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native';

import Carousel from 'react-native-snap-carousel';
import ShopCardCarousel from './ShopCardCarousel';
import MapView from 'react-native-maps';

import { Marker } from 'react-native-maps';
import { ArrowLeft } from 'lucide-react-native';

type Location = {
    latitude: number | undefined,
    longitude: number | undefined,
}

import { useAppSelector } from '../hooks/Hooks';
import { CalcPrices } from '../helpers/PriceCalculator';
import { axiosInstance } from '../helpers/AxiosAPI';


const ShopsMap = ({ route, navigation }: any) => {

    const [refreshing, setRefreshing] = React.useState(false);
    const [ShopData, setShopData] = useState<any>([]);

    useEffect(() => {

        axiosInstance.get(`/shops/getShops/`)
            .then(function (response: any) {
                setShopData(response.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }, [refreshing]);

    const basketItems: any = useAppSelector((state) => state.basket.value);
    const { pricelist, allShopsPriceList } = CalcPrices(ShopData, basketItems);

    const _renderItem = ({ item, index }: { item: any, index: number }) => {
        return (
            <ShopCardCarousel props={navigation} itemsdet={item} bprice={pricelist[index]} plist={allShopsPriceList[index]} />
        );
    }

    const SLIDER_WIDTH = Dimensions.get('window').width;
    const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1 / 1.1);

    const mapRef = useRef<any>(null);
    const caroRef = useRef<any>(null);

    const goToMarker = (lati: number, longi: number) => {
        mapRef?.current?.animateToRegion({ latitude: lati, longitude: longi, latitudeDelta: 0.0239, longitudeDelta: 0.0112 });
    }

    const getIndex = (lati: number, longi: number) => {
        const ind = ShopData.findIndex((obj: any) => (obj.lati === lati && obj.longi === longi));
        return (ind);
    }

    useEffect(() => {
        // Update the document title using the browser API
        if (route.params) {
            caroRef?.current?.snapToItem(getIndex(route.params.prop ? route.params.prop.lati : route.params.prop1.lati, route.params.prop ? route.params.prop.longi : route.params.prop1.longi), true, true);
        }
    });

    return (
        <View>
            <MapView
                ref={mapRef}
                style={{ width: "100%", height: '100%' }}
                region={{
                    latitude: route?.params ? route?.params?.prop ? Number(route?.params?.prop?.lati) : Number(route?.params?.prop1?.lati) : 33.70395347266037,
                    longitude: route?.params ? route?.params?.prop ? Number(route?.params?.prop?.longi) : Number(route?.params?.prop1?.longi) : 73.04128451925754,
                    latitudeDelta: route?.params ? 0.0239 : 0.2239,
                    longitudeDelta: route?.params ? 0.0112 : 0.1412,
                }}
                // showsUserLocation={true}
                //followsUserLocation
                showsMyLocationButton
                loadingEnabled
            >
                {ShopData.map((item: any, index: any) => (
                    <Marker
                        key={index}
                        identifier={item.title}
                        coordinate={{ latitude: Number(item?.lati), longitude: Number(item?.longi) }}
                        title={item.title}
                        description={'Basket Price : [ Rs. ' + pricelist[index] + ' ]'}
                        onSelect={e => { caroRef.current.snapToItem(getIndex(e.nativeEvent.coordinate?.latitude, e.nativeEvent.coordinate?.longitude), true, true) }}
                    />
                ))}
            </MapView>
            <SafeAreaView style={{ position: 'absolute' }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ left: 20, top: 20, backgroundColor: 'white', padding: 15, borderRadius: 15, borderWidth: 0.5 }}>
                    <ArrowLeft color='black' />
                </TouchableOpacity>
            </SafeAreaView>
            <View style={{ marginLeft: 18, position: 'absolute', bottom: Platform.OS == 'android' ? 95 : 110, width: '100%' }}>
                <Carousel layout={'default'}
                    ref={caroRef}
                    slideStyle={{ padding: 5 }}
                    sliderWidth={SLIDER_WIDTH}
                    itemWidth={ITEM_WIDTH}
                    inactiveSlideScale={1}
                    activeSlideAlignment='start'
                    data={ShopData}
                    renderItem={_renderItem}
                    inactiveSlideShift={0}
                    useScrollView={true}
                    onSnapToItem={(index) => { goToMarker(ShopData[index].lati, ShopData[index].longi) }}
                />
            </View>
        </View >
    )
}

export default ShopsMap