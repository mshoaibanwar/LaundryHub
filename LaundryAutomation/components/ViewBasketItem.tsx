import React from 'react'
import {
    Text,
    View,
    Image,
    ImageSourcePropType,
    Pressable
} from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { useAppDispatch } from '../hooks/Hooks';
import { removeItem } from '../reduxStore/reducers/BasketReducer';

interface BasketProps {
    name: string,
    type: string,
    id: number,
    img: ImageSourcePropType
}

const ViewBasketItem = (props: BasketProps) => {
    const dispatch = useAppDispatch();
    const delItem = () => {
        dispatch(removeItem(props.id));
    }

    return (

        <View style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                <Image source={props.img} style={{ width: 50, height: 50, borderRadius: 10 }} resizeMode='cover' />
                <Text style={{ fontSize: 20, color: 'black', fontWeight: '500' }}>{props.name}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 25 }}>
                <Text style={{ fontSize: 18, color: 'grey' }}>{props.type === 'WashIron' ? 'Wash & Iron' : props.type === 'DryClean' ? 'Dry Clean' : props.type}</Text>
                <Pressable onPress={delItem}>
                    <Trash2 color='red' size={23} />
                </Pressable>
            </View>
        </View>
    )
}

export default ViewBasketItem