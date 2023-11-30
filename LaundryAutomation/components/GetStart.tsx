import React from 'react'
import {
    Text,
    View,
    TouchableHighlight,
    SafeAreaView,
    ImageBackground
} from 'react-native';

const GetStart = (props: any) => {
    return (
        <View>
            <ImageBackground source={require('../assets/images/Splash.png')} style={{ height: '100%', width: '100%' }} resizeMode='stretch'>

                <SafeAreaView style={{ height: '100%' }}>
                    <View style={{ top: '20%', gap: 30 }}>
                        <Text style={{ fontSize: 70, fontWeight: '900', color: 'white', textAlign: 'center' }}>Laundry Hub</Text>
                    </View>
                    <TouchableHighlight onPress={() => { props.navigation.navigate("Login") }} style={{
                        backgroundColor: '#63F0C0', padding: 20, alignItems: 'center', borderRadius: 50, bottom: 50, left: 20, right: 20, position: 'absolute', borderWidth: 0, shadowOffset: {
                            width: 1
                            , height: 2
                        }, shadowColor: 'black', shadowOpacity: 0.7, shadowRadius: 15
                    }}>
                        <View>
                            <Text style={{ fontSize: 24, color: 'black', fontWeight: '600' }}>Get Started</Text>
                        </View>
                    </TouchableHighlight>
                </SafeAreaView>
            </ImageBackground>
        </View>
    )
}

export default GetStart