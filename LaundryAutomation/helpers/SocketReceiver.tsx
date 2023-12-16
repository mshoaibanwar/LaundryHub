import React, { ReactNode, useEffect } from 'react'
import socket from './Socket';
import { addMsg } from '../reduxStore/reducers/MessagesReducer';
import { useAppDispatch } from '../hooks/Hooks';

interface SocketReceiverProps {
    children: ReactNode; // Explicitly define children prop
}

const SocketReceiver: React.FC<SocketReceiverProps> = ({ children }) => {
    const dispatch = useAppDispatch();

    socket.onmessage = (e) => {
        const message = JSON.parse(e.data);
        if (message.msg) {
            const nMsg: any = { from: message.from, msg: message.msg };
            dispatch(addMsg({ userId: message.id, message: nMsg }))
        }
    }

    return (
        <>
            {children}
        </>
    )
}

export default SocketReceiver
