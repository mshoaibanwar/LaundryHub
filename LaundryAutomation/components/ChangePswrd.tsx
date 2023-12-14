import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react-native'
import React, { useState } from 'react'
import { Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { BlueColor, GreyColor, LightPurple, LoginBtn } from '../constants/Colors';
import { axiosInstance } from '../helpers/AxiosAPI';
import { useToast } from 'react-native-toast-notifications';
import { useAppSelector } from '../hooks/Hooks';
import LottieView from 'lottie-react-native';
import { useTogglePasswordVisibility } from '../helpers/useTogglePasswordVisibility'

const ChangePswrd = (props: any) => {
    const [oldpass, setOldPass] = useState('');
    const [newpass, setNewPass] = useState('');

    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const user: any = useAppSelector((state) => state.user.value);

    const { passwordVisibility, rightIcon, handlePasswordVisibility } =
        useTogglePasswordVisibility();

    const updatePass = () => {
        setLoading(true);
        if (oldpass.length >= 8 && newpass.length >= 8) {
            axiosInstance.post('users/changepass', { email: user?.user?.email, opassword: oldpass, password: newpass })
                .then(function (response: any) {
                    // handle success
                    toast.show(response.data, {
                        type: "success",
                        placement: "top",
                        duration: 2000,
                        animationType: "slide-in",
                    });
                    setLoading(false);
                })
                .catch(function (error) {
                    // handle error
                    setLoading(false);
                    toast.show(error.response.data, {
                        type: "danger",
                        placement: "top",
                        duration: 2000,
                        animationType: "slide-in",
                    });
                })
        }
        else {
            toast.show('Passwords must be atleast 8 characters long', {
                type: "danger",
                placement: "top",
                duration: 2000,
                animationType: "slide-in",
            });
            setLoading(false);
        }
    }
    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: 'white' }}>
            <View style={[{ flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 10, justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 0.5, borderColor: 'grey' }, Platform.OS == 'android' ? { paddingVertical: 15 } : null]}>
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <ArrowLeft color='black' size={25} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', position: 'relative', color: 'black', fontSize: 18, fontWeight: '600' }}>Change Password</Text>
                <View style={{ width: 25 }} />
            </View>
            <View style={{ backgroundColor: GreyColor, height: '100%' }}>
                <View style={{ padding: 20, gap: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', borderWidth: 0.5, borderRadius: 10, gap: 10, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: LightPurple }}>
                        <View>
                            <Lock color='white' size={20} />
                        </View>
                        <View style={{ width: '100%', gap: 5, justifyContent: 'center' }}>
                            <Text style={{ color: 'white' }}>OLD PASSWORD</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 30 }}>
                                <TextInput value={oldpass} onChangeText={setOldPass} secureTextEntry={passwordVisibility} autoComplete='password' placeholderTextColor={'grey'} style={{ width: '88%', fontSize: 17, color: 'white', padding: 0 }} placeholder='* * * * * * * *' />
                                <TouchableOpacity onPress={handlePasswordVisibility}>
                                    {rightIcon == 'eye' ?
                                        <Eye size={20} color="white" />
                                        : <EyeOff size={20} color="white" />}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', borderWidth: 0.5, borderRadius: 10, gap: 10, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: BlueColor }}>
                        <View>
                            <Lock color='white' size={20} />
                        </View>
                        <View style={{ width: '100%', gap: 5, justifyContent: 'center' }}>
                            <Text style={{ color: 'white' }}>NEW PASSWORD</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 30 }}>
                                <TextInput value={newpass} onChangeText={setNewPass} secureTextEntry={passwordVisibility} autoComplete='password' placeholderTextColor={'grey'} style={{ width: '88%', fontSize: 17, color: 'white', padding: 0 }} placeholder='* * * * * * * *' />
                                <TouchableOpacity onPress={handlePasswordVisibility}>
                                    {rightIcon == 'eye' ?
                                        <Eye size={20} color="white" />
                                        : <EyeOff size={20} color="white" />}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 20 }}>
                    <TouchableOpacity onPress={updatePass} style={{ paddingVertical: 12, backgroundColor: BlueColor, borderRadius: 10 }}>
                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 18, fontWeight: '500' }}>Update</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {loading ?
                <View style={{ padding: 30, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView style={{ width: 150, height: 150 }} source={require('../assets/animated/loading.json')} autoPlay loop />
                </View>
                : null}
        </SafeAreaView>
    )
}

export default ChangePswrd