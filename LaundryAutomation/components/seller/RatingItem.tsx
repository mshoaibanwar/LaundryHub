import { CornerLeftUp, Reply, SendHorizonal, Star } from 'lucide-react-native'
import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { DarkGrey } from '../../constants/Colors'
import { axiosInstance } from '../../helpers/AxiosAPI'

const RatingItem = (props: any) => {
    const [replying, setReplying] = React.useState(false);
    const [reply, setReply] = React.useState('');

    const onSendReply = () => {
        axiosInstance.post(`/ratings/feedback/${props.rating._id}`, { feedback: reply })
            .then((res) => {
                // setRatings(res.data);
                props.setRef(true);
                setReplying(false);
            })
            .catch((err) => {
                console.log(err);
            })
    }
    return (
        <View>
            <View style={{ marginVertical: 3, padding: 10, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', borderWidth: 0.5, backgroundColor: 'white' }}>
                <View style={{ width: '80%' }}>
                    <Text style={{ fontSize: 20, fontWeight: '600', color: 'black' }}>{props.rating.uname}</Text>
                    <Text style={{ fontSize: 13, fontWeight: '500', color: DarkGrey }}>{props.rating.createdAt.split('T')[0]} |  {props.rating.createdAt.split('T')[1].split('.')[0]}</Text>
                    <Text style={{ fontSize: 15, fontWeight: '500', color: 'black' }}>{props.rating.review}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        {
                            props.rating?.services?.map((service: any, index: any) => (
                                <View style={{ borderWidth: 0.5, borderRadius: 20, padding: 5, paddingHorizontal: 8 }} key={index}>
                                    <Text style={{ fontSize: 15, fontWeight: '500', color: 'black' }}>{service}</Text>
                                </View>
                            ))
                        }
                    </View>
                </View>
                <View style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                        <Star size={20} color='#FFD130' fill='#FFD130' />
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>{props.rating.rating}</Text>
                    </View>
                    {props.rating?.feedback ? null :
                        <TouchableOpacity onPress={() => setReplying(!replying)}>
                            <Reply size={30} color='black' />
                        </TouchableOpacity>
                    }
                </View>
            </View>
            {props.rating?.feedback ?
                <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginVertical: 3 }}>
                    <CornerLeftUp size={30} color='grey' />
                    <Text style={{ width: '70%', fontSize: 15, fontWeight: '500', color: 'black', padding: 10, borderWidth: 0.7, borderRadius: 10 }}>{props.rating?.feedback}</Text>
                </View> : null
            }
            {replying ?
                <View style={{ flexDirection: 'row', alignSelf: 'flex-end', gap: 8, marginVertical: 3 }}>
                    <TextInput multiline value={reply} onChangeText={setReply} placeholder='Add your Reply....' style={{ width: '70%', fontSize: 15, fontWeight: '500', color: 'black', padding: 10, borderWidth: 0.5, borderRadius: 5 }}></TextInput>
                    <TouchableOpacity onPress={onSendReply} style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <SendHorizonal size={30} color='black' />
                    </TouchableOpacity>
                </View>
                : null}
        </View >
    )
}

export default RatingItem