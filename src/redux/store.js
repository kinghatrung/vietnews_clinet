import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
    createTransform,
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './authSlice';
import userReducer from './userSlice';
import loadingReducer from './loadingSlice';

const userTransform = createTransform(
    (inboundState) => {
        if (inboundState.users && inboundState.users.allUsers) {
            return {
                ...inboundState,
                users: {
                    ...inboundState.users,
                    allUsers: null,
                },
            };
        }
        return inboundState;
    },
    (outboundState) => outboundState,
    { whitelist: ['users'] },
);

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    transforms: [userTransform],
    whitelist: ['auth'],
};
const rootReducer = combineReducers({
    auth: authReducer,
    users: userReducer,
    loading: loadingReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export let persistor = persistStore(store);
