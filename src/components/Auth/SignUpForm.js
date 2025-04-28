"use client"

import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import { useSelector, useDispatch } from "react-redux"
import { toggleSpinner } from "../../reducers/uiSlice"

import Spinner from "../UI/Spinner"

export default function SignUpForm() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const confirmPasswordRef = useRef()
  const [errors, setErrors] = useState({})

  const navigate = useNavigate()

  const spinner = useSelector((state) => state.uiState.spinner)
  const dispatch = useDispatch()

  async function handleFormSubmit(event) {
    event.preventDefault()

    const email = emailRef.current.value
    const password = passwordRef.current.value
    const confirmPassword = confirmPasswordRef.current.value

    // Form validation
    const newErrors = {}
    if (!email) newErrors.email = "Email is required"
    if (!password) newErrors.password = "Password is required"
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password"

    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (password && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    dispatch(toggleSpinner(true))
    try {
      // Check if user already exists
      const checkUserResponse = await fetch(
        `https://email-box-5aa50-default-rtdb.firebaseio.com/${email.replace(".", "")}.json`,
        { method: "HEAD" },
      )

      if (checkUserResponse.status === 200) {
        toast.error("This email is already registered. Please use a different email or login.")
        dispatch(toggleSpinner(false))
        return
      }

      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD4zS31jD6146ZIC7Ghsu4l6hK4Z_7eRps",
        {
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }),
        },
      )

      if (response.ok) {
        // Initialize user's data structure in Firebase
        await fetch(`https://email-box-5aa50-default-rtdb.firebaseio.com/${email.replace(".", "")}.json`, {
          method: "PUT",
          body: JSON.stringify({
            receivedMails: {},
            sentMails: {},
            userInfo: {
              email: email,
              createdAt: new Date().toISOString(),
            },
          }),
        })

        // Store signup credentials for login page
        sessionStorage.setItem("recentSignupEmail", email)
        sessionStorage.setItem("recentSignupPassword", password)

        toast.success("Your account is created successfully. Login here")
        navigate("/login")
      } else {
        const data = await response.json()
        let errorMessage = "Registration failed"
        if (data.error && data.error.message) {
          switch (data.error.message) {
            case "EMAIL_EXISTS":
              errorMessage = "This email is already registered. Please use a different email."
              break
            case "OPERATION_NOT_ALLOWED":
              errorMessage = "Password sign-up is disabled for this project."
              break
            case "TOO_MANY_ATTEMPTS_TRY_LATER":
              errorMessage = "Too many attempts. Please try again later."
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
    emailRef.current.focus()
  }, [])

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="mb-6">
        <label className="block font-semibold text-sm text-gray-800 mb-1" htmlFor="email">
          Email
        </label>
        <input
          className={`ring-1 ring-inset ${errors.email ? "ring-red-500" : "ring-gray-300"} w-full py-1 px-2 rounded-md shadow-sm focus:outline-blue-700`}
          type="email"
          id="email"
          ref={emailRef}
          onChange={() => setErrors({ ...errors, email: "" })}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
      <div className="mb-6">
        <label className="block font-semibold text-sm text-gray-800 mb-1" htmlFor="password">
          Password
        </label>
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
        <label className="block font-semibold text-sm text-gray-800 mb-1" htmlFor="confirm-password">
          Confirm Password
        </label>
        <input
          className={`ring-1 ring-inset ${errors.confirmPassword ? "ring-red-500" : "ring-gray-300"} w-full py-1 px-2 rounded-md shadow-sm focus:outline-blue-700`}
          type="password"
          id="confirm-password"
          ref={confirmPasswordRef}
          onChange={() => setErrors({ ...errors, confirmPassword: "" })}
        />
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
      </div>
      <div className="mb-6">
        <button
          className="rounded-md py-2 w-full text-sm text-center font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:outline-blue-700 focus:outline-offset-2"
          type="submit"
        >
          {spinner ? <Spinner /> : "Sign up"}
        </button>
      </div>
    </form>
  )
}
