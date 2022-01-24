import Link from "next/link";
import { useState } from "react";
import app from '../../firebase/clientApp';
import classes from "./AuthButtons.module.scss";
import UserLoginForm from "./UserLoginForm";
import UserRegisterForm from "./UserRegisterForm";
import { getAuth } from 'firebase/auth';

export default function UserAuth() {
  const [form, setForm] = useState('login');

  const auth = getAuth(app);

  return (
    <>
      <div className={classes.wrapper}>
        <Link href="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="17.995"
            viewBox="0 0 18 17.995"
            className={classes.closeButton}
          >
            <path
              id="Icon_ionic-ios-close"
              data-name="Icon ionic-ios-close"
              d="M22.418,20.286l6.429-6.429a1.506,1.506,0,0,0-2.13-2.13l-6.429,6.429-6.429-6.429a1.506,1.506,0,1,0-2.13,2.13l6.429,6.429-6.429,6.429a1.506,1.506,0,0,0,2.13,2.13l6.429-6.429,6.429,6.429a1.506,1.506,0,0,0,2.13-2.13Z"
              transform="translate(-11.285 -11.289)"
              fill="#a9bda7"
            />
          </svg>
        </Link>

        <a
          onClick={() => setForm('login')}
          className={form === 'login' ? classes.authButtonActive : classes.authButton}
          // className={`${form} === 'login' ? ${classes.authButtonActive} : ${classes.authButton}`}
        >
          Sign In
        </a>

        <h2>or</h2>

        <a
          onClick={() => setForm('register')}
          className={form === 'login' ? classes.authButton : classes.authButtonActive}
          // className={`${form} === 'login' ? ${classes.authButton} : ${classes.authButtonActive}`}
        >
          Sign Up
        </a>
      </div>
      {form === 'login' ? <UserLoginForm auth={auth}/> : <UserRegisterForm auth={auth}/>}
    </>
  );
}
