import { useEffect, useState } from 'react';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../../../firebase/clientApp';
import { handleAuthError } from '../../../utilities/authErrorHandler';
import DialogBox from '../../shared/DialogBox';

export default function Reauth({ reAuth, enabled }) {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isReauth, setIsReauth] = useState();
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    reAuth(isReauth);
  }, [isReauth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      password
    );

    try {
      await reauthenticateWithCredential(auth.currentUser, credential);
      setIsReauth(true);
      setIsLoading(false);
      enabled(false);
    } catch (error) {
      setErrorMessage(handleAuthError(error));
      setIsReauth(false);
    }
  };

  const handleCloseButton = () => {
    enabled(false);
  };

  return (
    <>
      <DialogBox close={handleCloseButton}>
        <div className='form-wrapper'>
          <form onSubmit={handleSubmit}>
            <h2>Please enter your current password</h2>
            <input
              id='new-password'
              type='password'
              name='password'
              aria-label='password'
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              minLength='8'
              required
            />
            {isLoading ? (
              <div className='spinner-container'>
                <div className='spinner'></div>
              </div>
            ) : (
              <button>NEXT</button>
            )}
          </form>

          {errorMessage ? <p>{errorMessage}</p> : null}
        </div>
      </DialogBox>
    </>
  );
}
