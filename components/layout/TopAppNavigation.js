import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import classes from './Layout.module.scss';

export default function TopAppNavigation() {
  return (
    <Link href='/dashboard/create-group'>
      <div className='row link-style'>
        <a>Create Group</a>
        <FontAwesomeIcon icon={faCirclePlus} className='icon-big link-style' />
      </div>
    </Link>
  );
}
