import React, { ReactNode, useEffect } from 'react'
import socket from './Socket';
import { addMsg } from '../reduxStore/reducers/MessagesReducer';
import { useAppDispatch } from '../hooks/Hooks';

interface SocketReceiverProps {
    children: ReactNode; // Explicitly define children prop
}

const SocketReceiver: React.FC<SocketReceiverProps> = ({ children }) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        socket.onmessage = (e) => {
            const message = JSON.parse(e.data);
            if (message.msg) {
                const nMsg: any = { from: 'other', msg: message.msg };
                dispatch(addMsg(nMsg))
            }
        }
    }, []);

    return (
        <>
            {children}
        </>
    )
}

export default SocketReceiver
