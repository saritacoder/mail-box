import { createSlice } from "@reduxjs/toolkit"

const emailSlice = createSlice({
  name: "email",
  initialState: {
    emails: [],
    loading: false,
    error: null,
    sending: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setSending: (state, action) => {
      state.sending = action.payload
    },
    setEmails: (state, action) => {
      state.emails = action.payload
    },
    addEmail: (state, action) => {
      state.emails.unshift(action.payload) // Add new email to the beginning
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
      state.sending = false
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { setLoading, setSending, setEmails, addEmail, setError, clearError } = emailSlice.actions
export default emailSlice.reducer




// import { createSlice } from "@reduxjs/toolkit"

// const emailSlice = createSlice({
//   name: "email",
//   initialState: {
//     emails: [],
//     loading: false,
//     error: null,
//     sending: false,
//   },
//   reducers: {
//     setLoading: (state, action) => {
//       state.loading = action.payload
//     },
//     setSending: (state, action) => {
//       state.sending = action.payload
//     },
//     setEmails: (state, action) => {
//       state.emails = action.payload
//     },
//     addEmail: (state, action) => {
//       state.emails.unshift(action.payload) // Add new email to the beginning
//     },
//     setError: (state, action) => {
//       state.error = action.payload
//       state.loading = false
//       state.sending = false
//     },
//     clearError: (state) => {
//       state.error = null
//     },
//   },
// })

// export const { setLoading, setSending, setEmails, addEmail, setError, clearError } = emailSlice.actions
// export default emailSlice.reducer
