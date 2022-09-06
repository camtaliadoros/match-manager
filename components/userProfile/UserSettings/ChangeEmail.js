import { updateEmail } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../../../firebase/clientApp';
import {
  selectCurrentUserDetails,
  updateUserEmail,
} from '../../../features/users/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import Reauth from './Reauth';
import { handleAuthError } from '../../../utilities/authErrorHandler';
import { AuthErrorCodes } from 'firebase/auth';

export default function ChangeEmail() {
  const [email, setEmail] = useState();
  const [emailChanged, setEmailChanged] = useState(false);
  const [isLoading, setIsLoading] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [needsReauth, setNeedsReauth] = useState();
  const [isAuth, setIsAuth] = useState();

  const user = useSelector(selectCurrentUserDetails);
  const currentEmail = user.emailAddress;

  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuth) {
      setNeedsReauth(false);
      handleUpdateEmail();
    }
  }, [needsReauth, isAuth]);

  const handleUpdateEmail = async () => {
    setIsLoading(true);
    if (email === currentEmail) {
      setErrorMessage('This email address is already in use.');
    }
    if (email !== currentEmail) {
      try {
        await updateEmail(auth.currentUser, email);
        dispatch(updateUserEmail(auth.currentUser.email));
        setErrorMessage('');
        setEmailChanged(true);
      } catch (error) {
        if (error.code === AuthErrorCodes.CREDENTIAL_TOO_OLD_LOGIN_AGAIN) {
          setNeedsReauth(true);
        } else {
          setErrorMessage(handleAuthError(error));
        }
      }
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdateEmail();
  };

  return (
    <>
      {needsReauth ? (
        <Reauth reAuth={setIsAuth} enabled={setNeedsReauth} />
      ) : null}
      <h2>Update your email address</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor='email-address'>New email address</label>
        <input
          id='email-address'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
        />
        {emailChanged ? (
          <>
            <p className='success-message'>EMAIL CHANGED</p>
            <p className='success-message'>Please check your email.</p>
          </>
        ) : (
          <button disabled={isLoading}>
            {isLoading ? (
              <div className='spinner-container'>
                <div className='spinner'></div>
              </div>
            ) : (
              'UPDATE'
            )}
          </button>
        )}
        {errorMessage ? <p className='error'>{errorMessage}</p> : null}
      </form>
    </>
  );
}
