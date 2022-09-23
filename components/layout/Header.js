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
      <div className={`${classes.navBar} mobile-hidden`}>
        <div>
          <FontAwesomeIcon icon={faFutbol} />
          <Link href='/dashboard'>Matches</Link>
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
