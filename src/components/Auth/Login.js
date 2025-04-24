import { Link } from 'react-router-dom';

import AuthCard from '../UI/AuthCard';
import mailIcon from '../../assets/mail-icon.png';
import LoginForm from './LoginForm';

export default function Login() {
  return (
    <AuthCard>
      <div>
        <img className="w-10 mb-4" src={mailIcon} alt="mail icon" />
        <h1 className="font-normal text-3xl">Sign in</h1>
        <h3 className="mt-4">to continue to Rmail</h3>
      </div>

      <div className="mt-3 sm:w-80">
        <LoginForm />

        <div className="text-center text-sm">
          <p className="inline-block">Don't have an account?</p>{' '}
          <Link
            className="font-semibold text-blue-600 hover:text-blue-700"
            to="/signup"
          >
            Sign up
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
