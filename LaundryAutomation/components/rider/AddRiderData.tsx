import { Bike, Hash, LocateFixed, Phone, RectangleHorizontal, Store } from 'lucide-react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, Image, Keyboard, PermissionsAndroid, Platform, Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';
import { useToast } from 'react-native-toast-notifications'
import { DarkPurple, LightPurple, LoginBtn } from '../../constants/Colors'
import * as ImagePicker from 'react-native-image-picker';
import GetLocation from 'react-native-get-location'
import { axiosInstance } from '../../helpers/AxiosAPI'
import { useAppSelector } from '../../hooks/Hooks'
import LottieView from 'lottie-react-native'

const includeExtra = true;

const AddRiderData = (props: any) => {
    const [loading, setLoading] = useState(false);

    const [cnic1, setCnic1] = React.useState<any>(null);
    const [cnic2, setCnic2] = React.useState<any>(null);
    const [lic, setLic] = React.useState<any>(null);
    const [profile, setProfile] = React.useState<any>(null);
    const [currentLocation, setCurrentLocation] = useState<any>(null);

    const [uploading, setUploading] = useState(false);
    const [uploadingCount, setUploadingCount] = useState(1);

    const user: any = useAppSelector((state) => state.user.value);

    const schema = yup.object().shape({
        address: yup
            .string()
            .required('Address is required')
            .min(8, 'Add Complete Address'),
        cnic: yup
            .string()
            .required('CNIC Number is required')
            .min(13, 'CNIC number must be 13 Digits Long'),
        bikenum: yup
            .string()
            .required('Bike Number is required')
            .min(4, 'Add complete bike number including letters'),
        bikename: yup
            .string()
            .required('Bike Name is required')
    });
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            address: '',
            cnic: '',
            bikenum: '',
            bikename: ''
        },
    });

    const toast = useToast();

    useEffect(() => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 1000,
        })
            .then(location => {
                setCurrentLocation(location);
            })
            .catch(error => {
                const { code, message } = error;
                console.warn(code, message);
            })
    }, []);

    const cloudinaryUpload = async (photo: any) => {
        const data = new FormData();
        data.append('file', photo);
        data.append('upload_preset', 'photoupload');
        data.append('cloud_name', 'dwsekopqu');

        try {
            const response: any = await fetch("https://api.cloudinary.com/v1_1/dwsekopqu/image/upload", {
                method: "post",
                body: data
            });
            const imgdata = await response.json();
            return imgdata.url;
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    const updateImage = async (item: any) => {
        setUploading(true);
        const uri = item.uri;
        const type = item.type;
        const name = item.fileName;
        const source = {
            uri,
            type,
            name,
        };
        const imageUrl = await cloudinaryUpload(source);
        setUploadingCount((prev) => prev + 1);
        return imageUrl;
    }

    const onPressSend = async (formData: any) => {
        if (profile == null) {
            toast.show('Please add your photo', {
                type: "danger",
                placement: "top",
                duration: 3000,
                animationType: "slide-in",
            });
            return;
        }
        if (cnic1 == null || cnic2 == null) {
            toast.show('Please add CNIC photos', {
                type: "danger",
                placement: "top",
                duration: 3000,
                animationType: "slide-in",
            });
            return;
        }
        if (lic == null) {
            toast.show('Please add License photo', {
                type: "danger",
                placement: "top",
                duration: 3000,
                animationType: "slide-in",
            });
            return;
        }

        setLoading(true);
        let cnicdata = [await updateImage(cnic1), await updateImage(cnic2)];
        let licdata = await updateImage(lic);
        let profiledata = await updateImage(profile);
        formData.cnicimgs = cnicdata;
        formData.licimg = licdata;
        formData.profileimg = profiledata;
        formData.uid = user?.user?._id;
        formData.lati = currentLocation?.latitude;
        formData.longi = currentLocation?.longitude;

        axiosInstance.post('riders/add', formData)
            .then(function (response: any) {
                // handle success
                toast.show(response.data, {
                    type: "success",
                    placement: "top",
                    duration: 3000,
                    animationType: "slide-in",
                });
                setLoading(false);
                props.navigation.navigate("RiderTab");
            })
            .catch(function (error) {
                // handle error
                setLoading(false);
                toast.show(error.response.data.message, {
                    type: "danger",
                    placement: "top",
                    duration: 8000,
                    animationType: "slide-in",
                });
            })
    };

    const onButtonPress = React.useCallback((type: any, options: any, calling: Number) => {
        if (loading) {
            return;
        }
        if (type === 'capture') {
            ImagePicker.launchCamera(options, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled Camera');
                } else if (response.errorMessage) {
                    console.log('Image Camera error Message: ', response.errorMessage);
                }
                else if (response.errorCode) {
                    console.log('Image Camera error Code: ', response.errorCode);
                } else {
                    if (calling == 0) {
                        setCnic1(response.assets?.[0]);
                    }
                    else if (calling == 1) {
                        setCnic2(response.assets?.[0]);
                    }
                    else if (calling == 2) {
                        setLic(response.assets?.[0]);
                    }
                    else {
                        setProfile(response.assets?.[0]);
                    }
                }
            });
        } else {
            ImagePicker.launchImageLibrary(options, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.errorMessage) {
                    console.log('Image picker error Message: ', response.errorMessage);
                }
                else if (response.errorCode) {
                    console.log('Image picker error Code: ', response.errorCode);
                } else {
                    if (calling == 0) {
                        setCnic1(response.assets?.[0]);
                    }
                    else if (calling == 1) {
                        setCnic2(response.assets?.[0]);
                    }
                    else if (calling == 2) {
                        setLic(response.assets?.[0]);
                    }
                    else {
                        setProfile(response.assets?.[0]);
                    }
                }
            });
        }
    }, []);

    const requestCameraPermission = async () => {
        if (Platform.OS == 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message:
                            'LaundryHub Business needs access to your camera ' +
                            'so you can take and add pictures to Form.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('You can use the camera');
                } else {
                    console.log('Camera permission denied');
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };

    const ImagePickerAlert = (calling: Number) => {
        requestCameraPermission
        Alert.alert('Choose From', '', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Camera',
                onPress: () => onButtonPress(actions[0].type, actions[0].options, calling),
            },
            { text: 'Gallery', onPress: () => onButtonPress(actions[1].type, actions[1].options, calling) },

        ]);
    }

    return (
        <SafeAreaView style={{ backgroundColor: DarkPurple, height: '100%' }}>
            <ScrollView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{ margin: 20, gap: 20 }}>
                        <View style={{ gap: 5, marginHorizontal: 10 }}>
                            <Text style={{ color: 'white', fontSize: 35, fontWeight: '600' }}>Add Rider Details</Text>
                            <Text style={{ color: 'grey', fontSize: 18 }}>Please fill the input below here</Text>
                        </View>

                        <View style={{ gap: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', borderWidth: 0.5, borderRadius: 20, gap: 10, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: LightPurple }}>
                                <View>
                                    <LocateFixed color='white' size={20} />
                                </View>
                                <View style={{ width: '100%', gap: 5, justifyContent: 'center' }}>
                                    <Text style={{ color: 'white' }}>YOUR ADDRESS</Text>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <TextInput value={value} onChangeText={onChange} spellCheck={false} autoComplete='address-line1' placeholderTextColor={'grey'} style={{ width: '88%', fontSize: 17, fontWeight: '600', color: 'white', padding: 0 }} placeholder='Complete Address' inputMode='text' />
                                        )}
                                        name="address"
                                    />
                                </View>
                            </View>
                            {errors.address && <Text style={{ color: 'orange', marginLeft: 15 }}>{errors.address.message}</Text>}
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', borderWidth: 0.5, borderRadius: 20, gap: 10, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: LightPurple }}>
                                <View>
                                    <RectangleHorizontal color='white' size={20} />
                                </View>
                                <View style={{ width: '100%', gap: 5, justifyContent: 'center' }}>
                                    <Text style={{ color: 'white' }}>YOUR CNIC</Text>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <TextInput value={value} onChangeText={onChange} maxLength={13} placeholderTextColor={'grey'} style={{ width: '88%', fontSize: 17, fontWeight: '600', color: 'white', padding: 0 }} placeholder='CNIC number without dashes' inputMode='numeric' />
                                        )}
                                        name="cnic"
                                    />
                                </View>
                            </View>
                            {errors.cnic && <Text style={{ color: 'orange', marginLeft: 15 }}>{errors.cnic.message}</Text>}
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', borderWidth: 0.5, borderRadius: 20, gap: 10, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: LightPurple }}>
                                <View>
                                    <Bike color='white' size={20} />
                                </View>
                                <View style={{ width: '100%', gap: 5, justifyContent: 'center' }}>
                                    <Text style={{ color: 'white' }}>BIKE NAME</Text>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <TextInput value={value} onChangeText={onChange} placeholderTextColor={'grey'} style={{ width: '88%', fontSize: 17, fontWeight: '600', color: 'white', padding: 0 }} placeholder='HONDA CD70' inputMode='text' />
                                        )}
                                        name="bikename"
                                    />
                                </View>
                            </View>
                            {errors.bikename && <Text style={{ color: 'orange', marginLeft: 15 }}>{errors.bikename.message}</Text>}
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', borderWidth: 0.5, borderRadius: 20, gap: 10, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: LightPurple }}>
                                <View>
                                    <Hash color='white' size={20} />
                                </View>
                                <View style={{ width: '100%', gap: 5, justifyContent: 'center' }}>
                                    <Text style={{ color: 'white' }}>BIKE NUMBER</Text>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <TextInput value={value} onChangeText={onChange} placeholderTextColor={'grey'} style={{ width: '88%', fontSize: 17, fontWeight: '600', color: 'white', padding: 0 }} placeholder='ABC 1234' inputMode='text' />
                                        )}
                                        name="bikenum"
                                    />
                                </View>
                            </View>
                            {errors.bikenum && <Text style={{ color: 'orange', marginLeft: 15 }}>{errors.bikenum.message}</Text>}
                        </View>

                        <View>
                            <Text style={{ color: 'white', fontSize: 20, marginBottom: 10 }}>YOUR PHOTO</Text>
                            <View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', maxHeight: 100 }}>
                                    <Pressable onPress={() => ImagePickerAlert(3)} style={{}}>
                                        <Image style={{ maxHeight: 100, maxWidth: 100, borderRadius: 50 }} source={profile ? profile : require('../../assets/images/profileph.png')} resizeMode='cover' />
                                    </Pressable>
                                </View>
                            </View>
                        </View>

                        <View>
                            <Text style={{ color: 'white', fontSize: 20, marginBottom: 10 }}>CNIC PHOTO</Text>
                            <View>
                                <View style={{ flexDirection: 'row', width: '100%', marginBottom: 5 }}>
                                    <Text style={{ color: 'grey', fontSize: 18, width: '52%' }}>Front Side</Text>
                                    <Text style={{ color: 'grey', fontSize: 18, width: '48%' }}>Back Side</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', maxHeight: 100 }}>
                                    <Pressable onPress={() => ImagePickerAlert(0)} style={{ width: '48%' }}>
                                        <Image style={{ width: '100%', maxHeight: 100 }} source={cnic1 ? cnic1 : require('../../assets/images/idback.png')} resizeMode='cover' />
                                    </Pressable>
                                    <Pressable onPress={() => ImagePickerAlert(1)} style={{ width: '48%' }}>
                                        <Image style={{ width: '100%', maxHeight: 100 }} source={cnic2 ? cnic2 : require('../../assets/images/idfront.png')} resizeMode='cover' />
                                    </Pressable>
                                </View>
                            </View>
                        </View>

                        <View>
                            <Text style={{ color: 'white', fontSize: 20, marginBottom: 10 }}>DRIVING LICENSE PHOTO</Text>
                            <View>
                                <View style={{ flexDirection: 'row', width: '100%', marginBottom: 5 }}>
                                    <Text style={{ color: 'grey', fontSize: 18, width: '52%' }}>Front Side</Text>
                                    {/* <Text style={{ color: 'grey', fontSize: 18, width: '48%' }}>Back Side</Text> */}
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', maxHeight: 190 }}>
                                    <Pressable onPress={() => ImagePickerAlert(2)} style={{ width: '98%' }}>
                                        <Image style={{ width: '100%', maxHeight: 190 }} source={lic ? lic : require('../../assets/images/license.png')} resizeMode='cover' />
                                    </Pressable>
                                </View>
                            </View>
                        </View>

                    </View>
                </TouchableWithoutFeedback>
                <View style={{ alignItems: 'center', marginVertical: 15 }}>
                    <TouchableOpacity disabled={loading ? true : false} onPress={handleSubmit(onPressSend)} style={{ paddingVertical: 20, paddingHorizontal: 80, backgroundColor: LoginBtn, borderRadius: 50 }}>
                        <Text style={{ color: 'black', textAlign: 'center', fontSize: 18, fontWeight: '700' }}>CONTINUE</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {loading ?
                <View style={{ padding: 30, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView style={{ width: 150, height: 150 }} source={require('../../assets/animated/loading.json')} autoPlay loop />
                    {uploading ?
                        <Text style={{ fontSize: 18, fontWeight: '600', color: 'orange', padding: 5, marginTop: -20 }}>Uploading Image {uploadingCount} ...</Text>
                        : null}
                </View>
                : null}
        </SafeAreaView>
    )
}

interface Action {
    title: string;
    type: 'capture' | 'library';
    options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
}

const actions: Action[] = [
    {
        title: 'Take Image',
        type: 'capture',
        options: {
            saveToPhotos: true,
            mediaType: 'photo',
            includeBase64: false,
            includeExtra,
        },
    },
    {
        title: 'Select Image',
        type: 'library',
        options: {
            selectionLimit: 1,
            mediaType: 'photo',
            includeBase64: false,
            includeExtra,
        },
    },

];

export default AddRiderData