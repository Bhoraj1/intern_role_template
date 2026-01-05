import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { indexSlice } from '../features/indexSlice';
import userReducer from '../features/auth/authState';

// Check if we're on the client side
const isClient = typeof window !== 'undefined';

let storage;
if (isClient) {
  storage = require('redux-persist/lib/storage').default;
}

const persistConfig = {
  key: 'root',
  storage: isClient ? storage : undefined,
};

const persistedReducer = isClient 
  ? persistReducer(persistConfig, userReducer)
  : userReducer;

export const store = configureStore({
  reducer: {
    user: persistedReducer,
    [indexSlice.reducerPath]: indexSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(indexSlice.middleware),
});

export const persistor = isClient ? persistStore(store) : null;
export default store;