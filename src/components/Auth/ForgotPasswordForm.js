import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

import { useSelector, useDispatch } from 'react-redux';
import { toggleSpinner } from '../../reducers/uiSlice';

import Spinner from '../UI/Spinner';

export default function ForgotPasswordForm() {
  const emailRef = useRef();

  const spinner = useSelector((state) => state.uiState.spinner);
  const dispatch = useDispatch();

  async function handleFormSubmit(event) {
    event.preventDefault();
    dispatch(toggleSpinner(true));

    try {
      const response = await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyCNcHCnrKiBY3UJe3lIviL1ZRguuvSWCE8',
        {
          method: 'POST',
          body: JSON.stringify({
            requestType: 'PASSWORD_RESET',
            email: emailRef.current.value,
          }),
        }
      );
      if (response.ok) {
        toast.success('Password reset link has been sent to your email');
      } else {
        const data = await response.json();
        throw new Error(data.error.message);
      }
    } catch (error) {
      toast.error(error.message);
    }

    dispatch(toggleSpinner(false));
  }

  useEffect(() => {
    emailRef.current.focus();
  }, []);
  return (
    <form onSubmit={handleFormSubmit}>
      <div className="mb-6">
        <label
          className="block font-semibold text-sm text-gray-800 mb-1"
          htmlFor="email"
        >
          Email
        </label>
        <input
          className="ring-1 ring-inset ring-gray-300 w-full py-1 px-2 rounded-md shadow-sm focus:outline-blue-700 autofill:bg-yellow-200"
          type="email"
          id="email"
          ref={emailRef}
        />
      </div>

      <div className="mb-6">
        <button
          className="rounded-md py-2 w-full text-sm text-center font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:outline-blue-700 focus:outline-offset-2"
          type="submit"
        >
          {spinner ? <Spinner /> : 'Get reset link'}
        </button>
      </div>
    </form>
  );
}
