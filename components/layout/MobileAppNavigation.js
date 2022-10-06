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
        <a>
          <FontAwesomeIcon icon={faFutbol} />
        </a>
      </Link>
      <Link href='/dashboard/my-groups'>
        <a>
          <FontAwesomeIcon icon={faUserGroup} />
        </a>
      </Link>
      <Link href='/profile'>
        <a>
          <FontAwesomeIcon icon={faUser} />
        </a>
      </Link>
    </footer>
  );
}
