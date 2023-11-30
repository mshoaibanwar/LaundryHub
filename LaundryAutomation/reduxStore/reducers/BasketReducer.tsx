import { createSlice } from '@reduxjs/toolkit'

export const basketSlice = createSlice({
    name: 'basket',
    initialState: {
        value: [],
    },
    reducers: {
        addItem: (state: any, action: any) => {

            state.value.push(action.payload)
        },
        removeItem: (state, action) => {

            state.value = state.value.filter((item: any) => item.id !== action.payload)
        },
        emptyBasket: (state, action) => {

            state.value = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { addItem, removeItem, emptyBasket } = basketSlice.actions

export default basketSlice.reducer