import { ArrowLeft, Star } from 'lucide-react-native'
import React, { useEffect } from 'react'
import { RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { axiosInstance } from '../../helpers/AxiosAPI';
import RatingItem from './RatingItem';
import { useAppSelector } from '../../hooks/Hooks';
import LottieView from 'lottie-react-native';

const Ratings = (props: any) => {
    const [ratings, setRatings] = React.useState<any>(null);
    const [refreshing, setRefreshing] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const user: any = useAppSelector((state) => state.user.value);

    const shopData: any = useAppSelector((state) => state.shopdata.value);

    useEffect(() => {
        if (user?.userType == 'rider') {
            axiosInstance.get(`/ratings/shop/${user?.user?._id}`)
                .then((res) => {
                    setRatings(res.data);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else
            axiosInstance.get(`/ratings/shop/${shopData?._id}`)
                .then((res) => {
                    setRatings(res.data);
                })
                .catch((err) => {
                    console.log(err);
                })
    }, [refreshing, loading])

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    }, []);

    const onLoad = React.useCallback(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }, [loading]);

    return (
        <SafeAreaView style={{ margin: 20, height: '100%' }}>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <ArrowLeft color='black' size={25} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', color: 'black', width: '85%', fontSize: 20, fontWeight: '700' }}>Ratings</Text>
            </View>
            <ScrollView style={{ marginTop: 15 }} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                {
                    ratings && ratings?.length == 0 ?
                        <View style={{ justifyContent: 'center', alignItems: 'center', top: '230%' }}>
                            <Text style={{ fontSize: 18, fontWeight: '500', color: 'black' }}>No Ratings Yet!</Text>
                        </View>
                        : null
                }
                {ratings && ratings.map((rating: any, index: any) => (
                    <RatingItem rating={rating} key={index} setRef={setLoading} />
                ))
                }
                <View style={{ height: 110 }}></View>
            </ScrollView>

            {loading ?
                <View style={{ padding: 30, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView style={{ width: 150, height: 150 }} source={require('../../assets/animated/loading.json')} autoPlay loop />
                </View>
                : null}
        </SafeAreaView>
    )
}

export default Ratings