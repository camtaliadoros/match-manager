import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import classes from "./Auth.module.scss";

const auth = getAuth();

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passVal, setPassVal] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [passMatch, setPassMatch] = useState(false);
  const [passAlert, setPassAlert] = useState(false);



useEffect(() => {
        if (passVal.length > 0 && passVal === password) {
            setPassMatch(true)
        } else {
            setPassMatch(false);
        }
    passMatch ? setPassAlert(false) : setPassAlert(true);
        
}, [passVal, passMatch, password]);

  const handleSubmit = (e) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  return (
      <form className={classes.form} onSubmit={handleSubmit}>
        <label htmlFor="email-address">Email Address</label>
        <input
          id="email-address"
          name='emailAdress'
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name='password'
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          minLength="8"
          required
        />
        <label htmlFor="passval">Confirm Password</label>
        <input
          id="passval"
          type="password"
          name='passVal'
          value={passVal}
          onChange={(e) => setPassVal(e.currentTarget.value)}
          required
        />
        { passAlert ? <p className={classes.passwordAlertDisabled}>Your password does not match</p> : null}
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name='name'
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          required
        />
        <label htmlFor="last-name">Last Name</label>
        <input
          id="last-name"
          name='lastName'
          value={lastName}
          onChange={(e) => setLastName(e.currentTarget.value)}
          required
        />
        <div className={classes.checkbox}>
          <input type="checkbox" id="tcs" name='tcs' required />
          <label htmlFor="tcs">
            I accept the{" "}
            <Link href="/terms-and-conditions">
              <a>Terms & Conditions</a>
            </Link>
          </label>
        </div>
        <input type='submit' className={classes.submit} disabled={!passMatch}/>
      </form>
  );
}

export default RegisterForm;
