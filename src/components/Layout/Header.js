import { useState } from 'react';
import { useSelector } from 'react-redux';

import { MenuBarIcon } from '../../assets/Icons';
import profileIcon from '../../assets/profile-icon.jpg';
import mailIcon from '../../assets/mail-icon.png';
import ProfileOverlay from './ProfileOverlay';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';

export default function Header() {
  const [showProfile, setShowProfile] = useState(false);

  const unreadMails = useSelector((state) => state.emailState.unreadMails);

  return (
    <header className="h-12 shadow-md">
      <div className="w-full flex justify-between items-center py-2 px-5 bg-blue-50 fixed z-30">
        <h1 className="hidden sm:block font-semibold text-2xl text-gray-700">
          Rmail
        </h1>
        <button
          className="sm:hidden focus:outline-none"
          onClick={() => {
            document.getElementById('hidden').classList.toggle('hidden');
          }}
        >
          <MenuBarIcon />
        </button>
        <div>
          <img className="rounded-full w-8" src={mailIcon} alt="mail icon" />
        </div>

        <button
          className="w-8 h-8 rounded-full border-2 hover:border-blue-300 focus:outline-blue-400 focus:outline-offset-2"
          onClick={() => setShowProfile(!showProfile)}
        >
          <img className="rounded-full" src={profileIcon} alt="" />
        </button>
      </div>
      {showProfile && (
        <ProfileOverlay onCloseOverlay={() => setShowProfile(!showProfile)} />
      )}
      <Sidebar unreadMails={unreadMails} />
      <MobileSidebar unreadMails={unreadMails} />
    </header>
  );
}
