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
          method: "DELETE",
        },
      )

      if (response.ok) {
        dispatch(setError("Email deleted successfully"))
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
      className={`flex items-start justify-between border-b border-gray-200 px-4 py-3 text-sm hover:cursor-pointer hover:shadow-md transition-all group ${
        isUnread ? "bg-white font-medium" : "bg-gray-50"
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
      </div>

      <div className="flex-1 ml-4 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-gray-800 ${isUnread ? "font-semibold" : ""}`}>{getDisplayName()}</span>
          {email.from === user?.email && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Sent</span>
          )}
          {isUnread && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">New</span>}
        </div>
        <p className="text-gray-600 truncate">
          <span className={`${isUnread ? "font-semibold" : ""}`}>{email.subject}</span>
          <span className="text-gray-500 ml-2">- {truncateText(email.message)}</span>
        </p>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <div className="flex-none text-gray-400 text-sm">{formatTime(email.timestamp)}</div>
        <div
          onClick={deleteEmail}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
        >
          <MdDeleteOutline className="w-4 h-4 text-red-500 hover:text-red-700" />
        </div>
      </div>
    </div>
  )
}

export default Message




// "use client"
// import { MdCropSquare, MdDeleteOutline, MdRestore } from "react-icons/md"
// import { RiStarLine, RiStarFill } from "react-icons/ri"
// import { useNavigate } from "react-router-dom"
// import { useSelector, useDispatch } from "react-redux"
// import { setError } from "../../redux/emailSlice"

// const Message = ({ email, onEmailUpdate }) => {
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const { user } = useSelector((store) => store.auth)
//   const { currentView } = useSelector((store) => store.appSlice)

//   const openMail = async () => {
//     // Mark email as read when opening
//     if (!email.read && email.to === user?.email) {
//       try {
//         await fetch(`https://new--clone-cdaa6-default-rtdb.firebaseio.com/emails/${email.firebaseKey}.json`, {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             read: true,
//           }),
//         })
//         // Refresh emails to update unread count
//         if (onEmailUpdate) onEmailUpdate()
//       } catch (error) {
//         console.error("Failed to mark email as read:", error)
//       }
//     }

//     navigate(`/mail/${email.firebaseKey || email.id}`, { state: { email } })
//   }

//   const deleteEmail = async (e) => {
//     e.stopPropagation() // Prevent opening email when clicking delete

//     if (!email?.firebaseKey) return

//     try {
//       if (currentView === "trash") {
//         // Permanently delete from trash
//         const response = await fetch(
//           `https://new--clone-cdaa6-default-rtdb.firebaseio.com/emails/${email.firebaseKey}.json`,
//           {
//             method: "DELETE",
//           },
//         )

//         if (response.ok) {
//           dispatch(setError("Email permanently deleted"))
//           if (onEmailUpdate) onEmailUpdate()
//         } else {
//           throw new Error("Failed to delete email")
//         }
//       } else {
//         // Move to trash
//         const response = await fetch(
//           `https://new--clone-cdaa6-default-rtdb.firebaseio.com/emails/${email.firebaseKey}.json`,
//           {
//             method: "PATCH",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               deleted: true,
//               deletedAt: new Date().toISOString(),
//             }),
//           },
//         )

//         if (response.ok) {
//           dispatch(setError("Email moved to trash"))
//           if (onEmailUpdate) onEmailUpdate()
//         } else {
//           throw new Error("Failed to move email to trash")
//         }
//       }
//     } catch (error) {
//       dispatch(setError("Failed to delete email: " + error.message))
//     }
//   }

//   const restoreEmail = async (e) => {
//     e.stopPropagation() // Prevent opening email when clicking restore

//     if (!email?.firebaseKey) return

//     try {
//       const response = await fetch(
//         `https://new--clone-cdaa6-default-rtdb.firebaseio.com/emails/${email.firebaseKey}.json`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             deleted: false,
//             deletedAt: null,
//           }),
//         },
//       )

//       if (response.ok) {
//         dispatch(setError("Email restored"))
//         if (onEmailUpdate) onEmailUpdate()
//       } else {
//         throw new Error("Failed to restore email")
//       }
//     } catch (error) {
//       dispatch(setError("Failed to restore email: " + error.message))
//     }
//   }

//   const toggleStar = async (e) => {
//     e.stopPropagation() // Prevent opening email when clicking star

//     if (!email?.firebaseKey) return

//     try {
//       const response = await fetch(
//         `https://new--clone-cdaa6-default-rtdb.firebaseio.com/emails/${email.firebaseKey}.json`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             starred: !email.starred,
//           }),
//         },
//       )

//       if (response.ok) {
//         // Refresh emails list
//         if (onEmailUpdate) onEmailUpdate()
//       } else {
//         throw new Error("Failed to update email")
//       }
//     } catch (error) {
//       dispatch(setError("Failed to update email: " + error.message))
//     }
//   }

//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp)
//     const now = new Date()
//     const diffInHours = (now - date) / (1000 * 60 * 60)

//     if (diffInHours < 24) {
//       return date.toLocaleTimeString("en-US", {
//         hour: "numeric",
//         minute: "2-digit",
//         hour12: true,
//       })
//     } else {
//       return date.toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//       })
//     }
//   }

//   const getDisplayName = () => {
//     if (currentView === "sent" || email.from === user?.email) {
//       return `To: ${email.to}`
//     } else {
//       return email.fromName || email.from
//     }
//   }

//   const truncateText = (text, maxLength = 50) => {
//     if (text.length <= maxLength) return text
//     return text.substring(0, maxLength) + "..."
//   }

//   // Determine if this email should show as unread
//   const isUnread = !email.read && email.to === user?.email

//   return (
//     <div
//       onClick={openMail}
//       className={`flex items-start justify-between border-b border-gray-200 px-4 py-3 text-sm hover:cursor-pointer hover:shadow-md transition-all group ${
//         isUnread ? "bg-white font-medium" : "bg-gray-50"
//       }`}
//     >
//       <div className="flex items-center gap-3">
//         <div className="flex-none text-gray-300">
//           <MdCropSquare className="w-5 h-5" />
//         </div>
//         <div className="flex-none text-gray-300" onClick={toggleStar}>
//           {email.starred ? (
//             <RiStarFill className="w-5 h-5 text-yellow-400 hover:text-yellow-500" />
//           ) : (
//             <RiStarLine className="w-5 h-5 hover:text-yellow-400" />
//           )}
//         </div>
//       </div>

//       <div className="flex-1 ml-4 min-w-0">
//         <div className="flex items-center gap-2">
//           <span className={`text-gray-800 ${isUnread ? "font-semibold" : ""}`}>{getDisplayName()}</span>
//           {email.from === user?.email && (
//             <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Sent</span>
//           )}
//           {isUnread && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">New</span>}
//           {email.deleted && <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">Deleted</span>}
//         </div>
//         <p className="text-gray-600 truncate">
//           <span className={`${isUnread ? "font-semibold" : ""}`}>{email.subject}</span>
//           <span className="text-gray-500 ml-2">- {truncateText(email.message)}</span>
//         </p>
//       </div>

//       <div className="flex items-center gap-2 ml-4">
//         <div className="flex-none text-gray-400 text-sm">{formatTime(email.timestamp)}</div>
//         <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
//           {currentView === "trash" ? (
//             <div onClick={restoreEmail} className="p-1 hover:bg-green-100 rounded" title="Restore email">
//               <MdRestore className="w-4 h-4 text-green-500 hover:text-green-700" />
//             </div>
//           ) : null}
//           <div
//             onClick={deleteEmail}
//             className="p-1 hover:bg-red-100 rounded"
//             title={currentView === "trash" ? "Delete permanently" : "Move to trash"}
//           >
//             <MdDeleteOutline className="w-4 h-4 text-red-500 hover:text-red-700" />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Message
