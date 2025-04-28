
import { useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import MailEditor from "./MailEditor"
import { setSentMails } from "../../reducers/emailSlice"

export default function ComposeMail() {
  const { email } = useSelector((state) => state.authState.loggedUser)

  const [isValid, setIsValid] = useState(true)
  const [isSending, setIsSending] = useState(false)

  const toMailRef = useRef()
  const subjectRef = useRef()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  let content
  function handleDoneEditing(mailContent) {
    content = mailContent.content
  }

  function handleToMailChange() {
    setIsValid(true)
  }

  async function handleSendEmail() {
    const enteredToMail = toMailRef.current.value
    const enteredSubject = subjectRef.current.value

    if (!enteredToMail || !enteredSubject) {
      setIsValid(false)
      return
    }
    if (!enteredToMail.includes("@")) {
      setIsValid(false)
      return
    }
    if (!content) {
      toast.warning("Did you forget to write the content of mail?")
      return
    }

    setIsSending(true)

    const mailDetails = {
      from: email,
      to: enteredToMail,
      subject: enteredSubject,
      content: content,
      timestamp: new Date().toISOString(),
    }

    try {
      // Save to sender's sent folder
      const response = await fetch(
        `https://email-box-5aa50-default-rtdb.firebaseio.com/${email.replace(".", "")}/sentMails.json`,
        {
          method: "POST",
          body: JSON.stringify(mailDetails),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to save sent mail")
      }

      const data = await response.json()
      dispatch(setSentMails({ id: data.name, mail: mailDetails }))

      // Save to recipient's inbox
      try {
        const receiverEmail = enteredToMail.replace(".", "")

        // First check if the recipient exists
        const checkUserResponse = await fetch(
          `https://email-box-5aa50-default-rtdb.firebaseio.com/${receiverEmail}.json`,
        )

        if (checkUserResponse.ok) {
          const userData = await checkUserResponse.json()

          // Check if the receivedMails collection exists, if not create it
          if (!userData || !userData.receivedMails) {
            // Initialize the receivedMails collection if it doesn't exist
            const initResponse = await fetch(
              `https://email-box-5aa50-default-rtdb.firebaseio.com/${receiverEmail}.json`,
              {
                method: "PATCH",
                body: JSON.stringify({
                  receivedMails: {
                    init: {
                      from: email,
                      to: enteredToMail,
                      subject: enteredSubject,
                      content: content,
                      timestamp: new Date().toISOString(),
                      read: false,
                    },
                  },
                }),
              },
            )

            if (!initResponse.ok) {
              console.warn("Could not initialize recipient's inbox, but email was saved to your sent folder")
            }
          } else {
            // If receivedMails already exists, just add the new email
            const receiverResponse = await fetch(
              `https://email-box-5aa50-default-rtdb.firebaseio.com/${receiverEmail}/receivedMails.json`,
              {
                method: "POST",
                body: JSON.stringify({ ...mailDetails, read: false }),
              },
            )

            if (!receiverResponse.ok) {
              console.warn("Could not deliver to recipient's inbox, but email was saved to your sent folder")
            }
          }
        } else {
          toast.info("The recipient may not have an account, but your email was saved to your sent folder")
        }

        navigate("/mail/sent")
      } catch (error) {
        console.error("Error sending to receiver:", error)
        toast.info("Email saved to your sent folder, but delivery to recipient failed")
        navigate("/mail/sent")
      }
    } catch (error) {
      console.error("Error in sendMail function:", error)
      toast.error("Failed to send email. Please try again.")
    } finally {
      setIsSending(false)
    }
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
          <label className="text-sm font-semibold text-slate-600" htmlFor="from">
            From:
          </label>
          <input className="px-2 flex-1 focus:outline-none" type="text" id="from" defaultValue={email} readOnly />
        </div>
        <div className="border-b flex p-1 items-center">
          <label className="font-semibold text-sm text-slate-600" htmlFor="email">
            To:
          </label>
          <input
            className={`flex-1 px-2 focus:outline-none ${!isValid ? "bg-red-200" : ""}`}
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
          <label className="text-sm font-semibold text-slate-600" htmlFor="subject">
            Subject:
          </label>
          <input
            className={`flex-1 px-2 focus:outline-none ${!isValid ? "bg-red-200" : ""}`}
            type="text"
            id="subject"
            ref={subjectRef}
          />
        </div>
        <MailEditor onDoneEditing={handleDoneEditing} />
        <div className="p-1">
          <button
            className="rounded px-2 py-1 font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:outline-blue-700 focus:outline-offset-2 disabled:bg-blue-400"
            onClick={handleSendEmail}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  )
}
