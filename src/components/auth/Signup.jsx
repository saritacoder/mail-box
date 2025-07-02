"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setError, setLoading, clearError, setUser, setToken } from "../../redux/authSlice"
import { FcGoogle } from "react-icons/fc"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

const Signup = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)

  // Navigate to inbox when authentication is successful
  useEffect(() => {
    if (isAuthenticated && !loading) {
      console.log("User authenticated via signup, navigating to inbox")
      navigate("/inbox", { replace: true })
    }
  }, [isAuthenticated, loading, navigate])

  useEffect(() => {
    // Clear error after 3 seconds
    if (error) {
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

  const handleEmailSignup = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      dispatch(setError("Passwords don't match"))
      return
    }

    if (formData.password.length < 6) {
      dispatch(setError("Password should be at least 6 characters"))
      return
    }

    dispatch(setLoading(true))
    dispatch(clearError())

    try {
      // Sign up with Firebase REST API
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCp--eljk8cfqNbcZKM0D7Pc0Ndg3cQZ2g",
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

        // Create user data for database
        const userData = {
          uid: data.localId,
          email: formData.email,
          displayName: formData.name,
          photoURL: "",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        }

        // Save user data to Realtime Database
        await fetch(`https://new--clone-cdaa6-default-rtdb.firebaseio.com/users/${data.localId}.json`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })

        // Show success message and prepare for redirect
        setSignupSuccess(true)

        // Store credentials for auto-fill in login
        localStorage.setItem("signupEmail", formData.email)
        localStorage.setItem("signupPassword", formData.password)

        // Redirect to login after 2 seconds
        setTimeout(() => {
          onSwitchToLogin()
        }, 2000)
      } else {
        dispatch(setError(data.error?.message || "Signup failed"))
      }
    } catch (error) {
      dispatch(setError("Network error: " + error.message))
    }

    dispatch(setLoading(false))
  }

  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
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
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      }

      // Check if user already exists
      const userResponse = await fetch(`https://new--clone-cdaa6-default-rtdb.firebaseio.com/users/${user.uid}.json`)

      if (userResponse.ok) {
        const existingUser = await userResponse.json()
        if (existingUser) {
          // User already exists, just update login time
          const updatedUserData = {
            ...existingUser,
            lastLogin: new Date().toISOString(),
          }

          await fetch(`https://new--clone-cdaa6-default-rtdb.firebaseio.com/users/${user.uid}.json`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ lastLogin: new Date().toISOString() }),
          })

          dispatch(setUser(updatedUserData))
          localStorage.setItem("userData", JSON.stringify(updatedUserData))

          // Navigation will happen automatically via useEffect
          console.log("Existing user Google signup completed, waiting for state update")
          setGoogleLoading(false)
          return
        }
      }

      // Save new user data to database
      await fetch(`https://new--clone-cdaa6-default-rtdb.firebaseio.com/users/${user.uid}.json`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      // Update Redux state and localStorage
      dispatch(setUser(userData))
      localStorage.setItem("userData", JSON.stringify(userData))

      // Navigation will happen automatically via useEffect
      console.log("New user Google signup completed, waiting for state update")
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        dispatch(setError("Google sign-up was cancelled"))
      } else if (error.code === "auth/popup-blocked") {
        dispatch(setError("Popup was blocked. Please allow popups and try again"))
      } else {
        dispatch(setError("Google sign-up failed: " + error.message))
      }
    }

    setGoogleLoading(false)
  }

  // Show success message after signup
  if (signupSuccess) {
    return (
      <div className="w-full max-w-sm mx-auto bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-white/20 text-center">
        <div className="mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Account Created!</h2>
          <p className="text-xs text-gray-500 mb-4">Redirecting to login page...</p>
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600 text-xs">Please wait...</span>
          </div>
        </div>
      </div>
    )
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
        <h2 className="text-gray-800 text-lg font-medium">Create Account</h2>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-50 border border-red-300 text-red-700 rounded text-xs animate-shake">
          {error}
        </div>
      )}

      <form onSubmit={handleEmailSignup} className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 bg-transparent border border-gray-400 rounded text-gray-800 placeholder-gray-500 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
          />
        </div>

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

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-3 bg-transparent border border-gray-400 rounded text-gray-800 placeholder-gray-500 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showConfirmPassword ? <AiOutlineEyeInvisible size={16} /> : <AiOutlineEye size={16} />}
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
              Creating Account...
            </div>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Back to login button styled like main button */}
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="w-full bg-gradient-to-r from-teal-500 to-pink-500 hover:from-teal-600 hover:to-pink-600 text-white p-3 rounded text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Already have an account? Sign in
        </button>
      </div>

      <div className="mt-4">
        <div className="flex items-center mb-3">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-xs">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleSignup}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98] relative z-[9999] bg-white"
        >
          {googleLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span className="text-gray-700 text-xs font-medium">Connecting...</span>
            </>
          ) : (
            <>
              <FcGoogle size={16} />
              <span className="text-gray-700 text-xs font-medium">Continue with Google</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default Signup
