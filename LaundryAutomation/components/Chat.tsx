import React, { useEffect, useRef, useState } from 'react'
import { AppState, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import socket from '../helpers/Socket'
import { ArrowLeft } from 'lucide-react-native'
import { useAppDispatch, useAppSelector } from '../hooks/Hooks'
import { addMsg, selectUserChat } from '../reduxStore/reducers/MessagesReducer'
import { GreyColor } from '../constants/Colors'
import { axiosInstance } from '../helpers/AxiosAPI'

const Chat = (props: any) => {
    const [message, setMessage] = React.useState<string>("")
    const [messages, setMessages] = React.useState<any>([])
    const dispatch = useAppDispatch();
    let id: string = props?.route?.params?.id?.toString();
    const msgs = useAppSelector(selectUserChat(id));
    const user: any = useAppSelector((state) => state.user.value);
    const sendMessage = () => {
        if (message === "") return
        const updatedMessages = [...messages, { from: user?.user?._id, msg: message }];
        // Set the state with the new array
        setMessages(updatedMessages);
        const nMsg: any = { from: user?.user?._id, msg: message };
        dispatch(addMsg({ userId: id, message: nMsg }));
        socket.send(JSON.stringify({
            msg: message,
            to: props?.route?.params?.uid.toString(),
            from: user?.user?._id,
            id: props?.route?.params?.id.toString()
        }))
        setMessage("")
    }

    useEffect(() => {
        setMessages(msgs);
        axiosInstance.get(`chats/get/${id}`)
            .then(res => {
                if (res.data) {
                    setMessages(res.data.chat);
                }
            }).catch(err => {
                console.log(err.response.data)
            })
        return () => {
        }
    }, []);

    socket.onmessage = ((msg) => {
        const parsedMsg = JSON.parse(msg.data);
        if (parsedMsg.msg) {
            const nMsg: any = { from: parsedMsg.from, msg: parsedMsg.msg };
            setMessages((prevMessages: any) => [...prevMessages, { from: parsedMsg.from, msg: parsedMsg.msg }]);
            dispatch(addMsg({ userId: id, message: nMsg }));
        }
    })

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
            }
            else {
                axiosInstance.post('chats/add', { id: id, chat: msgs })
                    .then(res => {
                        //console.log(res.data)
                    }).catch(err => {
                        console.log(err)
                    })
            }
            appState.current = nextAppState;
            setAppStateVisible(appState.current);
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const onBack = () => {
        axiosInstance.post('chats/add', { id: id, chat: msgs })
            .then(res => {
                // console.log(res.data)
            }).catch(err => {
                console.log(err)
            })
        props.navigation.goBack()
    }

    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: 'white' }}>
            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, paddingHorizontal: 20, borderBottomWidth: 0.5, borderColor: 'grey' }, Platform.OS == 'android' ? { paddingVertical: 15 } : null]}>
                <TouchableOpacity onPress={onBack}>
                    <ArrowLeft size={25} color='black' />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '500', color: 'black' }}>Chat</Text>
                <View style={{ width: 30 }}></View>
            </View>
            <ScrollView style={{ padding: 20, backgroundColor: GreyColor }}>
                {msgs.length > 0 && msgs.length > messages.length ? msgs.map((item: any, index: number) => (
                    <View key={index} style={item.from == user?.user?._id ? { padding: 5, paddingHorizontal: 10, borderRadius: 10, backgroundColor: 'green', gap: 5, alignSelf: 'flex-end', marginVertical: 5 } : { marginVertical: 5, padding: 5, paddingHorizontal: 10, borderRadius: 10, backgroundColor: 'grey', gap: 5, alignSelf: 'flex-start' }}>
                        <Text style={{ fontSize: 16, color: 'white' }} key={index}>{item.msg}</Text>
                    </View>
                ))
                    : messages.map((item: any, index: number) => (
                        <View key={index} style={item.from == user?.user?._id ? { padding: 5, paddingHorizontal: 10, borderRadius: 10, backgroundColor: 'green', gap: 5, alignSelf: 'flex-end', marginVertical: 5 } : { marginVertical: 5, padding: 5, paddingHorizontal: 10, borderRadius: 10, backgroundColor: 'grey', gap: 5, alignSelf: 'flex-start' }}>
                            <Text style={{ fontSize: 16, color: 'white' }} key={index}>{item.msg}</Text>
                        </View>
                    ))}
                <View style={{ height: 60 }}></View>
            </ScrollView>
            <View style={[{ position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', padding: 20 }, Platform.OS == 'ios' ? { bottom: 10 } : null]}>
                <TextInput value={message} onChangeText={setMessage} style={{ borderWidth: 0.5, padding: 5, paddingHorizontal: 10, width: '82%', borderRadius: 10, color: 'black' }} placeholder="Type your message here" placeholderTextColor={'grey'} />
                <TouchableOpacity style={{ backgroundColor: 'green', padding: 10, borderRadius: 10 }} onPress={sendMessage}>
                    <Text style={{ color: 'white' }}>Send</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Chat