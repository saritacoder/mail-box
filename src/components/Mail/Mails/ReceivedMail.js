
import { useSelector } from "react-redux"

import EmptyTab from "../../UI/EmptyTab"
import MailList from "./MailList"

export default function ReceivedMail() {
  const receivedMails = useSelector((state) => state.emailState.receivedMails)
  const { email } = useSelector((state) => state.authState.loggedUser || {})

  // Filter received mails to only show those received by the current user
  const userReceivedMails = receivedMails.filter((mail) => mail.mail.to === email)

  let content = <EmptyTab tab="Inbox" />
  if (userReceivedMails.length > 0) {
    content = (
      <ul>
        {userReceivedMails.map((m) => {
          return <MailList key={m.id} id={m.id} mail={m.mail} label="From:" />
        })}
      </ul>
    )
  }

  return <div className="w-11/12 m-auto rounded overflow-hidden sm:w-auto sm:mx-2">{content}</div>
}