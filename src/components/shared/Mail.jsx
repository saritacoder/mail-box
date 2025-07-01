"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { IoMdMore, IoMdArrowBack } from "react-icons/io"
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdDeleteOutline,
  MdOutlineReport,
  MdOutlineMarkEmailUnread,
  MdOutlineWatchLater,
  MdOutlineAddTask,
  MdOutlineDriveFileMove,
} from "react-icons/md"
import { BiArchiveIn } from "react-icons/bi"
import { setError } from "../../redux/emailSlice"

const Mail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((store) => store.auth)

  const [email, setEmail] = useState(location.state?.email || null)
  const [loading, setLoading] = useState(!email)

  useEffect(() => {
    if (!email && id) {
      fetchEmailById(id)
    }
  }, [id, email])

  const fetchEmailById = async (emailId) => {
    try {
      setLoading(true)
      const response = await fetch(`https://new--clone-cdaa6-default-rtdb.firebaseio.com/emails/${emailId}.json`)

      if (response.ok) {
        const data = await response.json()
        if (data) {
          setEmail({ ...data, firebaseKey: emailId })
        } else {
          dispatch(setError("Email not found"))
          navigate("/")
        }
      } else {
        throw new Error("Failed to fetch email")
      }
    } catch (error) {
      dispatch(setError("Failed to load email: " + error.message))
      navigate("/")
    } finally {
      setLoading(false)
    }
  }

  const deleteEmail = async () => {
    if (!email?.firebaseKey) return

    try {
      const response = await fetch(
        `https://new--clone-cdaa6-default-rtdb.firebaseio.com/emails/${email.firebaseKey}.json`,
        {
          method: "DELETE",
        },
      )

      if (response.ok) {
        dispatch(setError("Email deleted successfully"))
        navigate("/")
      } else {
        throw new Error("Failed to delete email")
      }
    } catch (error) {
      dispatch(setError("Failed to delete email: " + error.message))
    }
  }

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  if (loading) {
    return (
      <div className="flex-1 bg-white/40 backdrop-blur-sm flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading email...</span>
        </div>
      </div>
    )
  }

  if (!email) {
    return (
      <div className="flex-1 bg-white/40 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Email not found</p>
          <button onClick={() => navigate("/")} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Back to Inbox
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-white/40 backdrop-blur-sm shadow-lg">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-gray-700 py-2">
          <div onClick={() => navigate("/")} className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            <IoMdArrowBack size={"20px"} />
          </div>
          <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            <BiArchiveIn size={"20px"} />
          </div>
          <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            <MdOutlineReport size={"20px"} />
          </div>
          <div onClick={deleteEmail} className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            <MdDeleteOutline size={"20px"} />
          </div>
          <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            <MdOutlineMarkEmailUnread size={"20px"} />
          </div>
          <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            <MdOutlineWatchLater size={"20px"} />
          </div>
          <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            <MdOutlineAddTask size={"20px"} />
          </div>
          <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            <MdOutlineDriveFileMove size={"20px"} />
          </div>
          <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            <IoMdMore size={"20px"} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button disabled={false} className="hover:rounded-full hover:bg-gray-100">
            <MdKeyboardArrowLeft size={"24px"} />
          </button>
          <button disabled={false} className="hover:rounded-full hover:bg-gray-100">
            <MdKeyboardArrowRight size={"24px"} />
          </button>
        </div>
      </div>

      <div className="h-[90vh] overflow-y-auto p-4">
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <h1 className="text-xl font-medium">{email.subject}</h1>
                <span className="text-sm bg-gray-200 rounded-md px-2">
                  {email.from === user?.email ? "sent" : "inbox"}
                </span>
              </div>

              <div className="text-gray-600 text-sm mb-6 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">From:</span>
                  <span>{email.fromName || email.from}</span>
                  <span className="text-gray-400">{"<" + email.from + ">"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">To:</span>
                  <span>{email.to}</span>
                </div>
              </div>

              <div className="mt-6 text-gray-800 leading-relaxed whitespace-pre-wrap">{email.message}</div>
            </div>

            <div className="text-gray-400 text-sm ml-4">
              <p>{formatDateTime(email.timestamp)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mail
