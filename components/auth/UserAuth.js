import Link from "next/link";
import { useState } from "react";
import app from "../../firebase/clientApp";
import classes from "./Auth.module.scss";
import UserLoginForm from "./UserLoginForm";
import UserRegisterForm from "./UserRegisterForm";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import {
  updateUserId,
  updateUserStatus,
  updateEmailVerified,
  resetUser,
} from "../../features/usersSlice";
import { useRouter } from "next/router";
import VerificationAlert from "./VerificationAlert";

export default function UserAuth() {
  const [form, setForm] = useState("login");
  const [alert, setAlert] = useState(false);
  const [user, setUser] = useState("");
  const router = useRouter();
  const auth = getAuth(app);
  const dispatch = useDispatch();

  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
      dispatch(updateUserStatus(true));
      dispatch(updateUserId(currentUser.uid));
      if (currentUser.emailVerified) {
        dispatch(updateEmailVerified(true));
      } else {
        setAlert(true);
      }
    } else {
      dispatch(resetUser());
    }
  });

  if (!user) {
    return (
      <>
        <div className={classes.buttonWrapper}>
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
            onClick={() => setForm("login")}
            className={
              form === "login" ? classes.authButtonActive : classes.authButton
            }
          >
            Sign In
          </a>

          <h2>or</h2>

          <a
            onClick={() => setForm("register")}
            className={
              form === "login" ? classes.authButton : classes.authButtonActive
            }
          >
            Sign Up
          </a>
        </div>
        {form === "login" ? (
          <UserLoginForm auth={auth} />
        ) : (
          <UserRegisterForm auth={auth} />
        )}
      </>
    );
  } else {
    if (!auth.currentUser.emailVerified) {
      return <VerificationAlert auth={auth} />;
    } else {
      return (
        <div className={classes.alert}>
          <h2>You are already signed in.</h2>
          <button>GO TO DASHBOARD</button>
        </div>
      );
    }
  }
}
