import {
  faFutbol,
  faUserGroup,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import {
  selectEmailVerified,
  selectLoggedIn,
} from '../../features/users/userSlice';
import AuthNavigation from './AuthNavigation';
import classes from './Layout.module.scss';

export default function Header() {
  const isLoggedIn = useSelector(selectLoggedIn);
  const isEmailVerified = useSelector(selectEmailVerified);

  return (
    <>
      <header className={classes.header}>
        <Link href='/'>
          <a className='logo'>FA</a>
        </Link>
        <nav className='mobile-hidden'>
          <AuthNavigation authClass={classes.navLinks} />
        </nav>
      </header>
      {isLoggedIn && isEmailVerified ? (
        <div className={`${classes.navBar} mobile-hidden`}>
          <div>
            <FontAwesomeIcon icon={faFutbol} />
            <Link href='/dashboard'>Matches</Link>
          </div>
          <div>
            <FontAwesomeIcon icon={faUserGroup} />
            <Link href='/dashboard/my-groups'>Groups</Link>
          </div>
          <div>
            <FontAwesomeIcon icon={faUser} />
            <Link href='/profile'>Profile</Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
