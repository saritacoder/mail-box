import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import styles from '../MailEditor.module.css';

import { useSelector, useDispatch } from 'react-redux';
import {
  deleteReceivedMails,
  deleteSentMails,
  markAsUnread,
} from '../../../reducers/emailSlice';

import { BackArrow, DeleteIcon, MarkAsUnread } from '../../../assets/Icons';

export default function MailBody() {
  const { mailId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const sentMails = useSelector((state) => state.emailState.sentMails);
  const receivedMails = useSelector((state) => state.emailState.receivedMails);
  const { email } = useSelector((state) => state.authState.loggedUser);

  if (!sentMails.length && !receivedMails.length) {
    if (location.pathname.includes('inbox')) navigate('/mail/inbox');
    if (location.pathname.includes('sent')) navigate('/mail/sent');
    return;
  }

  const allMails = [...sentMails, ...receivedMails];
  const selectedMail = allMails.find((m) => m.id === mailId);

  if (!selectedMail) {
    if (location.pathname.includes('inbox')) navigate('/mail/inbox');
    if (location.pathname.includes('sent')) navigate('/mail/sent');
    return;
  }

  async function handleDeleteMail() {
    if (location.pathname.includes('inbox')) {
      const response = await fetch(
        `https://email-box-5aa50-default-rtdb.firebaseio.com/${email.replace(
          '.',
          ''
        )}/receivedMails/${mailId}.json`,
        {
          method: 'DELETE',
        }
      );
      if (response.ok) {
        dispatch(deleteReceivedMails(mailId));
        navigate('/mail/inbox');
      }
    }

    if (location.pathname.includes('sent')) {
      const response = await fetch(
        `https://email-box-5aa50-default-rtdb.firebaseio.com/${email.replace(
          '.',
          ''
        )}/sentMails/${mailId}.json`,
        {
          method: 'DELETE',
        }
      );
      if (response.ok) {
        dispatch(deleteSentMails(mailId));
        navigate('/mail/sent');
      }
    }
  }

  async function handleMarkAsUnread() {
    if (selectedMail.mail.read === true) {
      const response = await fetch(
        `https://email-box-5aa50-default-rtdb.firebaseio.com/${email.replace(
          '.',
          ''
        )}/receivedMails/${mailId}.json`,
        {
          method: 'PUT',
          body: JSON.stringify({ ...selectedMail.mail, read: false }),
        }
      );
      if (response.ok) {
        dispatch(markAsUnread(mailId));
      }
    }
  }

  return (
    <div className="w-11/12 m-auto rounded overflow-hidden sm:w-auto sm:mx-2">
      <header className="p-1 border-b flex justify-between items-center">
        <button
          className="rounded-full p-2 hover:bg-gray-100 active:bg-gray-200 duration-300"
          onClick={() => navigate(-1)}
        >
          <BackArrow className="w-6" />
        </button>
        <div className="flex items-center">
          {location.pathname.includes('inbox') && (
            <button
              className="rounded-full p-2 hover:bg-gray-100 active:bg-gray-200 duration-300"
              onClick={handleMarkAsUnread}
            >
              <MarkAsUnread className="w-6" />
            </button>
          )}
          <button
            className="rounded-full p-3 hover:bg-gray-100 active:bg-gray-200 duration-300"
            onClick={handleDeleteMail}
          >
            <DeleteIcon className="w-4" />
          </button>
        </div>
      </header>
      <section className="p-3">
        <div className="mb-5 mt-2">
          <h1 className="text-xlfont-medium">{selectedMail.mail.subject}</h1>
          <p className="text-sm text-slate-700">
            {location.pathname.includes('inbox')
              ? `<${selectedMail.mail.from}>`
              : `<${selectedMail.mail.to}>`}
          </p>
        </div>
        <Editor
          editorClassName={styles.readOnly}
          initialContentState={selectedMail.mail.content}
          readOnly
          toolbarHidden
        />
      </section>
    </div>
  );
}
