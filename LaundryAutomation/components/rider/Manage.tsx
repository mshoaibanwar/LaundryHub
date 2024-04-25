import React, { useEffect } from 'react'
import { Alert, Image, PermissionsAndroid, Platform, Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import * as ImagePicker from 'react-native-image-picker';
import { axiosInstance } from '../../helpers/AxiosAPI';
import { useAppSelector } from '../../hooks/Hooks';
import LottieView from 'lottie-react-native';
import { GreyColor } from '../../constants/Colors';

const includeExtra = true;

const Manage = (props: any) => {
    const [bikeName, setBikeName] = React.useState('')
    const [bikeNumber, setBikeNumber] = React.useState('')
    const [address, setAddress] = React.useState('')
    const [cnic, setCnic] = React.useState('')
    const [cnic1, setCnic1] = React.useState<any>(null);
    const [cnic2, setCnic2] = React.useState<any>(null);
    const [lic, setLic] = React.useState<any>(null);
    const [cnic1On, setCnic1On] = React.useState<any>(null);
    const [cnic2On, setCnic2On] = React.useState<any>(null);
    const [licOn, setLicOn] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(false);

    const user: any = useAppSelector((state) => state.user.value);

    useEffect(() => {
        setLoading(true);
        axiosInstance.get(`/riders/user/${user.user._id}`)
            .then((res) => {
                setLoading(false);
                setBikeName(res.data[0].bikename);
                setBikeNumber(res.data[0].bikenum);
                setAddress(res.data[0].address);
                setCnic(res.data[0].cnic);
                setCnic1On(res.data[0].cnicimgs[0]);
                setCnic2On(res.data[0].cnicimgs[1]);
                setLicOn(res.data[0].licenseimg);
            }).catch((err) => {
                setLoading(false);
                console.log(err);
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
        const uri = item.uri;
        const type = item.type;
        const name = item.fileName;
        const source = {
            uri,
            type,
            name,
        };
        const imageUrl = await cloudinaryUpload(source);
        return imageUrl;
    }

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
                    else if (calling == 1) {
                        setCnic2(response.assets?.[0]);
                    }
                    else if (calling == 2) {
                        setLic(response.assets?.[0]);
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

    const updateImages = async () => {
        if (cnic1On == null) {
            setCnic1On(await updateImage(cnic1));
            setLoading(true);
        }
        if (cnic2On == null) {
            setCnic2On(await updateImage(cnic2));
            setLoading(true);
        }
        if (licOn == null) {
            setLicOn(await updateImage(lic));
            setLoading(true);
        }

        if (cnic1On != null && cnic2On != null && licOn != null) {
            setLoading(true);
            axiosInstance.post(`/riders/update/images/${user.user._id}`, {
                cnicimgs: [cnic1On, cnic2On],
                licimg: licOn
            }).then((res) => {
                setLoading(false);
                console.log(res.data);
            }).catch((err) => {
                setLoading(false);
                console.log(err);
            })
        }
        else {
            Alert.alert('Please Select All Images')
        }
    }

    const updateBikeDeatils = () => {
        if (bikeName != '' && bikeNumber != '') {
            setLoading(true);
            axiosInstance.post(`/riders/update/bike/${user.user._id}`, {
                bikeName: bikeName,
                bikeNumber: bikeNumber
            }).then((res) => {
                setLoading(false);
                console.log(res.data);
            }).catch((err) => {
                setLoading(false);
                console.log(err);
            })
        }
        else {
            Alert.alert('Please Fill All Fields')
        }
    }

    const updatePersonalDetails = () => {
        if (address != '' && cnic != '') {
            setLoading(true);
            axiosInstance.post(`/riders/update/personal/${user.user._id}`, {
                address: address,
                cnic: cnic
            }).then((res) => {
                setLoading(false);
                console.log(res.data);
            }).catch((err) => {
                setLoading(false);
                console.log(err);
            })
        }
        else {
            Alert.alert('Please Fill All Fields')
        }
    }

    return (
        <SafeAreaView style={{ backgroundColor: 'white' }}>
            <View style={[{ flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 10, borderBottomWidth: 0.5, borderColor: 'grey' }, Platform.OS == 'android' ? { paddingVertical: 15 } : null]}>
                <Text style={{ textAlign: 'center', color: 'black', width: '100%', fontSize: 18, fontWeight: '600' }}>Manage</Text>
            </View>
            <View style={{ backgroundColor: GreyColor }}>
                <ScrollView style={{ padding: 20 }}>
                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Bike Details</Text>
                        <View style={{ gap: 5, marginVertical: 10 }}>
                            <TextInput value={bikeName} onChangeText={setBikeName} placeholder='Bike Name' style={{ borderWidth: 1, borderColor: 'black', padding: 10, borderRadius: 5, backgroundColor: 'white', color: 'black' }} />
                            <TextInput value={bikeNumber} onChangeText={setBikeNumber} placeholder='Bike Number' style={{ borderWidth: 1, borderColor: 'black', padding: 10, borderRadius: 5, backgroundColor: 'white', color: 'black' }} />
                        </View>
                        <TouchableOpacity onPress={updateBikeDeatils} style={{ backgroundColor: 'black', padding: 10, borderRadius: 5 }}>
                            <Text style={{ textAlign: 'center', color: 'white', fontSize: 16, fontWeight: '500' }}>Update</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Personal Details</Text>
                        <View style={{ gap: 5, marginVertical: 10 }}>
                            <TextInput value={address} onChangeText={setAddress} placeholder='Your Address' style={{ borderWidth: 1, borderColor: 'black', padding: 10, borderRadius: 5, backgroundColor: 'white', color: 'black' }} />
                            <TextInput maxLength={13} value={cnic} onChangeText={setCnic} placeholder='CNIC Number' style={{ borderWidth: 1, borderColor: 'black', padding: 10, borderRadius: 5, backgroundColor: 'white', color: 'black' }} />
                        </View>
                        <TouchableOpacity onPress={updatePersonalDetails} style={{ backgroundColor: 'black', padding: 10, borderRadius: 5 }}>
                            <Text style={{ textAlign: 'center', color: 'white', fontSize: 16, fontWeight: '500' }}>Update</Text>
                        </TouchableOpacity>
                        <View style={{ marginVertical: 10 }}>
                            <Text style={{ color: 'black', fontSize: 16, marginBottom: 10, fontWeight: '500' }}>CNIC Photos</Text>
                            <View>
                                <View style={{ flexDirection: 'row', width: '100%', marginBottom: 5 }}>
                                    <Text style={{ color: 'grey', fontSize: 16, width: '52%' }}>Front Side</Text>
                                    <Text style={{ color: 'grey', fontSize: 16, width: '48%' }}>Back Side</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', maxHeight: 100 }}>
                                    <Pressable onPress={() => cnic1On == null ? ImagePickerAlert(0) : null} style={{ width: '48%' }}>
                                        <Image style={cnic1On == null ? { width: '100%', height: 100, borderWidth: 1, borderColor: 'red' } : { width: '100%', height: 100 }} source={cnic1 ? cnic1 : cnic1On ? { uri: cnic1On } : require('../../assets/images/idback.png')} resizeMode='cover' />
                                    </Pressable>
                                    <Pressable onPress={() => cnic2On == null ? ImagePickerAlert(1) : null} style={{ width: '48%' }}>
                                        <Image style={cnic2On == null ? { width: '100%', height: 100, borderWidth: 1, borderColor: 'red' } : { width: '100%', height: 100 }} source={cnic2 ? cnic2 : cnic2On ? { uri: cnic2On } : require('../../assets/images/idfront.png')} resizeMode='cover' />
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                        <View>
                            <Text style={{ color: 'black', fontSize: 16, marginBottom: 10, fontWeight: '500' }}>Driving License Photo</Text>
                            <View>
                                <View style={{ flexDirection: 'row', width: '100%', marginBottom: 5 }}>
                                    <Text style={{ color: 'grey', fontSize: 16, width: '52%' }}>Front Side</Text>
                                </View>
                                <View style={{}}>
                                    <Pressable onPress={() => licOn == null ? ImagePickerAlert(2) : null} style={{}}>
                                        <Image style={licOn === null ? { width: '100%', height: 205, borderColor: 'red', borderWidth: 1 } : { width: '100%', height: 205 }} source={lic ? lic : licOn ? { uri: licOn } : require('../../assets/images/license.png')} resizeMode='cover' />
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                        {cnic1On === null || cnic2On === null || licOn === null ?
                            <TouchableOpacity onPress={updateImages} style={{ backgroundColor: 'black', padding: 10, borderRadius: 5, marginTop: 10 }}>
                                <Text style={{ textAlign: 'center', color: 'white', fontSize: 16, fontWeight: '500' }}>Update</Text>
                            </TouchableOpacity>
                            : null}
                    </View>
                    <View style={{ height: 220 }}></View>
                </ScrollView>
            </View>
            {loading ?
                <View style={{ padding: 30, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView style={{ width: 150, height: 150 }} source={require('../../assets/animated/loading.json')} autoPlay loop />
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

export default Manage