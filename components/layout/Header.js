import Link from 'next/link';
import classes from './Layout.module.scss';

export default function Header(props) {
  return (
    <>
      <header className={classes.header}>
        <Link href='/'>
          <a className='logo'>FA</a>
        </Link>
        <nav className='mobile-hidden'>{props.children}</nav>
      </header>
    </>
  );
}
