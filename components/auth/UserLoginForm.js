import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from "react";
import { auth } from '../../firebase/clientApp';
import classes from "./Auth.module.scss";



function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className={classes.wrapper}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <label htmlFor="email-address">Email Address</label>
        <input
          id="email-address"
          name="emailAdress"
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
        <button onClick={handleSubmit} className={classes.submit}>LOGIN</button>
      </form>
    </div>
  );
}

export default UserLogin;
