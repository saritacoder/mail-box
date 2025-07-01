import Sidebar from "./Sidebar"
import { Outlet } from "react-router-dom"

const Body = () => {
  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}

export default Body
