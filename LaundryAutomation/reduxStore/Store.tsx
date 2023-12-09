import { configureStore } from '@reduxjs/toolkit'
import basketReducer from './reducers/BasketReducer'
import { combineReducers } from 'redux'

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'

import AsyncStorage from '@react-native-async-storage/async-storage';
import OrderReducer from './reducers/OrderReducer';
import TempOrderSlice from './reducers/TempOrderReducer';
import userSlice from './reducers/UserReducer';
import MessagesReducer from './reducers/MessagesReducer';
import ShopDataReducer from './reducers/ShopDataReducer';

const persistConfig = {
    key: 'root',
    version: 1,
    storage: AsyncStorage,
}

const allReducers = combineReducers({
    shopdata: ShopDataReducer,
    basket: basketReducer,
    order: OrderReducer,
    temporder: TempOrderSlice,
    msg: MessagesReducer,
    user: userSlice,
})

const persistedReducer = persistReducer(persistConfig, allReducers)

const storeObject = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const store = storeObject;
export const persistor = persistStore(storeObject);
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch