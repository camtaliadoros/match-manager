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
    <nav className={classes.topnav}>
      {isLoggedIn && isEmailVerified ? <Link href="/">Dashboard</Link> : null}
      {isLoggedIn ? null : <Link href="/login">Register / Log In</Link>}
      {isLoggedIn ? (
        <Link href="/">
          <a onClick={handleSignOut}>Sign Out</a>
        </Link>
      ) : null}
    </nav>
  );
}
