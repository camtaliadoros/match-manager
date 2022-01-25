import { sendEmailVerification } from "firebase/auth";
import { useState } from "react";
import classes from './Auth.module.scss';

export default function VerificationAlert({ auth }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    sendEmailVerification(auth.currentUser);
    setClicked(true);
  };

  return (
    <div className={classes.alert}>
      <h2>Please verify your email address.</h2>

      {clicked ? (
        <p>Please check your e-mail</p>
      ) : (
        <button onClick={handleClick}>RE-SEND EMAIL VERIFICATION</button>
      )}
    </div>
  );
}
