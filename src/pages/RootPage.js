import { useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { toggleSpinner } from '../reducers/uiSlice';
import { setReceivedMails, setSentMails } from '../reducers/emailSlice';

import Header from '../components/Layout/Header';

let initial = true;

export default function RootPage() {
  const { email } = useSelector((state) => state.authState.loggedUser);
  const dispatch = useDispatch();

  const fetchReceivedMails = useCallback(async () => {
    const response = await fetch(
      `https://mail-box-8e2c3-default-rtdb.firebaseio.com/
${email.replace(
        '.',
        ''
      )}/receivedMails.json`
    );

    const data = await response.json();

    let unreadMails = 0;
    const mailArray = [];
    for (const key in data) {
      //Firebase won't store the empty arrays and objects.
      // Re-creating those properties manually, after reading the data back.
      const content = data[key].content;
      if (!content.entityMap) content.entityMap = {};
      content.blocks.map((c) => {
        if (!c.data) c.data = {};
        if (!c.entityRanges) c.entityRanges = [];
        if (!c.inlineStyleRanges) c.inlineStyleRanges = [];
        return c;
      });

      if (data[key].read === false) unreadMails += 1;
      mailArray.push({
        id: key,
        mail: data[key],
      });
    }
    dispatch(setReceivedMails({ mailArray, unreadMails }));
  }, [email, dispatch]);

  const fetchSentMails = useCallback(async () => {
    dispatch(toggleSpinner(true));
    const response = await fetch(
      `https://mail-box-8e2c3-default-rtdb.firebaseio.com/
${email.replace(
        '.',
        ''
      )}/sentMails.json`
    );

    const data = await response.json();
    for (const key in data) {
      //Firebase won't store the empty arrays and objects.
      // Re-creating those properties manually, after reading the data back.
      const content = data[key].content;
      if (!content.entityMap) content.entityMap = {};
      content.blocks.map((c) => {
        if (!c.data) c.data = {};
        if (!c.entityRanges) c.entityRanges = [];
        if (!c.inlineStyleRanges) c.inlineStyleRanges = [];
        return c;
      });
      dispatch(setSentMails({ id: key, mail: data[key] }));
    }

    dispatch(toggleSpinner(false));
  }, [email, dispatch]);

  useEffect(() => {
    if (initial) {
      fetchReceivedMails();
      fetchSentMails();
      initial = false;
      return;
    }

    const interval = setInterval(() => {
      fetchReceivedMails();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchReceivedMails, fetchSentMails]);

  return (
    <>
      <Header />
      <section className="sm:ml-64 mt-2">
        <Outlet />
      </section>
    </>
  );
}
