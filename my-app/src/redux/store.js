import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to local storage
import counterReducer from './slices/counterSlice';
import contractReducer from './slices/contractSlice';


const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, counterReducer);

const store = configureStore({
    reducer: {
        contract: contractReducer,
        counter: persistedReducer,
    },
});

export const persistor = persistStore(store);



export default store;