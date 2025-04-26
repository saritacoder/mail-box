import { Link } from 'react-router-dom';

import AuthCard from '../UI/AuthCard';
import mailIcon from '../../assets/mail-icon.png';
import SignUpForm from './SignUpForm';

export default function SignUp() {
  return (
    <AuthCard>
      <div>
        <img className="w-10 mb-4" src={mailIcon} alt="mail icon" />
        <h1 className="font-normal text-3xl">Create a Rmail Account</h1>
        <h3 className="mt-4">Enter email and password</h3>
      </div>

      <div className="mt-3 sm:w-80">
        <SignUpForm />

        <div className="text-center text-sm">
          <p className="inline-block">Already have an account?</p>{' '}
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
