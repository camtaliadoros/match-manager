import classes from './Layout.module.scss';
import AuthNavigation from './AuthNavigation';
import Header from '../layout/Header';
import { useSelector } from 'react-redux';
import {
  selectEmailVerified,
  selectLoggedIn,
} from '../../features/userProfile/usersSlice';
import VerificationAlert from '../auth/VerificationAlert';

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
        <AuthNavigation />
      </footer>
    </div>
  );
}

export default Layout;
