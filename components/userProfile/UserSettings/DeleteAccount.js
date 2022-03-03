import { deleteUser, AuthErrorCodes } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { resetUser } from '../../../features/users/userSlice';
import { auth } from '../../../firebase/clientApp';
import { handleAuthError } from '../../../utilities/authErrorHandler';
import Reauth from './Reauth';

export default function DeleteAccount() {
  const [isAuth, setIsAuth] = useState();
  const [needsReauth, setNeedsReauth] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [accountDeleted, setAccountDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState();

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (isAuth) {
      setNeedsReauth(false);
      handleDeleteAccount();
    }
  }, [isAuth]);

  const handleDeleteAccount = () => {
    const user = auth.currentUser;
    setIsLoading(true);

    deleteUser(user)
      .then(() => {
        setAccountDeleted(true);
        dispatch(resetUser());
        setTimeout(() => {
          router.push('/'), 5000;
        });
      })
      .catch((error) => {
        if (error.code === AuthErrorCodes.CREDENTIAL_TOO_OLD_LOGIN_AGAIN) {
          setNeedsReauth(true);
        } else {
          setErrorMessage(handleAuthError(error));
        }
      });
    setIsLoading(false);
  };

  const handleClick = (e) => {
    e.preventDefault();
    handleDeleteAccount();
  };

  return (
    <>
      {needsReauth ? (
        <Reauth reAuth={setIsAuth} enabled={setNeedsReauth} />
      ) : null}
      {accountDeleted ? (
        <p>Your account has been deleted</p>
      ) : isLoading ? (
        <div className='spinner-container'>
          <div className='spinner'></div>
        </div>
      ) : (
        <button className='delete-btn' onClick={handleClick}>
          DELETE ACCOUNT
        </button>
      )}
      {errorMessage ? <p>{errorMessage}</p> : null}
    </>
  );
}
