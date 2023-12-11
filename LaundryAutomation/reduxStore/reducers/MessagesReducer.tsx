import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';

interface Message {
    from: string;
    msg: string;
}

interface MessageState {
    [userId: string]: Message[]; // Each user's chat is stored as an array of Message objects
}

interface AddMsgPayload {
    userId: string;
    message: Message;
}

const initialState: MessageState = {
    // Store chats as properties of the object, where key is the user's unique ID
};

export const msgSlice = createSlice({
    name: 'msg',
    initialState,
    reducers: {
        addMsg: (state, action: PayloadAction<AddMsgPayload>) => {
            const { userId, message } = action.payload;

            // Check if the user's chat already exists, if not, create it
            if (!state[userId]) {
                state[userId] = [];
            }

            // Update the user's chat with the new message
            state[userId] = [...state[userId], message];
        },
        emptyMsg: (state) => {
            // Clear all chat records
            Object.keys(state).forEach((userId) => {
                state[userId] = [];
            });
        },
    },
});

export const { addMsg, emptyMsg } = msgSlice.actions;

// Selector to get the chat of a specific user
export const selectUserChat = (userId: string) =>
    createSelector(
        (state: any) => state.msg,
        (msgState) => msgState[userId] || []
    );


export default msgSlice.reducer;
