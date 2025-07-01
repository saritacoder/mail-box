"use client"

import { useState, useEffect } from "react"
import { LuPencil } from "react-icons/lu"
import {
  MdInbox,
  MdOutlineWatchLater,
  MdOutlineDrafts,
  MdExpandMore,
  MdExpandLess,
  MdDelete,
  MdOutlineMail,
} from "react-icons/md"
import { IoMdStar } from "react-icons/io"
import { TbSend2 } from "react-icons/tb"
import { BiLabel } from "react-icons/bi"
import { PiChatsBold } from "react-icons/pi"
import { RiSpam2Line } from "react-icons/ri"
import { MdOutlineLabel } from "react-icons/md"
import { MdAdd } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { setOpen, setCurrentView } from "../../redux/appSlice"

const mainItems = [
  { icon: <MdInbox size="20px" />, text: "Inbox", view: "inbox" },
  { icon: <IoMdStar size="20px" />, text: "Starred", view: "starred" },
  { icon: <MdOutlineWatchLater size="20px" />, text: "Snoozed", view: "snoozed" },
  { icon: <TbSend2 size="20px" />, text: "Sent", view: "sent" },
  { icon: <MdOutlineDrafts size="20px" />, text: "Drafts", view: "drafts" },
]

const moreItems = [
  { icon: <BiLabel size="20px" />, text: "Important", view: "important" },
  { icon: <PiChatsBold size="20px" />, text: "Chats", view: "chats" },
  { icon: <MdOutlineMail size="20px" />, text: "All Mail", view: "all" },
  { icon: <RiSpam2Line size="20px" />, text: <strong>Spam</strong>, view: "spam" },
  { icon: <MdDelete size="20px" />, text: "Bin", view: "bin" },
  { icon: <MdOutlineLabel size="20px" />, text: <strong>Categories</strong>, view: "categories" },
  { icon: <MdAdd size="20px" />, text: "Create new label", view: "create-label" },
]

const Sidebar = () => {
  const [showMore, setShowMore] = useState(false)
  const [animatedItems, setAnimatedItems] = useState([])
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const dispatch = useDispatch()
  const { currentView, unreadCount } = useSelector((store) => store.appSlice)

  const toggleMore = () => setShowMore((prev) => !prev)

  const handleItemClick = (view) => {
    dispatch(setCurrentView(view))
  }

  // Animation effect for first load only
  useEffect(() => {
    if (isInitialLoad) {
      const allItems = [...mainItems, ...(showMore ? moreItems : [])]

      // Reset animated items
      setAnimatedItems([])

      // Animate items one by one with slower timing
      allItems.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedItems((prev) => [...prev, index])
        }, index * 300) // Increased from 150ms to 300ms for slower animation
      })

      // Mark initial load as complete after all animations
      setTimeout(
        () => {
          setIsInitialLoad(false)
        },
        allItems.length * 300 + 500,
      )
    } else {
      // For subsequent changes (like More/Less), show items immediately
      const allItems = [...mainItems, ...(showMore ? moreItems : [])]
      setAnimatedItems(allItems.map((_, index) => index))
    }
  }, [showMore, isInitialLoad])

  const renderItem = (item, index) => {
    const isAnimated = animatedItems.includes(index)

    return (
      <div
        key={index}
        onClick={() => handleItemClick(item.view)}
        className={`flex items-center justify-between pl-4 py-1 rounded-r-full hover:cursor-pointer hover:bg-gray-200 my-1 transition-all duration-500 transform ${
          currentView === item.view ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-600 hover:text-gray-800"
        } ${isAnimated ? "translate-x-0 opacity-100" : "translate-x-[-30px] opacity-0"}`}
        style={{
          transitionDelay: isInitialLoad && !isAnimated ? `${index * 300}ms` : "0ms",
        }}
      >
        <div className="flex items-center gap-2">
          {item.icon}
          <p>{item.text}</p>
        </div>
        {item.view === "inbox" && unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 mr-4 min-w-[20px] text-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="w-[20%] min-w-[180px]">
      <div className="p-3">
        <button
          onClick={() => dispatch(setOpen(true))}
          className="flex items-center gap-2 p-4 rounded-2xl hover:shadow-md bg-[#C2E7FF] transition-all duration-300 transform hover:scale-105"
        >
          <LuPencil size="20px" />
          Compose
        </button>
      </div>

      <div className="text-gray-600 text-sm">
        {[...mainItems, ...(showMore ? moreItems : [])].map((item, index) => renderItem(item, index))}

        <div
          onClick={toggleMore}
          className="flex items-center gap-2 pl-4 py-1 rounded-r-full hover:cursor-pointer hover:bg-gray-200 my-1 text-gray-600 hover:text-gray-800 transition-colors"
        >
          {showMore ? <MdExpandLess size="20px" /> : <MdExpandMore size="20px" />}
          <p>{showMore ? "Less" : "More"}</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar




// "use client"

// import { useState, useEffect } from "react"
// import { useNavigate, useLocation } from "react-router-dom"
// import { LuPencil } from "react-icons/lu"
// import {
//   MdInbox,
//   MdOutlineWatchLater,
//   MdOutlineDrafts,
//   MdExpandMore,
//   MdExpandLess,
//   MdDelete,
//   MdOutlineMail,
// } from "react-icons/md"
// import { IoMdStar } from "react-icons/io"
// import { TbSend2 } from "react-icons/tb"
// import { BiLabel } from "react-icons/bi"
// import { PiChatsBold } from "react-icons/pi"
// import { RiSpam2Line } from "react-icons/ri"
// import { MdOutlineLabel } from "react-icons/md"
// import { MdAdd } from "react-icons/md"
// import { useDispatch, useSelector } from "react-redux"
// import { setOpen, setCurrentView } from "../../redux/appSlice"

// const mainItems = [
//   { icon: <MdInbox size="20px" />, text: "Inbox", view: "inbox", path: "/inbox" },
//   { icon: <IoMdStar size="20px" />, text: "Starred", view: "starred", path: "/starred" },
//   { icon: <MdOutlineWatchLater size="20px" />, text: "Snoozed", view: "snoozed", path: "/snoozed" },
//   { icon: <TbSend2 size="20px" />, text: "Sent", view: "sent", path: "/sent" },
//   { icon: <MdOutlineDrafts size="20px" />, text: "Drafts", view: "drafts", path: "/drafts" },
//   { icon: <MdDelete size="20px" />, text: "Trash", view: "trash", path: "/trash" },
//   { icon: <MdOutlineMail size="20px" />, text: "All Mail", view: "all", path: "/all" },
// ]

// const moreItems = [
//   { icon: <BiLabel size="20px" />, text: "Important", view: "important", path: "/important" },
//   { icon: <PiChatsBold size="20px" />, text: "Chats", view: "chats", path: "/chats" },
//   { icon: <RiSpam2Line size="20px" />, text: <strong>Spam</strong>, view: "spam", path: "/spam" },
//   { icon: <MdOutlineLabel size="20px" />, text: <strong>Categories</strong>, view: "categories", path: "/categories" },
//   { icon: <MdAdd size="20px" />, text: "Create new label", view: "create-label", path: "/create-label" },
// ]

// const Sidebar = () => {
//   const [showMore, setShowMore] = useState(false)
//   const [animatedItems, setAnimatedItems] = useState([])
//   const [isInitialLoad, setIsInitialLoad] = useState(true)
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const location = useLocation()
//   const { currentView, unreadCount } = useSelector((store) => store.appSlice)

//   const toggleMore = () => setShowMore((prev) => !prev)

//   // Update current view based on URL
//   useEffect(() => {
//     const path = location.pathname
//     const item = [...mainItems, ...moreItems].find((item) => item.path === path)
//     if (item) {
//       dispatch(setCurrentView(item.view))
//     } else if (path === "/" || path === "/inbox") {
//       dispatch(setCurrentView("inbox"))
//     }
//   }, [location.pathname, dispatch])

//   const handleItemClick = (view, path) => {
//     dispatch(setCurrentView(view))
//     navigate(path)
//   }

//   // Animation effect for first load only
//   useEffect(() => {
//     if (isInitialLoad) {
//       const allItems = [...mainItems, ...(showMore ? moreItems : [])]

//       // Reset animated items
//       setAnimatedItems([])

//       // Animate items one by one with slower timing
//       allItems.forEach((_, index) => {
//         setTimeout(() => {
//           setAnimatedItems((prev) => [...prev, index])
//         }, index * 300) // Increased from 150ms to 300ms for slower animation
//       })

//       // Mark initial load as complete after all animations
//       setTimeout(
//         () => {
//           setIsInitialLoad(false)
//         },
//         allItems.length * 300 + 500,
//       )
//     } else {
//       // For subsequent changes (like More/Less), show items immediately
//       const allItems = [...mainItems, ...(showMore ? moreItems : [])]
//       setAnimatedItems(allItems.map((_, index) => index))
//     }
//   }, [showMore, isInitialLoad])

//   const renderItem = (item, index) => {
//     const isAnimated = animatedItems.includes(index)
//     const isActive =
//       currentView === item.view || (item.view === "inbox" && (currentView === "inbox" || location.pathname === "/"))

//     return (
//       <div
//         key={index}
//         onClick={() => handleItemClick(item.view, item.path)}
//         className={`flex items-center justify-between pl-4 py-1 rounded-r-full hover:cursor-pointer hover:bg-gray-200 my-1 transition-all duration-500 transform ${
//           isActive ? "bg-red-100 text-red-600 font-medium" : "text-gray-600 hover:text-gray-800"
//         } ${isAnimated ? "translate-x-0 opacity-100" : "translate-x-[-30px] opacity-0"}`}
//         style={{
//           transitionDelay: isInitialLoad && !isAnimated ? `${index * 300}ms` : "0ms",
//         }}
//       >
//         <div className="flex items-center gap-2">
//           {item.icon}
//           <p>{item.text}</p>
//         </div>
//         {item.view === "inbox" && unreadCount > 0 && (
//           <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 mr-4 min-w-[20px] text-center animate-pulse">
//             {unreadCount}
//           </span>
//         )}
//       </div>
//     )
//   }

//   return (
//     <div className="w-[20%] min-w-[180px]">
//       <div className="p-3">
//         <button
//           onClick={() => dispatch(setOpen(true))}
//           className="flex items-center gap-2 p-4 rounded-2xl hover:shadow-md bg-[#C2E7FF] transition-all duration-300 transform hover:scale-105"
//         >
//           <LuPencil size="20px" />
//           Compose
//         </button>
//       </div>

//       <div className="text-gray-600 text-sm">
//         {[...mainItems, ...(showMore ? moreItems : [])].map((item, index) => renderItem(item, index))}

//         <div
//           onClick={toggleMore}
//           className="flex items-center gap-2 pl-4 py-1 rounded-r-full hover:cursor-pointer hover:bg-gray-200 my-1 text-gray-600 hover:text-gray-800 transition-colors"
//         >
//           {showMore ? <MdExpandLess size="20px" /> : <MdExpandMore size="20px" />}
//           <p>{showMore ? "Less" : "More"}</p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Sidebar
