import classes from "./Layout.module.scss";
import Link from "next/link";
import AuthNavigation from "./AuthNavigation";
import { useSelector } from 'react-redux';
import { selectLoggedIn } from '../../features/usersSlice';

function Layout(props) {
  const userIsLoggedIn = useSelector(selectLoggedIn);
  console.log(props)
  
  return (
    <>
      <header className={classes.header}>
        <Link href="/">
          <a className={`${classes.logo}`}>FA</a>
        </Link>
        <nav className="top-nav">
          <AuthNavigation />
        </nav>
      </header>
      <main className={classes.main}>{props.children}</main>
      <footer className="bottom-nav">
        <AuthNavigation />
      </footer>
    </>
  );
}

export default Layout;
