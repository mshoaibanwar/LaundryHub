import { createSlice } from '@reduxjs/toolkit'

export const orderSlice = createSlice({
    name: 'order',
    initialState: {
        value: [],
    },
    reducers: {
        addOrder: (state: any, action: any) => {

            state.value.push(action.payload)
        },
        removeOrder: (state, action) => {

            state.value = state.value.filter((item: any) => item.id !== action.payload)
        },
        emptyOrders: (state, action) => {

            state.value = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { addOrder, removeOrder, emptyOrders } = orderSlice.actions

export default orderSlice.reducer