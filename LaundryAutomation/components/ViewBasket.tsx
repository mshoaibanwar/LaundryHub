import React from 'react'
import {
    Text,
    View,
    SafeAreaView,
    Pressable,
    FlatList,
    Alert,
    Platform
} from 'react-native';
import { X } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ViewBasketItem from './ViewBasketItem';
import { useAppDispatch, useAppSelector } from '../hooks/Hooks';
import { emptyBasket } from '../reduxStore/reducers/BasketReducer';
import { BlueColor } from '../constants/Colors';

const FlatListItemSeparator = () => {
    return (
        //Item Separator
        <View style={{ width: '100%', backgroundColor: 'black', borderTopWidth: 1, opacity: 0.25 }} />
    );
};

const ViewBasket = (props: any) => {
    const basketItems = useAppSelector((state) => state.basket.value);
    const dispatch = useAppDispatch();

    const deleteAll = () => {
        dispatch(emptyBasket([]) as any);
        Alert.alert('Basket Emptied!');
    }

    return (
        <SafeAreaView>
            <View style={{ height: Platform.OS == 'android' ? '95%' : '93.5%', padding: 20, justifyContent: 'space-between' }}>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                        <Pressable onPress={() => { props.navigation.goBack() }} style={{ width: '21%' }}>
                            <X style={{}} size={30} color='#0E1446' />
                        </Pressable>
                        <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'black' }}>Basket</Text>
                        <Pressable onPress={deleteAll} style={{}}>
                            <Text style={{ fontSize: 18, color: BlueColor }}>Delete All</Text>
                        </Pressable>
                    </View>

                    <FlatList
                        style={{ maxHeight: '93.5%', backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 10 }}
                        data={basketItems}
                        renderItem={({ item, index }: any) => (
                            <ViewBasketItem key={index} name={item.item} type={item.serType} img={item.images[0]} id={item.id} />
                        )}
                        //Setting the number of column
                        ItemSeparatorComponent={FlatListItemSeparator}
                    />

                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <TouchableOpacity onPress={() => { props.navigation.navigate("Basket") }} style={{ minWidth: '49%', padding: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 0.7, borderColor: 'black', borderRadius: 10, backgroundColor: 'white' }}>
                        <Text style={{ fontSize: 18, color: 'black' }}>Add more items</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { props.navigation.navigate("ShopsStack", { screen: 'Shops' }) }} style={{ minWidth: '49%', padding: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 0.7, borderColor: 'black', borderRadius: 10, backgroundColor: '#0E1446' }}>
                        <Text style={{ fontSize: 18, color: 'white' }}>Confirm Basket</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView >
    )
}

export default ViewBasket