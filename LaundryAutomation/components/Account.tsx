import { ArrowLeft } from 'lucide-react-native'
import React, { useState } from 'react'
import { Alert, Image, PermissionsAndroid, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BlueColor } from '../constants/Colors'
import { useAppDispatch, useAppSelector } from '../hooks/Hooks'
import { addUser } from '../reduxStore/reducers/UserReducer'
import { useToast } from 'react-native-toast-notifications'
import { axiosInstance } from '../helpers/AxiosAPI'
import LottieView from 'lottie-react-native'
import * as ImagePicker from 'react-native-image-picker';

const includeExtra = true;

const Account = (props: any) => {
    const user: any = useAppSelector((state) => state.user.value);
    const [loading, setLoading] = useState(false);
    const [fName, setFName] = useState(user?.user?.name.split(' ')[0]);
    const [lName, setLName] = useState(user?.user?.name.split(' ')[1]);
    const [num, setNum] = useState(user?.user?.phone.toString());
    const [email, setEmail] = useState(user?.user?.email);
    const [profile, setProfile] = React.useState<any>(null);
    const [onprofile, setOnProfile] = React.useState<any>(user?.user?.profile);

    const toast = useToast();

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
        setLoading(true);
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

    const dispatch = useAppDispatch();
    const UpdateAccount = async () => {

        setLoading(true);
        let profiledata = await updateImage(profile);
        setOnProfile(profiledata);
        const updata: any = { email: email, name: fName + ' ' + lName, phone: num, profile: profiledata }
        const newData: any = { token: user?.token, user: { ...user?.user, name: fName + ' ' + lName, phone: num, profile: profiledata } };
        axiosInstance.post('users/update', updata)
            .then(function (response: any) {
                // handle success
                dispatch(addUser(newData));
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
                    duration: 3000,
                    animationType: "slide-in",
                });
            })
    }

    const onButtonPress = React.useCallback((type: any, options: any) => {
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
                    setProfile(response.assets?.[0]);
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
                    setProfile(response.assets?.[0]);
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

    const ImagePickerAlert = () => {
        requestCameraPermission
        Alert.alert('Choose From', '', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Camera',
                onPress: () => onButtonPress(actions[0].type, actions[0].options),
            },
            { text: 'Gallery', onPress: () => onButtonPress(actions[1].type, actions[1].options) },

        ]);
    }

    return (
        <SafeAreaView style={{ height: '100%' }}>
            <View style={{ flexDirection: 'row', padding: 20 }}>
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <ArrowLeft color='black' size={25} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', color: 'black', width: '87%', fontSize: 20, fontWeight: '700' }}>Account</Text>
            </View>
            <ScrollView>
                <TouchableOpacity onPress={() => ImagePickerAlert()} style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: 90, height: 90, borderRadius: 50 }} source={profile ? profile : onprofile ? { uri: onprofile } : require('../assets/images/profileph.png')} resizeMode='cover' />
                </TouchableOpacity>
                <View style={{ padding: 20, gap: 10 }}>
                    <Text style={{ color: 'black' }}>First Name</Text>
                    <TextInput value={fName} onChangeText={setFName} placeholder='First Name' style={{ borderWidth: 0.5, padding: 13, borderRadius: 10, backgroundColor: 'white' }} />
                    <Text style={{ color: 'black' }}>Last Name</Text>
                    <TextInput value={lName} onChangeText={setLName} placeholder='Last Name' style={{ borderWidth: 0.5, padding: 13, borderRadius: 10, backgroundColor: 'white' }} />
                    <Text style={{ color: 'black' }}>Mobile Number</Text>
                    <TextInput value={num} onChangeText={setNum} placeholder='Phone No' inputMode='tel' maxLength={11} style={{ borderWidth: 0.5, padding: 13, borderRadius: 10, backgroundColor: 'white' }} />
                    <Text style={{ color: 'black' }}>Email</Text>
                    <TextInput value={email} placeholder='Email' editable={false} inputMode='email' style={{ borderWidth: 0.5, padding: 13, borderRadius: 10, backgroundColor: 'white' }} />
                    <TouchableOpacity onPress={UpdateAccount} style={{ backgroundColor: BlueColor, padding: 8, borderRadius: 10, marginTop: 20 }}>
                        <Text style={{ textAlign: 'center', color: 'white', fontSize: 20 }}>Update</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 100 }}></View>
            </ScrollView>
            {loading ?
                <View style={{ padding: 30, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView style={{ width: 150, height: 150 }} source={require('../assets/animated/loading.json')} autoPlay loop />
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

export default Account