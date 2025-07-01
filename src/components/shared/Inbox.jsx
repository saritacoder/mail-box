
"use client"

import { useState } from "react"
import { MdCropSquare } from "react-icons/md"
import { FaCaretDown, FaUserFriends } from "react-icons/fa"
import { IoMdRefresh, IoMdMore } from "react-icons/io"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdInbox } from "react-icons/md"
import { GoTag } from "react-icons/go"
import Messages from "./Messages"
import { useSelector } from "react-redux"

const mailType = [
  {
    icon: <MdInbox size={"20px"} />,
    text: "Primary",
  },
  {
    icon: <GoTag size={"20px"} />,
    text: "Promotions",
  },
  {
    icon: <FaUserFriends size={"20px"} />,
    text: "Social",
  },
]

const Inbox = () => {
  const [mailTypeSelected, setMailTypeSelected] = useState(0)
  const { currentView } = useSelector((store) => store.appSlice)
  const { emails } = useSelector((store) => store.email)
  const { user } = useSelector((store) => store.auth)

  // Get filtered emails count based on current view
  const getEmailCount = () => {
    if (!emails || !user?.email) return 0

    switch (currentView) {
      case "inbox":
        return emails.filter((email) => email.to === user.email).length
      case "sent":
        return emails.filter((email) => email.from === user.email).length
      case "starred":
        return emails.filter((email) => (email.to === user.email || email.from === user.email) && email.starred).length
      default:
        return emails.filter((email) => email.to === user.email).length
    }
  }

  const getViewTitle = () => {
    switch (currentView) {
      case "inbox":
        return "Inbox"
      case "sent":
        return "Sent"
      case "starred":
        return "Starred"
      case "drafts":
        return "Drafts"
      case "all":
        return "All Mail"
      default:
        return "Inbox"
    }
  }

  // Show loading if user is not available yet
  if (!user) {
    return (
      <div className="flex-1 bg-white rounded-xl mx-5 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-white rounded-xl mx-5">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-gray-700 py-2">
          <div className="flex items-center gap-1">
            <MdCropSquare size={"20px"} />
            <FaCaretDown size={"20px"} />
          </div>
          <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            <IoMdRefresh size={"20px"} />
          </div>
          <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            <IoMdMore size={"20px"} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500">
            {getEmailCount() > 0 ? `1-${Math.min(50, getEmailCount())} of ${getEmailCount()}` : "0 emails"}
          </p>
          <button disabled={false} className="hover:rounded-full hover:bg-gray-100">
            <MdKeyboardArrowLeft size={"24px"} />
          </button>
          <button disabled={false} className="hover:rounded-full hover:bg-gray-100">
            <MdKeyboardArrowRight size={"24px"} />
          </button>
        </div>
      </div>

      <div className="h-[90vh] overflow-y-auto">
        {/* Show mail type tabs only for inbox and non-guest users */}
        {currentView === "inbox" && !user.isGuest && (
          <div className="flex items-center gap-1">
            {mailType.map((item, index) => (
              <button
                key={index}
                className={`flex items-center gap-5 p-4 ${mailTypeSelected === index ? "border-b-4 border-b-blue-600 text-blue-600" : "border-b-4 border-b-transparent"} w-52 hover:bg-gray-100`}
                onClick={() => {
                  setMailTypeSelected(index)
                }}
              >
                {item.icon}
                <span>{item.text}</span>
              </button>
            ))}
          </div>
        )}

        {/* View Title */}
        <div className="px-4 py-2 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800">{getViewTitle()}</h2>
            {user.isGuest && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Guest Mode</span>
            )}
          </div>
        </div>

        <Messages />
      </div>
    </div>
  )
}

export default Inbox


///

// "use client"

// import { useState } from "react"
// import { MdCropSquare } from "react-icons/md"
// import { FaCaretDown, FaUserFriends } from "react-icons/fa"
// import { IoMdRefresh, IoMdMore } from "react-icons/io"
// import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdInbox } from "react-icons/md"
// import { GoTag } from "react-icons/go"
// import Messages from "./Messages"
// import { useSelector } from "react-redux"

// const mailType = [
//   {
//     icon: <MdInbox size={"20px"} />,
//     text: "Primary",
//   },
//   {
//     icon: <GoTag size={"20px"} />,
//     text: "Promotions",
//   },
//   {
//     icon: <FaUserFriends size={"20px"} />,
//     text: "Social",
//   },
// ]

// const Inbox = () => {
//   const [mailTypeSelected, setMailTypeSelected] = useState(0)
//   const { currentView } = useSelector((store) => store.appSlice)
//   const { emails } = useSelector((store) => store.email)
//   const { user } = useSelector((store) => store.auth)

//   // Get filtered emails count based on current view
//   const getEmailCount = () => {
//     if (!emails || !user?.email) return 0

//     switch (currentView) {
//       case "inbox":
//         return emails.filter((email) => email.to === user.email).length
//       case "sent":
//         return emails.filter((email) => email.from === user.email).length
//       case "starred":
//         return emails.filter((email) => (email.to === user.email || email.from === user.email) && email.starred).length
//       default:
//         return emails.filter((email) => email.to === user.email).length
//     }
//   }

//   const getViewTitle = () => {
//     switch (currentView) {
//       case "inbox":
//         return "Inbox"
//       case "sent":
//         return "Sent"
//       case "starred":
//         return "Starred"
//       case "drafts":
//         return "Drafts"
//       case "all":
//         return "All Mail"
//       default:
//         return "Inbox"
//     }
//   }

//   // Show loading if user is not available yet
//   if (!user) {
//     return (
//       <div className="flex-1 bg-white rounded-xl mx-5 flex items-center justify-center">
//         <div className="flex items-center gap-3">
//           <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
//           <span className="text-gray-600">Loading...</span>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex-1 bg-white rounded-xl mx-5">
//       <div className="flex items-center justify-between px-4">
//         <div className="flex items-center gap-2 text-gray-700 py-2">
//           <div className="flex items-center gap-1">
//             <MdCropSquare size={"20px"} />
//             <FaCaretDown size={"20px"} />
//           </div>
//           <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
//             <IoMdRefresh size={"20px"} />
//           </div>
//           <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
//             <IoMdMore size={"20px"} />
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <p className="text-sm text-gray-500">
//             {getEmailCount() > 0 ? `1-${Math.min(50, getEmailCount())} of ${getEmailCount()}` : "0 emails"}
//           </p>
//           <button disabled={false} className="hover:rounded-full hover:bg-gray-100">
//             <MdKeyboardArrowLeft size={"24px"} />
//           </button>
//           <button disabled={false} className="hover:rounded-full hover:bg-gray-100">
//             <MdKeyboardArrowRight size={"24px"} />
//           </button>
//         </div>
//       </div>

//       <div className="h-[90vh] overflow-y-auto">
//         {/* Show mail type tabs only for inbox and non-guest users */}
//         {currentView === "inbox" && !user.isGuest && (
//           <div className="flex items-center gap-1">
//             {mailType.map((item, index) => (
//               <button
//                 key={index}
//                 className={`flex items-center gap-5 p-4 ${mailTypeSelected === index ? "border-b-4 border-b-blue-600 text-blue-600" : "border-b-4 border-b-transparent"} w-52 hover:bg-gray-100`}
//                 onClick={() => {
//                   setMailTypeSelected(index)
//                 }}
//               >
//                 {item.icon}
//                 <span>{item.text}</span>
//               </button>
//             ))}
//           </div>
//         )}

//         {/* View Title */}
//         <div className="px-4 py-2 border-b">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-medium text-gray-800">{getViewTitle()}</h2>
//             {user.isGuest && (
//               <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Guest Mode</span>
//             )}
//           </div>
//         </div>

//         <Messages />
//       </div>
//     </div>
//   )
// }

// export default Inbox
