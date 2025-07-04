"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import { setUser, setToken, setLoading } from "../../redux/authSlice"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth)
  const [initialCheck, setInitialCheck] = useState(true)
  const [hasStoredAuth, setHasStoredAuth] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuthentication = async () => {
      console.log("Checking authentication...") // Debug log

      dispatch(setLoading(true))

      try {
        const storedToken = localStorage.getItem("authToken")
        const storedUserData = localStorage.getItem("userData")

        console.log("Stored token:", !!storedToken) // Debug log
        console.log("Stored user data:", !!storedUserData) // Debug log

        // Set hasStoredAuth immediately if we have stored data
        if (storedToken && storedUserData) {
          setHasStoredAuth(true)

          try {
            const userData = JSON.parse(storedUserData)
            console.log("Parsed user data:", userData) // Debug log

            // Verify token is still valid by making a test request
            const testResponse = await fetch(
              `https://new--clone-cdaa6-default-rtdb.firebaseio.com/users/${userData.uid}.json`,
            )

            if (testResponse.ok) {
              dispatch(setToken(storedToken))
              dispatch(setUser(userData))
              console.log("User authenticated from localStorage") // Debug log
            } else {
              // Token might be expired, clear storage
              localStorage.removeItem("authToken")
              localStorage.removeItem("userData")
              dispatch(setUser(null))
              setHasStoredAuth(false)
            }
          } catch (error) {
            console.log("Error parsing stored data:", error) // Debug log
            // Clear invalid stored data
            localStorage.removeItem("authToken")
            localStorage.removeItem("userData")
            dispatch(setUser(null))
            setHasStoredAuth(false)
          }
        } else {
          console.log("No stored authentication data found") // Debug log
          dispatch(setUser(null))
          setHasStoredAuth(false)
        }
      } catch (error) {
        console.error("Authentication check error:", error)
        dispatch(setUser(null))
        setHasStoredAuth(false)
      }

      dispatch(setLoading(false))
      setInitialCheck(false)
    }

    if (initialCheck) {
      // Check for stored auth immediately on mount
      const storedToken = localStorage.getItem("authToken")
      const storedUserData = localStorage.getItem("userData")
      setHasStoredAuth(!!(storedToken && storedUserData))

      checkAuthentication()
    }
  }, [dispatch, initialCheck])

  // Show loading while checking authentication OR if we have stored auth data but haven't verified it yet
  if (loading || initialCheck || (hasStoredAuth && !isAuthenticated)) {
    console.log("Showing loading screen") // Debug log
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 via-cyan-300 to-pink-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  console.log("Auth check complete - isAuthenticated:", isAuthenticated, "hasStoredAuth:", hasStoredAuth) // Debug log

  // Only redirect to login if we're sure there's no authentication data
  if (!isAuthenticated && !hasStoredAuth) {
    console.log("Redirecting to login") // Debug log
    return <Navigate to="/login" replace />
  }

  // Show main app if authenticated
  console.log("Showing main application") // Debug log
  return children
}

export default ProtectedRoute
