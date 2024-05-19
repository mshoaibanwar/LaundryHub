import React, { useState } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { DarkPurple, LightPurple, LoginBtn } from '../constants/Colors'
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Smartphone, User } from 'lucide-react-native'
import { useToast } from 'react-native-toast-notifications'
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { axiosInstance } from '../helpers/AxiosAPI'
import LottieView from 'lottie-react-native'
import { useTogglePasswordVisibility } from '../helpers/useTogglePasswordVisibility'

const Register = (props: any) => {
    const [loading, setLoading] = useState(false);
    const [isUser, setIsUser] = useState(true);
    const [isRider, setIsRider] = useState(false);
    const { passwordVisibility, rightIcon, handlePasswordVisibility } =
        useTogglePasswordVisibility();

    const schema = yup.object().shape({
        name: yup
            .string()
            .required('Full Name is required')
            .min(3, 'Name must be at least 3 characters'),
        email: yup
            .string()
            .required('Email is required')
            .email('Invalid email'),
        phone: yup
            .string()
            .required('Phone Number is required')
            .min(10, 'Phone number must be at least 10 Numbers'),
        password: yup
            .string()
            .required('Password is required')
            .min(8, 'Password must contain at least 8 characters')
            .matches(
                /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/,
                'Password must contain at least one uppercase letter, one digit, one special character, and be at least 8 characters long'
            ),
    });
    const {
        control,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
        },
    });

    const toast = useToast();

    const onPressSend = async (formData: any) => {
        formData.email = formData.email.toLowerCase();
        // Perform actions with the validated form data
        setLoading(true);

        axiosInstance.post('users/register', formData)
            .then(function (response: any) {
                // handle success
                toast.show(response.data, {
                    type: "success",
                    placement: "top",
                    duration: 3000,
                    animationType: "slide-in",
                });
                reset();
                setLoading(false);
                props.navigation.navigate("Login");
            })
            .catch(function (error) {
                // handle error
                setLoading(false);
                toast.show(error.response.data, {
                    type: "danger",
                    placement: "top",
                    duration: 8000,
                    animationType: "slide-in",
                });
            })
            .then(function () {
                // always executed
            });
    };


    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: DarkPurple, justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ margin: 20 }}>
                <ArrowLeft color={LoginBtn} size={40} />
            </TouchableOpacity>
            <ScrollView>
                <KeyboardAvoidingView keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : -150} behavior={Platform.OS === 'ios' ? 'position' : 'padding'} style={{ flex: 1 }}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={{ margin: 20, gap: 30 }}>
                            <View style={{ gap: 10, marginHorizontal: 10 }}>
                                <Text style={{ color: 'white', fontSize: 35, fontWeight: '600' }}>Create Account</Text>
                                <Text style={{ color: 'grey', fontSize: 18 }}>Please fill the input below here</Text>
                            </View>

                            <View style={{ gap: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end', borderWidth: 0.5, borderRadius: 20, gap: 10, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: LightPurple }}>
                                    <View>
                                        <User color='white' size={20} />
                                    </View>
                                    <View style={{ width: '100%', gap: 5, justifyContent: 'center' }}>
                                        <Text style={{ color: 'white' }}>FULL NAME</Text>
                                        <Controller
                                            control={control}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, value } }) => (
                                                <TextInput value={value} onChangeText={onChange} autoComplete='name' placeholderTextColor={'grey'} style={{ width: '88%', fontSize: 17, fontWeight: '600', color: 'white', padding: 0 }} placeholder='Your Name' />
                                            )}
                                            name="name"
                                        />
                                    </View>
                                </View>
                                {errors.name && <Text style={{ color: 'orange', marginLeft: 15 }}>{errors.name.message}</Text>}
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
                                        <Smartphone color='white' size={20} />
                                    </View>
                                    <View style={{ width: '100%', gap: 5, justifyContent: 'center' }}>
                                        <Text style={{ color: 'white' }}>PHONE</Text>
                                        <Controller
                                            control={control}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, value } }) => (
                                                <TextInput value={value} onChangeText={onChange} maxLength={11} autoComplete='tel' placeholderTextColor={'grey'} style={{ width: '88%', fontSize: 17, fontWeight: '600', color: 'white', padding: 0 }} placeholder='03123456789' inputMode='tel' />
                                            )}
                                            name="phone"
                                        />
                                    </View>
                                </View>
                                {errors.phone && <Text style={{ color: 'orange', marginLeft: 15 }}>{errors.phone.message}</Text>}
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end', borderWidth: 0.5, borderRadius: 20, gap: 10, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: LightPurple }}>
                                    <View>
                                        <Lock color='white' size={20} />
                                    </View>
                                    <View style={{ width: '100%', gap: 5, justifyContent: 'center' }}>
                                        <Text style={{ color: 'white' }}>PASSWORD</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 30 }}>
                                            <Controller
                                                control={control}
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field: { onChange, value } }) => (
                                                    <TextInput value={value} onChangeText={onChange} secureTextEntry={passwordVisibility} autoComplete='password' placeholderTextColor={'grey'} style={{ width: '88%', fontSize: 17, color: 'white', padding: 0 }} placeholder='* * * * * * * *' />
                                                )}
                                                name="password"
                                            />
                                            <TouchableOpacity onPress={handlePasswordVisibility}>
                                                {rightIcon == 'eye' ?
                                                    <Eye size={20} color="white" />
                                                    : <EyeOff size={20} color="white" />}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                {errors.password && <Text style={{ color: 'orange', marginLeft: 15 }}>{errors.password.message}</Text>}

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

                            <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity disabled={loading ? true : false} onPress={handleSubmit(onPressSend)} style={{ paddingVertical: 20, paddingHorizontal: 80, backgroundColor: LoginBtn, borderRadius: 50 }}>
                                    <Text style={{ color: 'black', textAlign: 'center', fontSize: 18, fontWeight: '700' }}>REGISTER</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </ScrollView>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                <Text style={{ color: 'grey', fontSize: 16 }}>Already have an account? </Text>
                <TouchableOpacity onPress={() => { props.navigation.navigate("Login") }}>
                    <Text style={{ color: LoginBtn, fontSize: 16 }}>Login</Text>
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

export default Register