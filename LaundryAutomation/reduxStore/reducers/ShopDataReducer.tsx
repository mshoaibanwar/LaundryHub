import { createSlice } from '@reduxjs/toolkit'

export const ShopDataSlice = createSlice({
    name: 'shopdata',
    initialState: {
        value: [],
    },
    reducers: {
        addShopData: (state: any, action: any) => {

            state.value = action.payload
        },
        removeShopData: (state, action) => {

            state.value = state.value.filter((item: any) => item.id !== action.payload)
        },
        emptyShopData: (state, action) => {

            state.value = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { addShopData, removeShopData, emptyShopData } = ShopDataSlice.actions

export default ShopDataSlice.reducer