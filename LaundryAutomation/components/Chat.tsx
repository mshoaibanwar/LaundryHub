import React, { useEffect } from 'react'
import { Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import socket from '../helpers/Socket'
import { ArrowLeft, ChevronLeft } from 'lucide-react-native'
import { useAppDispatch, useAppSelector } from '../hooks/Hooks'
import { addMsg, selectUserChat } from '../reduxStore/reducers/MessagesReducer'
import { GreyColor } from '../constants/Colors'

const Chat = (props: any) => {
    const [message, setMessage] = React.useState<string>("")
    const [messages, setMessages] = React.useState<any>([])
    const dispatch = useAppDispatch();
    let userId: string = props?.route?.params.toString();
    const msgs = useAppSelector(selectUserChat(userId));
    const sendMessage = () => {
        if (message === "") return
        const updatedMessages = [...messages, { from: 'me', msg: message }];
        // Set the state with the new array
        setMessages(updatedMessages);
        const nMsg: any = { from: 'me', msg: message };
        dispatch(addMsg({ userId, message: nMsg }));
        socket.send(JSON.stringify({
            msg: message,
            to: props?.route?.params.toString(),
        }))
        setMessage("")
    }

    socket.onmessage = ((msg) => {
        const parsedMsg = JSON.parse(msg.data);
        if (parsedMsg.msg) {
            const nMsg: any = { from: 'other', msg: parsedMsg.msg };
            setMessages((prevMessages: any) => [...prevMessages, { from: 'other', msg: parsedMsg.msg }]);
            dispatch(addMsg({ userId, message: nMsg }));
        }
    })

    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: 'white' }}>
            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, paddingHorizontal: 20, borderBottomWidth: 0.5, borderColor: 'grey' }, Platform.OS == 'android' ? { paddingVertical: 15 } : null]}>
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <ArrowLeft size={25} color='black' />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '500', color: 'black' }}>Chat</Text>
                <View style={{ width: 30 }}></View>
            </View>
            <ScrollView style={{ padding: 20, backgroundColor: GreyColor }}>
                {msgs.length > 0 && msgs.map((item: any, index: number) => (
                    <View key={index} style={item.from == 'me' ? { padding: 5, paddingHorizontal: 10, borderRadius: 10, backgroundColor: 'pink', gap: 5, alignSelf: 'flex-end', marginVertical: 5 } : { marginVertical: 5, padding: 5, paddingHorizontal: 10, borderRadius: 10, backgroundColor: 'pink', gap: 5, alignSelf: 'flex-start' }}>
                        <Text style={{ fontSize: 16, color: 'black' }} key={index}>{item.msg}</Text>
                    </View>
                ))}
                <View style={{ height: 60 }}></View>
            </ScrollView>
            <View style={[{ position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', padding: 20 }, Platform.OS == 'ios' ? { bottom: 10 } : null]}>
                <TextInput value={message} onChangeText={setMessage} style={{ borderWidth: 0.5, padding: 5, paddingHorizontal: 10, width: '82%', borderRadius: 10 }} placeholder="Type your message here" />
                <TouchableOpacity style={{ backgroundColor: 'green', padding: 10, borderRadius: 10 }} onPress={sendMessage}>
                    <Text style={{ color: 'white' }}>Send</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Chat