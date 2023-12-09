import { createSlice } from '@reduxjs/toolkit'

export const msgSlice = createSlice({
    name: 'msg',
    initialState: {
        value: [],
    },
    reducers: {
        addMsg: (state: any, action: any) => {
            return {
                ...state,
                value: [...state.value, action.payload],
            };
        },
        emptyMsg: (state, action) => {
            state.value = []
        },
    },
})

// Action creators are generated for each case reducer function
export const { addMsg, emptyMsg } = msgSlice.actions

export default msgSlice.reducer