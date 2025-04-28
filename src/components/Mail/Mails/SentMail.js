import { useSelector } from "react-redux"

import EmptyTab from "../../UI/EmptyTab"
import Loader from "../../UI/Loader"
import MailList from "./MailList"

export default function SentMail() {
  const sentMails = useSelector((state) => state.emailState.sentMails)
  const spinner = useSelector((state) => state.uiState.spinner)
  const { email } = useSelector((state) => state.authState.loggedUser || {})

  // Filter sent mails to only show those sent by the current user
  const userSentMails = sentMails.filter((mail) => mail.mail.from === email)

  let content = <EmptyTab tab="Sent" />
  if (userSentMails.length > 0) {
    content = (
      <ul>
        {userSentMails.map((m) => {
          return <MailList key={m.id} id={m.id} mail={m.mail} label="To:" />
        })}
      </ul>
    )
  }
  if (spinner) content = <Loader />

  return <div className="w-11/12 m-auto rounded overflow-hidden sm:w-auto sm:mx-2">{content}</div>
}