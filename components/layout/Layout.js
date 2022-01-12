import classes from "./Layout.module.scss";
import Link from "next/link";

function Layout(props) {
  return (
    <>
      <header className={classes.header}>
        <Link href="/">
          <p className={classes.header}>FA</p>
        </Link>
      </header>
      <main className={classes.main}>{props.children}</main>
    </>
  );
}

export default Layout;
