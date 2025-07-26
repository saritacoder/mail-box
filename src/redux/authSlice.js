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
  reducers: { //This updates the user info in Redux and marks user as logged in.
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload //  converts truthy values to true
      state.error = null
    },
    setToken: (state, action) => { //Stores Firebase ID token in state. Used for authenticated API requests.
      state.token = action.payload
    },
    setError: (state, action) => { //When an error occurs (e.g. signup failed, wrong password), you: Set the error message
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

