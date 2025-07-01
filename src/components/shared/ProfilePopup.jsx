"use client"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../redux/authSlice"
import { RxCross2 } from "react-icons/rx"

const ProfilePopup = ({ onClose, onOpenProfile }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  console.log("ProfilePopup rendered, user:", user) // Debug log

  const handleLogout = async () => {
    console.log("Logout clicked")
    try {
      // Update last logout time in database
      if (user?.uid) {
        await fetch(`https://new--clone-cdaa6-default-rtdb.firebaseio.com/users/${user.uid}.json`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lastLogout: new Date().toISOString(),
          }),
        })
      }

      // Clear local storage first
      localStorage.removeItem("authToken")
      localStorage.removeItem("userData")

      // Then dispatch logout action
      dispatch(logout())

      // Close popup
      onClose()

      console.log("Logout completed")
    } catch (error) {
      console.error("Logout error:", error)
      // Still logout even if database update fails
      localStorage.removeItem("authToken")
      localStorage.removeItem("userData")
      dispatch(logout())
      onClose()
    }
  }

  const handleUserProfile = () => {
    console.log("User Profile clicked")
    onOpenProfile()
  }

  return (
    <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-64 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="text-lg font-medium text-gray-800">Options</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <RxCross2 size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Options */}
      <div className="p-2">
        {/* User Profile Button */}
        <button
          onClick={handleUserProfile}
          className="w-full p-3 mb-2 bg-green-100 hover:bg-green-200 text-gray-800 rounded-lg transition-all duration-200 text-center font-medium"
        >
          User Profile
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full p-3 bg-red-100 hover:bg-red-200 text-gray-800 rounded-lg transition-all duration-200 text-center font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default ProfilePopup



// "use client"
// import { useDispatch, useSelector } from "react-redux"
// import { logout } from "../../redux/authSlice"
// import { RxCross2 } from "react-icons/rx"

// const ProfilePopup = ({ onClose, onOpenProfile }) => {
//   const dispatch = useDispatch()
//   const { user } = useSelector((state) => state.auth)

//   console.log("ProfilePopup rendered, user:", user) // Debug log

//   const handleLogout = async () => {
//     console.log("Logout clicked")
//     try {
//       // Update last logout time in database
//       if (user?.uid) {
//         await fetch(`https://new--clone-cdaa6-default-rtdb.firebaseio.com/users/${user.uid}.json`, {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             lastLogout: new Date().toISOString(),
//           }),
//         })
//       }

//       // Clear local storage first
//       localStorage.removeItem("authToken")
//       localStorage.removeItem("userData")

//       // Then dispatch logout action
//       dispatch(logout())

//       // Close popup
//       onClose()

//       console.log("Logout completed")
//     } catch (error) {
//       console.error("Logout error:", error)
//       // Still logout even if database update fails
//       localStorage.removeItem("authToken")
//       localStorage.removeItem("userData")
//       dispatch(logout())
//       onClose()
//     }
//   }

//   const handleUserProfile = () => {
//     console.log("User Profile clicked")
//     onOpenProfile()
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-64 overflow-hidden">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 border-b border-gray-100">
//         <h3 className="text-lg font-medium text-gray-800">Options</h3>
//         <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
//           <RxCross2 size={18} className="text-gray-600" />
//         </button>
//       </div>

//       {/* Options */}
//       <div className="p-2">
//         {/* User Profile Button */}
//         <button
//           onClick={handleUserProfile}
//           className="w-full p-3 mb-2 bg-green-100 hover:bg-green-200 text-gray-800 rounded-lg transition-all duration-200 text-center font-medium"
//         >
//           User Profile
//         </button>

//         {/* Logout Button */}
//         <button
//           onClick={handleLogout}
//           className="w-full p-3 bg-red-100 hover:bg-red-200 text-gray-800 rounded-lg transition-all duration-200 text-center font-medium"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   )
// }

// export default ProfilePopup
