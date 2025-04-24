import { Link, NavLink } from 'react-router-dom';

export const navLinkClass = ({ isActive }) => {
  return `block px-2 py-1 rounded-r-2xl border-l-4
  ${
    isActive
      ? 'bg-blue-200 font-semibold border-l-blue-700'
      : 'hover:bg-blue-100'
  }
`;
};

export default function Sidebar(props) {
  return (
    <div className="hidden sm:block drop-shadow-lg w-64 h-full px-5 py-8 bg-blue-50 fixed top-12">
      <Link
        className="border-2 border-blue-600 rounded px-2 py-1 text-lg font-semibold hover:bg-blue-600 hover:text-white active:bg-blue-700 focus:outline-blue-600 focus:outline-offset-2"
        to="compose"
      >
        Compose
      </Link>

      <ul className="mt-4 py-1 rounded">
        <li className="my-2">
          <NavLink className={navLinkClass} to="inbox">
            Inbox
            {props.unreadMails > 0 && (
              <span className="float-end mr-7 font-bold">
                +{props.unreadMails}
              </span>
            )}
          </NavLink>
        </li>
        <li className="my-2">
          <NavLink className={navLinkClass} to="sent">
            Sent
          </NavLink>
        </li>
        <li className="my-2">
          <NavLink className={navLinkClass} to="stared">
            Stared
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
