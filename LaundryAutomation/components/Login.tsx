import React, { useState } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { DarkPurple, LightPurple, LoginBtn } from '../constants/Colors'
import { Lock, Mail } from 'lucide-react-native'
import { useToast } from 'react-native-toast-notifications'
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { axiosInstance } from '../helpers/AxiosAPI'
import LottieView from 'lottie-react-native'
import { useAppDispatch } from '../hooks/Hooks'
import { addUser } from '../reduxStore/reducers/UserReducer'
import messaging from '@react-native-firebase/messaging';
import { addShopData } from '../reduxStore/reducers/ShopDataReducer'
import socket from '../helpers/Socket'

const Login = (props: any) => {
    const [loading, setLoading] = useState(false);
    const [isUser, setIsUser] = useState(true);
    const [isRider, setIsRider] = useState(false);

    const schema = yup.object().shape({
        email: yup
            .string()
            .required('Email is required')
            .email('Invalid email'),
        password: yup
            .string()
            .required('Password is required')
            .min(8, 'Password must contain at least 8 characters'),
    });
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const toast = useToast();
    const dispatch = useAppDispatch();

    const onPressSend = async (formData: any) => {
        formData.email = formData.email.toLowerCase();
        // Perform actions with the validated form data
        setLoading(true);
        if (Platform.OS === 'android') {
            await messaging().registerDeviceForRemoteMessages();
            const token = await messaging().getToken();
            formData.token = token;
        }
        else {
            formData.token = '';
        }

        axiosInstance.post('users/login', formData)
            .then(function (response: any) {
                response.data.userType = isUser ? 'user' : isRider ? 'rider' : 'seller';
                dispatch(addUser(response.data));
                socket.send(
                    JSON.stringify({
                        userId: response.data.user._id,
                    })
                );
                toast.show("Logged In!", {
                    type: "success",
                    placement: "top",
                    duration: 2000,
                    animationType: "slide-in",
                });
                setLoading(false);
                if (isUser && !isRider)
                    props.navigation.navigate("Tab");
                else if (!isUser && !isRider) {
                    setLoading(true);
                    axiosInstance.get(`shops/user/${response.data.user._id}`)
                        .then(async function (sresponse: any) {
                            setLoading(false);
                            if (sresponse.data.length == 0) {
                                props.navigation.navigate("AddShopData");
                            }
                            else {
                                dispatch(addShopData(sresponse.data[0]));
                                props.navigation.navigate("SellerTab");
                            }
                        })
                        .catch(function (error) {
                            // handle error
                            setLoading(false);
                            toast.show(error?.response?.data, {
                                type: "danger",
                                placement: "top",
                                duration: 3000,
                                animationType: "slide-in",
                            });
                        })
                }
                else if (isRider) {
                    setLoading(true);
                    axiosInstance.get(`riders/user/${response.data.user._id}`)
                        .then(async function (sresponse: any) {
                            setLoading(false);
                            if (sresponse.data.length == 0) {
                                props.navigation.navigate("AddRiderData");
                            }
                            else {
                                dispatch(addShopData(sresponse.data[0]));
                                props.navigation.navigate("RiderTab");
                            }
                        })
                        .catch(function (error) {
                            // handle error
                            setLoading(false);
                            toast.show(error?.response?.data, {
                                type: "danger",
                                placement: "top",
                                duration: 3000,
                                animationType: "slide-in",
                            });
                        })
                }
            })
            .catch(function (error) {
                // handle error
                setLoading(false);
                toast.show(error.response.data, {
                    type: "danger",
                    placement: "top",
                    duration: 3000,
                    animationType: "slide-in",
                });
            })
            .then(function () {
                // always executed
            });
    };
    return (
        <SafeAreaView style={{ justifyContent: 'space-between', alignItems: 'center', height: '100%', backgroundColor: DarkPurple }}>
            <View style={{ width: '90%', marginTop: 30 }}>
                <View style={{ flexDirection: 'row', backgroundColor: LightPurple, padding: 5, borderRadius: 20, width: '100%', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => { setIsUser(true); setIsRider(false) }} style={isUser ? { backgroundColor: LoginBtn, padding: 10, borderRadius: 18, minWidth: '33%' } : { padding: 10, borderRadius: 10, minWidth: '33%' }}>
                        <Text style={isUser ? { textAlign: 'center', color: 'black', fontSize: 20, fontWeight: '700' } : { textAlign: 'center', color: 'white', fontSize: 20, fontWeight: '600' }}>User</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setIsUser(false); setIsRider(false) }} style={!isUser && !isRider ? { backgroundColor: LoginBtn, padding: 10, borderRadius: 18, minWidth: '33%' } : { padding: 10, borderRadius: 10, minWidth: '33%' }}>
                        <Text style={!isUser && !isRider ? { textAlign: 'center', color: 'black', fontSize: 20, fontWeight: '700' } : { textAlign: 'center', color: 'white', fontSize: 20, fontWeight: '600' }}>Seller</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setIsRider(true); setIsUser(false) }} style={isRider ? { backgroundColor: LoginBtn, padding: 10, borderRadius: 18, minWidth: '33%' } : { padding: 10, borderRadius: 10, minWidth: '33%' }}>
                        <Text style={isRider ? { textAlign: 'center', color: 'black', fontSize: 20, fontWeight: '700' } : { textAlign: 'center', color: 'white', fontSize: 20, fontWeight: '600' }}>Rider</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={{ width: '90%', marginTop: 70 }}>
                <KeyboardAvoidingView keyboardVerticalOffset={Platform.OS === 'ios' ? -190 : -190} behavior={Platform.OS === 'ios' ? 'height' : 'padding'} style={{ flex: 1 }}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={{ width: '100%', gap: 50, bottom: 10 }}>
                            <View style={{ gap: 10, marginHorizontal: 10 }}>
                                <Text style={{ color: 'white', fontSize: 40, fontWeight: '600' }}>Login</Text>
                                <Text style={{ color: 'grey', fontSize: 18 }}>Please sign in to continue.</Text>
                            </View>
                            <View style={{ gap: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end', borderWidth: 0.5, borderRadius: 20, gap: 10, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: LightPurple }}>
                                    <View>
                                        <Mail color='white' size={20} />
                                    </View>
                                    <View style={{ width: '100%', gap: 5, justifyContent: 'center' }}>
                                        <Text style={{ color: 'white' }}>EMAIL</Text>
                                        <Controller
                                            control={control}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, value } }) => (
                                                <TextInput value={value} onChangeText={onChange} spellCheck={false} autoComplete='email' placeholderTextColor={'grey'} style={{ width: '88%', fontSize: 17, fontWeight: '600', color: 'white', padding: 0 }} placeholder='name@mail.com' inputMode='email' />
                                            )}
                                            name="email"
                                        />
                                    </View>
                                </View>
                                {errors.email && <Text style={{ color: 'orange', marginLeft: 15 }}>{errors.email.message}</Text>}
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end', borderWidth: 0.5, borderRadius: 20, gap: 10, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: LightPurple }}>
                                    <View>
                                        <Lock color='white' size={20} />
                                    </View>
                                    <View style={{ width: '100%', gap: 5, justifyContent: 'center' }}>
                                        <Text style={{ color: 'white' }}>PASSWORD</Text>
                                        <Controller
                                            control={control}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, value } }) => (
                                                <TextInput value={value} onChangeText={onChange} secureTextEntry={true} autoComplete='password' placeholderTextColor={'grey'} style={{ width: '88%', fontSize: 17, color: 'white', padding: 0 }} placeholder='* * * * * * * *' />
                                            )}
                                            name="password"
                                        />
                                    </View>
                                </View>
                                {errors.password && <Text style={{ color: 'orange', marginLeft: 15 }}>{errors.password.message}</Text>}
                            </View>
                            <View style={{ alignItems: 'center', gap: 20 }}>
                                <TouchableOpacity onPress={handleSubmit(onPressSend)} style={{ paddingVertical: 20, paddingHorizontal: 80, backgroundColor: LoginBtn, borderRadius: 50 }}>
                                    <Text style={{ color: 'black', textAlign: 'center', fontSize: 18, fontWeight: '700' }}>LOGIN</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => props.navigation.navigate("Forgot")}>
                                    <Text style={{ color: 'white' }}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </ScrollView>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                <Text style={{ color: 'grey', fontSize: 16 }}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => { props.navigation.navigate("Register") }}>
                    <Text style={{ color: LoginBtn, fontSize: 16 }}>SignUp</Text>
                </TouchableOpacity>
            </View>

            {
                loading ?
                    <View style={{ padding: 30, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                        <LottieView style={{ width: 150, height: 150 }} source={require('../assets/animated/loading.json')} autoPlay loop />
                    </View>
                    : null
            }

        </SafeAreaView >

    )
}

export default Login