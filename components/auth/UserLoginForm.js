import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase/clientApp';
import { handleAuthError } from '../../utilities/authErrorHandler';
import classes from './Auth.module.scss';

function UserLoginForm({ loginEmail, loginPwd }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passResetRequested, setPassResetRequested] = useState(false);

  useEffect(() => {
    loginEmail(email);
    loginPwd(password);
  }, [email, password]);

  const handleResetPassword = async () => {
    setErrorMessage('');
    if (!email) {
      setErrorMessage('Please fill in your email address.');
    } else {
      try {
        await sendPasswordResetEmail(auth, email);
        setPassResetRequested(true);
      } catch (error) {
        setErrorMessage(handleAuthError(error));
      }
    }
  };

  return (
    <>
      <label htmlFor='email-address'>Email Address</label>
      <input
        id='email-address'
        type='email'
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        required
      />
      <label htmlFor='password'>Password</label>
      <input
        id='password'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        minLength='8'
        required
      />
      {passResetRequested ? (
        <p className={classes.passwordReset}>Please check your email.</p>
      ) : (
        <button
          type='button'
          className='linkStyle'
          onClick={handleResetPassword}
        >
          Forgot your password?
        </button>
      )}
      {errorMessage ? <p>{errorMessage}</p> : null}
    </>
  );
}

export default UserLoginForm;
