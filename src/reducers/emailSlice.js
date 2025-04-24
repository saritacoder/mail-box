import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sentMails: [],
  receivedMails: [],
  unreadMails: 0,
  staredMails: [],
};

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    setSentMails(state, action) {
      state.sentMails.push(action.payload);
    },

    setReceivedMails(state, action) {
      state.receivedMails = action.payload.mailArray;
      state.unreadMails = action.payload.unreadMails;
    },

    setStaredMails(state, action) {
      state.staredMails = action.payload;
    },

    markAsRead(state, action) {
      const updatedMails = state.receivedMails.map((m) => {
        if (m.id === action.payload) {
          m.mail.read = true;
        }
        return m;
      });
      state.receivedMails = updatedMails;
      state.unreadMails -= 1;
    },

    markAsUnread(state, action) {
      const updatedMails = state.receivedMails.map((m) => {
        if (m.id === action.payload) {
          m.mail.read = false;
        }
        return m;
      });
      state.receivedMails = updatedMails;
      state.unreadMails += 1;
    },

    deleteSentMails(state, action) {
      const updatedMails = state.sentMails.filter(
        (m) => m.id !== action.payload
      );
      state.sentMails = updatedMails;
    },

    deleteReceivedMails(state, action) {
      const updatedMails = state.receivedMails.filter(
        (m) => m.id !== action.payload
      );
      state.receivedMails = updatedMails;
    },
  },
});

export const {
  setSentMails,
  setReceivedMails,
  setStaredMails,
  markAsRead,
  markAsUnread,
  deleteSentMails,
  deleteReceivedMails,
} = emailSlice.actions;
export default emailSlice.reducer;
