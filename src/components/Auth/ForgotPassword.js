import { Link } from 'react-router-dom';

import AuthCard from '../UI/AuthCard';
import mailIcon from '../../assets/mail-icon.png';
import ForgotPasswordForm from './ForgotPasswordForm';

export default function ForgotPassword() {
  return (
    <AuthCard>
      <div>
        <img className="w-10 mb-4" src={mailIcon} alt="mail icon" />
        <h1 className="font-normal text-3xl">Reset your Password</h1>
        <h3 className="mt-4">Enter registered email</h3>
      </div>

      <div className="mt-3 sm:w-80">
        <ForgotPasswordForm />

        <div className="text-center text-sm">
          <p className="inline-block">Know your password?</p>{' '}
          <Link
            className="font-semibold text-blue-600 hover:text-blue-700"
            to="/login"
          >
            Sign in
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
