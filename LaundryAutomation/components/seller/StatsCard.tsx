import React from 'react'
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { FrontColor } from '../../constants/Colors';

type Props =
    {
        img: any,
        name: string,
        count: number,
        navigation: any
    };

const StatsCard: React.FC<Props> = ({ navigation, img, name, count }) => {
    return (
        <TouchableOpacity style={styles.view}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>{img}</Text>
                <Text adjustsFontSizeToFit={true} numberOfLines={1} style={{ fontSize: 33, fontWeight: '700', maxWidth: 60, color: 'black' }}>{count}</Text>
            </View>
            <Text numberOfLines={1} style={styles.title}>{name}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    view:
    {
        flex: 1,
        backgroundColor: FrontColor,
        padding: 20,
        borderRadius: 10,
        borderWidth: 0.5,
        gap: 10,
        margin: 6,
        borderColor: 'grey',
        shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 3
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

export default StatsCard