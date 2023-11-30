import React, { useRef, useState } from 'react'
import {
    Text,
    View,
    Image,
    SafeAreaView,
    SectionList,
    ScrollView,
    Modal,
    Pressable,
    Alert,
    Platform,
    PermissionsAndroid
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PlusCircle, X, Camera, Trash2 } from 'lucide-react-native';
import ServiceTypeCard from './ServiceTypeCard';

import * as ImagePicker from 'react-native-image-picker';
import { addItem } from '../reduxStore/reducers/BasketReducer';
import { useAppSelector, useAppDispatch } from '../hooks/Hooks'
import { useToast } from "react-native-toast-notifications";
import Toast from "react-native-toast-notifications";
import { BackgroundColor, BlueColor, FrontColor } from '../constants/Colors';


const includeExtra = true;

const Basket = (props: any) => {
    const DATA = [
        {
            title: 'Traditional',
            data: [{ id: 1, value: 'Kurta' }, { id: 2, value: 'Abaya' }, { id: 3, value: 'Hijab' }, { id: 4, value: 'Punjabi' }],
        },
        {
            title: 'Tops',
            data: [{ id: 5, value: 'Shirt' }, { id: 6, value: 'Vest' }, { id: 7, value: 'T-Shirt' }],
        },
        {
            title: 'Bottoms',
            data: [{ id: 8, value: 'Pants' }, { id: 9, value: 'Jeans' }, { id: 10, value: 'Shorts' }],
        },
        {
            title: 'Outdoors',
            data: [{ id: 11, value: 'Track Suit' }, { id: 12, value: 'Jacket' }],
        },
    ];

    const toast = useToast();
    const toastRef = useRef<any>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [selcName, setSelcName] = useState("Shirt");

    const [response, setResponse] = React.useState<any>(null);

    const [ImagesArray, setImagesArray] = useState<any>([]);
    const [imgCount, setImgCount] = useState(0);

    const [serType, setSerType] = useState("");
    const [currentItem, setCurrentItem] = useState<any>(null);

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
                    setImagesArray((prev: any) => ([...prev, response.assets?.[0]]));
                    setResponse(response);
                    setImgCount(imgCount + 1)
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
                    console.log(response.assets?.[0]);
                    setImagesArray((prev: any) => ([...prev, response.assets?.[0]]));
                    setResponse(response);
                    setImgCount(imgCount + 1)
                }
            });
        }
    }, []);

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
    const FlatListItemSeparator = () => {
        return (
            //Item Separator
            <View style={{ width: '100%', backgroundColor: 'black', borderTopWidth: 1, opacity: 0.25 }} />
        );
    };

    //ReduxStore Basket
    const basketItems = useAppSelector((state) => state.basket.value);
    let basket_id = basketItems.length + 1;
    const dispatch = useAppDispatch();

    const addToBasket = () => {
        if (response != null && ImagesArray != null) {
            dispatch(addItem({ id: basket_id, item: currentItem.value, images: ImagesArray, serType: serType } as any));
            setModalVisible(!modalVisible);
            setResponse(null);
            setImagesArray([]);
            toast.show("Added to Basket!", {
                type: "success",
                placement: "top",
                duration: 3000,
                animationType: "slide-in",
            });
        }
        else {
            toastRef.current?.show("Please Select Image first!", {
                type: "danger",
                placement: "top",
                duration: 3000,
                animationType: "slide-in",
            });
        }
    }

    const removeImg = (pitem: any) => {
        setImagesArray(ImagesArray.filter((item: any) => item !== pitem));
        if (response?.assets[0] == pitem) {
            setResponse(null);
        }
    }

    const requestCameraPermission = async () => {
        if (Platform.OS == 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message:
                            'Laundry Hub needs access to your camera ' +
                            'so you can take and add pictures to order.',
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

    return (
        <SafeAreaView>
            <View style={{ padding: 20, height: Platform.OS == 'android' ? '90%' : '88%' }}>
                <Text style={{ fontSize: 35, fontWeight: 'bold', marginVertical: 10, color: 'black' }}>
                    Create Laundry Basket
                </Text>
                <SectionList
                    sections={DATA}
                    keyExtractor={(item, index) => item.value + index}
                    ItemSeparatorComponent={FlatListItemSeparator}
                    renderItem={({ item, index }) => (
                        <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                                <Image source={require('../assets/icons/washin.png')} />
                                <Text style={{ fontSize: 20, color: 'black', fontWeight: "500" }}>{item.value}</Text>
                            </View>
                            <TouchableOpacity onPress={() => { setModalVisible(true); setCurrentItem(item); setSelcName(item.value) }} style={{ padding: 10, backgroundColor: "white", borderRadius: 15, borderWidth: 0.3 }}>
                                <PlusCircle color='black' />
                            </TouchableOpacity>
                        </View>
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={{ fontWeight: 'bold', fontSize: 20, paddingVertical: 10, color: 'black', backgroundColor: BackgroundColor }}>{title}</Text>
                    )}
                    stickySectionHeadersEnabled={true}
                />
            </View>

            <View style={{ paddingHorizontal: 20, paddingVertical: Platform.OS == 'android' ? 17 : 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', bottom: 0, width: '100%', borderTopWidth: 0.4, borderColor: 'black', backgroundColor: BackgroundColor }}>
                <View>
                    <Text style={{ fontSize: 25, color: 'black' }}>x{basketItems.length} Items</Text>
                    <TouchableOpacity onPress={() => { props.navigation.navigate("ViewBasket") }}>
                        <Text style={{ textDecorationLine: 'underline', color: 'black' }}>View Basket</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => { props.navigation.navigate("ShopsStack") }} style={{ backgroundColor: '#0E1446', borderRadius: 10 }}>
                    <Text style={{ color: 'white', padding: 20, fontSize: 16, fontWeight: 'bold' }}>Confirm Basket</Text>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                presentationStyle={'pageSheet'}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>

                <ScrollView style={{ backgroundColor: 'white', padding: 30, borderTopLeftRadius: 20, borderTopRightRadius: 20, height: '100%' }}>
                    <Toast ref={toastRef} />
                    <View style={{ marginBottom: 20 }}>
                        <Pressable onPress={() => setModalVisible(!modalVisible)} style={{ backgroundColor: '#F1F1F0', padding: 10, borderRadius: 20, width: 50, height: 50, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.5, shadowRadius: 5 }}>
                            <X color='black' />
                        </Pressable>
                        <Pressable onPress={ImagePickerAlert} style={{ alignItems: 'center' }}>
                            <Image style={{ width: 190, height: 190, borderRadius: 100 }} source={response?.assets ? response?.assets[0] : require('../assets/images/Logo.png')} resizeMode={response?.assets ? 'cover' : 'contain'} />
                            <Camera size={45} style={{ position: 'absolute', right: 65, bottom: -15 }} color={BlueColor} />
                        </Pressable>
                        <ScrollView style={ImagesArray.length != 0 ? { height: 130 } : { height: 30 }} horizontal={true}>
                            <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', justifyContent: 'center', marginVertical: 10, top: 15 }}>
                                {ImagesArray.map((item: any, index: number) => (
                                    <View key={index}>
                                        <Image style={{ width: 100, height: 100, borderRadius: 10 }} source={item} resizeMode='cover' />
                                        <Pressable onPress={() => removeImg(item)}>
                                            <View style={{ backgroundColor: 'white', bottom: 5, right: 5, position: 'absolute', borderRadius: 10, padding: 5 }}>
                                                <Trash2 color='red' size={22} style={{}} />
                                            </View>
                                        </Pressable>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>

                        <Text style={{ marginTop: 20, fontSize: 25, fontWeight: 'bold', color: 'black' }}>{selcName}</Text>
                        <ServiceTypeCard type={serType} setType={setSerType} />
                    </View>
                </ScrollView>
                <View>
                    <Pressable onPress={addToBasket} style={{ alignItems: 'center', justifyContent: 'center', padding: 15, backgroundColor: '#0E1446', borderRadius: 10, margin: 30 }}>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Add to basket</Text>
                    </Pressable>
                </View>
            </Modal>
        </SafeAreaView >
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


export default Basket