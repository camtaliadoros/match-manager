import Link from 'next/link';
import { useState } from 'react';
import classes from './Auth.module.scss';
import UserLogin from './UserLogin';
import UserRegisterForm from './UserRegisterForm';
import { useSelector } from 'react-redux';
import { selectEmailVerified, selectLoggedIn } from '../../features/usersSlice';

export default function UserAuthContainer() {
  const [form, setForm] = useState('login');

  const isLoggedIn = useSelector(selectLoggedIn);
  const isEmailVerified = useSelector(selectEmailVerified);

  if (!isLoggedIn) {
    return (
      <>
        <div className={classes.buttonWrapper}>
          <Link href='/'>
            {/* Swap for font awesome */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='18'
              height='17.995'
              viewBox='0 0 18 17.995'
              className={classes.closeButton}
            >
              <path
                d='M22.418,20.286l6.429-6.429a1.506,1.506,0,0,0-2.13-2.13l-6.429,6.429-6.429-6.429a1.506,1.506,0,1,0-2.13,2.13l6.429,6.429-6.429,6.429a1.506,1.506,0,0,0,2.13,2.13l6.429-6.429,6.429,6.429a1.506,1.506,0,0,0,2.13-2.13Z'
                transform='translate(-11.285 -11.289)'
                fill='#a9bda7'
              />
            </svg>
          </Link>

          <button
            onClick={() => setForm('login')}
            className={
              form === 'login' ? classes.authButtonActive : classes.authButton
            }
          >
            Sign In
          </button>

          <h2>or</h2>

          <button
            onClick={() => setForm('register')}
            className={
              form === 'login' ? classes.authButton : classes.authButtonActive
            }
          >
            Sign Up
          </button>
        </div>
        {form === 'login' ? (
          <UserLogin submitCTA={'LOGIN'} />
        ) : (
          <UserRegisterForm />
        )}
      </>
    );
  } else {
    return (
      <div className={classes.alert}>
        <h2>You are already signed in.</h2>
        <Link href='/dashboard'>
          <a className='button-style'>GO TO DASHBOARD</a>
        </Link>
      </div>
    );
  }
}
