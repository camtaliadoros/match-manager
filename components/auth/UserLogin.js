import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import classes from './Auth.module.scss';
import { handleAuthError } from '../../utilities/authErrorHandler';
import { auth } from '../../firebase/clientApp';
import UserLoginForm from './UserLoginForm';

function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setErrorMessage(handleAuthError(error));
    }
  };

  return (
    <div className={classes.wrapper}>
      <form onSubmit={handleSubmit}>
        <UserLoginForm
          loginEmail={setEmail}
          loginPwd={setPassword}
          error={setErrorMessage}
        />
        <button className={classes.submit}>LOGIN</button>
      </form>
      {errorMessage ? errorMessage : null}
      <div className={classes.authMessage}></div>
    </div>
  );
}

export default UserLogin;
