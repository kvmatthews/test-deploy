import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import servicesReducer from './homePageSlice';
import topupReducer from './topupSlice';
import transactionReducer from './transactionSlice';
import serviceReducer from './serviceSlice';
import profileReducer from './profileSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        services: servicesReducer,
        topup: topupReducer,
        transaction: transactionReducer,
        service: serviceReducer,
        profile: profileReducer,
    },
});

export default store;
