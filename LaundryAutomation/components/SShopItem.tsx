import React from 'react'
import {
    Text,
    View,
    Image,
    ImageSourcePropType,
} from 'react-native';

interface BasketProps {
    name: string,
    type: string,
    id: number,
    img: ImageSourcePropType
    price: any
}

const SShopItem = (props: BasketProps) => {

    return (

        <View style={[{ marginHorizontal: 8, marginVertical: 4, paddingHorizontal: 6, paddingVertical: 4, borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, props?.price == undefined ? { backgroundColor: '#ffb3ad' } : {}]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                <Image source={props.img} style={{ width: 50, height: 50, borderRadius: 5 }} resizeMode='cover' />
                <View>
                    <Text style={{ fontSize: 20, color: 'black', fontWeight: '500' }}>{props.name}</Text>
                    <Text style={{ fontSize: 16, color: 'grey' }}>{props.type === 'WashIron' ? 'Wash & Iron' : props.type === 'DryClean' ? 'Dry Clean' : props.type}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 25 }}>
                <Text style={{ fontSize: 18, color: 'black' }}>{props?.price == undefined ? 'Nan' : `Rs. ${props.price}`}</Text>
            </View>
        </View>
    )
}

export default SShopItem