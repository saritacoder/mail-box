"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUser, setToken, setError, setLoading, clearError } from "../../redux/authSlice"
import { FcGoogle } from "react-icons/fc"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

const Login = ({ onSwitchToSignup, onSwitchToForgot, onGuestLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.auth)

  useEffect(() => {
    // Check for signup credentials and auto-fill
    const signupEmail = localStorage.getItem("signupEmail")
    const signupPassword = localStorage.getItem("signupPassword")

    if (signupEmail && signupPassword) {
      setFormData({
        email: signupEmail,
        password: signupPassword,
      })

      // Clear the stored credentials after using them
      localStorage.removeItem("signupEmail")
      localStorage.removeItem("signupPassword")

      // Show success message
      dispatch(setError("Account created successfully! Please sign in with your credentials."))
      setTimeout(() => dispatch(clearError()), 4000)
    }
  }, [dispatch])

  useEffect(() => {
    // Clear error after 3 seconds (except for success message)
    if (error && !error.includes("successfully")) {
      const timer = setTimeout(() => dispatch(clearError()), 3000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    dispatch(setLoading(true))
    dispatch(clearError())

    try {
      // Sign in with Firebase REST API
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCp--eljk8cfqNbcZKM0D7Pc0Ndg3cQZ2g",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            returnSecureToken: true,
          }),
        },
      )

      const data = await response.json()

      if (response.ok) {
        // Store token
        dispatch(setToken(data.idToken))
        localStorage.setItem("authToken", data.idToken)

        // Get user data from Realtime Database
        const userResponse = await fetch(
          `https://new--clone-cdaa6-default-rtdb.firebaseio.com/users/${data.localId}.json`,
        )
        let userData = {}

        if (userResponse.ok) {
          const existingUserData = await userResponse.json()
          userData = existingUserData || {}
        }

        // Update last login
        const updatedUserData = {
          ...userData,
          email: formData.email,
          uid: data.localId,
          lastLogin: new Date().toISOString(),
        }

        // Save updated user data to database
        await fetch(`https://new--clone-cdaa6-default-rtdb.firebaseio.com/users/${data.localId}.json`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUserData),
        })

        // Update Redux state
        dispatch(setUser(updatedUserData))
        localStorage.setItem("userData", JSON.stringify(updatedUserData))
      } else {
        dispatch(setError(data.error?.message || "Login failed"))
      }
    } catch (error) {
      dispatch(setError("Network error: " + error.message))
    }

    dispatch(setLoading(false))
  }

  const handleGoogleLogin = async () => {
    dispatch(setLoading(true))
    dispatch(clearError())

    try {
      const { signInWithPopup } = await import("firebase/auth")
      const { auth, googleProvider } = await import("../../firebase")

      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      // Store token
      const token = await user.getIdToken()
      dispatch(setToken(token))
      localStorage.setItem("authToken", token)

      // Create user data for database
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString(),
      }

      // Check if user exists in database
      const userResponse = await fetch(`https://new--clone-cdaa6-default-rtdb.firebaseio.com/users/${user.uid}.json`)

      let existingUserData = {}
      if (userResponse.ok) {
        const data = await userResponse.json()
        existingUserData = data || {}
      }

      // Merge existing data with new login data
      const updatedUserData = {
        ...existingUserData,
        ...userData,
        createdAt: existingUserData.createdAt || new Date().toISOString(),
      }

      // Save user data to database
      await fetch(`https://new--clone-cdaa6-default-rtdb.firebaseio.com/users/${user.uid}.json`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserData),
      })

      // Update Redux state
      dispatch(setUser(updatedUserData))
      localStorage.setItem("userData", JSON.stringify(updatedUserData))
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        dispatch(setError("Google sign-in was cancelled"))
      } else if (error.code === "auth/popup-blocked") {
        dispatch(setError("Popup was blocked. Please allow popups and try again"))
      } else {
        dispatch(setError("Google sign-in failed: " + error.message))
      }
    }

    dispatch(setLoading(false))
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-white/20">
      {/* Gmail Logo */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          {/* Gmail Logo Icon */}
          <div className="relative">
            <svg width="32" height="24" viewBox="0 0 32 24" className="mr-1">
              <path fill="#4285f4" d="M2 6l10 8 10-8v12H2z" />
              <path fill="#34a853" d="M2 6l10 8V2z" />
              <path fill="#fbbc04" d="M22 6l-10 8V2z" />
              <path fill="#ea4335" d="M22 6l8-4v16H22z" />
              <path fill="#c5221f" d="M2 6L-6 2v16H2z" />
            </svg>
          </div>
          <span className="text-gray-700 text-xl font-normal">Gmail</span>
        </div>
        <h2 className="text-gray-800 text-lg font-medium">Login</h2>
      </div>

      {error && (
        <div
          className={`mb-4 p-2 border rounded text-xs ${
            error.includes("successfully")
              ? "bg-green-50 border-green-300 text-green-700"
              : "bg-red-50 border-red-300 text-red-700"
          }`}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 bg-transparent border border-gray-400 rounded text-gray-800 placeholder-gray-500 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 bg-transparent border border-gray-400 rounded text-gray-800 placeholder-gray-500 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showPassword ? <AiOutlineEyeInvisible size={16} /> : <AiOutlineEye size={16} />}
          </button>
        </div>

        {/* Forgot password link aligned to the right */}
        <div className="text-right">
          <button
            type="button"
            onClick={onSwitchToForgot}
            className="text-teal-600 hover:text-teal-700 text-xs transition-colors hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-teal-500 to-pink-500 hover:from-teal-600 hover:to-pink-600 text-white p-3 rounded text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Signing in...
            </div>
          ) : (
            "Login"
          )}
        </button>
      </form>

      {/* Sign up button styled like login button */}
      <div className="mt-4">
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="w-full bg-gradient-to-r from-teal-500 to-pink-500 hover:from-teal-600 hover:to-pink-600 text-white p-3 rounded text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Create an account
        </button>
      </div>

      <div className="mt-4">
        <div className="flex items-center mb-3">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-xs">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <FcGoogle size={16} />
          <span className="text-gray-700 text-xs font-medium">Continue with Google</span>
        </button>
      </div>

      {/* <div className="text-center mt-4">
        <button
          onClick={onGuestLogin}
          className="w-full bg-gradient-to-r from-teal-500 to-pink-500 hover:from-teal-600 hover:to-pink-600 text-white p-3 rounded text-xs font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Continue as Guest
        </button> */}
      {/* </div> */}
    </div>
  )
}

export default Login





// "use client"

// import { useState, useEffect } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { setUser, setToken, setError, setLoading, clearError } from "../../redux/authSlice"
// import { FcGoogle } from "react-icons/fc"
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

// const Login = ({ onSwitchToSignup, onSwitchToForgot, onGuestLogin }) => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   })
//   const [showPassword, setShowPassword] = useState(false)

//   const dispatch = useDispatch()
//   const { loading, error } = useSelector((state) => state.auth)

//   useEffect(() => {
//     // Check for signup credentials and auto-fill
//     const signupEmail = localStorage.getItem("signupEmail")
//     const signupPassword = localStorage.getItem("signupPassword")

//     if (signupEmail && signupPassword) {
//       setFormData({
//         email: signupEmail,
//         password: signupPassword,
//       })

//       // Clear the stored credentials after using them
//       localStorage.removeItem("signupEmail")
//       localStorage.removeItem("signupPassword")

//       // Show success message
//       dispatch(setError("Account created successfully! Please sign in with your credentials."))
//       setTimeout(() => dispatch(clearError()), 4000)
//     }
//   }, [dispatch])

//   useEffect(() => {
//     // Clear error after 3 seconds (except for success message)
//     if (error && !error.includes("successfully")) {
//       const timer = setTimeout(() => dispatch(clearError()), 3000)
//       return () => clearTimeout(timer)
//     }
//   }, [error, dispatch])

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     })
//   }

//   const handleEmailLogin = async (e) => {
//     e.preventDefault()
//     dispatch(setLoading(true))
//     dispatch(clearError())

//     try {
//       // Sign in with Firebase REST API
//       const response = await fetch(
//         "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCp--eljk8cfqNbcZKM0D7Pc0Ndg3cQZ2g",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email: formData.email,
//             password: formData.password,
//             returnSecureToken: true,
//           }),
//         },
//       )

//       const data = await response.json()

//       if (response.ok) {
//         // Store token
//         dispatch(setToken(data.idToken))
//         localStorage.setItem("authToken", data.idToken)

//         // Get user data from Realtime Database
//         const userResponse = await fetch(
//           `https://new--clone-cdaa6-default-rtdb.firebaseio.com/users/${data.localId}.json`,
//         )
//         let userData = {}

//         if (userResponse.ok) {
//           const existingUserData = await userResponse.json()
//           userData = existingUserData || {}
//         }

//         // Update last login
//         const updatedUserData = {
//           ...userData,
//           email: formData.email,
//           uid: data.localId,
//           lastLogin: new Date().toISOString(),
//         }

//         // Save updated user data to database
//         await fetch(`https://new--clone-cdaa6-default-rtdb.firebaseio.com/users/${data.localId}.json`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(updatedUserData),
//         })

//         // Update Redux state
//         dispatch(setUser(updatedUserData))
//         localStorage.setItem("userData", JSON.stringify(updatedUserData))
//       } else {
//         dispatch(setError(data.error?.message || "Login failed"))
//       }
//     } catch (error) {
//       dispatch(setError("Network error: " + error.message))
//     }

//     dispatch(setLoading(false))
//   }

//   const handleGoogleLogin = async () => {
//     dispatch(setLoading(true))
//     dispatch(clearError())

//     try {
//       const { signInWithPopup } = await import("firebase/auth")
//       const { auth, googleProvider } = await import("../../firebase")

//       const result = await signInWithPopup(auth, googleProvider)
//       const user = result.user

//       // Store token
//       const token = await user.getIdToken()
//       dispatch(setToken(token))
//       localStorage.setItem("authToken", token)

//       // Create user data for database
//       const userData = {
//         uid: user.uid,
//         email: user.email,
//         displayName: user.displayName,
//         photoURL: user.photoURL,
//         lastLogin: new Date().toISOString(),
//       }

//       // Check if user exists in database
//       const userResponse = await fetch(`https://new--clone-cdaa6-default-rtdb.firebaseio.com/users/${user.uid}.json`)

//       let existingUserData = {}
//       if (userResponse.ok) {
//         const data = await userResponse.json()
//         existingUserData = data || {}
//       }

//       // Merge existing data with new login data
//       const updatedUserData = {
//         ...existingUserData,
//         ...userData,
//         createdAt: existingUserData.createdAt || new Date().toISOString(),
//       }

//       // Save user data to database
//       await fetch(`https://new--clone-cdaa6-default-rtdb.firebaseio.com/users/${user.uid}.json`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedUserData),
//       })

//       // Update Redux state
//       dispatch(setUser(updatedUserData))
//       localStorage.setItem("userData", JSON.stringify(updatedUserData))
//     } catch (error) {
//       if (error.code === "auth/popup-closed-by-user") {
//         dispatch(setError("Google sign-in was cancelled"))
//       } else if (error.code === "auth/popup-blocked") {
//         dispatch(setError("Popup was blocked. Please allow popups and try again"))
//       } else {
//         dispatch(setError("Google sign-in failed: " + error.message))
//       }
//     }

//     dispatch(setLoading(false))
//   }

//   return (
//     <div className="w-full max-w-sm mx-auto bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-white/20">
//       {/* Gmail Logo */}
//       <div className="text-center mb-6">
//         <div className="flex items-center justify-center gap-2 mb-4">
//           {/* Gmail Logo Icon */}
//           <div className="relative">
//             <svg width="32" height="24" viewBox="0 0 32 24" className="mr-1">
//               <path fill="#4285f4" d="M2 6l10 8 10-8v12H2z" />
//               <path fill="#34a853" d="M2 6l10 8V2z" />
//               <path fill="#fbbc04" d="M22 6l-10 8V2z" />
//               <path fill="#ea4335" d="M22 6l8-4v16H22z" />
//               <path fill="#c5221f" d="M2 6L-6 2v16H2z" />
//             </svg>
//           </div>
//           <span className="text-gray-700 text-xl font-normal">Gmail</span>
//         </div>
//         <h2 className="text-gray-800 text-lg font-medium">Login</h2>
//       </div>

//       {error && (
//         <div
//           className={`mb-4 p-2 border rounded text-xs ${
//             error.includes("successfully")
//               ? "bg-green-50 border-green-300 text-green-700"
//               : "bg-red-50 border-red-300 text-red-700"
//           }`}
//         >
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleEmailLogin} className="space-y-4">
//         <div>
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="w-full p-3 bg-transparent border border-gray-400 rounded text-gray-800 placeholder-gray-500 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
//           />
//         </div>

//         <div className="relative">
//           <input
//             type={showPassword ? "text" : "password"}
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="w-full p-3 bg-transparent border border-gray-400 rounded text-gray-800 placeholder-gray-500 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all pr-10"
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
//           >
//             {showPassword ? <AiOutlineEyeInvisible size={16} /> : <AiOutlineEye size={16} />}
//           </button>
//         </div>

//         {/* Forgot password link aligned to the right */}
//         <div className="text-right">
//           <button
//             type="button"
//             onClick={onSwitchToForgot}
//             className="text-teal-600 hover:text-teal-700 text-xs transition-colors hover:underline"
//           >
//             Forgot password?
//           </button>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-gradient-to-r from-teal-500 to-pink-500 hover:from-teal-600 hover:to-pink-600 text-white p-3 rounded text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
//         >
//           {loading ? (
//             <div className="flex items-center justify-center gap-2">
//               <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//               Signing in...
//             </div>
//           ) : (
//             "Login"
//           )}
//         </button>
//       </form>

//       {/* Sign up button styled like login button */}
//       <div className="mt-4">
//         <button
//           type="button"
//           onClick={onSwitchToSignup}
//           className="w-full bg-gradient-to-r from-teal-500 to-pink-500 hover:from-teal-600 hover:to-pink-600 text-white p-3 rounded text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
//         >
//           Create an account
//         </button>
//       </div>

//       <div className="mt-4">
//         <div className="flex items-center mb-3">
//           <div className="flex-1 border-t border-gray-300"></div>
//           <span className="px-3 text-gray-500 text-xs">or</span>
//           <div className="flex-1 border-t border-gray-300"></div>
//         </div>

//         <button
//           onClick={handleGoogleLogin}
//           disabled={loading}
//           className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98]"
//         >
//           <FcGoogle size={16} />
//           <span className="text-gray-700 text-xs font-medium">Continue with Google</span>
//         </button>
//       </div>

//       <div className="text-center mt-4">
//         <button
//           onClick={onGuestLogin}
//           className="w-full bg-gradient-to-r from-teal-500 to-pink-500 hover:from-teal-600 hover:to-pink-600 text-white p-3 rounded text-xs font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
//         >
//           Continue as Guest
//         </button>
//       </div>
//     </div>
//   )
// }

// export default Login
