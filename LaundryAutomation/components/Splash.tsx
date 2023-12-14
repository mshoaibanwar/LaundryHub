import React, { useEffect, useState } from 'react'
import { Platform, SafeAreaView, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { View } from 'react-native';
import { DarkPurple, LoginBtn, TabFocus } from '../constants/Colors';
import { useAppSelector } from '../hooks/Hooks';
import { axiosInstance } from '../helpers/AxiosAPI';
import { useToast } from 'react-native-toast-notifications'
import messaging from '@react-native-firebase/messaging';
import socket from '../helpers/Socket';

const Splash = (props: any) => {
    const user: any = useAppSelector((state) => state.user.value);
    const toast: any = useToast();
    const closeSplashScreen = async () => {
        if (user?.token != undefined) {
            axiosInstance.post('users/verifyToken', { token: user?.token })
                .then(async function (response: any) {
                    // toast.show(response?.data?.message, {
                    //     type: "success",
                    //     placement: "top",
                    //     duration: 3000,
                    //     animationType: "slide-in",
                    // });

                    socket.send(
                        JSON.stringify({
                            userId: user.user._id,
                        })
                    );
                    if (Platform.OS === 'android') {
                        await messaging().registerDeviceForRemoteMessages();
                        const token = await messaging().getToken();
                        await axiosInstance.post('users/updateToken', { email: user?.user?.email, token: token })
                            .then(function (response: any) {
                                if (user.userType == "user")
                                    props.navigation.navigate("Tab");
                                else if (user.userType == "seller") {
                                    axiosInstance.get(`shops/user/${user.user._id}`)
                                        .then(async function (sresponse: any) {
                                            if (sresponse.data.length == 0) {
                                                props.navigation.navigate("AddShopData");
                                            }
                                            else {
                                                props.navigation.navigate("SellerTab");
                                            }
                                        })
                                        .catch(function (error) {
                                            // handle error
                                            toast.show(error?.response?.data, {
                                                type: "danger",
                                                placement: "top",
                                                duration: 3000,
                                                animationType: "slide-in",
                                            });
                                        })
                                }
                                else if (user.userType == "rider") {
                                    axiosInstance.get(`riders/user/${user.user._id}`)
                                        .then(async function (sresponse: any) {
                                            if (sresponse.data.length == 0) {
                                                props.navigation.navigate("AddRiderData");
                                            }
                                            else {
                                                props.navigation.navigate("RiderTab");
                                            }
                                        })
                                        .catch(function (error) {
                                            // handle error
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
                                toast.show("Something Went Wrong, Check your internet Connection!", {
                                    type: "danger",
                                    placement: "top",
                                    duration: 3000,
                                    animationType: "slide-in",
                                });
                            });
                    }
                    else {
                        if (user.userType == "user")
                            props.navigation.navigate("Tab");
                        else if (user.userType == "seller") {
                            axiosInstance.get(`shops/user/${user.user._id}`)
                                .then(async function (sresponse: any) {
                                    if (sresponse.data.length == 0) {
                                        props.navigation.navigate("AddShopData");
                                    }
                                    else {
                                        props.navigation.navigate("SellerTab");
                                    }
                                })
                                .catch(function (error) {
                                    // handle error
                                    toast.show(error?.response?.data, {
                                        type: "danger",
                                        placement: "top",
                                        duration: 3000,
                                        animationType: "slide-in",
                                    });
                                })
                        }
                        else if (user.userType == "rider") {
                            axiosInstance.get(`riders/user/${user.user._id}`)
                                .then(async function (sresponse: any) {
                                    if (sresponse.data.length == 0) {
                                        props.navigation.navigate("AddRiderData");
                                    }
                                    else {
                                        props.navigation.navigate("RiderTab");
                                    }
                                })
                                .catch(function (error) {
                                    // handle error
                                    toast.show(error?.response?.data, {
                                        type: "danger",
                                        placement: "top",
                                        duration: 3000,
                                        animationType: "slide-in",
                                    });
                                })
                        }
                    }
                })
                .catch(function (error) {
                    // toast.show(error?.response?.data?.message, {
                    //     type: "danger",
                    //     placement: "top",
                    //     duration: 3000,
                    //     animationType: "slide-in",
                    // });
                    props.navigation.navigate("Login");
                });
        }
        else
            props.navigation.navigate("Login");
    }

    useEffect(() => {
        setTimeout(closeSplashScreen, 2500);
    }, []);

    return (
        <SafeAreaView style={{ backgroundColor: DarkPurple, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ bottom: 30 }}>
                <LottieView style={{ left: 5, width: 220, height: 220 }} source={require('../assets/animated/laundry.json')} loop={false} autoPlay />
                {/* onAnimationFinish={closeSplashScreen} */}
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: LoginBtn, fontSize: 40, fontWeight: '700' }}>Laundry</Text>
                    <Text style={{ color: TabFocus, fontSize: 40, fontWeight: '700' }}>HUB</Text>
                </View>
            </View>

        </SafeAreaView>
    )
}

export default Splash