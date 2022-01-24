import classes from "./Layout.module.scss";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectLoggedIn } from "../../features/usersSlice";

function Layout(props) {
  const isLoggedIn = useSelector(selectLoggedIn);

  return (
    <>
      <header className={classes.header}>
        <Link href="/">
          <a className={`${classes.logo}`}>FA</a>
        </Link>
        <nav className={classes.topnav}>
          {isLoggedIn ? <Link href="/">Dashboard</Link> : null}
          {isLoggedIn ? null : <Link href="/login">Register / Log In</Link>}
          {isLoggedIn ? <Link href="/">Sign Out</Link> : null}
        </nav>
      </header>
      <main className={classes.main}>{props.children}</main>
    </>
  );
}

export default Layout;
