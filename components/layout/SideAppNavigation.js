import { useSelector } from 'react-redux';
import {
  selectEmailVerified,
  selectUserIsLoggedIn,
} from '../../features/users/userSlice';
import classes from './Layout.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFutbol,
  faUserGroup,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function SideAppNavigation() {
  const isLoggedIn = useSelector(selectUserIsLoggedIn);
  const isEmailVerified = useSelector(selectEmailVerified);

  return (
    <>
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
