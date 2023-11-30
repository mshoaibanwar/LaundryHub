import React, { useEffect, useState } from 'react'
import { BlueColor, DarkGrey, LightGreen } from '../../constants/Colors';

import {
    Text,
    View,
    Image,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';

import { axiosInstance } from '../../helpers/AxiosAPI';
import LottieView from 'lottie-react-native';
import MapView, { Marker } from 'react-native-maps';
import { Banknote, LocateFixed, MapPin, MessageCircle, MessageSquare, Navigation, Phone } from 'lucide-react-native';
import MapViewDirections from 'react-native-maps-directions';

const CurrentRide = ({ navigation }: any) => {
    const texts = ['Set Arrived', 'Set Pickedup', 'Set Droppedoff', 'Set Completed']
    const [btnPressCount, setBtnPressCount] = useState(0);
    const [origin, setOrigin] = useState({ latitude: 37.78825, longitude: -122.4324 });
    const [destination, setDestination] = useState({ latitude: 37.18825, longitude: -122.1324 });
    const GOOGLE_MAPS_APIKEY = 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY';
    return (
        <View style={{ height: '100%', backgroundColor: 'white' }}>
            <View style={{ height: '65%' }}>
                <MapView
                    style={{ flex: 1 }}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    loadingEnabled={true}
                    region={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                >
                    <Marker.Animated
                        ref={marker => {
                            marker = marker;
                        }}
                        coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
                        title={"title"}
                        description={"description"}
                    />
                    <MapViewDirections
                        origin={origin}
                        destination={destination}
                        apikey={GOOGLE_MAPS_APIKEY}
                    />
                </MapView>
            </View>
            <View style={{ height: 2, width: '100%', backgroundColor: 'black' }}>
            </View>
            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ margin: 5, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                        <Image style={{ width: 50, height: 50, borderRadius: 50 }} source={require('../../assets/images/profileph.png')} />
                        <View style={{}}>
                            <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginTop: 0 }}>Wali M.</Text>
                            <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>wali@gmail.com</Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'center', gap: 10, flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                        <TouchableOpacity style={{ backgroundColor: LightGreen, borderRadius: 10, padding: 10 }}>
                            <MessageSquare size={20} color={'green'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: LightGreen, borderRadius: 10, padding: 10 }}>
                            <Phone size={20} color={'green'} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ height: 1, width: '93%', backgroundColor: 'grey', marginHorizontal: 10, marginBottom: 8 }}>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '95%' }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                            <LocateFixed color='green' size={20} />
                        </View>
                        <View style={{ width: '90%' }}>
                            <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Pickup Location</Text>
                            <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>House# 123, Street# 123, Sector# 123, Islamabad, 440000</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '95%' }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: LightGreen, borderRadius: 10 }}>
                            <Navigation color='green' size={20} />
                        </View>
                        <View style={{ width: '90%' }}>
                            <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Dropoff Location</Text>
                            <Text style={{ fontSize: 14, fontWeight: '300', color: 'black' }}>House# 123, Street# 123, Sector# 123, Islamabad</Text>
                        </View>
                    </View>
                </View>
                <View style={{ height: 1, width: '93%', backgroundColor: 'grey', marginHorizontal: 10, marginVertical: 8 }}>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MapPin color='green' size={25} />
                            <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginLeft: 10 }}>5 KM Distance</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Banknote color='green' size={25} />
                            <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginLeft: 10 }}>Fare: Rs 150</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                    <TouchableOpacity onPress={() => setBtnPressCount(btnPressCount + 1)} style={{ backgroundColor: BlueColor, width: '65%', borderRadius: 5, padding: 8 }}>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'white', textAlign: 'center' }}>{texts[btnPressCount]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: 'red', width: '33%', borderRadius: 5, padding: 8 }}>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'white', textAlign: 'center' }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
export default CurrentRide;