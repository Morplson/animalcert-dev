import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to local storage
import counterReducer from './slices/counterSlice';
import contractReducer from './slices/contractSlice';
import sorterReducer from './slices/sorterSlice';
import animalReducer from './slices/animalSlice';


const persistConfig = {
    key: 'root',
    storage,
};

const persistedCounterReducer = persistReducer(persistConfig, counterReducer);

const persistedSorterReducer = persistReducer(persistConfig, sorterReducer);
const persistedAnimalReducer = persistReducer(persistConfig, animalReducer);

const store = configureStore({
    reducer: {
        contract: contractReducer,
        counter: persistedCounterReducer,
        animal: persistedAnimalReducer,
        sorter: persistedSorterReducer,
    },
});

export const persistor = persistStore(store);

export default store;
