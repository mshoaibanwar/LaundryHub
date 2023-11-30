import { createSlice } from '@reduxjs/toolkit'

export const TempOrderSlice = createSlice({
    name: 'temporder',
    initialState: {
        value: {},
    },
    reducers: {
        addTempOrder: (state: any, action: any) => {

            state.value = action.payload
        },
        mergeTempOrder: (state, action) => {

            state.value = { ...state.value, ...action.payload }
        },
        emptyTempOrder: (state, action) => {

            state.value = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { addTempOrder, mergeTempOrder, emptyTempOrder } = TempOrderSlice.actions

export default TempOrderSlice.reducer