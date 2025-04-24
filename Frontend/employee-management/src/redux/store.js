import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger'; // <-- import logger

import { userReducer } from '../features/employee/index'

const store = configureStore({
  reducer: {
    user: userReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: true,
});

export default store;
