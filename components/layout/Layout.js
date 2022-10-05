import { useSelector } from 'react-redux';
import {
  selectEmailVerified,
  selectUserIsLoggedIn,
} from '../../features/users/userSlice';
import VerificationAlert from '../auth/VerificationAlert';
import Header from '../layout/Header';
import classes from './Layout.module.scss';
import MobileAppNavigation from './MobileAppNavigation';
import SideAppNavigation from './SideAppNavigation';
import TopAppNavigation from './TopAppNavigation';

function Layout(props) {
  const isEmailVerified = useSelector(selectEmailVerified);
  const isLoggedIn = useSelector(selectUserIsLoggedIn);

  return (
    <div className='outter-wrapper'>
      <Header>
        <TopAppNavigation />
      </Header>
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
