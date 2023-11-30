import React from 'react'
import {
    StyleSheet,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';
import { FrontColor } from '../constants/Colors';

type Props =
    {
        img: object,
        name: string,
        desc: string,
        navigation: any
    };

const ServiceCard: React.FC<Props> = ({ navigation, img, name, desc }) => {
    return (
        <TouchableOpacity onPress={() => navigation?.navigate('BasketStack', { screen: 'Basket' })} style={styles.view}>
            <Image
                style={styles.img}
                source={img}
            />
            <Text numberOfLines={1} style={styles.title}>{name}</Text>
            <Text numberOfLines={2} style={{ color: 'black' }}>{desc}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    view:
    {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        gap: 10,
        margin: 6,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    title:
    {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black'
    },
    img:
    {
        height: 50,
        width: 50,
        resizeMode: 'contain'
    }
});

export default ServiceCard