import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import classes from "./Auth.module.scss";
import { useRouter } from "next/router";
import { handleAuthError } from '../../utilities/authErrorHandler';

function UserRegister({auth}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passVal, setPassVal] = useState("");
  const [passMatch, setPassMatch] = useState(false);
  const [passAlert, setPassAlert] = useState(false);
  const [authError, setAuthError] = useState('');

  const router = useRouter();

  useEffect(() => {
    if (passVal.length > 0 && passVal === password) {
      setPassMatch(true);
    } else {
      setPassMatch(false);
    }
    passMatch || passVal.length === 0
      ? setPassAlert(false)
      : setPassAlert(true);
  }, [passVal, passMatch, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(handleAuthError(error));
    }
  };

  return (
    <div className={classes.wrapper}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <label htmlFor="email-address">Email Address</label>
        <input
          id="email-address"
          name="emailAdress"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          minLength="8"
          required
        />
        <label htmlFor="passval">Confirm Password</label>
        <input
          id="passval"
          type="password"
          name="passVal"
          value={passVal}
          onChange={(e) => setPassVal(e.currentTarget.value)}
          required
        />
        {passAlert ? <p>Your password does not match</p> : null}
        <div className={classes.checkbox}>
          <input type="checkbox" id="tcs" name="tcs" required />
          <label htmlFor="tcs">
            I accept the{" "}
            <Link href="/terms-and-conditions">
              <a>Terms & Conditions</a>
            </Link>
          </label>
        </div>
        <button
          onClick={handleSubmit}
          className={classes.submit}
          disabled={!passMatch}
        >
          REGISTER
        </button>
      </form>
      <div className={classes.error}>
        {authError}
      </div>
    </div>
  );
}

export default UserRegister;
