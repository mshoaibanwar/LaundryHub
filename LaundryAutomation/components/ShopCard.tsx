import React, { useEffect, useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import { Star, ShoppingBasket, MapPin } from 'lucide-react-native';
import { BlueColor } from '../constants/Colors';
import { axiosInstance } from '../helpers/AxiosAPI';

const ShopCard = (props: any) => {
    const [ratings, setRatings] = useState<any>(0);
    const [avgRating, setAvgRating] = useState(0);

    useEffect(() => {
        axiosInstance.get(`ratings/shop/${props?.id}`)
            .then(function (response: any) {
                setRatings(response.data);

                let sratings = 0;
                response.data?.map((item: any) => {
                    sratings += item.rating;
                });
                if (response.data?.length > 0)
                    setAvgRating(sratings / response.data?.length);
            })
            .catch(function (error) {
                // handle error
            })
            .then(function () {
                // always executed
            });
    }, []);

    const newProps = { ...props, ratings: ratings, avgRating: avgRating }

    return (
        <TouchableOpacity key={props?.key} onPress={() => { props.prop.navigation.navigate('SingleShop', newProps) }} style={{ padding: 5, backgroundColor: 'white', borderRadius: 20, marginHorizontal: 20, marginTop: 10, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 5, borderWidth: 0.5, borderColor: 'grey' }}>
            <View>
                <View style={{ position: 'relative' }}>
                    <Image
                        source={require('../assets/images/bgimage.jpeg')}
                        style={{ borderTopRightRadius: 17, borderTopLeftRadius: 17, width: '100%', height: 130 }}
                    />
                    <View style={{ position: 'absolute', backgroundColor: 'white', bottom: 10, right: 10, borderRadius: 20, flexDirection: 'row', alignItems: 'center', padding: 8, gap: 5 }}>
                        <Star size={20} fill={ratings.length > 0 ? '#FFD130' : 'none'} color='#FFD130' />
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>
                            {avgRating.toFixed(1)}
                        </Text>
                        <Text style={{ color: 'grey' }}>({ratings.length})</Text>
                    </View>
                </View>
                <View style={{ margin: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5 }}>
                        <Text style={{ fontWeight: 'bold', color: BlueColor, fontSize: 18 }}>
                            {props.itemsdet.title}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                            <MapPin color='black' size={20} />
                            <Text style={{ color: 'black' }}>
                                {props?.dist} KM
                            </Text>
                        </View>
                    </View>
                    <Text style={{ fontSize: 14, marginTop: 5, color: 'black' }}>
                        Minimum Order Rs. {props.itemsdet.minOrderPrice}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10, alignItems: 'center' }}>
                            <ShoppingBasket color='#0E1446' />
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>
                                {props.bprice === 0 ? "Add items in Basket!" : `Basket Price Rs. ${props.bprice}`}
                            </Text>
                        </View>
                        {props?.bilength !== props?.plist.length ?
                            <Text style={{ fontSize: 16, fontWeight: '600', color: 'red', top: 5 }}>Partial</Text>
                            : null}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create(
    {
        text:
        {
            color: 'black',
        }
    }
)

export default ShopCard