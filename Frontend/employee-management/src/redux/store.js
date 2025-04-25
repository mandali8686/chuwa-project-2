import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { hrReducer }from "../features/hr/hrSlice";
import { userReducer } from "../features/employee/index";

const store = configureStore({
  reducer: {
    user: userReducer,
    hr: hrReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: true,
});

export default store;
