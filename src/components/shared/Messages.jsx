"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setLoading, setEmails, setError } from "../../redux/emailSlice"
import { setUnreadCount } from "../../redux/appSlice"
import Message from "./Message"

const Messages = () => {
  const dispatch = useDispatch()
  const { emails, loading, error } = useSelector((store) => store.email)
  const { user } = useSelector((store) => store.auth)
  const { currentView } = useSelector((store) => store.appSlice)
  const [animatedMessages, setAnimatedMessages] = useState([])

  useEffect(() => {
    if (user) {
      fetchEmails()
    }
  }, [user])

  const fetchEmails = async () => {
    if (!user?.email) return

    dispatch(setLoading(true))

    try {
      const response = await fetch(`https://new--clone-cdaa6-default-rtdb.firebaseio.com/emails.json`)

      if (response.ok) {
        const data = await response.json()

        if (data) {
          // Convert Firebase object to array
          const emailsArray = Object.entries(data).map(([key, value]) => ({
            ...value,
            firebaseKey: key,
          }))

          // Sort by timestamp (newest first)
          emailsArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

          dispatch(setEmails(emailsArray))

          // Calculate unread count for inbox (only for non-guest users)
          if (!user.isGuest) {
            const inboxEmails = emailsArray.filter((email) => email.to === user.email && !email.read)
            dispatch(setUnreadCount(inboxEmails.length))
          } else {
            dispatch(setUnreadCount(0))
          }
        } else {
          dispatch(setEmails([]))
          dispatch(setUnreadCount(0))
        }
      } else {
        throw new Error("Failed to fetch emails")
      }
    } catch (error) {
      dispatch(setError("Failed to load emails: " + error.message))
    }

    dispatch(setLoading(false))
  }

  // Filter emails based on current view
  const getFilteredEmails = () => {
    // Return empty array if user is not available
    if (!user?.email) {
      return []
    }

    switch (currentView) {
      case "inbox":
        return emails.filter((email) => email.to === user.email)
      case "sent":
        return emails.filter((email) => email.from === user.email)
      case "starred":
        return emails.filter((email) => (email.to === user.email || email.from === user.email) && email.starred)
      case "all":
        return emails.filter((email) => email.to === user.email || email.from === user.email)
      default:
        return emails.filter((email) => email.to === user.email)
    }
  }

  const filteredEmails = getFilteredEmails()

  // Animation effect for messages with slower timing
  useEffect(() => {
    setAnimatedMessages([])

    if (filteredEmails.length > 0) {
      filteredEmails.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedMessages((prev) => [...prev, index])
        }, index * 200) // Increased from 100ms to 200ms for slower animation
      })
    }
  }, [filteredEmails.length, currentView])

  // Show loading if user is not available yet
  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading user data...</span>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading emails...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
  }

  // Show guest mode message for certain views
  if (user.isGuest && (currentView === "sent" || currentView === "starred")) {
    return (
      <div className="text-center p-8 text-gray-500">
        <div className="mb-4">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👤</span>
          </div>
          <p className="font-medium">Guest Mode</p>
          <p className="mt-2">
            {currentView === "sent" && "You haven't sent any emails in guest mode."}
            {currentView === "starred" && "No starred emails in guest mode."}
          </p>
          <p className="mt-2 text-sm">Create an account to access full email functionality.</p>
        </div>
      </div>
    )
  }

  if (filteredEmails.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📧</span>
          </div>
          <p className="font-medium">No emails found in {currentView}.</p>
          {currentView === "inbox" && !user.isGuest && (
            <p className="mt-2">Send your first email or ask someone to email you!</p>
          )}
          {currentView === "inbox" && user.isGuest && (
            <p className="mt-2">Guest mode has limited email functionality. Create an account for full access.</p>
          )}
          {currentView === "sent" && <p className="mt-2">You haven't sent any emails yet.</p>}
        </div>
      </div>
    )
  }

  return (
    <div>
      {filteredEmails.map((email, index) => {
        const isAnimated = animatedMessages.includes(index)
        return (
          <div
            key={email.firebaseKey || email.id}
            className={`transition-all duration-600 transform ${
              isAnimated ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{
              transitionDelay: isAnimated ? "0ms" : `${index * 200}ms`,
            }}
          >
            <Message email={email} onEmailUpdate={fetchEmails} />
          </div>
        )
      })}
    </div>
  )
}

export default Messages




// "use client"

// import { useEffect, useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { setLoading, setEmails, setError } from "../../redux/emailSlice"
// import { setUnreadCount } from "../../redux/appSlice"
// import Message from "./Message"

// const Messages = () => {
//   const dispatch = useDispatch()
//   const { emails, loading, error } = useSelector((store) => store.email)
//   const { user } = useSelector((store) => store.auth)
//   const { currentView } = useSelector((store) => store.appSlice)
//   const [animatedMessages, setAnimatedMessages] = useState([])

//   useEffect(() => {
//     fetchEmails()
//   }, [user])

//   const fetchEmails = async () => {
//     if (!user) return

//     dispatch(setLoading(true))

//     try {
//       const response = await fetch(`https://new--clone-cdaa6-default-rtdb.firebaseio.com/emails.json`)

//       if (response.ok) {
//         const data = await response.json()

//         if (data) {
//           // Convert Firebase object to array
//           const emailsArray = Object.entries(data).map(([key, value]) => ({
//             ...value,
//             firebaseKey: key,
//           }))

//           // Sort by timestamp (newest first)
//           emailsArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

//           dispatch(setEmails(emailsArray))

//           // Calculate unread count for inbox
//           const inboxEmails = emailsArray.filter((email) => email.to === user.email && !email.read && !email.deleted)
//           dispatch(setUnreadCount(inboxEmails.length))
//         } else {
//           dispatch(setEmails([]))
//           dispatch(setUnreadCount(0))
//         }
//       } else {
//         throw new Error("Failed to fetch emails")
//       }
//     } catch (error) {
//       dispatch(setError("Failed to load emails: " + error.message))
//     }

//     dispatch(setLoading(false))
//   }

//   // Filter emails based on current view
//   const getFilteredEmails = () => {
//     switch (currentView) {
//       case "inbox":
//         return emails.filter((email) => email.to === user.email && !email.deleted)
//       case "sent":
//         return emails.filter((email) => email.from === user.email && !email.deleted)
//       case "starred":
//         return emails.filter(
//           (email) => (email.to === user.email || email.from === user.email) && email.starred && !email.deleted,
//         )
//       case "trash":
//         return emails.filter((email) => (email.to === user.email || email.from === user.email) && email.deleted)
//       case "all":
//         return emails.filter((email) => (email.to === user.email || email.from === user.email) && !email.deleted)
//       case "drafts":
//         return emails.filter((email) => email.from === user.email && email.draft && !email.deleted)
//       default:
//         return emails.filter((email) => email.to === user.email && !email.deleted)
//     }
//   }

//   const filteredEmails = getFilteredEmails()

//   // Animation effect for messages with slower timing
//   useEffect(() => {
//     setAnimatedMessages([])

//     if (filteredEmails.length > 0) {
//       filteredEmails.forEach((_, index) => {
//         setTimeout(() => {
//           setAnimatedMessages((prev) => [...prev, index])
//         }, index * 200) // Increased from 100ms to 200ms for slower animation
//       })
//     }
//   }, [filteredEmails.length, currentView])

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <div className="flex items-center gap-3">
//           <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
//           <span className="text-gray-600">Loading emails...</span>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
//   }

//   if (filteredEmails.length === 0) {
//     return (
//       <div className="text-center p-8 text-gray-500">
//         <p>No emails found in {currentView}.</p>
//         {currentView === "inbox" && <p className="mt-2">Send your first email or ask someone to email you!</p>}
//         {currentView === "sent" && <p className="mt-2">You haven't sent any emails yet.</p>}
//         {currentView === "trash" && <p className="mt-2">No emails in trash.</p>}
//         {currentView === "all" && <p className="mt-2">No emails found.</p>}
//       </div>
//     )
//   }

//   return (
//     <div>
//       {filteredEmails.map((email, index) => {
//         const isAnimated = animatedMessages.includes(index)
//         return (
//           <div
//             key={email.firebaseKey || email.id}
//             className={`transition-all duration-600 transform ${
//               isAnimated ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
//             }`}
//             style={{
//               transitionDelay: isAnimated ? "0ms" : `${index * 200}ms`,
//             }}
//           >
//             <Message email={email} onEmailUpdate={fetchEmails} />
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// export default Messages
