import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: null,
    },
    reducers: {
        addUser: (state: any, action: any) => {
            state.value = action.payload
        },
        logout: (state, action) => {
            state.value = null
        },
        emptyUser: (state, action) => {
            state.value = null
        },
    },
})

// Action creators are generated for each case reducer function
export const { addUser, logout, emptyUser } = userSlice.actions

export default userSlice.reducer