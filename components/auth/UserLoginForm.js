import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import React, { useState } from 'react';
import classes from './Auth.module.scss';
import { handleAuthError } from '../../utilities/authErrorHandler';
import { auth } from '../../firebase/clientApp';

function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passResetRequested, setPassResetRequested] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setErrorMessage(handleAuthError(error));
    }
  };

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
    <div className={classes.wrapper}>
      <form className={classes.form} onSubmit={handleSubmit}>
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
          <button className={classes.linkStyle} onClick={handleResetPassword}>
            Forgot your password?
          </button>
        )}
        <button className={classes.submit}>LOGIN</button>
      </form>
      <div className={classes.authMessage}>
        <p className={classes.error}>{errorMessage}</p>
      </div>
    </div>
  );
}

export default UserLogin;
