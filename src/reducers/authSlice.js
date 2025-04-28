import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
  name: " auth",
  initialState: {
    idToken: null,
    loggedUser: null,
    isLoggedIn: false,
  },
  reducers: {
    onLogin(state, action) {
      const idToken = action.payload.idToken
      const loggedUser = {
        name: action.payload.displayName,
        email: action.payload.email,
        uniqueId: action.payload.localId,
      }

      state.idToken = idToken
      localStorage.setItem("idToken", idToken)

      state.loggedUser = loggedUser
      localStorage.setItem("loggedUser", JSON.stringify(loggedUser))

      state.isLoggedIn = true
    },

    onLogout(state) {
      state.idToken = null
      localStorage.removeItem("idToken")

      state.loggedUser = null
      localStorage.removeItem("loggedUser")

      state.isLoggedIn = false
    },

    checkAuthState(state) {
      const token = localStorage.getItem("idToken")
      const user = localStorage.getItem("loggedUser")

      if (token && token !== "null" && token !== "undefined" && user) {
        state.idToken = token
        state.loggedUser = JSON.parse(user)
        state.isLoggedIn = true
      } else {
        state.idToken = null
        state.loggedUser = null
        state.isLoggedIn = false
        localStorage.removeItem("idToken")
        localStorage.removeItem("loggedUser")
      }
    },
  },
})

export const { onLogin, onLogout, checkAuthState } = authSlice.actions
export default authSlice.reducer
