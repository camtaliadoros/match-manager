import React from "react";
import classes from "./Auth.module.scss";
import AuthButtons from "./AuthButtons";
import RegisterForm from "./RegisterForm";

function Auth() {
  return (
    <div className={classes.wrapper}>
      <AuthButtons />
        <RegisterForm />
    </div>
  );
}

export default Auth;
