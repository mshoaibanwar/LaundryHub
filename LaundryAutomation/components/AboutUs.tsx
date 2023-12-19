import { ArrowLeft } from 'lucide-react-native'
import React from 'react'
import { Image, Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { GreyColor } from '../constants/Colors'

const AboutUs = ({ navigation }: any) => {
    return (
        <SafeAreaView style={{ backgroundColor: 'white' }}>
            <View style={[{ flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 10, borderBottomWidth: 0.5, borderColor: 'grey' }, Platform.OS == 'android' ? { paddingVertical: 15 } : null]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft color='black' size={25} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', color: 'black', width: '87%', fontSize: 18, fontWeight: '600' }}>About Us</Text>
            </View>
            <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: GreyColor }}>
                <View style={{ alignItems: 'center', height: '80%', justifyContent: 'space-between' }}>
                    <View style={{ alignItems: 'center', gap: 30 }}>
                        <View>
                            <Image source={require('../assets/images/LogoTrans.png')} style={{ width: 300, height: 300 }} />
                        </View>
                        <View style={{ alignItems: 'center', gap: 5 }}>
                            <Text style={{ fontSize: 20, fontWeight: '600', color: 'black' }}>Developed by:</Text>
                            <Text style={{ fontSize: 16, color: 'black' }}>Muhammad Shoaib Anwar</Text>
                            <Text style={{ fontSize: 16, color: 'black' }}>Aoun Raza</Text>
                            <Text style={{ fontSize: 16, color: 'black' }}>Wali Muhammad</Text>
                        </View>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ color: 'black' }}>Version 1.0.0</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default AboutUs