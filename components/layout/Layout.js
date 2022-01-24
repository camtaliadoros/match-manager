import classes from "./Layout.module.scss";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggedIn } from "../../features/usersSlice";
import { signOut, onAuthStateChanged, getAuth } from "firebase/auth";
import app from '../../firebase/clientApp';
import { updateUserId, updateUserStatus } from '../../features/usersSlice';
import { useRouter } from 'next/router';

function Layout(props) {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const router = useRouter();

  const isLoggedIn = useSelector(selectLoggedIn);

  const handleSignOut = async () => {
    signOut(auth);
  }


  return (
    <>
      <header className={classes.header}>
        <Link href="/">
          <a className={`${classes.logo}`}>FA</a>
        </Link>
        <nav className={classes.topnav}>
          {isLoggedIn ? <Link href="/">Dashboard</Link> : null}
          {isLoggedIn ? null : <Link href="/login">Register / Log In</Link>}
          {isLoggedIn ? <Link href="/"><a onClick={handleSignOut}>Sign Out</a></Link> : null}
        </nav>
      </header>
      <main className={classes.main}>{props.children}</main>
    </>
  );
}

export default Layout;
