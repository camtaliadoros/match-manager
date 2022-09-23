import classes from './Layout.module.scss';
import AuthNavigation from './AuthNavigation';
import Header from '../layout/Header';
import { useSelector } from 'react-redux';
import {
  selectEmailVerified,
  selectLoggedIn,
} from '../../features/users/userSlice';
import VerificationAlert from '../auth/VerificationAlert';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFutbol,
  faUserGroup,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

function Layout(props) {
  const isEmailVerified = useSelector(selectEmailVerified);
  const isLoggedIn = useSelector(selectLoggedIn);

  return (
    <div className='outter-wrapper'>
      <Header classes={classes} />
      {isLoggedIn && !isEmailVerified ? (
        <VerificationAlert />
      ) : (
        <main className={classes.main}>{props.children}</main>
      )}

      <footer className='bottom-nav'>
        <Link href='/dashboard'>
          <FontAwesomeIcon icon={faFutbol} />
        </Link>
        <Link href='/dashboard'>
          <FontAwesomeIcon icon={faUserGroup} />
        </Link>
        <Link href='/profile'>
          <FontAwesomeIcon icon={faUser} />
        </Link>
      </footer>
    </div>
  );
}

export default Layout;
