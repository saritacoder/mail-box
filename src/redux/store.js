
import { configureStore } from "@reduxjs/toolkit"
import appReducer from "./appSlice"
import authReducer from "./authSlice"
import emailReducer from "./emailSlice"

const store = configureStore({
  reducer: {
    appSlice: appReducer,
    auth: authReducer,
    email: emailReducer,
  },
})

export default store



// import { configureStore } from "@reduxjs/toolkit"
// import appReducer from "./appSlice"
// import authReducer from "./authSlice"
// import emailReducer from "./emailSlice"

// const store = configureStore({
//   reducer: {
//     appSlice: appReducer,
//     auth: authReducer,
//     email: emailReducer,
//   },
// })

// export default store
