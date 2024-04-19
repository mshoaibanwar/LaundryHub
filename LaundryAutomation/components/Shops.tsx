import React, { useEffect, useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    FlatList,
    TextInput,
} from 'react-native';
import ShopCard from './ShopCard';
import { MapPin } from 'lucide-react-native';
import { useAppSelector } from '../hooks/Hooks';
import { useDistance } from '../helpers/DistanceCalculator';
import { CalcPrices } from '../helpers/PriceCalculator';
import { axiosInstance } from '../helpers/AxiosAPI';
import { BlueColor } from '../constants/Colors';
import { set } from 'react-hook-form';

function Shops(props: any) {
    const user: any = useAppSelector((state) => state.user.value);

    const [nActive, setnActive] = useState(false);
    const [pActive, setpActive] = useState(true);
    const [cActive, setcActive] = useState(false);
    const [NShopsData, setNShopsData] = useState<any>([]);
    const [ShopsData, setShopsData] = useState<any>([]);
    const [userLoc, setUserLoc] = useState<any>(user?.ccord);
    const [ratings, setRatings] = useState<any>([]);

    const basketItems: any = useAppSelector((state) => state.basket.value);
    const [ShowLoader, setShowLoader] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        axiosInstance.get(`/shops/getShops/`)
            .then(function (response: any) {
                setShopsData(response.data);
                setNShopsData(response.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }, [refreshing]);

    useEffect(() => {
        setTimeout(() => {
            setShowLoader(false);
        }, 500);
    }, [ShowLoader]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    let Distances: any = [];
    for (let i = 0; i < ShopsData.length; i++) {
        const dist = useDistance({ from: { latitude: userLoc?.latitude ? userLoc.latitude : 33.603, longitude: userLoc?.longitude ? userLoc.longitude : 73.4412 }, to: { latitude: ShopsData[i]?.lati, longitude: ShopsData[i]?.longi } });
        Distances.push(dist);
    }

    const getShopRating = async (ratings: any) => {
        try {
            const shopRatings = ratings;
            if (shopRatings?.length > 0) {
                const avg = shopRatings.reduce((sum: any, item: any) => sum + item.rating, 0) / shopRatings.length;
                return avg;
            } else {
                return 0;
            }
        } catch (error) {
            console.error(`Error fetching ratings for shop ID : ${error}`);
            return 0;
        }
    };

    useEffect(() => {
        const fetchShopRatings = async () => {
            try {
                const newRatings = await Promise.all(ShopsData?.map((shop: any) => getShopRating(shop.ratings)));
                setRatings(newRatings);
            } catch (error) {
                console.error(`Error fetching shop ratings: ${error}`);
            }
        };
        setRatings([]);
        fetchShopRatings();
        OnPopular();
    }, [refreshing]);

    const { pricelist, allShopsPriceList } = CalcPrices(ShopsData, basketItems);

    const OnCheapest = () => {
        let newArray = ShopsData.map((obj1: any, index: any) => {
            let obj2 = { bp: pricelist[index] };
            let obj3 = { allPriceList: allShopsPriceList[index] }
            let obj4 = { dist: Distances[index] }
            return { ...obj1, ...obj2, ...obj3, ...obj4 };
        });
        const numAscending: any = [...newArray].sort((a, b) => a.bp - b.bp);
        setShopsData(numAscending);
        setnActive(false);
        setcActive(true);
        setpActive(false);
        setShowLoader(true);
    }

    const OnPopular = () => {
        let newArray = ShopsData.map((obj1: any, index: any) => {
            let obj2 = { bp: pricelist[index] };
            let obj3 = { allPriceList: allShopsPriceList[index] }
            let obj4 = { dist: Distances[index] }
            let obj5 = { rating: ratings?.[index] }
            return { ...obj1, ...obj2, ...obj3, ...obj4, ...obj5 };
        });
        const numAscending: any = [...newArray].sort((a, b) => b.rating - a.rating);
        setShopsData(numAscending);
        setnActive(false);
        setcActive(false);
        setpActive(true);
        setShowLoader(true);
    }

    const OnNearest = () => {
        let newArray = ShopsData.map((obj1: any, index: any) => {
            let obj2 = { bp: pricelist[index] };
            let obj3 = { allPriceList: allShopsPriceList[index] }
            let obj4 = { dist: Distances[index] }
            return { ...obj1, ...obj2, ...obj3, ...obj4 };
        });
        const numAscending: any = [...newArray].sort((a, b) => a.dist - b.dist);
        setShopsData(numAscending);
        setnActive(true);
        setcActive(false);
        setpActive(false);
        setShowLoader(true);
    }

    useEffect(() => {
        OnPopular();
    }, [ratings]);

    const OnSearch = (text: string) => {
        if (text) {
            let newArray = NShopsData.filter((item: any) => item.title.toLowerCase().includes(text.toLowerCase()));
            setShopsData(newArray);
        }
        else {
            setShopsData(NShopsData);
        }
    }

    return (
        <SafeAreaView>
            {ShowLoader ?
                <ActivityIndicator size={'large'} color="#0E1446" style={{ position: 'absolute', top: 420, left: "46%", zIndex: 1 }} />
                : null}
            <View style={{ flexDirection: 'row', gap: 10, marginHorizontal: 20, marginVertical: 10 }}>
                <MapPin color='black' size={30} />
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'black' }}>{user?.cadd}</Text>
            </View>
            <TextInput onChangeText={(t) => OnSearch(t)} style={{ backgroundColor: 'white', color: 'black', padding: 10, marginHorizontal: 20, marginBottom: 10, borderRadius: 10, borderWidth: 0.5, borderColor: 'grey' }} placeholder="Search for a shop" placeholderTextColor="grey" />
            <View style={{ flexDirection: 'row', padding: 20, paddingVertical: 0, gap: 10 }}>
                <TouchableOpacity onPress={OnPopular} style={{ alignItems: 'center' }}>
                    <Text style={pActive ? styles.active : styles.topNav}>
                        Popular
                    </Text>
                    {pActive ?
                        <View style={{ width: 18, height: 6, backgroundColor: BlueColor, borderRadius: 10, marginVertical: 6 }}></View>
                        : null}
                </TouchableOpacity>
                <TouchableOpacity onPress={OnNearest} style={{ alignItems: 'center' }}>
                    <Text style={nActive ? styles.active : styles.topNav}>
                        Nearest
                    </Text>
                    {nActive ?
                        <View style={{ width: 18, height: 6, backgroundColor: BlueColor, borderRadius: 10, marginVertical: 6 }}></View>
                        : null}
                </TouchableOpacity>
                <TouchableOpacity onPress={OnCheapest} style={{ alignItems: 'center' }}>
                    <Text style={cActive ? styles.active : styles.topNav}>
                        Cheapest
                    </Text>
                    {cActive ?
                        <View style={{ width: 18, height: 6, backgroundColor: BlueColor, borderRadius: 10, marginVertical: 6 }}></View>
                        : null}
                </TouchableOpacity>
            </View>
            {!ShowLoader ?
                <>
                    <FlatList
                        data={ShopsData}
                        renderItem={({ item, index }) => <ShopCard shopsData={ShopsData} id={item._id} key={index} prop={props} itemsdet={item} bprice={item?.bp ? item.bp : pricelist[index]} plist={item?.allPriceList ? item.allPriceList : allShopsPriceList[index]} dist={item?.dist ? item.dist : Distances[index]} bilength={basketItems.length} />}
                        keyExtractor={item => item.id}
                        ListFooterComponent={<View style={{ height: 270 }}></View>}
                        onRefresh={onRefresh}
                        refreshing={refreshing}
                    />
                </>
                : null}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create(
    {
        topNav:
        {
            fontSize: 18,
            color: 'grey'
        },
        active:
        {
            fontWeight: 'bold',
            fontSize: 18,
            color: 'black'
        }
    }
);

export default Shops