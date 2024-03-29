import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import Link from 'next/link';
import React, { useState } from 'react';
import { auth } from '../../firebase/clientApp';
import { handleAuthError } from '../../utilities/authErrorHandler';
import classes from './Auth.module.scss';
import { useDispatch } from 'react-redux';
import { createUser } from '../../features/users/userSlice';
import PasswordComparison from './PasswordComparison';

function UserRegister() {
  const [email, setEmail] = useState('');
  const [authError, setAuthError] = useState('');
  const [password, setPassword] = useState('');
  const [passMatch, setPassMatch] = useState(true);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = email.split('@')[0];
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        const userData = {
          id: auth.currentUser.uid,
          username: username,
        };
        sendEmailVerification(auth.currentUser);
        dispatch(createUser(userData));
      }
    } catch (error) {
      setAuthError(handleAuthError(error));
    }
  };

  return (
    <div className={classes.wrapper}>
      <form aria-label='form' onSubmit={handleSubmit}>
        <label htmlFor='email-address'>Email Address</label>
        <input
          id='email-address'
          name='emailAdress'
          type='email'
          aria-label='email-adress'
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
        />
        <PasswordComparison
          setPwd={setPassword}
          match={setPassMatch}
          label='Password'
          required={true}
        />
        <div className='checkbox'>
          <input type='checkbox' id='tcs' name='tcs' required />
          <label htmlFor='tcs'>
            I accept the{' '}
            <Link href='/terms-and-conditions'>
              <a>Terms & Conditions</a>
            </Link>
          </label>
        </div>
        <button className='submit' disabled={!passMatch}>
          REGISTER
        </button>
      </form>
      <div className='error'>{authError}</div>
    </div>
  );
}

export default UserRegister;
