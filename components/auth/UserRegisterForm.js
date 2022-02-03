import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import classes from './Auth.module.scss';
import { handleAuthError } from '../../utilities/authErrorHandler';
import { auth } from '../../firebase/clientApp';

function UserRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passVal, setPassVal] = useState('');
  const [passMatch, setPassMatch] = useState(false);
  const [passAlert, setPassAlert] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    setPassMatch(passVal.length > 0 && passVal === password);
    setPassAlert(!(passMatch || passVal.length === 0));
  }, [passVal, passMatch, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) {
        sendEmailVerification(auth.currentUser);
      }
    } catch (error) {
      setAuthError(handleAuthError(error));
    }
  };

  return (
    <div className={classes.wrapper}>
      <form onSubmit={handleSubmit}>
        <label htmlFor='email-address'>Email Address</label>
        <input
          id='email-address'
          name='emailAdress'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
        />
        <label htmlFor='password'>Password</label>
        <input
          id='password'
          type='password'
          name='password'
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          minLength='8'
          required
        />
        <label htmlFor='passval'>Confirm Password</label>
        <input
          id='passval'
          type='password'
          name='passVal'
          value={passVal}
          onChange={(e) => setPassVal(e.currentTarget.value)}
          required
        />
        {passAlert ? <p>Your password does not match</p> : null}
        <div className='checkbox'>
          <input type='checkbox' id='tcs' name='tcs' required />
          <label htmlFor='tcs'>
            I accept the{' '}
            <Link href='/terms-and-conditions'>
              <a>Terms & Conditions</a>
            </Link>
          </label>
        </div>
        <button className={classes.submit} disabled={!passMatch}>
          REGISTER
        </button>
      </form>
      <div className={classes.error}>{authError}</div>
    </div>
  );
}

export default UserRegister;
