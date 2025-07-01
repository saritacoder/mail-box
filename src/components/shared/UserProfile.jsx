"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUser, setError, setLoading, clearError } from "../../redux/authSlice"
import { MdArrowBack, MdCancel } from "react-icons/md"
import { FiUser, FiPhone, FiImage, FiCalendar, FiClock } from "react-icons/fi"
import Avatar from "react-avatar"

const UserProfile = ({ isOpen, onClose }) => {
  console.log("UserProfile component rendered, isOpen:", isOpen)
  const dispatch = useDispatch()
  const { user, loading, error } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    displayName: "",
    phoneNumber: "",
    photoURL: "",
  })
  const [editingField, setEditingField] = useState(null)
  const [tempValue, setTempValue] = useState("")

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        phoneNumber: user.phoneNumber || "",
        photoURL: user.photoURL || "",
      })
    }
  }, [user])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 3000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  const handleEdit = (field) => {
    setEditingField(field)
    setTempValue(formData[field])
  }

  const handleCancel = () => {
    setEditingField(null)
    setTempValue("")
  }

  const handleSave = async (field) => {
    if (!user?.uid) return

    const updatedData = {
      ...formData,
      [field]: tempValue,
    }

    setFormData(updatedData)
    setEditingField(null)

    try {
      dispatch(setLoading(true))

      // Update user data in database
      await fetch(`https://new--clone-cdaa6-default-rtdb.firebaseio.com/users/${user.uid}.json`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [field]: tempValue,
          lastUpdated: new Date().toISOString(),
        }),
      })

      // Update Redux state and localStorage immediately
      const updatedUser = {
        ...user,
        [field]: tempValue,
      }
      dispatch(setUser(updatedUser))
      localStorage.setItem("userData", JSON.stringify(updatedUser))

      dispatch(setError("✅ Profile updated successfully!"))
    } catch (error) {
      dispatch(setError("❌ Failed to update profile"))
    }

    dispatch(setLoading(false))
  }

  const handleSaveChanges = async () => {
    if (!user?.uid) return

    try {
      dispatch(setLoading(true))

      // Update all user data in database
      await fetch(`https://new--clone-cdaa6-default-rtdb.firebaseio.com/users/${user.uid}.json`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          lastUpdated: new Date().toISOString(),
        }),
      })

      // Update Redux state and localStorage immediately
      const updatedUser = {
        ...user,
        ...formData,
      }
      dispatch(setUser(updatedUser))
      localStorage.setItem("userData", JSON.stringify(updatedUser))

      dispatch(setError("✅ Profile updated successfully!"))
    } catch (error) {
      dispatch(setError("❌ Failed to update profile"))
    }

    dispatch(setLoading(false))
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not available"
    return new Date(dateString).toLocaleString()
  }

  if (!isOpen) {
    console.log("UserProfile not open, returning null")
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-teal-400 via-blue-500 to-pink-500 overflow-y-auto">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-start justify-center p-4 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 w-full max-w-lg p-6 my-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MdArrowBack size={24} className="text-gray-600" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
              <p className="text-gray-600 text-sm">Manage your account information</p>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="text-center mb-6">
            <Avatar
              src={formData.photoURL || user?.photoURL}
              name={formData.displayName || user?.displayName || user?.email}
              size="80"
              round={true}
              className="mx-auto mb-3"
            />
            <p className="text-gray-700 font-medium">{user?.email}</p>
          </div>

          {error && (
            <div
              className={`mb-4 p-3 border rounded-lg ${
                error.includes("successfully") || error.includes("✅")
                  ? "bg-green-100 border-green-400 text-green-700"
                  : "bg-red-100 border-red-400 text-red-700"
              }`}
            >
              {error}
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4 mb-6">
            {/* Display Name */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <FiUser className="text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Display Name</p>
                  {editingField === "displayName" ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="flex-1 p-1 border border-gray-300 rounded text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSave("displayName")}
                        className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                      >
                        Save
                      </button>
                      <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
                        <MdCancel size={16} />
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-800">{formData.displayName || "Not set"}</p>
                  )}
                </div>
              </div>
              {editingField !== "displayName" && (
                <button
                  onClick={() => handleEdit("displayName")}
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                >
                  Edit
                </button>
              )}
            </div>

            {/* Phone Number */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <FiPhone className="text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Phone Number</p>
                  {editingField === "phoneNumber" ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="tel"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="flex-1 p-1 border border-gray-300 rounded text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSave("phoneNumber")}
                        className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                      >
                        Save
                      </button>
                      <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
                        <MdCancel size={16} />
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-800">{formData.phoneNumber || "Not set"}</p>
                  )}
                </div>
              </div>
              {editingField !== "phoneNumber" && (
                <button
                  onClick={() => handleEdit("phoneNumber")}
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                >
                  Edit
                </button>
              )}
            </div>

            {/* Photo URL */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <FiImage className="text-gray-500" />
                <p className="text-sm text-gray-500">Photo URL</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={formData.photoURL}
                  onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
                  placeholder="Enter photo URL"
                  className="flex-1 p-2 border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={() => setFormData({ ...formData, photoURL: "" })}
                  className="text-pink-600 hover:text-pink-700 text-sm font-medium"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <FiCalendar className="text-gray-500" size={16} />
                <p className="text-sm text-gray-500">Account Created</p>
              </div>
              <p className="text-xs text-gray-700">{formatDate(user?.createdAt)}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <FiClock className="text-gray-500" size={16} />
                <p className="text-sm text-gray-500">Last Login</p>
              </div>
              <p className="text-xs text-gray-700">{formatDate(user?.lastLogin)}</p>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveChanges}
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-pink-500 text-white p-3 rounded-lg font-medium hover:from-teal-600 hover:to-pink-600 transition-all disabled:opacity-50"
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserProfile




// "use client"

// import { useState, useEffect } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { setUser, setError, setLoading, clearError } from "../../redux/authSlice"
// import { MdArrowBack, MdCancel } from "react-icons/md"
// import { FiUser, FiPhone, FiImage, FiCalendar, FiClock } from "react-icons/fi"
// import Avatar from "react-avatar"

// const UserProfile = ({ isOpen, onClose }) => {
//   console.log("UserProfile component rendered, isOpen:", isOpen)
//   const dispatch = useDispatch()
//   const { user, loading, error } = useSelector((state) => state.auth)

//   const [formData, setFormData] = useState({
//     displayName: "",
//     phoneNumber: "",
//     photoURL: "",
//   })
//   const [editingField, setEditingField] = useState(null)
//   const [tempValue, setTempValue] = useState("")

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         displayName: user.displayName || "",
//         phoneNumber: user.phoneNumber || "",
//         photoURL: user.photoURL || "",
//       })
//     }
//   }, [user])

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => dispatch(clearError()), 3000)
//       return () => clearTimeout(timer)
//     }
//   }, [error, dispatch])

//   const handleEdit = (field) => {
//     setEditingField(field)
//     setTempValue(formData[field])
//   }

//   const handleCancel = () => {
//     setEditingField(null)
//     setTempValue("")
//   }

//   const handleSave = async (field) => {
//     if (!user?.uid) return

//     const updatedData = {
//       ...formData,
//       [field]: tempValue,
//     }

//     setFormData(updatedData)
//     setEditingField(null)

//     try {
//       dispatch(setLoading(true))

//       // Update user data in database
//       await fetch(`https://new--clone-cdaa6-default-rtdb.firebaseio.com/users/${user.uid}.json`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           [field]: tempValue,
//           lastUpdated: new Date().toISOString(),
//         }),
//       })

//       // Update Redux state and localStorage immediately
//       const updatedUser = {
//         ...user,
//         [field]: tempValue,
//       }
//       dispatch(setUser(updatedUser))
//       localStorage.setItem("userData", JSON.stringify(updatedUser))

//       dispatch(setError("✅ Profile updated successfully!"))
//     } catch (error) {
//       dispatch(setError("❌ Failed to update profile"))
//     }

//     dispatch(setLoading(false))
//   }

//   const handleSaveChanges = async () => {
//     if (!user?.uid) return

//     try {
//       dispatch(setLoading(true))

//       // Update all user data in database
//       await fetch(`https://new--clone-cdaa6-default-rtdb.firebaseio.com/users/${user.uid}.json`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...formData,
//           lastUpdated: new Date().toISOString(),
//         }),
//       })

//       // Update Redux state and localStorage immediately
//       const updatedUser = {
//         ...user,
//         ...formData,
//       }
//       dispatch(setUser(updatedUser))
//       localStorage.setItem("userData", JSON.stringify(updatedUser))

//       dispatch(setError("✅ Profile updated successfully!"))
//     } catch (error) {
//       dispatch(setError("❌ Failed to update profile"))
//     }

//     dispatch(setLoading(false))
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return "Not available"
//     return new Date(dateString).toLocaleString()
//   }

//   if (!isOpen) {
//     console.log("UserProfile not open, returning null")
//     return null
//   }

//   return (
//     <div className="fixed inset-0 z-50 bg-gradient-to-br from-teal-400 via-blue-500 to-pink-500 overflow-y-auto">
//       {/* Background Animation */}
//       <div className="absolute inset-0 opacity-30">
//         <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
//         <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
//         <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
//       </div>

//       {/* Content */}
//       <div className="relative z-10 min-h-screen flex items-start justify-center p-4 py-8">
//         <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 w-full max-w-lg p-6 my-8">
//           {/* Header */}
//           <div className="flex items-center gap-4 mb-6">
//             <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//               <MdArrowBack size={24} className="text-gray-600" />
//             </button>
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
//               <p className="text-gray-600 text-sm">Manage your account information</p>
//             </div>
//           </div>

//           {/* Profile Picture */}
//           <div className="text-center mb-6">
//             <Avatar
//               src={formData.photoURL || user?.photoURL}
//               name={formData.displayName || user?.displayName || user?.email}
//               size="80"
//               round={true}
//               className="mx-auto mb-3"
//             />
//             <p className="text-gray-700 font-medium">{user?.email}</p>
//           </div>

//           {error && (
//             <div
//               className={`mb-4 p-3 border rounded-lg ${
//                 error.includes("successfully") || error.includes("✅")
//                   ? "bg-green-100 border-green-400 text-green-700"
//                   : "bg-red-100 border-red-400 text-red-700"
//               }`}
//             >
//               {error}
//             </div>
//           )}

//           {/* Form Fields */}
//           <div className="space-y-4 mb-6">
//             {/* Display Name */}
//             <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//               <div className="flex items-center gap-3 flex-1">
//                 <FiUser className="text-gray-500" />
//                 <div className="flex-1">
//                   <p className="text-sm text-gray-500">Display Name</p>
//                   {editingField === "displayName" ? (
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="text"
//                         value={tempValue}
//                         onChange={(e) => setTempValue(e.target.value)}
//                         className="flex-1 p-1 border border-gray-300 rounded text-sm"
//                         autoFocus
//                       />
//                       <button
//                         onClick={() => handleSave("displayName")}
//                         className="text-teal-600 hover:text-teal-700 text-sm font-medium"
//                       >
//                         Save
//                       </button>
//                       <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
//                         <MdCancel size={16} />
//                       </button>
//                     </div>
//                   ) : (
//                     <p className="text-gray-800">{formData.displayName || "Not set"}</p>
//                   )}
//                 </div>
//               </div>
//               {editingField !== "displayName" && (
//                 <button
//                   onClick={() => handleEdit("displayName")}
//                   className="text-teal-600 hover:text-teal-700 text-sm font-medium"
//                 >
//                   Edit
//                 </button>
//               )}
//             </div>

//             {/* Phone Number */}
//             <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//               <div className="flex items-center gap-3 flex-1">
//                 <FiPhone className="text-gray-500" />
//                 <div className="flex-1">
//                   <p className="text-sm text-gray-500">Phone Number</p>
//                   {editingField === "phoneNumber" ? (
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="tel"
//                         value={tempValue}
//                         onChange={(e) => setTempValue(e.target.value)}
//                         className="flex-1 p-1 border border-gray-300 rounded text-sm"
//                         autoFocus
//                       />
//                       <button
//                         onClick={() => handleSave("phoneNumber")}
//                         className="text-teal-600 hover:text-teal-700 text-sm font-medium"
//                       >
//                         Save
//                       </button>
//                       <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
//                         <MdCancel size={16} />
//                       </button>
//                     </div>
//                   ) : (
//                     <p className="text-gray-800">{formData.phoneNumber || "Not set"}</p>
//                   )}
//                 </div>
//               </div>
//               {editingField !== "phoneNumber" && (
//                 <button
//                   onClick={() => handleEdit("phoneNumber")}
//                   className="text-teal-600 hover:text-teal-700 text-sm font-medium"
//                 >
//                   Edit
//                 </button>
//               )}
//             </div>

//             {/* Photo URL */}
//             <div className="p-3 bg-gray-50 rounded-lg">
//               <div className="flex items-center gap-3 mb-2">
//                 <FiImage className="text-gray-500" />
//                 <p className="text-sm text-gray-500">Photo URL</p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <input
//                   type="url"
//                   value={formData.photoURL}
//                   onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
//                   placeholder="Enter photo URL"
//                   className="flex-1 p-2 border border-gray-300 rounded text-sm"
//                 />
//                 <button
//                   onClick={() => setFormData({ ...formData, photoURL: "" })}
//                   className="text-pink-600 hover:text-pink-700 text-sm font-medium"
//                 >
//                   Clear
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Account Info */}
//           <div className="grid grid-cols-2 gap-4 mb-6">
//             <div className="p-3 bg-gray-50 rounded-lg">
//               <div className="flex items-center gap-2 mb-1">
//                 <FiCalendar className="text-gray-500" size={16} />
//                 <p className="text-sm text-gray-500">Account Created</p>
//               </div>
//               <p className="text-xs text-gray-700">{formatDate(user?.createdAt)}</p>
//             </div>
//             <div className="p-3 bg-gray-50 rounded-lg">
//               <div className="flex items-center gap-2 mb-1">
//                 <FiClock className="text-gray-500" size={16} />
//                 <p className="text-sm text-gray-500">Last Login</p>
//               </div>
//               <p className="text-xs text-gray-700">{formatDate(user?.lastLogin)}</p>
//             </div>
//           </div>

//           {/* Save Button */}
//           <button
//             onClick={handleSaveChanges}
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-teal-500 to-pink-500 text-white p-3 rounded-lg font-medium hover:from-teal-600 hover:to-pink-600 transition-all disabled:opacity-50"
//           >
//             {loading ? "Saving Changes..." : "Save Changes"}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default UserProfile
