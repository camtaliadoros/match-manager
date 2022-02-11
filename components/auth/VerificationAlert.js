import { sendEmailVerification } from 'firebase/auth';
import { useState } from 'react';
import classes from './Auth.module.scss';
import { auth } from '../../firebase/clientApp';
import { handleAuthError } from '../../utilities/authErrorHandler';

export default function VerificationAlert() {
  const [clicked, setClicked] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleClick = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      setClicked(true);
    } catch (error) {
      console.log(error);
      setAuthError(handleAuthError(error));
    }
  };

  return (
    <div className={classes.alert}>
      <h2>Please verify your email address.</h2>

      {clicked ? (
        <p>Please check your e-mail</p>
      ) : (
        <button onClick={handleClick}>RE-SEND EMAIL VERIFICATION</button>
      )}
      {authError ? <p className='error'>{authError}</p> : null}
    </div>
  );
}
