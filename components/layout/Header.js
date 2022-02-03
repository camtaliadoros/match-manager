import Link from 'next/link';
import AuthNavigation from './AuthNavigation';

export default function Header({ classes }) {
  return (
    <header className={classes.header}>
      <Link href='/'>
        <a className='logo'>FA</a>
      </Link>
      <nav className='mobile-hidden'>
        <AuthNavigation authClass={classes.navLinks} />
      </nav>
    </header>
  );
}
