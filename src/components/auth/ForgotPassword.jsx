

"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setError, setLoading, clearError } from "../../redux/authSlice"
import { MdArrowBack } from "react-icons/md"

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)

  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.auth)

  useEffect(() => {
    // Clear error after 3 seconds
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 3000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  const handleResetPassword = async (e) => {
    e.preventDefault()

    if (!email) {
      dispatch(setError("Please enter your email"))
      return
    }

    dispatch(setLoading(true))
    dispatch(clearError())

    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyCp--eljk8cfqNbcZKM0D7Pc0Ndg3cQZ2g",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestType: "PASSWORD_RESET",
            email: email,
          }),
        },
      )

      const data = await response.json()

      if (response.ok) {
        setEmailSent(true)
      } else {
        dispatch(setError(data.error?.message || "Failed to send reset link"))
      }
    } catch (error) {
      dispatch(setError("Network error: " + error.message))
    }

    dispatch(setLoading(false))
  }

  if (emailSent) {
    return (
      <div className="w-full max-w-sm mx-auto bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-white/20 text-center">
        <div className="mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Check Your Email</h2>
          <p className="text-gray-600 text-xs mb-4">
            We've sent a password reset link to <strong className="text-gray-800">{email}</strong>
          </p>
          <p className="text-xs text-gray-500 mb-4">Didn't receive the email? Check your spam folder or try again.</p>
        </div>

        <button
          onClick={onBackToLogin}
          className="w-full bg-gradient-to-r from-teal-500 to-pink-500 hover:from-teal-600 hover:to-pink-600 text-white p-3 rounded text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Back to Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-white/20">
      <button
        onClick={onBackToLogin}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
      >
        <MdArrowBack size={16} />
        <span className="text-xs">Back to Sign In</span>
      </button>

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
        <h2 className="text-gray-800 text-lg font-medium mb-1">Forgot Password?</h2>
        <p className="text-gray-600 text-xs">No worries, we'll send you reset instructions.</p>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-50 border border-red-300 text-red-700 rounded text-xs animate-shake">
          {error}
        </div>
      )}

      <form onSubmit={handleResetPassword} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 bg-transparent border border-gray-400 rounded text-gray-800 placeholder-gray-500 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-teal-500 to-pink-500 hover:from-teal-600 hover:to-pink-600 text-white p-3 rounded text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Sending...
            </div>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  )
}

export default ForgotPassword




// "use client"

// import { useState, useEffect } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { setError, setLoading, clearError } from "../../redux/authSlice"
// import { MdArrowBack } from "react-icons/md"

// const ForgotPassword = ({ onBackToLogin }) => {
//   const [email, setEmail] = useState("")
//   const [emailSent, setEmailSent] = useState(false)

//   const dispatch = useDispatch()
//   const { loading, error } = useSelector((state) => state.auth)

//   useEffect(() => {
//     // Clear error after 3 seconds
//     if (error) {
//       const timer = setTimeout(() => dispatch(clearError()), 3000)
//       return () => clearTimeout(timer)
//     }
//   }, [error, dispatch])

//   const handleResetPassword = async (e) => {
//     e.preventDefault()

//     if (!email) {
//       dispatch(setError("Please enter your email"))
//       return
//     }

//     dispatch(setLoading(true))
//     dispatch(clearError())

//     try {
//       const response = await fetch(
//         "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyCp--eljk8cfqNbcZKM0D7Pc0Ndg3cQZ2g",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             requestType: "PASSWORD_RESET",
//             email: email,
//           }),
//         },
//       )

//       const data = await response.json()

//       if (response.ok) {
//         setEmailSent(true)
//       } else {
//         dispatch(setError(data.error?.message || "Failed to send reset link"))
//       }
//     } catch (error) {
//       dispatch(setError("Network error: " + error.message))
//     }

//     dispatch(setLoading(false))
//   }

//   if (emailSent) {
//     return (
//       <div className="w-full max-w-sm mx-auto bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-white/20 text-center">
//         <div className="mb-6">
//           <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
//             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <h2 className="text-lg font-bold text-gray-800 mb-2">Check Your Email</h2>
//           <p className="text-gray-600 text-xs mb-4">
//             We've sent a password reset link to <strong className="text-gray-800">{email}</strong>
//           </p>
//           <p className="text-xs text-gray-500 mb-4">Didn't receive the email? Check your spam folder or try again.</p>
//         </div>

//         <button
//           onClick={onBackToLogin}
//           className="w-full bg-gradient-to-r from-teal-500 to-pink-500 hover:from-teal-600 hover:to-pink-600 text-white p-3 rounded text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
//         >
//           Back to Sign In
//         </button>
//       </div>
//     )
//   }

//   return (
//     <div className="w-full max-w-sm mx-auto bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-white/20">
//       <button
//         onClick={onBackToLogin}
//         className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
//       >
//         <MdArrowBack size={16} />
//         <span className="text-xs">Back to Sign In</span>
//       </button>

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
//         <h2 className="text-gray-800 text-lg font-medium mb-1">Forgot Password?</h2>
//         <p className="text-gray-600 text-xs">No worries, we'll send you reset instructions.</p>
//       </div>

//       {error && (
//         <div className="mb-4 p-2 bg-red-50 border border-red-300 text-red-700 rounded text-xs animate-shake">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleResetPassword} className="space-y-4">
//         <div>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full p-3 bg-transparent border border-gray-400 rounded text-gray-800 placeholder-gray-500 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-gradient-to-r from-teal-500 to-pink-500 hover:from-teal-600 hover:to-pink-600 text-white p-3 rounded text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
//         >
//           {loading ? (
//             <div className="flex items-center justify-center gap-2">
//               <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//               Sending...
//             </div>
//           ) : (
//             "Reset Password"
//           )}
//         </button>
//       </form>
//     </div>
//   )
// }

// export default ForgotPassword

