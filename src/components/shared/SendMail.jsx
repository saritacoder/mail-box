"use client"

import { useState, useEffect } from "react"
import { RxCross2 } from "react-icons/rx"
import { MdOutlineAttachFile, MdInsertEmoticon } from "react-icons/md"
import { BsThreeDots } from "react-icons/bs"
import { AiOutlinePlus } from "react-icons/ai"
import { useSelector, useDispatch } from "react-redux"
import { setOpen } from "../../redux/appSlice"
import { setSending, addEmail, setError, clearError } from "../../redux/emailSlice"

const SendMail = () => {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: "",
  })

  const open = useSelector((store) => store.appSlice.open)
  const { user } = useSelector((store) => store.auth)
  const { sending, error } = useSelector((store) => store.email)
  const dispatch = useDispatch()

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 4000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    if (!formData.to || !formData.subject || !formData.message) {
      dispatch(setError("Please fill in all fields"))
      return
    }

    if (!user?.email) {
      dispatch(setError("You must be logged in to send emails"))
      return
    }

    // Check if user is guest
    if (user.isGuest) {
      dispatch(setError("❌ Guest users cannot send emails. Please create an account for full functionality."))
      return
    }

    dispatch(setSending(true))
    dispatch(clearError())

    try {
      // Create email object
      const emailData = {
        id: Date.now().toString(), // Simple ID generation
        from: user.email,
        fromName: user.displayName || user.email,
        to: formData.to,
        subject: formData.subject,
        message: formData.message,
        timestamp: new Date().toISOString(),
        read: false,
        starred: false,
        type: "sent",
      }

      // Send to Firebase Realtime Database
      const response = await fetch(`https://new--clone-cdaa6-default-rtdb.firebaseio.com/emails.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      })

      if (response.ok) {
        const result = await response.json()

        // Add the Firebase-generated key to our email data
        const emailWithKey = {
          ...emailData,
          firebaseKey: result.name,
        }

        // Add email to Redux store
        dispatch(addEmail(emailWithKey))

        // Reset form
        setFormData({
          to: "",
          subject: "",
          message: "",
        })

        // Close compose window
        dispatch(setOpen(false))

        // Show success message in green
        dispatch(setError("✅ Email sent successfully!"))
      } else {
        throw new Error("Failed to send email")
      }
    } catch (error) {
      dispatch(setError("❌ Failed to send email: " + error.message))
    }

    dispatch(setSending(false))
  }

  // Don't render if user is not available
  if (!user) {
    return null
  }

  return (
    <div
      className={`${open ? "block" : "hidden"} fixed bottom-0 right-16 w-[600px] shadow-2xl rounded-t-lg bg-white z-50 transition-all duration-300 transform ${
        open ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 bg-[#F2F6FC] rounded-t-lg">
        <h1 className="text-sm font-medium">
          New Message {user.isGuest && <span className="text-xs text-yellow-600">(Guest Mode - Limited)</span>}
        </h1>
        <div
          onClick={() => dispatch(setOpen(false))}
          className="p-2 cursor-pointer transition-all duration-300 hover:bg-red-600 hover:text-white hover:rotate-180 rounded-full"
        >
          <RxCross2 size={"14px"} />
        </div>
      </div>

      {/* Guest Mode Warning */}
      {user.isGuest && (
        <div className="mx-4 mt-2 p-3 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg text-sm">
          <strong>Guest Mode:</strong> You cannot send emails. Please create an account for full functionality.
        </div>
      )}

      {/* Error/Success Message */}
      {error && (
        <div
          className={`mx-4 mt-2 p-3 border rounded-lg text-sm font-medium transition-all duration-300 ${
            error.includes("successfully") || error.includes("✅")
              ? "bg-green-50 border-green-300 text-green-700 shadow-green-100"
              : "bg-red-50 border-red-300 text-red-700 shadow-red-100"
          } shadow-lg`}
        >
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={submitHandler} className="flex flex-col px-4 pt-3 gap-2">
        <input
          onChange={changeHandler}
          value={formData.to}
          name="to"
          type="email"
          placeholder="To"
          className="text-sm border-b border-gray-200 focus:outline-none focus:border-blue-500 py-2 transition-colors"
          disabled={sending || user.isGuest}
        />
        <input
          onChange={changeHandler}
          value={formData.subject}
          name="subject"
          type="text"
          placeholder="Subject"
          className="text-sm border-b border-gray-200 focus:outline-none focus:border-blue-500 py-2 transition-colors"
          disabled={sending || user.isGuest}
        />
        <textarea
          onChange={changeHandler}
          value={formData.message}
          name="message"
          rows={12}
          placeholder="Message"
          className="text-sm resize-none focus:outline-none focus:border-blue-500 border border-transparent rounded p-2 transition-colors"
          disabled={sending || user.isGuest}
        ></textarea>

        {/* Footer */}
        <div className="flex items-center justify-between py-3">
          {/* Send button and icons */}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={sending || user.isGuest}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              {sending ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Sending...
                </div>
              ) : (
                "Send"
              )}
            </button>
            <MdOutlineAttachFile
              size={20}
              className={`cursor-pointer transition-colors ${
                user.isGuest ? "text-gray-400" : "text-gray-600 hover:text-black"
              }`}
            />
            <MdInsertEmoticon
              size={20}
              className={`cursor-pointer transition-colors ${
                user.isGuest ? "text-gray-400" : "text-gray-600 hover:text-black"
              }`}
            />
            <AiOutlinePlus
              size={20}
              className={`cursor-pointer transition-colors ${
                user.isGuest ? "text-gray-400" : "text-gray-600 hover:text-black"
              }`}
            />
          </div>

          {/* More options */}
          <div>
            <BsThreeDots
              size={20}
              className={`cursor-pointer transition-colors ${
                user.isGuest ? "text-gray-400" : "text-gray-600 hover:text-black"
              }`}
            />
          </div>
        </div>
      </form>
    </div>
  )
}

export default SendMail




// "use client"

// import { useState, useEffect } from "react"
// import { RxCross2 } from "react-icons/rx"
// import { MdOutlineAttachFile, MdInsertEmoticon } from "react-icons/md"
// import { BsThreeDots } from "react-icons/bs"
// import { AiOutlinePlus } from "react-icons/ai"
// import { useSelector, useDispatch } from "react-redux"
// import { setOpen } from "../../redux/appSlice"
// import { setSending, addEmail, setError, clearError } from "../../redux/emailSlice"

// const SendMail = () => {
//   const [formData, setFormData] = useState({
//     to: "",
//     subject: "",
//     message: "",
//   })

//   const open = useSelector((store) => store.appSlice.open)
//   const { user } = useSelector((store) => store.auth)
//   const { sending, error } = useSelector((store) => store.email)
//   const dispatch = useDispatch()

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => dispatch(clearError()), 4000)
//       return () => clearTimeout(timer)
//     }
//   }, [error, dispatch])

//   const changeHandler = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }

//   const submitHandler = async (e) => {
//     e.preventDefault()

//     if (!formData.to || !formData.subject || !formData.message) {
//       dispatch(setError("Please fill in all fields"))
//       return
//     }

//     if (!user?.email) {
//       dispatch(setError("You must be logged in to send emails"))
//       return
//     }

//     // Check if user is guest
//     if (user.isGuest) {
//       dispatch(setError("❌ Guest users cannot send emails. Please create an account for full functionality."))
//       return
//     }

//     dispatch(setSending(true))
//     dispatch(clearError())

//     try {
//       // Create email object
//       const emailData = {
//         id: Date.now().toString(), // Simple ID generation
//         from: user.email,
//         fromName: user.displayName || user.email,
//         to: formData.to,
//         subject: formData.subject,
//         message: formData.message,
//         timestamp: new Date().toISOString(),
//         read: false,
//         starred: false,
//         type: "sent",
//       }

//       // Send to Firebase Realtime Database
//       const response = await fetch(`https://new--clone-cdaa6-default-rtdb.firebaseio.com/emails.json`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(emailData),
//       })

//       if (response.ok) {
//         const result = await response.json()

//         // Add the Firebase-generated key to our email data
//         const emailWithKey = {
//           ...emailData,
//           firebaseKey: result.name,
//         }

//         // Add email to Redux store
//         dispatch(addEmail(emailWithKey))

//         // Reset form
//         setFormData({
//           to: "",
//           subject: "",
//           message: "",
//         })

//         // Close compose window
//         dispatch(setOpen(false))

//         // Show success message in green
//         dispatch(setError("✅ Email sent successfully!"))
//       } else {
//         throw new Error("Failed to send email")
//       }
//     } catch (error) {
//       dispatch(setError("❌ Failed to send email: " + error.message))
//     }

//     dispatch(setSending(false))
//   }

//   // Don't render if user is not available
//   if (!user) {
//     return null
//   }

//   return (
//     <div
//       className={`${open ? "block" : "hidden"} fixed bottom-0 right-16 w-[600px] shadow-2xl rounded-t-lg bg-white z-50 transition-all duration-300 transform ${
//         open ? "translate-y-0" : "translate-y-full"
//       }`}
//     >
//       {/* Header */}
//       <div className="flex justify-between items-center px-4 py-2 bg-[#F2F6FC] rounded-t-lg">
//         <h1 className="text-sm font-medium">
//           New Message {user.isGuest && <span className="text-xs text-yellow-600">(Guest Mode - Limited)</span>}
//         </h1>
//         <div
//           onClick={() => dispatch(setOpen(false))}
//           className="p-2 cursor-pointer transition-all duration-300 hover:bg-red-600 hover:text-white hover:rotate-180 rounded-full"
//         >
//           <RxCross2 size={"14px"} />
//         </div>
//       </div>

//       {/* Guest Mode Warning */}
//       {user.isGuest && (
//         <div className="mx-4 mt-2 p-3 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg text-sm">
//           <strong>Guest Mode:</strong> You cannot send emails. Please create an account for full functionality.
//         </div>
//       )}

//       {/* Error/Success Message */}
//       {error && (
//         <div
//           className={`mx-4 mt-2 p-3 border rounded-lg text-sm font-medium transition-all duration-300 ${
//             error.includes("successfully") || error.includes("✅")
//               ? "bg-green-50 border-green-300 text-green-700 shadow-green-100"
//               : "bg-red-50 border-red-300 text-red-700 shadow-red-100"
//           } shadow-lg`}
//         >
//           {error}
//         </div>
//       )}

//       {/* Form */}
//       <form onSubmit={submitHandler} className="flex flex-col px-4 pt-3 gap-2">
//         <input
//           onChange={changeHandler}
//           value={formData.to}
//           name="to"
//           type="email"
//           placeholder="To"
//           className="text-sm border-b border-gray-200 focus:outline-none focus:border-blue-500 py-2 transition-colors"
//           disabled={sending || user.isGuest}
//         />
//         <input
//           onChange={changeHandler}
//           value={formData.subject}
//           name="subject"
//           type="text"
//           placeholder="Subject"
//           className="text-sm border-b border-gray-200 focus:outline-none focus:border-blue-500 py-2 transition-colors"
//           disabled={sending || user.isGuest}
//         />
//         <textarea
//           onChange={changeHandler}
//           value={formData.message}
//           name="message"
//           rows={12}
//           placeholder="Message"
//           className="text-sm resize-none focus:outline-none focus:border-blue-500 border border-transparent rounded p-2 transition-colors"
//           disabled={sending || user.isGuest}
//         ></textarea>

//         {/* Footer */}
//         <div className="flex items-center justify-between py-3">
//           {/* Send button and icons */}
//           <div className="flex items-center gap-2">
//             <button
//               type="submit"
//               disabled={sending || user.isGuest}
//               className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
//             >
//               {sending ? (
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                   Sending...
//                 </div>
//               ) : (
//                 "Send"
//               )}
//             </button>
//             <MdOutlineAttachFile
//               size={20}
//               className={`cursor-pointer transition-colors ${
//                 user.isGuest ? "text-gray-400" : "text-gray-600 hover:text-black"
//               }`}
//             />
//             <MdInsertEmoticon
//               size={20}
//               className={`cursor-pointer transition-colors ${
//                 user.isGuest ? "text-gray-400" : "text-gray-600 hover:text-black"
//               }`}
//             />
//             <AiOutlinePlus
//               size={20}
//               className={`cursor-pointer transition-colors ${
//                 user.isGuest ? "text-gray-400" : "text-gray-600 hover:text-black"
//               }`}
//             />
//           </div>

//           {/* More options */}
//           <div>
//             <BsThreeDots
//               size={20}
//               className={`cursor-pointer transition-colors ${
//                 user.isGuest ? "text-gray-400" : "text-gray-600 hover:text-black"
//               }`}
//             />
//           </div>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default SendMail
