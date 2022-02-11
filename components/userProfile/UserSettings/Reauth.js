import { useEffect, useState } from 'react';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../../../firebase/clientApp';
import { handleAuthError } from '../../../utilities/authErrorHandler';

export default function Reauth({ isAuth }) {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isReauth, setIsReauth] = useState();

  useEffect(() => {
    isAuth(isReauth);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      password
    );

    try {
      await reauthenticateWithCredential(auth.currentUser, credential);
      setIsReauth(true);
    } catch (error) {
      setErrorMessage(handleAuthError(error));
      setIsReauth(false);
    }
  };

  return (
    <div className='form-wrapper'>
      <form onSubmit={handleSubmit}>
        <label htmlFor='password'>Please enter your current password</label>
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
        <button>NEXT</button>
      </form>

      {errorMessage ? <p>{errorMessage}</p> : null}
    </div>
  );
}
