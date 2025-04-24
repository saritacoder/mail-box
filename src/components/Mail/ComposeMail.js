import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import MailEditor from './MailEditor';
import { setSentMails } from '../../reducers/emailSlice';

export default function ComposeMail() {
  const { email } = useSelector((state) => state.authState.loggedUser);

  const [isValid, setIsValid] = useState(true);

  const toMailRef = useRef();
  const subjectRef = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  let content;
  function handleDoneEditing(mailContent) {
    content = mailContent.content;
  }

  function handleToMailChange() {
    setIsValid(true);
  }

  function handleSendEmail() {
    const enteredToMail = toMailRef.current.value;
    const enteredSubject = subjectRef.current.value;

    if (!enteredToMail || !enteredSubject) {
      setIsValid(false);
      return;
    }
    if (!enteredToMail.includes('@')) {
      setIsValid(false);
      return;
    }
    if (!content) {
      toast.warning('Did you forget to write the content of mail?');
      return;
    }

    const mailDetails = {
      from: email,
      to: enteredToMail,
      subject: enteredSubject,
      content: content,
    };

    async function sendMail() {
      const response = await fetch(
        `https://mail-box-8e2c3-default-rtdb.firebaseio.com/
${email.replace(
          '.',
          ''
        )}/sentMails.json`,
        {
          method: 'POST',
          body: JSON.stringify(mailDetails),
        }
      );

      if (response.ok) {
        const data = await response.json();
        dispatch(setSentMails({ id: data.name, mail: mailDetails }));
        navigate('/mail/sent');
        await fetch(
          `https://mail-box-8e2c3-default-rtdb.firebaseio.com/
${toMailRef.current.value.replace(
            '.',
            ''
          )}/receivedMails.json`,
          {
            method: 'POST',
            body: JSON.stringify({ ...mailDetails, read: false }),
          }
        );
      }
    }
    sendMail();
  }

  return (
    <div className="w-11/12 m-auto rounded overflow-hidden sm:w-auto sm:mx-2">
      <div className="p-1 bg-blue-600 text-white">
        <span>New Message</span>
        <button className="float-end mr-2" onClick={() => navigate(-1)}>
          ✕
        </button>
      </div>
      <div className="min-h-96 p-1 flex flex-col border rounded-b">
        <div className="border-b p-1 flex items-center">
          <label
            className="text-sm font-semibold text-slate-600"
            htmlFor="from"
          >
            From:
          </label>
          <input
            className="px-2 flex-1 focus:outline-none"
            type="text"
            id="from"
            defaultValue={email}
            readOnly
          />
        </div>
        <div className="border-b flex p-1 items-center">
          <label
            className="font-semibold text-sm text-slate-600"
            htmlFor="email"
          >
            To:
          </label>
          <input
            className={`flex-1 px-2 focus:outline-none ${
              !isValid ? 'bg-red-200' : ''
            }`}
            type="email"
            id="email"
            onChange={handleToMailChange}
            ref={toMailRef}
          />
          <div className="text-slate-400 text-sm">
            <span className="mr-1">Cc</span>
            <span>Bcc</span>
          </div>
        </div>

        <div className="border-b p-1 flex items-center">
          <label
            className="text-sm font-semibold text-slate-600"
            htmlFor="subject"
          >
            Subject:
          </label>
          <input
            className={`flex-1 px-2 focus:outline-none ${
              !isValid ? 'bg-red-200' : ''
            }`}
            type="text"
            id="subject"
            ref={subjectRef}
          />
        </div>
        <MailEditor onDoneEditing={handleDoneEditing} />
        <div className="p-1">
          <button
            className="rounded px-2 py-1 font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:outline-blue-700 focus:outline-offset-2"
            onClick={handleSendEmail}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
