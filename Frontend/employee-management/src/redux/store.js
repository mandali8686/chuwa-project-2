import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import hrReducer from "./hrSlice";

const store = configureStore({
  reducer: {
    hr: hrReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: true,
});

export default store;
