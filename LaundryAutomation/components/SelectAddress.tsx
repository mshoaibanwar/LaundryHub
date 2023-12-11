import { ArrowLeft, Bed, Building2, ChevronRight, Delete, DeleteIcon, FileEdit, Home, Trash, Trash2 } from 'lucide-react-native'
import React, { useEffect } from 'react'
import { RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { BlueColor } from '../constants/Colors'
import { useAppSelector } from '../hooks/Hooks'
import { ScrollView } from 'react-native-gesture-handler'
import { axiosInstance } from '../helpers/AxiosAPI'

const SelectAddress = (props: any) => {
    const [addresses, setAddresses] = React.useState([]);
    const selected = props?.route?.params?.id ? props?.route?.params?.id : -1;
    const [refreshing, setRefreshing] = React.useState(false);

    const user: any = useAppSelector((state) => state.user.value);

    useEffect(() => {
        axiosInstance.get(`addresses/user/${user.user._id}`)
            .then(function (response: any) {
                setAddresses(response.data);
            })
            .catch(function (error) {
                // handle error
            })
    }, [refreshing]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    return (
        <SafeAreaView>
            <View style={{ flexDirection: 'row', padding: 20, justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <ArrowLeft color='black' size={25} />
                </TouchableOpacity>
                <Text style={{ width: '80%', right: 35, textAlign: 'center', position: 'relative', color: 'black', fontSize: 20, fontWeight: '700' }}>Select Address</Text>
            </View>
            <TouchableOpacity onPress={() => props.navigation.navigate('HomeStack', { screen: 'Addresses' })} style={{ backgroundColor: BlueColor, marginHorizontal: 20, borderRadius: 10, padding: 10, marginBottom: 10 }}>
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: '500' }}>Add New / Edit Address</Text>
            </TouchableOpacity>
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                {addresses.length == 0 ?
                    <View style={{ alignItems: 'center', justifyContent: 'center', height: 520 }}>
                        <Text style={{ fontSize: 18, fontWeight: '400', color: 'black' }}>No Addresses Found!</Text>
                    </View>
                    : null}
                {addresses.map((item: any) => (
                    <TouchableOpacity key={item._id} onPress={() => props.navigation.navigate('ShopsStack', { screen: 'ColDel', params: { ...props?.route?.params, ...item } })}>
                        <View style={selected == item.id ? styles.selectedBtn : styles.btn}>
                            <View>
                                {item.type == 'Home' ?
                                    <Home color='black' />
                                    : item.type == 'Hotel' ?
                                        <Bed color='black' />
                                        : item.type == 'Work' ?
                                            <Building2 color='black' /> : null}
                            </View>
                            <View style={{ gap: 5, width: '78%' }}>
                                <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>{item.type}</Text>
                                <Text style={{ color: 'black' }}>{item.add}</Text>
                                <View style={{ gap: 2 }}>
                                    <Text style={{ color: BlueColor }}>{item.name}</Text>
                                    <Text style={{ color: BlueColor }}>{item.num}</Text>
                                </View>
                            </View>
                            <ChevronRight color='black' style={{ alignSelf: 'center', justifySelf: 'center' }} />
                        </View>
                    </TouchableOpacity>
                ))}
                <View style={{ height: 160 }}></View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    btn: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginVertical: 5,
        padding: 10,
        borderWidth: 0.5,
        borderRadius: 10,
        gap: 10,
        backgroundColor: 'white'
    },
    selectedBtn: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginVertical: 5,
        padding: 10,
        borderWidth: 1.5,
        borderColor: '#03a9f4',
        borderRadius: 10,
        gap: 10
    }
})

export default SelectAddress