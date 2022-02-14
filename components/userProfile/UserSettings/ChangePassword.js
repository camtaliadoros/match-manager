import PasswordComparison from '../../auth/PasswordComparison';
import { useEffect, useState } from 'react';
import { auth } from '../../../firebase/clientApp';
import { handleAuthError } from '../../../utilities/authErrorHandler';
import { updatePassword, AuthErrorCodes } from 'firebase/auth';
import Reauth from './Reauth';

export default function ChangePassword() {
  const [password, setPassword] = useState();
  const [passMatch, setPassMatch] = useState(true);
  const [passChanged, setPassChanged] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState();
  const [needsReauth, setNeedsReauth] = useState();
  const [isAuth, setIsAuth] = useState();

  useEffect(() => {
    setPassChanged(false);
  }, [password]);

  useEffect(() => {
    if (isAuth) {
      setNeedsReauth(false);
      handleUpdatePassword();
    }
  }, [needsReauth, isAuth]);

  const handleUpdatePassword = async () => {
    setIsLoading(true);
    try {
      await updatePassword(auth.currentUser, password);
      setPassChanged(true);
      setIsLoading(false);
      setErrorMessage('');
    } catch (error) {
      if (error.code === AuthErrorCodes.CREDENTIAL_TOO_OLD_LOGIN_AGAIN) {
        setNeedsReauth(true);
      } else {
        setErrorMessage(handleAuthError(error));
      }
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleUpdatePassword();
  };

  return (
    <>
      {needsReauth ? <Reauth reAuth={setIsAuth} /> : null}
      <h2>Change your password</h2>
      <form>
        <PasswordComparison
          pwd={setPassword}
          match={setPassMatch}
          label={'Change Password'}
          required={false}
        />
        {passChanged ? (
          <p className='success-message'>PASSWORD CHANGED</p>
        ) : (
          <button onClick={handleSubmit} disabled={!passMatch}>
            {isLoading ? (
              <div className='spinner-container'>
                <div className='spinner'></div>
              </div>
            ) : (
              'SAVE'
            )}
          </button>
        )}
        {errorMessage ? <p>{errorMessage}</p> : null}
      </form>
    </>
  );
}
