import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import hrReducer from "../features/hr/hrSlice";

const store = configureStore({
  reducer: {
    hr: hrReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: true,
});

export default store;
