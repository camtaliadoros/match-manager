import classes from "./Layout.module.scss";
import Link from "next/link";
import AuthNavigation from "./AuthNavigation";

function Layout(props) {



  return (
    <>
      <header className={classes.header}>
        <Link href="/">
          <a className={`${classes.logo}`}>FA</a>
        </Link>
        <AuthNavigation />
      </header>
      <main className={classes.main}>{props.children}</main>
    </>
  );
}

export default Layout;
