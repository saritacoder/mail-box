import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Zoom, ToastContainer } from 'react-toastify';

import NotFoundPage from './pages/Error/NotFoundPage';

import SignUpPage from './pages/Auth/SignUpPage';
import LoginPage from './pages/Auth/LoginPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';

import RootPage from './pages/RootPage';
import ComposePage from './pages/Mail/ComposePage';
import InboxPage from './pages/Mail/InboxPage';
import SentPage from './pages/Mail/SentPage';
import StaredPage from './pages/Mail/StaredPage';
import MailBodyPage from './pages/Mail/MailBodyPage';

export default function App() {
  const isLoggedIn = useSelector((state) => state.authState.isLoggedIn);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={<Navigate to="/mail" />}
          errorElement={<NotFoundPage />}
        />

        <Route
          path="/login"
          element={!isLoggedIn ? <LoginPage /> : <Navigate to="/" />}
        />

        <Route
          path="/signup"
          element={!isLoggedIn ? <SignUpPage /> : <Navigate to="/" />}
        />

        <Route
          path="/forgot-password"
          element={!isLoggedIn ? <ForgotPasswordPage /> : <Navigate to="/" />}
        />

        <Route
          path="/mail"
          element={isLoggedIn ? <RootPage /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="inbox" />} />
          <Route path="inbox" element={<InboxPage />} />
          <Route path="inbox/:mailId" element={<MailBodyPage />} />
          <Route path="sent" element={<SentPage />} />
          <Route path="sent/:mailId" element={<MailBodyPage />} />
          <Route path="stared" element={<StaredPage />} />
          <Route path="compose" element={<ComposePage />} />
        </Route>
      </>
    )
  );

  return (
    <>
      <RouterProvider router={router} />

      <ToastContainer
        transition={Zoom}
        position="top-center"
        pauseOnFocusLoss={false}
        hideProgressBar
        autoClose={2000}
      />
    </>
  );
}
