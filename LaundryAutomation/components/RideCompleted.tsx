import { CheckCheck, LocateFixed, Navigation } from 'lucide-react-native'
import React, { useState } from 'react'
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { BlueColor, GreyColor, LightGreen } from '../constants/Colors'
import StarRating from 'react-native-star-rating-widget'
import { axiosInstance } from '../helpers/AxiosAPI'
import { useToast } from 'react-native-toast-notifications'
import { useAppSelector } from '../hooks/Hooks'
import LottieView from 'lottie-react-native'

const RideCompleted = (props: any) => {
    const [rating, setRating] = useState(0);
    const [rated, setRated] = useState(false);
    const [review, setReview] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const user: any = useAppSelector((state) => state.user.value);
    let services: string[] = [];

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

        axiosInstance.post('ratings/add', { rating: rating, review: review, oid: props?.route?.params?.ride?._id, uid: user.user._id, shopid: props?.route?.params?.ride?.rid, uname: user?.user.name, services: services })
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

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ padding: 20, marginHorizontal: 30, shadowOffset: { width: 1, height: 1 }, backgroundColor: 'white', borderRadius: 10, shadowOpacity: 0.5 }}>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ padding: 15, backgroundColor: LightGreen, borderRadius: 50 }}>
                        <CheckCheck size={30} color='green' />
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: '500', marginVertical: 10 }}>The Rider Delivered the Clothes!</Text>
                </View>
                <View style={{ height: 2, width: '100%', backgroundColor: GreyColor, marginVertical: 10 }}></View>
                <View>
                    <Text style={{ fontWeight: '500' }}>{Date()}</Text>
                    <View style={{ alignItems: 'center', marginVertical: 5, gap: 8 }}>
                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '100%' }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                                <LocateFixed color='green' size={20} />
                            </View>
                            <View style={{ width: '90%' }}>
                                <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Pickup Location</Text>
                                <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>{props?.route?.params?.ride?.pLoc}</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '100%' }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                                <Navigation color='green' size={20} />
                            </View>
                            <View style={{ width: '90%' }}>
                                <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Dropoff Location</Text>
                                <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>{props?.route?.params?.ride?.dLoc}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View>
                    <View style={{ marginTop: 15, justifyContent: 'center', alignItems: 'center', width: '100%', padding: 20, borderWidth: 0.5, borderRadius: 10, gap: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: '500', color: 'black' }}>Rate Your Experience!</Text>
                        <StarRating
                            rating={rating}
                            onChange={!rated ? setRating : () => { }}
                        />
                        <TextInput editable={rated ? false : true} value={review} onChangeText={setReview} multiline={true} style={{ width: '100%', height: 50, textAlign: 'left', padding: 10, borderWidth: 0.5, borderRadius: 10, color: rated ? 'grey' : 'black' }} placeholder='How was Rider?...' />
                        <TouchableOpacity disabled={rated ? true : false} onPress={onStarRatingPress} style={{ width: '100%', padding: 10, borderRadius: 10, backgroundColor: rated ? 'grey' : BlueColor }}>
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: '500', textAlign: 'center' }}>{rated ? 'Reviewed' : 'Submit'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ height: 2, width: '100%', backgroundColor: GreyColor, marginVertical: 10 }}></View>
                <TouchableOpacity onPress={() => props.navigation.navigate('ShopsStack', { screen: 'Shops' })} style={{ padding: 10, backgroundColor: BlueColor, borderRadius: 10 }}>
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 18, fontWeight: '500' }}>Done</Text>
                </TouchableOpacity>
            </View>
            {loading ?
                <View style={{ padding: 30, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView style={{ width: 150, height: 150 }} source={require('../assets/animated/loading.json')} autoPlay loop />
                </View>
                : null}

        </SafeAreaView >
    )
}

export default RideCompleted