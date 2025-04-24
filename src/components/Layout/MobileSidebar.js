import { Link, NavLink } from 'react-router-dom';

import { XmarkIcon } from '../../assets/Icons';
import { navLinkClass } from './Sidebar';

export default function MobileSidebar(props) {
  function hideSideBar() {
    document.getElementById('hidden').classList.toggle('hidden');
  }

  return (
    <div
      className="hidden sm:hidden drop-shadow-lg w-64 h-full px-5 py-2 bg-blue-50 fixed z-50 animate-slideIn"
      id="hidden"
    >
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-2xl text-gray-700">Rmail</h1>
        <button onClick={hideSideBar}>
          <XmarkIcon />
        </button>
      </div>
      <div className="py-10">
        <Link
          className="border-2 border-blue-600 rounded px-2 py-1 text-lg font-semibold duration-300 hover:bg-blue-600 hover:text-white active:bg-blue-700 focus:outline-blue-600 focus:outline-offset-2"
          to="compose"
          onClick={hideSideBar}
        >
          Compose
        </Link>

        <ul className="mt-4 py-1 rounded">
          <li className="my-2">
            <NavLink className={navLinkClass} to="inbox" onClick={hideSideBar}>
              Inbox
              {props.unreadMails > 0 && (
                <span className="float-end mr-7 font-bold">
                  +{props.unreadMails}
                </span>
              )}
            </NavLink>
          </li>
          <li className="my-2">
            <NavLink className={navLinkClass} to="sent" onClick={hideSideBar}>
              Sent
            </NavLink>
          </li>
          <li className="my-2">
            <NavLink className={navLinkClass} to="stared" onClick={hideSideBar}>
              Stared
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
