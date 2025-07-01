import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true, // Start with loading true
    error: null,
    token: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      state.error = null
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    clearError: (state) => {
      state.error = null
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
      state.token = null
      state.loading = false
    },
  },
})

export const { setLoading, setUser, setToken, setError, clearError, logout } = authSlice.actions
export default authSlice.reducer



// import { createSlice } from "@reduxjs/toolkit"

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: null,
//     isAuthenticated: false,
//     loading: true, // Start with loading true
//     error: null,
//     token: null,
//   },
//   reducers: {
//     setLoading: (state, action) => {
//       state.loading = action.payload
//     },
//     setUser: (state, action) => {
//       state.user = action.payload
//       state.isAuthenticated = !!action.payload
//       state.error = null
//     },
//     setToken: (state, action) => {
//       state.token = action.payload
//     },
//     setError: (state, action) => {
//       state.error = action.payload
//       state.loading = false
//     },
//     clearError: (state) => {
//       state.error = null
//     },
//     logout: (state) => {
//       state.user = null
//       state.isAuthenticated = false
//       state.error = null
//       state.token = null
//       state.loading = false
//     },
//   },
// })

// export const { setLoading, setUser, setToken, setError, clearError, logout } = authSlice.actions
// export default authSlice.reducer
