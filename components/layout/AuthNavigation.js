import { useSelector } from "react-redux";
import { selectLoggedIn, selectEmailVerified } from "../../features/usersSlice";
import { signOut, getAuth } from "firebase/auth";
import app from "../../firebase/clientApp";
import classes from "./Layout.module.scss";
import Link from "next/link";

export default function AuthNavigation() {
  const auth = getAuth(app);

  const isLoggedIn = useSelector(selectLoggedIn);
  const isEmailVerified = useSelector(selectEmailVerified);

  const handleSignOut = async () => {
    signOut(auth);
  };
  return (
    <div className={classes.navLinks}>
      {isLoggedIn && isEmailVerified ? <Link href="/"><a>Dashboard</a></Link> : null}
      {isLoggedIn ? null : <Link href="/login"><a>Register / Log In</a></Link>}
      {isLoggedIn ? (
        <Link href="/">
          <a onClick={handleSignOut}>Sign Out</a>
        </Link>
      ) : null}
    </div>
  );
}
