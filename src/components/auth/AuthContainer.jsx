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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-teal-400 via-cyan-300 to-pink-400">
      {/* No AnimatedBackground here - only static gradient for auth pages */}

      {/* Auth Card */}
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
