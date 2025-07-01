"use client"

import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./App.css"
import Navbar from "./components/shared/Navbar"
import Body from "./components/shared/Body"
import Inbox from "./components/shared/Inbox"
import Mail from "./components/shared/Mail"
import SendMail from "./components/shared/SendMail"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import UserProfile from "./components/shared/UserProfile"

// Error Boundary Component
const ErrorBoundary = ({ error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h1>
          <p className="text-gray-600 mb-6">
            We encountered an unexpected error. Please try refreshing the page or contact support if the problem
            persists.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Body />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <Inbox />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/mail/:id",
        element: <Mail />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/profile",
        element: <UserProfile isOpen={true} onClose={() => window.history.back()} />,
        errorElement: <ErrorBoundary />,
      },
    ],
  },
])

function App() {
  return (
    <ProtectedRoute>
      <div className="bg-[#F6F8FC] min-h-screen w-full">
        <Navbar />
        <RouterProvider router={router} />
        <div>
          <SendMail />
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default App
