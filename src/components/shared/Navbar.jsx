"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { GiHamburgerMenu } from "react-icons/gi"
import { IoIosSearch } from "react-icons/io"
import { CiCircleQuestion } from "react-icons/ci"
import { CiSettings } from "react-icons/ci"
import { PiDotsNineBold } from "react-icons/pi"
import Avatar from "react-avatar"
import ProfilePopup from "./ProfilePopup"
import UserProfile from "./UserProfile"

const Navbar = () => {
  const { user } = useSelector((state) => state.auth)
  const [showProfilePopup, setShowProfilePopup] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)

  // Debug logs
  useEffect(() => {
    console.log("Navbar - showProfilePopup:", showProfilePopup)
    console.log("Navbar - user:", user)
  }, [showProfilePopup, user])

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfilePopup && !event.target.closest(".profile-popup-container")) {
        console.log("Clicking outside, closing popup")
        setShowProfilePopup(false)
      }
    }

    if (showProfilePopup) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showProfilePopup])

  const handleProfileClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Profile clicked, current state:", showProfilePopup)
    setShowProfilePopup(!showProfilePopup)
  }

  const handleOpenProfile = () => {
    console.log("Opening user profile")
    setShowUserProfile(true)
    setShowProfilePopup(false)
  }

  const handleCloseProfile = () => {
    setShowUserProfile(false)
  }

  const handleClosePopup = () => {
    console.log("Closing popup")
    setShowProfilePopup(false)
  }

  return (
    <>
      <div className="flex items-center justify-between mx-3 h-16 relative">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="p-3 rounded-full hover:bg-gray-100 cursor-pointer">
              <GiHamburgerMenu size={"20px"} />
            </div>
            <img
              className="w-8"
              src="data:image/png;base64,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"
              alt=""
            />
            <h1 className="text-2xl text-gray-500 font-medium">Mail Hub</h1>
          </div>
        </div>

        <div className="md:block hidden w-[50%] mr-60">
          <div className="flex items-center bg-[#EAF1FB] px-2 py-3 rounded-full">
            <IoIosSearch size={"24px"} className="text-gray-700" />
            <input
              type="text"
              placeholder="Search mail"
              className="rounded-full w-full bg-transparent outline-none px-1"
            />
          </div>
        </div>

        <div className="md:block hidden">
          <div className="flex items-center gap-2">
            <div className="p-3 rounded-full hover:bg-gray-100 cursor-pointer">
              <CiCircleQuestion size={"20px"} />
            </div>
            <div className="p-3 rounded-full hover:bg-gray-100 cursor-pointer">
              <CiSettings size={"20px"} />
            </div>
            <div className="p-3 rounded-full hover:bg-gray-100 cursor-pointer">
              <PiDotsNineBold size={"20px"} />
            </div>

            {/* Profile Avatar with Popup */}
            <div className="relative profile-popup-container">
              <div className="cursor-pointer p-1 rounded-full hover:bg-gray-100" onClick={handleProfileClick}>
                <Avatar
                  src={user?.photoURL || ""}
                  name={user?.displayName || user?.email || "User"}
                  size="40"
                  round={true}
                />
              </div>

              {/* Profile Popup */}
              {showProfilePopup && (
                <div className="absolute top-14 right-0 z-[9999] min-w-max">
                  <ProfilePopup onClose={handleClosePopup} onOpenProfile={handleOpenProfile} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      {showUserProfile && <UserProfile isOpen={showUserProfile} onClose={handleCloseProfile} />}
    </>
  )
}

export default Navbar




// "use client"

// import { useState, useEffect } from "react"
// import { useSelector } from "react-redux"
// import { GiHamburgerMenu } from "react-icons/gi"
// import { IoIosSearch } from "react-icons/io"
// import { CiCircleQuestion } from "react-icons/ci"
// import { CiSettings } from "react-icons/ci"
// import { PiDotsNineBold } from "react-icons/pi"
// import Avatar from "react-avatar"
// import ProfilePopup from "./ProfilePopup"
// import UserProfile from "./UserProfile"

// const Navbar = () => {
//   const { user } = useSelector((state) => state.auth)
//   const [showProfilePopup, setShowProfilePopup] = useState(false)
//   const [showUserProfile, setShowUserProfile] = useState(false)

//   // Debug logs
//   useEffect(() => {
//     console.log("Navbar - showProfilePopup:", showProfilePopup)
//     console.log("Navbar - user:", user)
//   }, [showProfilePopup, user])

//   // Close popup when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showProfilePopup && !event.target.closest(".profile-popup-container")) {
//         console.log("Clicking outside, closing popup")
//         setShowProfilePopup(false)
//       }
//     }

//     if (showProfilePopup) {
//       document.addEventListener("mousedown", handleClickOutside)
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [showProfilePopup])

//   const handleProfileClick = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//     console.log("Profile clicked, current state:", showProfilePopup)
//     setShowProfilePopup(!showProfilePopup)
//   }

//   const handleOpenProfile = () => {
//     console.log("Opening user profile")
//     setShowUserProfile(true)
//     setShowProfilePopup(false)
//   }

//   const handleCloseProfile = () => {
//     setShowUserProfile(false)
//   }

//   const handleClosePopup = () => {
//     console.log("Closing popup")
//     setShowProfilePopup(false)
//   }

//   return (
//     <>
//       <div className="flex items-center justify-between mx-3 h-16 relative">
//         <div className="flex items-center gap-10">
//           <div className="flex items-center gap-2">
//             <div className="p-3 rounded-full hover:bg-gray-100 cursor-pointer">
//               <GiHamburgerMenu size={"20px"} />
//             </div>
//             <img
//               className="w-8"
//               src="data:image/png;base64,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"
//               alt=""
//             />
//             <h1 className="text-2xl text-gray-500 font-medium">Mail Hub</h1>
//           </div>
//         </div>

//         <div className="md:block hidden w-[50%] mr-60">
//           <div className="flex items-center bg-[#EAF1FB] px-2 py-3 rounded-full">
//             <IoIosSearch size={"24px"} className="text-gray-700" />
//             <input
//               type="text"
//               placeholder="Search mail"
//               className="rounded-full w-full bg-transparent outline-none px-1"
//             />
//           </div>
//         </div>

//         <div className="md:block hidden">
//           <div className="flex items-center gap-2">
//             <div className="p-3 rounded-full hover:bg-gray-100 cursor-pointer">
//               <CiCircleQuestion size={"20px"} />
//             </div>
//             <div className="p-3 rounded-full hover:bg-gray-100 cursor-pointer">
//               <CiSettings size={"20px"} />
//             </div>
//             <div className="p-3 rounded-full hover:bg-gray-100 cursor-pointer">
//               <PiDotsNineBold size={"20px"} />
//             </div>

//             {/* Profile Avatar with Popup */}
//             <div className="relative profile-popup-container">
//               <div className="cursor-pointer p-1 rounded-full hover:bg-gray-100" onClick={handleProfileClick}>
//                 <Avatar
//                   src={user?.photoURL || ""}
//                   name={user?.displayName || user?.email || "User"}
//                   size="40"
//                   round={true}
//                 />
//               </div>

//               {/* Profile Popup */}
//               {showProfilePopup && (
//                 <div className="absolute top-14 right-0 z-[9999] min-w-max">
//                   <ProfilePopup onClose={handleClosePopup} onOpenProfile={handleOpenProfile} />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* User Profile Modal */}
//       {showUserProfile && <UserProfile isOpen={showUserProfile} onClose={handleCloseProfile} />}
//     </>
//   )
// }

// export default Navbar
