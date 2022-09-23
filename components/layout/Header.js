import {
  faFutbol,
  faUserGroup,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import AuthNavigation from './AuthNavigation';

export default function Header({ classes }) {
  return (
    <>
      <header className={classes.header}>
        <div>
          <Link href='/'>
            <a className='logo'>FA</a>
          </Link>
          <nav className='mobile-hidden'>
            <AuthNavigation authClass={classes.navLinks} />
          </nav>
        </div>
      </header>
      <div className={classes.navBar}>
        <div>
          <Link href='/dashboard'>
            <FontAwesomeIcon icon={faFutbol} />
            Matches
          </Link>
        </div>
        <div>
          <FontAwesomeIcon icon={faUserGroup} />
          <Link href='/dashboard'>Groups</Link>
        </div>
        <div>
          <FontAwesomeIcon icon={faUser} />
          <Link href='/profile'>Profile</Link>
        </div>
      </div>
    </>
  );
}
