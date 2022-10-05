import classes from './Layout.module.scss';
import AuthNavigation from './AuthNavigation';
import Header from '../layout/Header';
import { useSelector } from 'react-redux';
import {
  selectEmailVerified,
  selectUserIsLoggedIn,
} from '../../features/users/userSlice';
import VerificationAlert from '../auth/VerificationAlert';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFutbol,
  faUserGroup,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import SideAppNavigation from './SideAppNavigation';
import MobileAppNavigation from './MobileAppNavigation';

function Layout(props) {
  const isEmailVerified = useSelector(selectEmailVerified);
  const isLoggedIn = useSelector(selectUserIsLoggedIn);

  return (
    <div className='outter-wrapper'>
      <Header />
      {isLoggedIn && !isEmailVerified ? (
        <VerificationAlert />
      ) : (
        <main className={classes.main}>{props.children}</main>
      )}
      <SideAppNavigation />
      <MobileAppNavigation />
    </div>
  );
}

export default Layout;
