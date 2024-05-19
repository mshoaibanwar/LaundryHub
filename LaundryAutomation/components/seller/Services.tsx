import { ArrowLeft, FileEdit, Plus, Trash2, X } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';
import { BlueColor, DarkGrey, GreyColor } from '../../constants/Colors';
import { axiosInstance } from '../../helpers/AxiosAPI';
import LottieView from 'lottie-react-native';
import { useToast } from 'react-native-toast-notifications';

const Services = (props: any) => {
    const [openitemSelc, setOpenItemSelc] = useState(false);
    const [itemsValue, setItemsValue] = useState('Kurta');

    const [openServSelc, setOpenServSelc] = useState(false);
    const [servicesValue, setServicesValue] = useState('Wash');
    const [price, setPrice] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [itemsList, setItemsList] = useState<any>([]);
    const [nItemsList, setNItemsList] = useState<any>([]);

    const [services, setServices] = useState([
        { label: 'Wash', value: 'Wash' },
        { label: 'Dry Clean', value: 'Dry Clean' },
        { label: 'Iron', value: 'Iron' },
    ]);
    const [items, setItems] = useState([
        { label: 'Kurta', value: 'Kurta' },
        { label: 'Shalwar', value: 'Shalwar' },
        { label: 'Shalwar Kameez', value: 'Shalwar Kameez' },
        { label: 'Shirt', value: 'Shirt' },
        { label: 'Pants', value: 'Pants' },
        { label: 'Jeans', value: 'Jeans' },
        { label: 'Trousers', value: 'Trousers' },
        { label: 'Shorts', value: 'Shorts' },
        { label: 'Track Suit', value: 'Track Suit' },
        { label: 'Tie', value: 'Tie' },
        { label: 'Coat', value: 'Coat' },
        { label: 'Sweater', value: 'Sweater' },
        { label: 'Hoodie', value: 'Hoodie' },
        { label: 'Jacket', value: 'Jacket' },
        { label: 'Shawl', value: 'Shawl' },
        { label: 'Single Blanket', value: 'Single Blanket' },
        { label: 'Double Blanket', value: 'Double Blanket' },
        { label: 'Bed Sheet', value: 'Bed Sheet' },
        { label: 'Pillow Cover', value: 'Pillow Cover' },
        { label: 'Curtains', value: 'Curtains' },
        { label: 'Towel', value: 'Towel' },
        { label: 'Socks', value: 'Socks' },
        { label: 'Gloves', value: 'Gloves' },
        { label: 'Scarf', value: 'Scarf' },
        { label: 'Cap', value: 'Cap' },
        { label: 'Under Garments', value: 'Under Garments' },
        { label: 'Metress Cover', value: 'Metress Cover' }
    ]);

    const toast = useToast();

    useEffect(() => {
        setRefreshing(true);
        axiosInstance.get(`/shops/getPrices/${props.route.params.uid}`)
            .then((res) => {
                if (res.data) {
                    let revItems = res.data.reverse();
                    setItemsList(revItems);
                    setNItemsList(revItems);
                }
                setRefreshing(false);
            })
            .catch((err) => {
                console.log(err);
                setRefreshing(false);
            })
    }, [])

    const updatePrices = (nitem: any = itemsList) => {
        setRefreshing(true);
        axiosInstance.post(`/shops/updatePrices/${props.route.params.uid}`, { prices: nitem })
            .then((res) => {
                setRefreshing(false);
                toast.show(res.data, {
                    type: "success",
                    placement: "top",
                    duration: 2000,
                });
            })
            .catch((err) => {
                setRefreshing(false);
                toast.show(err.data, {
                    type: "danger",
                    placement: "top",
                    duration: 2000,
                });
            })
    }

    const [servicesList, setServicesList] = useState<any>([]);

    const onServAdd = () => {
        if (servicesValue && Number(price) > 0) {
            // Check if the service already exists in the list
            const serviceExists = servicesList.some((service: any) => service.serv === servicesValue);

            if (!serviceExists) {
                const newService = { serv: servicesValue, pri: price };
                setServicesList([...servicesList, newService]);
                setServicesValue("Wash");
                setPrice("");
            } else {
                // Display a message or handle the case where the service already exists
                toast.show(`Service "${servicesValue}" already exists.`, {
                    type: "warning",
                    placement: "top",
                    duration: 2000,
                });
            }
        }
        else {
            toast.show(`Service price must be greater than Zero.`, {
                type: "warning",
                placement: "top",
                duration: 2000,
            });
        }
    }

    const onServRemove = (service: any) => {
        const updatedServicesList = servicesList.filter((item: any) => item !== service);
        setServicesList(updatedServicesList);
    }

    const onAddItem = () => {
        if (isUpdating) {
            onUpdateItemInfo(itemsValue, servicesList);
            setServicesList([]);
        }

        // Check if the service already exists in the list
        const itemExists = itemsList.some((item: any) => item.title === itemsValue);

        if (!itemExists) {
            if (itemsValue && servicesList.length > 0) {
                const newItem = { title: itemsValue, services: servicesList };
                updatePrices([newItem, ...itemsList]);
                setItemsList([newItem, ...itemsList]);
                setServicesList([]);
                setItems((prevItems) => prevItems.filter(item => item.value !== itemsValue));
            }
            else {
                toast.show(`Please add Services and their Prices too!`, {
                    type: "warning",
                    placement: "top",
                    duration: 2000,
                });
            }
        } else {
            // Display a message or handle the case where the service already exists
            toast.show(`Item "${itemsValue}" already exists.`, {
                type: "warning",
                placement: "top",
                duration: 1000,
            });
        }

    }
    useEffect(() => {
        const updatedItems = items.filter((item) =>
            !itemsList.some((listItem: any) => listItem.title === item.value)
        );
        setItems(updatedItems);
        setItemsValue(updatedItems[0].value)
    }, [itemsList])

    // console.log(itemsList)

    const onUpdateServiceInfo = (selectedService: any, newServiceInfo: any) => {
        const updatedServicesList = servicesList.map((service: any) => {
            if (service.serv === selectedService) {
                // If the service matches the selected service, update the service's information
                return { serv: service.serv, pri: newServiceInfo };
            }
            return service;
        });

        // Update the state with the modified services list
        setServicesList(updatedServicesList);
        return;
    }

    const onUpdateItemInfo = async (selectedItemTitle: any, newItemInfo: any) => {
        const updatedItemsList = itemsList.map((item: any) => {
            if (item.title === selectedItemTitle) {
                // If the title matches the selected item, update the item's information
                return { title: item.title, services: newItemInfo };
            }
            return item;
        });

        // Update the state with the modified items list
        setItemsList(await updatedItemsList);
        setIsUpdating(false); // Reset the update flag
        updatePrices(await updatedItemsList);
    };

    const onUpdateItem = (item: any) => {
        setItemsValue(item.title);
        setServicesList(item.services);
        setIsUpdating(true);
    }

    const onItemRemove = async (itemser: any) => {
        const updatedItemsList = itemsList.filter((item: any) => item !== itemser);
        setItemsList(await updatedItemsList);
        updatePrices(await updatedItemsList);
    }

    const onCancelUpdate = () => {
        setIsUpdating(false);
        setServicesList([]);
        setItemsValue(items[0].value);
    }

    const OnSearch = (text: any) => {
        if (text.length > 0) {
            const updatedItemsList = nItemsList.filter((item: any) => item.title.toLowerCase().includes(text.toLowerCase()));
            setItemsList(updatedItemsList);
        }
        else {
            setItemsList(nItemsList);
        }
    }

    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: 'white' }}>
            <View style={[{ flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 10, borderBottomWidth: 0.5, borderColor: 'grey' }, Platform.OS == 'android' ? { paddingVertical: 15 } : null]}>
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <ArrowLeft color='black' size={25} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', color: 'black', width: '85%', fontSize: 18, fontWeight: '600' }}>Services</Text>
            </View>
            <View style={{ backgroundColor: GreyColor, padding: 20, paddingTop: 10 }}>
                <View style={{ padding: 10, borderWidth: 0.5, borderRadius: 10, marginVertical: 10, position: 'relative', zIndex: 2, backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 3 }}>
                        <Text style={{ color: 'black', fontSize: 18, fontWeight: '500' }}>Select Item:</Text>
                        <DropDownPicker
                            containerStyle={{ width: '50%' }}
                            style={isUpdating ? { backgroundColor: DarkGrey, borderRadius: 10, paddingHorizontal: 10, minHeight: 40 } : { backgroundColor: BlueColor, borderRadius: 10, paddingHorizontal: 10, minHeight: 40 }}
                            textStyle={{ color: 'white', fontSize: 16, fontWeight: '500' }}
                            placeholder={itemsValue}
                            dropDownContainerStyle={{ backgroundColor: BlueColor, borderRadius: 10, borderTopColor: 'grey' }}
                            open={openitemSelc}
                            theme='DARK'
                            value={itemsValue}
                            items={items}
                            setOpen={setOpenItemSelc}
                            setValue={setItemsValue}
                            setItems={setItems}
                            autoScroll={true}
                            disabled={isUpdating}
                            searchable={true}
                        />
                    </View>

                    <View style={{ borderWidth: 0.5, gap: 5, borderRadius: 10, padding: 10, marginTop: 10, justifyContent: 'center' }}>
                        {servicesList?.map((item: any, index: any) => (
                            <View key={index}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ color: 'black', fontSize: 16, fontWeight: '500', width: '30%' }}>{item.serv}</Text>
                                    <View style={{ width: '40%', flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ color: 'black', fontSize: 16 }}>Rs. </Text>
                                        <TextInput editable={isUpdating} value={item.pri.toString()} onChangeText={(nv) => onUpdateServiceInfo(item.serv, nv)} style={[{ padding: 2, color: 'black', fontSize: 18, fontWeight: '500', borderWidth: 0.5, borderRadius: 5, textAlign: 'center', width: '80%' }, Platform.OS === 'android' ? { padding: 0 } : {}]} placeholderTextColor={'grey'}></TextInput>
                                    </View>
                                    <TouchableOpacity style={{}} onPress={() => onServRemove(item)}>
                                        <Trash2 color='red' size={20} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, position: 'relative', zIndex: 2 }}>
                        <DropDownPicker
                            containerStyle={{ width: '40%' }}
                            style={{ backgroundColor: BlueColor, borderRadius: 10, paddingHorizontal: 10, minHeight: 40 }}
                            textStyle={{ color: 'white', fontSize: 16, fontWeight: '500' }}
                            placeholder='Wash'
                            dropDownContainerStyle={{ backgroundColor: BlueColor, borderRadius: 10, borderTopColor: 'grey' }}
                            open={openServSelc}
                            theme='DARK'
                            value={servicesValue}
                            items={services}
                            setOpen={setOpenServSelc}
                            setValue={setServicesValue}
                            setItems={setServices}
                        />

                        <TextInput value={price} onChangeText={setPrice} style={[{ borderWidth: 1, borderColor: 'black', width: '30%', borderRadius: 10, textAlign: 'center', fontSize: 18, color: 'black' }, Platform.OS === 'android' ? { padding: 0 } : {}]} placeholder='Price' placeholderTextColor={'grey'} />

                        <TouchableOpacity onPress={onServAdd} style={{ backgroundColor: BlueColor, padding: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                            <Plus color='white' size={20} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={onAddItem} style={{ backgroundColor: BlueColor, padding: 8, borderRadius: 10, marginTop: 10 }}>
                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: '500' }}>{isUpdating ? 'Update Item' : 'Add Item'}</Text>
                    </TouchableOpacity>
                    {isUpdating ?
                        <TouchableOpacity onPress={onCancelUpdate} style={{ backgroundColor: 'red', padding: 8, borderRadius: 10, marginTop: 5 }}>
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: '500' }}>Cancel</Text>
                        </TouchableOpacity>
                        : null
                    }

                </View>

                <Text style={{ fontSize: 18, fontWeight: '500', color: 'black', marginBottom: 5 }}>Added Items</Text>
                <TextInput onChangeText={(t) => OnSearch(t)} style={{ borderWidth: 0.5, borderRadius: 10, padding: 10, paddingVertical: 5, backgroundColor: 'white', color: 'black', marginBottom: 5 }} placeholder='Search Items' placeholderTextColor={'grey'} />
                <ScrollView>
                    {itemsList?.map((item: any, index: any) => (
                        <View key={index} style={{ borderWidth: 0.5, padding: 5, marginVertical: 2, borderRadius: 5, backgroundColor: 'white' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: 'black', fontSize: 18, fontWeight: '500', width: '30%' }}>{item.title}</Text>
                                <View style={{ gap: 2, width: '50%' }}>
                                    {item?.services?.map((service: any, index: any) => (
                                        <View key={index}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={{ color: 'black', fontSize: 15, fontWeight: '500', width: '50%' }}>{service.serv}</Text>
                                                <Text style={{ color: 'black', fontSize: 15, fontWeight: '500', width: '40%' }}>Rs. {service.pri}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                                <View style={{ flexDirection: 'row', width: '18%', justifyContent: 'space-between', marginHorizontal: 4 }}>
                                    <TouchableOpacity style={{ alignItems: 'flex-end' }} onPress={() => onUpdateItem(item)}>
                                        <FileEdit color='green' size={20} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ alignItems: 'flex-end' }} onPress={() => onItemRemove(item)}>
                                        <Trash2 color='red' size={20} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                    <View style={{ height: 420 }}></View>
                </ScrollView>
            </View>

            {refreshing ?
                <View style={{ padding: 30, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView style={{ width: 150, height: 150 }} source={require('../../assets/animated/loading.json')} autoPlay loop />
                </View>
                : null}
        </SafeAreaView>
    )
}

export default Services