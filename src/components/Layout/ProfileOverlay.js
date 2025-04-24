import { useSelector, useDispatch } from 'react-redux';
import { onLogout } from '../../reducers/authSlice';

import { LogoutIcon } from '../../assets/Icons';
import profileIcon from '../../assets/profile-icon.jpg';

export default function ProfileOverlay(props) {
  const { email } = useSelector((state) => state.authState.loggedUser);
  const dispatch = useDispatch();

  return (
    <div id="overlay">
      <div
        className="w-full h-full fixed z-40"
        onClick={() => props.onCloseOverlay()}
      ></div>
      <div className="fixed z-50 top-14 right-6 rounded-xl bg-blue-50 drop-shadow-lg w-80 h-56 p-3 flex flex-col items-center justify-around">
        <h1 className="text-sm font-semibold">{email}</h1>
        <div className="flex flex-col items-center">
          <div>
            <img className="w-16 rounded-full" src={profileIcon} alt="" />
          </div>
          <h1 className="text-xl">Your Name</h1>
        </div>
        <div>
          <button
            className="flex items-center gap-1 bg-white rounded-3xl p-3 hover:bg-slate-200 focus:outline-slate-200"
            onClick={() => dispatch(onLogout())}
          >
            <LogoutIcon />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
