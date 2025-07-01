"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUser, setToken, setLoading } from "../../redux/authSlice"
import Login from "./Login"
import Signup from "./Signup"
import ForgotPassword from "./ForgotPassword"

const AuthContainer = ({ onGuestLogin }) => {
  const [currentView, setCurrentView] = useState("login")
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(setLoading(true))

    // Check for stored auth data on component mount
    const storedToken = localStorage.getItem("authToken")
    const storedUserData = localStorage.getItem("userData")

    if (storedToken && storedUserData) {
      try {
        const userData = JSON.parse(storedUserData)
        dispatch(setToken(storedToken))
        dispatch(setUser(userData))
      } catch (error) {
        // Clear invalid stored data
        localStorage.removeItem("authToken")
        localStorage.removeItem("userData")
      }
    }

    dispatch(setLoading(false))
  }, [dispatch])

  const renderCurrentView = () => {
    switch (currentView) {
      case "signup":
        return <Signup onSwitchToLogin={() => setCurrentView("login")} />
      case "forgot":
        return <ForgotPassword onBackToLogin={() => setCurrentView("login")} />
      default:
        return (
          <Login
            onSwitchToSignup={() => setCurrentView("signup")}
            onSwitchToForgot={() => setCurrentView("forgot")}
            onGuestLogin={onGuestLogin}
          />
        )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Enhanced Animated Background with Teal-Pink Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-cyan-300 to-pink-400">
        {/* Large Floating Orbs with Enhanced Animation */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-300/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-300/40 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-300/40 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>

        {/* Additional Floating Orbs */}
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-300/30 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-300/30 rounded-full blur-2xl animate-float animation-delay-3000"></div>
        <div className="absolute top-1/6 left-1/2 w-48 h-48 bg-emerald-300/30 rounded-full blur-xl animate-float animation-delay-1000"></div>

        {/* Enhanced Moving Particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full animate-float ${
                i % 3 === 0
                  ? "w-1 h-1 bg-white/40"
                  : i % 3 === 1
                    ? "w-2 h-2 bg-teal-200/30"
                    : "w-1.5 h-1.5 bg-pink-200/30"
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${8 + Math.random() * 25}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Enhanced Grid Pattern with Animation */}
        <div
          className="absolute inset-0 opacity-10 animate-pulse"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            animationDuration: "4s",
          }}
        ></div>

        {/* Enhanced Animated Lines */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-400/70 to-transparent animate-slide-right"></div>
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400/70 to-transparent animate-slide-left animation-delay-1000"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent animate-slide-right animation-delay-2000"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/70 to-transparent animate-slide-left animation-delay-3000"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent animate-slide-right animation-delay-4000"></div>
        </div>

        {/* Rotating Gradient Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>

        {/* Pulsing Radial Gradients */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-radial-gradient from-teal-400/20 via-transparent to-transparent animate-pulse"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-full h-full bg-radial-gradient from-pink-400/20 via-transparent to-transparent animate-pulse animation-delay-1000"
          style={{ animationDuration: "3s" }}
        ></div>
      </div>

      {/* Enhanced Floating Elements */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-teal-400/50 rounded-full animate-bounce"></div>
      <div className="absolute bottom-20 right-20 w-5 h-5 bg-pink-400/50 rounded-full animate-bounce animation-delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-3 h-3 bg-cyan-400/50 rounded-full animate-bounce animation-delay-2000"></div>
      <div className="absolute top-1/3 right-10 w-3 h-3 bg-purple-400/50 rounded-full animate-bounce animation-delay-3000"></div>
      <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-emerald-400/50 rounded-full animate-bounce animation-delay-4000"></div>
      <div className="absolute top-1/6 right-1/3 w-4 h-4 bg-indigo-400/50 rounded-full animate-bounce animation-delay-2000"></div>

      {/* Floating Geometric Shapes */}
      <div className="absolute top-1/4 right-1/6 w-6 h-6 border-2 border-teal-400/30 rotate-45 animate-float"></div>
      <div className="absolute bottom-1/4 left-1/6 w-8 h-8 border-2 border-pink-400/30 rounded-full animate-float animation-delay-2000"></div>
      <div className="absolute top-2/3 right-1/4 w-5 h-5 border-2 border-cyan-400/30 animate-float animation-delay-1000"></div>

      {/* Auth Card with Enhanced Styling */}
      <div className="relative z-10 w-full max-w-4xl mx-4">
        {loading ? (
          <div className="flex items-center justify-center p-12 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl">
            <div className="flex flex-col items-center gap-6">
              <div className="w-10 h-10 border-3 border-teal-500/30 border-t-teal-500 rounded-full animate-spin"></div>
              <p className="text-gray-800 text-lg font-medium">Loading...</p>
            </div>
          </div>
        ) : (
          <div className="transform transition-all duration-500 hover:scale-[1.01]">{renderCurrentView()}</div>
        )}
      </div>
    </div>
  )
}

export default AuthContainer







// "use client"

// import { useState, useEffect } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { useNavigate, useLocation } from "react-router-dom"
// import { setUser, setToken, setLoading } from "../../redux/authSlice"
// import Login from "./Login"
// import Signup from "./Signup"
// import ForgotPassword from "./ForgotPassword"

// const AuthContainer = ({ onGuestLogin }) => {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const dispatch = useDispatch()
//   const { loading, isAuthenticated } = useSelector((state) => state.auth)

//   // Determine current view based on URL
//   const getCurrentView = () => {
//     if (location.pathname === "/signup") return "signup"
//     if (location.pathname === "/forgot") return "forgot"
//     return "login"
//   }

//   const [currentView, setCurrentView] = useState(getCurrentView())

//   useEffect(() => {
//     setCurrentView(getCurrentView())
//   }, [location.pathname])

//   useEffect(() => {
//     dispatch(setLoading(true))

//     // Check for stored auth data on component mount
//     const storedToken = localStorage.getItem("authToken")
//     const storedUserData = localStorage.getItem("userData")

//     if (storedToken && storedUserData) {
//       try {
//         const userData = JSON.parse(storedUserData)
//         dispatch(setToken(storedToken))
//         dispatch(setUser(userData))
//       } catch (error) {
//         // Clear invalid stored data
//         localStorage.removeItem("authToken")
//         localStorage.removeItem("userData")
//       }
//     }

//     dispatch(setLoading(false))
//   }, [dispatch])

//   // Redirect to home if authenticated
//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/")
//     }
//   }, [isAuthenticated, navigate])

//   const handleGuestLogin = () => {
//     if (onGuestLogin) {
//       onGuestLogin()
//     }
//     navigate("/")
//   }

//   const renderCurrentView = () => {
//     switch (currentView) {
//       case "signup":
//         return <Signup onSwitchToLogin={() => navigate("/login")} />
//       case "forgot":
//         return <ForgotPassword onBackToLogin={() => navigate("/login")} />
//       default:
//         return (
//           <Login
//             onSwitchToSignup={() => navigate("/signup")}
//             onSwitchToForgot={() => navigate("/forgot")}
//             onGuestLogin={handleGuestLogin}
//           />
//         )
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
//       {/* Enhanced Animated Background with Teal-Pink Gradient */}
//       <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-cyan-300 to-pink-400">
//         {/* Large Floating Orbs with Enhanced Animation */}
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-300/40 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-300/40 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
//         <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-300/40 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>

//         {/* Additional Floating Orbs */}
//         <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-300/30 rounded-full blur-2xl animate-float"></div>
//         <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-300/30 rounded-full blur-2xl animate-float animation-delay-3000"></div>
//         <div className="absolute top-1/6 left-1/2 w-48 h-48 bg-emerald-300/30 rounded-full blur-xl animate-float animation-delay-1000"></div>

//         {/* Enhanced Moving Particles */}
//         <div className="absolute inset-0">
//           {[...Array(50)].map((_, i) => (
//             <div
//               key={i}
//               className={`absolute rounded-full animate-float ${
//                 i % 3 === 0
//                   ? "w-1 h-1 bg-white/40"
//                   : i % 3 === 1
//                     ? "w-2 h-2 bg-teal-200/30"
//                     : "w-1.5 h-1.5 bg-pink-200/30"
//               }`}
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 animationDelay: `${Math.random() * 15}s`,
//                 animationDuration: `${8 + Math.random() * 25}s`,
//               }}
//             ></div>
//           ))}
//         </div>

//         {/* Enhanced Grid Pattern with Animation */}
//         <div
//           className="absolute inset-0 opacity-10 animate-pulse"
//           style={{
//             backgroundImage: `
//               linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
//               linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
//             `,
//             backgroundSize: "50px 50px",
//             animationDuration: "4s",
//           }}
//         ></div>

//         {/* Enhanced Animated Lines */}
//         <div className="absolute inset-0">
//           <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-400/70 to-transparent animate-slide-right"></div>
//           <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400/70 to-transparent animate-slide-left animation-delay-1000"></div>
//           <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent animate-slide-right animation-delay-2000"></div>
//           <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/70 to-transparent animate-slide-left animation-delay-3000"></div>
//           <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent animate-slide-right animation-delay-4000"></div>
//         </div>

//         {/* Rotating Gradient Overlay */}
//         <div
//           className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-spin"
//           style={{ animationDuration: "20s" }}
//         ></div>

//         {/* Pulsing Radial Gradients */}
//         <div
//           className="absolute top-0 left-0 w-full h-full bg-radial-gradient from-teal-400/20 via-transparent to-transparent animate-pulse"
//           style={{ animationDuration: "3s" }}
//         ></div>
//         <div
//           className="absolute bottom-0 right-0 w-full h-full bg-radial-gradient from-pink-400/20 via-transparent to-transparent animate-pulse animation-delay-1000"
//           style={{ animationDuration: "3s" }}
//         ></div>
//       </div>

//       {/* Enhanced Floating Elements */}
//       <div className="absolute top-20 left-20 w-4 h-4 bg-teal-400/50 rounded-full animate-bounce"></div>
//       <div className="absolute bottom-20 right-20 w-5 h-5 bg-pink-400/50 rounded-full animate-bounce animation-delay-1000"></div>
//       <div className="absolute top-1/2 left-10 w-3 h-3 bg-cyan-400/50 rounded-full animate-bounce animation-delay-2000"></div>
//       <div className="absolute top-1/3 right-10 w-3 h-3 bg-purple-400/50 rounded-full animate-bounce animation-delay-3000"></div>
//       <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-emerald-400/50 rounded-full animate-bounce animation-delay-4000"></div>
//       <div className="absolute top-1/6 right-1/3 w-4 h-4 bg-indigo-400/50 rounded-full animate-bounce animation-delay-2000"></div>

//       {/* Floating Geometric Shapes */}
//       <div className="absolute top-1/4 right-1/6 w-6 h-6 border-2 border-teal-400/30 rotate-45 animate-float"></div>
//       <div className="absolute bottom-1/4 left-1/6 w-8 h-8 border-2 border-pink-400/30 rounded-full animate-float animation-delay-2000"></div>
//       <div className="absolute top-2/3 right-1/4 w-5 h-5 border-2 border-cyan-400/30 animate-float animation-delay-1000"></div>

//       {/* Auth Card with Enhanced Styling */}
//       <div className="relative z-10 w-full max-w-4xl mx-4">
//         {loading ? (
//           <div className="flex items-center justify-center p-12 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl">
//             <div className="flex flex-col items-center gap-6">
//               <div className="w-10 h-10 border-3 border-teal-500/30 border-t-teal-500 rounded-full animate-spin"></div>
//               <p className="text-gray-800 text-lg font-medium">Loading...</p>
//             </div>
//           </div>
//         ) : (
//           <div className="transform transition-all duration-500 hover:scale-[1.01]">{renderCurrentView()}</div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default AuthContainer
