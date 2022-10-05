import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFutbol,
  faUserGroup,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

export default function MobileAppNavigation() {
  return (
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
  );
}
