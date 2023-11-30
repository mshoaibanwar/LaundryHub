import React, { useEffect, useState } from 'react'
import { Keyboard, SafeAreaView, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { DarkPurple, LightPurple, LoginBtn } from '../constants/Colors'
import { ArrowLeft, Hash, Lock, Mail } from 'lucide-react-native'
import { useToast } from 'react-native-toast-notifications'
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getRandomValues } from 'crypto'
import { useAppDispatch, useAppSelector } from '../hooks/Hooks'
import { addUser, logout } from '../reduxStore/reducers/UserReducer'
import { axiosInstance } from '../helpers/AxiosAPI'
import LottieView from 'lottie-react-native'

const ForgotPswrd = (props: any) => {
    const [validated, setValidated] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [pass, setPass] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const schema = yup.object().shape({
        email: yup
            .string()
            .required('Email is required')
            .email('Invalid email'),
    });
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: ''
        },
    });

    const toast = useToast();
    const dispatch = useAppDispatch();
    const user: any = useAppSelector((state) => state.user.value);

    useEffect(() => {
        if (user == null) {
            let veriCode = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < 6) {
                veriCode += characters.charAt(Math.floor(Math.random() * charactersLength));
                counter += 1;
            }
            dispatch(addUser({ vcode: veriCode } as any));
        }
    }, []);


    const onPressSend = (formData: any) => {
        // Perform actions with the validated form data
        setLoading(true);

        if (!codeSent)
            axiosInstance.post('users/sendcode', { email: formData.email, code: user?.vcode })
                .then(function (response: any) {
                    // handle success
                    toast.show(response.data, {
                        type: "success",
                        placement: "top",
                        duration: 2000,
                        animationType: "slide-in",
                    });
                    setLoading(false);
                    setCodeSent(true);
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
                    setLoading(false);
                })
        if (codeSent && !validated) {
            if (code == user?.vcode) {
                setValidated(true);
                toast.show("Email Verified Successfully!", {
                    type: "success",
                    placement: "top",
                    duration: 2000,
                    animationType: "slide-in",
                });
                setLoading(false);
                dispatch(logout(''));
            }
            else {
                toast.show("Wrong Code!", {
                    type: "danger",
                    placement: "top",
                    duration: 2000,
                    animationType: "slide-in",
                });
                setLoading(false);
            }
        }
        else if (pass.length >= 8) {
            axiosInstance.post('users/reset', { email: formData.email, password: pass })
                .then(function (response: any) {
                    // handle success
                    toast.show(response.data, {
                        type: "success",
                        placement: "top",
                        duration: 3000,
                        animationType: "slide-in",
                    });
                    setLoading(false);
                    props.navigation.navigate("Login");
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
                    setLoading(false);
                })
        }
        else if (codeSent && validated && pass.length < 8) {
            toast.show("Password must be at least 8 characters long!", {
                type: "danger",
                placement: "top",
                duration: 2000,
                animationType: "slide-in",
            });
            setLoading(false);
        }
        // props.navigation.navigate("Tab");
    };
    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: DarkPurple, justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ margin: 20 }}>
                <ArrowLeft color={LoginBtn} size={40} />
            </TouchableOpacity>
            <ScrollView>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={{ width: '90%', gap: 50 }}>
                            <View style={{ gap: 10, marginHorizontal: 10 }}>
                                <Text style={{ color: 'white', fontSize: 40, fontWeight: '600' }}>Forgot Password</Text>
                                <Text style={{ color: 'grey', fontSize: 18 }}>Please enter your email to reset your password.</Text>
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
                                                <TextInput editable={codeSent || validated ? false : true} value={value} onChangeText={onChange} spellCheck={false} autoComplete='email' placeholderTextColor={'grey'} style={{ width: '88%', fontSize: 17, fontWeight: '600', color: 'white', padding: 0 }} placeholder='name@mail.com' inputMode='email' />
                                            )}
                                            name="email"
                                        />
                                    </View>
                                </View>
                                {errors.email && <Text style={{ color: 'orange', marginLeft: 15 }}>{errors.email.message}</Text>}
                                {codeSent && !validated ?
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', borderWidth: 0.5, borderRadius: 20, gap: 10, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: LightPurple }}>
                                            <View>
                                                <Hash color='white' size={20} />
                                            </View>
                                            <View style={{ width: '100%', gap: 5, justifyContent: 'center' }}>
                                                <Text style={{ color: 'white' }}>VERIFICATION CODE</Text>
                                                <TextInput maxLength={6} value={code} onChangeText={setCode} autoComplete='one-time-code' placeholderTextColor={'grey'} style={{ width: '88%', fontSize: 17, color: 'white', padding: 0 }} placeholder='abcd12' />
                                            </View>
                                        </View>
                                        <Text style={{ color: 'orange', marginLeft: 15 }}>{ }</Text>
                                    </View>
                                    : null}
                                {validated ?
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', borderWidth: 0.5, borderRadius: 20, gap: 10, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: LightPurple }}>
                                            <View>
                                                <Lock color='white' size={20} />
                                            </View>
                                            <View style={{ width: '100%', gap: 5, justifyContent: 'center' }}>
                                                <Text style={{ color: 'white' }}>PASSWORD</Text>
                                                <TextInput value={pass} onChangeText={setPass} secureTextEntry={true} autoComplete='password' placeholderTextColor={'grey'} style={{ width: '88%', fontSize: 17, color: 'white', padding: 0 }} placeholder='* * * * * * * *' />
                                            </View>
                                        </View>
                                        <Text style={{ color: 'orange', marginLeft: 15 }}>{ }</Text>
                                    </View>
                                    : null}
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity onPress={handleSubmit(onPressSend)} style={{ paddingVertical: 20, paddingHorizontal: 80, backgroundColor: LoginBtn, borderRadius: 50 }}>
                                    <Text style={{ color: 'black', textAlign: 'center', fontSize: 18, fontWeight: '700' }}>{codeSent ? (validated ? 'Reset' : 'Verify') : 'Send Code'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </ScrollView>
            <View style={{ height: 100 }}></View>
            {loading ?
                <View style={{ padding: 30, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView style={{ width: 150, height: 150 }} source={require('../assets/animated/loading.json')} autoPlay loop />
                </View>
                : null}
        </SafeAreaView >

    )
}

export default ForgotPswrd