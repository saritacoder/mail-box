import { createSlice } from "@reduxjs/toolkit"

const appSlice = createSlice({
  name: "appSlice",
  initialState: {
    open: false,
    currentView: "inbox", // inbox, sent, starred, drafts, etc.
    unreadCount: 0,
  },
  reducers: {
    //actions
    setOpen: (state, action) => {
      state.open = action.payload
    },
    setCurrentView: (state, action) => {
      state.currentView = action.payload
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload
    },
  },
})
export const { setOpen, setCurrentView, setUnreadCount } = appSlice.actions
export default appSlice.reducer




// import { createSlice } from "@reduxjs/toolkit"

// const appSlice = createSlice({
//   name: "appSlice",
//   initialState: {
//     open: false,
//     currentView: "inbox", // inbox, sent, starred, drafts, etc.
//     unreadCount: 0,
//   },
//   reducers: {
//     //actions
//     setOpen: (state, action) => {
//       state.open = action.payload
//     },
//     setCurrentView: (state, action) => {
//       state.currentView = action.payload
//     },
//     setUnreadCount: (state, action) => {
//       state.unreadCount = action.payload
//     },
//   },
// })
// export const { setOpen, setCurrentView, setUnreadCount } = appSlice.actions
// export default appSlice.reducer
