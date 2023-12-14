import { Star } from 'lucide-react-native';
import React, { useEffect, useState } from 'react'
import {
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import { axiosInstance } from '../helpers/AxiosAPI';

type ShopProps = {
    itemsdet: any,
    props: any
    bprice: number
    plist: any
}

const ShopCardCarousel = (props: ShopProps) => {
    const [ratings, setRatings] = useState<any>(0);
    const [avgRating, setAvgRating] = useState(0);

    useEffect(() => {
        axiosInstance.get(`ratings/shop/${props?.itemsdet?._id}`)
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
    }, [props]);

    const newProps = { ...props, ratings: ratings, avgRating: avgRating }
    return (
        <View style={{ marginVertical: 10, borderWidth: 0.6, borderColor: 'grey', borderRadius: 15, backgroundColor: 'white', shadowOffset: { width: 0, height: 0 }, shadowRadius: 3, shadowOpacity: 0.2, elevation: 3 }}>
            <Image source={require('../assets/images/bgimage.jpeg')} style={{ width: 'auto', height: 100, borderTopLeftRadius: 15, borderTopRightRadius: 15 }} />
            <View style={{ alignItems: 'center', padding: 10, gap: 8 }}>
                <Text style={{ color: 'black', fontSize: 16 }} numberOfLines={1}>{props.itemsdet?.title} (Rs. {props.bprice})</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Star size={14} color='blue' fill={ratings.length > 0 ? 'blue' : 'none'} />
                    <Text style={{ color: 'black' }}>{avgRating.toFixed(1)}</Text>
                    <Text style={{ color: 'black' }}>({ratings.length})</Text>
                </View>
                <TouchableOpacity onPress={() => { props.props.navigate("ShopsStack", { screen: 'SingleShop', initial: false, params: newProps }) }} style={{ borderWidth: 1, borderRadius: 10, width: '100%', alignItems: 'center', padding: 6 }}>
                    <Text style={{ fontWeight: '500', color: 'black', fontSize: 16 }}>View</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ShopCardCarousel