import { LocateFixed, Phone, RectangleHorizontal, Store } from 'lucide-react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, Image, Keyboard, PermissionsAndroid, Platform, Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';
import { useToast } from 'react-native-toast-notifications'
import { DarkPurple, LightPurple, LoginBtn } from '../../constants/Colors'
import * as ImagePicker from 'react-native-image-picker';
import GetLocation from 'react-native-get-location'

const includeExtra = true;

const AddShopData = (props: any) => {
    const [loading, setLoading] = useState(false);

    const [cnic1, setCnic1] = React.useState<any>(null);
    const [cnic2, setCnic2] = React.useState<any>(null);
    const [currentLocation, setCurrentLocation] = useState<any>(null);

    const schema = yup.object().shape({
        title: yup
            .string()
            .required('Shop Name is required')
            .min(3, 'Shop Name must be at least 3 characters'),
        address: yup
            .string()
            .required('Address is required')
            .min(8, 'Add Complete Address'),
        cnic: yup
            .string()
            .required('CNIC Number is required')
            .min(13, 'CNIC number must be 13 Digits Long'),
        contact: yup
            .string()
            .required('Contact Number is required')
            .min(5, 'Contact number must be at least 5 Digits Long'),
    });
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            title: '',
            address: '',
            cnic: '',
            contact: '',
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

    const onPressSend = async (formData: any) => {
        if (cnic1 == null || cnic2 == null) {
            toast.show('Please add CNIC photos', {
                type: "danger",
                placement: "top",
                duration: 5000,
                animationType: "slide-in",
            });
            return;
        }

        formData.cnicimgs = [cnic1, cnic2];
        // formData.timing = [startValue, endValue];
        formData.lati = currentLocation.latitude;
        formData.longi = currentLocation.longitude;

        props.navigation.navigate("ShopLocation", { data: formData });
    };

    const onButtonPress = React.useCallback((type: any, options: any, calling: Number) => {
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
                    else {
                        setCnic2(response.assets?.[0]);
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
                    else {
                        setCnic2(response.assets?.[0]);
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
                            <Text style={{ color: 'white', fontSize: 35, fontWeight: '600' }}>Add Shop Details</Text>
                            <Text style={{ color: 'grey', fontSize: 18 }}>Please fill the input below here</Text>
                        </View>

                        <View style={{ gap: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', borderWidth: 0.5, borderRadius: 20, gap: 10, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: LightPurple }}>
                                <View>
                                    <Store color='white' size={20} />
                                </View>
                                <View style={{ width: '100%', gap: 5, justifyContent: 'center' }}>
                                    <Text style={{ color: 'white' }}>SHOP NAME</Text>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <TextInput value={value} onChangeText={onChange} placeholderTextColor={'grey'} style={{ width: '88%', fontSize: 17, fontWeight: '600', color: 'white', padding: 0 }} placeholder='Shop Name' />
                                        )}
                                        name="title"
                                    />
                                </View>
                            </View>
                            {errors.title && <Text style={{ color: 'orange', marginLeft: 15 }}>{errors.title.message}</Text>}
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', borderWidth: 0.5, borderRadius: 20, gap: 10, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: LightPurple }}>
                                <View>
                                    <LocateFixed color='white' size={20} />
                                </View>
                                <View style={{ width: '100%', gap: 5, justifyContent: 'center' }}>
                                    <Text style={{ color: 'white' }}>SHOP ADDRESS</Text>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <TextInput value={value} onChangeText={onChange} spellCheck={false} autoComplete='address-line1' placeholderTextColor={'grey'} style={{ width: '88%', fontSize: 17, fontWeight: '600', color: 'white', padding: 0 }} placeholder='Shop Complete Address' inputMode='text' />
                                        )}
                                        name="address"
                                    />
                                </View>
                            </View>
                            {errors.address && <Text style={{ color: 'orange', marginLeft: 15 }}>{errors.address.message}</Text>}
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', borderWidth: 0.5, borderRadius: 20, gap: 10, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: LightPurple }}>
                                <View>
                                    <Phone color='white' size={20} />
                                </View>
                                <View style={{ width: '100%', gap: 5, justifyContent: 'center' }}>
                                    <Text style={{ color: 'white' }}>SHOP CONTACT</Text>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <TextInput value={value} onChangeText={onChange} maxLength={13} placeholderTextColor={'grey'} style={{ width: '88%', fontSize: 17, fontWeight: '600', color: 'white', padding: 0 }} placeholder='Shop Contact Number' inputMode='numeric' />
                                        )}
                                        name="contact"
                                    />
                                </View>
                            </View>
                            {errors.contact && <Text style={{ color: 'orange', marginLeft: 15 }}>{errors.contact.message}</Text>}
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

                    </View>
                </TouchableWithoutFeedback>
                <View style={{ alignItems: 'center', marginTop: 15 }}>
                    <TouchableOpacity disabled={loading ? true : false} onPress={handleSubmit(onPressSend)} style={{ paddingVertical: 20, paddingHorizontal: 80, backgroundColor: LoginBtn, borderRadius: 50 }}>
                        <Text style={{ color: 'black', textAlign: 'center', fontSize: 18, fontWeight: '700' }}>CONTINUE</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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

export default AddShopData