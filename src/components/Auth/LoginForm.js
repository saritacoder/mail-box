"use client"

import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

import { useDispatch, useSelector } from "react-redux"
import { onLogin } from "../../reducers/authSlice"
import { toggleSpinner } from "../../reducers/uiSlice"

import Spinner from "../UI/Spinner"

export default function LoginForm() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const [errors, setErrors] = useState({})

  const spinner = useSelector((state) => state.uiState.spinner)
  const dispatch = useDispatch()

  async function handleFormSubmit(event) {
    event.preventDefault()

    const email = emailRef.current.value
    const password = passwordRef.current.value

    // Form validation
    const newErrors = {}
    if (!email) newErrors.email = "Email is required"
    if (!password) newErrors.password = "Password is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    dispatch(toggleSpinner(true))
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD4zS31jD6146ZIC7Ghsu4l6hK4Z_7eRps",
        {
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }),
        },
      )
      const data = await response.json()

      if (response.ok) {
        // Clear the stored signup credentials after successful login
        sessionStorage.removeItem("recentSignupEmail")
        sessionStorage.removeItem("recentSignupPassword")

        dispatch(onLogin(data))
        toast.success("Login successful")
      } else {
        let errorMessage = "Authentication failed"
        if (data.error && data.error.message) {
          switch (data.error.message) {
            case "EMAIL_NOT_FOUND":
              errorMessage = "Email not found. Please check your email or sign up."
              break
            case "INVALID_PASSWORD":
              errorMessage = "Invalid password. Please try again."
              break
            case "USER_DISABLED":
              errorMessage = "This account has been disabled."
              break
            default:
              errorMessage = data.error.message
          }
        }
        throw new Error(errorMessage)
      }
    } catch (error) {
      toast.error(error.message)
    }
    dispatch(toggleSpinner(false))
  }

  useEffect(() => {
    // Check if there are recently used signup credentials
    const recentEmail = sessionStorage.getItem("recentSignupEmail")
    const recentPassword = sessionStorage.getItem("recentSignupPassword")

    // Pre-fill the form if credentials exist
    if (recentEmail && emailRef.current) {
      emailRef.current.value = recentEmail
    }

    if (recentPassword && passwordRef.current) {
      passwordRef.current.value = recentPassword
    }

    // Focus on the empty field or submit button if both are filled
    if (!recentEmail && emailRef.current) {
      emailRef.current.focus()
    } else if (!recentPassword && passwordRef.current) {
      passwordRef.current.focus()
    }
  }, [])

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="mb-6">
        <label className="block font-semibold text-sm text-gray-800 mb-1" htmlFor="email">
          Email
        </label>
        <input
          className={`ring-1 ring-inset ${errors.email ? "ring-red-500" : "ring-gray-300"} w-full py-1 px-2 rounded-md shadow-sm focus:outline-blue-700 autofill:bg-yellow-200`}
          type="email"
          id="email"
          ref={emailRef}
          onChange={() => setErrors({ ...errors, email: "" })}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <label className="block font-semibold text-sm text-gray-800 mb-1 flex-grow" htmlFor="password">
            Password
          </label>
          <Link className="text-sm font-semibold text-blue-600 hover:text-blue-700" to="/forgot-password">
            Forgot password?
          </Link>
        </div>
        <input
          className={`ring-1 ring-inset ${errors.password ? "ring-red-500" : "ring-gray-300"} w-full py-1 px-2 rounded-md shadow-sm focus:outline-blue-700`}
          type="password"
          id="password"
          ref={passwordRef}
          onChange={() => setErrors({ ...errors, password: "" })}
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>
      <div className="mb-6">
        <button
          className="rounded-md py-2 w-full text-sm text-center font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:outline-blue-700 focus:outline-offset-2"
          type="submit"
        >
          {spinner ? <Spinner /> : "Login"}
        </button>
      </div>
    </form>
  )
}
