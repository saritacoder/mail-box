"use client"
import { MdCropSquare, MdDeleteOutline } from "react-icons/md"
import { RiStarLine, RiStarFill } from "react-icons/ri"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { setError } from "../../redux/emailSlice"

const Message = ({ email, onEmailUpdate }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((store) => store.auth)
  const { currentView } = useSelector((store) => store.appSlice)

  const openMail = async () => {
    // Mark email as read when opening
    if (!email.read && email.to === user?.email) {
      try {
        await fetch(`https://new--clone-cdaa6-default-rtdb.firebaseio.com/emails/${email.firebaseKey}.json`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            read: true,
          }),
        })
        // Refresh emails to update unread count
        if (onEmailUpdate) onEmailUpdate()
      } catch (error) {
        console.error("Failed to mark email as read:", error)
      }
    }

    navigate(`/mail/${email.firebaseKey || email.id}`, { state: { email } })
  }

  const deleteEmail = async (e) => {
    e.stopPropagation() // Prevent opening email when clicking delete

    if (!email?.firebaseKey) return

    try {
      const response = await fetch(
        `https://new--clone-cdaa6-default-rtdb.firebaseio.com/emails/${email.firebaseKey}.json`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deleted: true,
            deletedAt: new Date().toISOString(),
          }),
        },
      )

      if (response.ok) {
        dispatch(setError("Email moved to trash"))
        // Refresh emails list
        if (onEmailUpdate) onEmailUpdate()
      } else {
        throw new Error("Failed to delete email")
      }
    } catch (error) {
      dispatch(setError("Failed to delete email: " + error.message))
    }
  }

  const toggleStar = async (e) => {
    e.stopPropagation() // Prevent opening email when clicking star

    if (!email?.firebaseKey) return

    try {
      const response = await fetch(
        `https://new--clone-cdaa6-default-rtdb.firebaseio.com/emails/${email.firebaseKey}.json`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            starred: !email.starred,
          }),
        },
      )

      if (response.ok) {
        // Refresh emails list
        if (onEmailUpdate) onEmailUpdate()
      } else {
        throw new Error("Failed to update email")
      }
    } catch (error) {
      dispatch(setError("Failed to update email: " + error.message))
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    }
  }

  const getDisplayName = () => {
    if (currentView === "sent" || email.from === user?.email) {
      return `To: ${email.to}`
    } else {
      return email.fromName || email.from
    }
  }

  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Determine if this email should show as unread
  const isUnread = !email.read && email.to === user?.email

  return (
    <div
      onClick={openMail}
      className={`flex items-start justify-between border-b border-gray-200/40 px-4 py-3 text-sm hover:cursor-pointer hover:shadow-md transition-all group ${
        isUnread ? "bg-white/70 backdrop-blur-sm" : "bg-gray-50/50 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-none text-gray-300">
          <MdCropSquare className="w-5 h-5" />
        </div>
        <div className="flex-none text-gray-300" onClick={toggleStar}>
          {email.starred ? (
            <RiStarFill className="w-5 h-5 text-yellow-400 hover:text-yellow-500" />
          ) : (
            <RiStarLine className="w-5 h-5 hover:text-yellow-400" />
          )}
        </div>
        <div className="flex-none text-gray-300" onClick={deleteEmail}>
          <MdDeleteOutline className="w-5 h-5 hover:text-red-500 transition-colors" />
        </div>
      </div>

      <div className="flex-1 ml-4 min-w-0">
        <div className="flex items-center gap-2">
          {/* Blue dot for unread emails */}
          {isUnread && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>}
          <span
            className={`${isUnread ? "font-semibold text-black gmail-text-heavy" : "text-gray-500 gmail-text-medium"}`}
          >
            {getDisplayName()}
          </span>
          {email.from === user?.email && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Sent</span>
          )}
          {isUnread && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">New</span>}
        </div>
        <p className={`truncate ${isUnread ? "text-black gmail-text-medium" : "text-gray-500 gmail-text-light"}`}>
          <span className={`${isUnread ? "font-semibold gmail-text-heavy" : "gmail-text-medium"}`}>
            {email.subject}
          </span>
          <span className="text-gray-500 ml-2 gmail-text-light">- {truncateText(email.message)}</span>
        </p>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <div
          className={`flex-none text-sm ${isUnread ? "text-black font-medium gmail-text-medium" : "text-gray-400 gmail-text-light"}`}
        >
          {formatTime(email.timestamp)}
        </div>
      </div>
    </div>
  )
}

export default Message
