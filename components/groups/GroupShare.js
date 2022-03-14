import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useRouter } from 'next/router';
import { useState } from 'react';
import classes from './groups.module.scss';

export default function GroupShare() {
  const router = useRouter();
  const currentRoute = router.asPath;
  const [textCopied, setTextCopied] = useState(false);
  // Add links
  return (
    <>
      <h3 className='title'>Invite New Players</h3>
      <div className={classes.shareLinks}>
        <a
          href={`https://wa.me/?text=Join%20my%20football%20group: https://matcher.com${currentRoute}`}
          target='_blank'
        >
          <FontAwesomeIcon className='share-icon' icon={faWhatsapp} />
        </a>
        <a
          href={`mailto:?subject=Join my football group&body=Join my football group: https://matcher.com${currentRoute}`}
        >
          <FontAwesomeIcon className='share-icon' icon={faEnvelope} />
        </a>
        <button
          className='linkStyle'
          onClick={() => {
            navigator.clipboard.writeText(
              `Join my football group: https://matcher.com${currentRoute}`
            );
            setTextCopied(true);
            setTimeout(() => setTextCopied(false), 3000);
          }}
        >
          <FontAwesomeIcon className='share-icon' icon={faClone} />{' '}
          {textCopied && <p>Copied</p>}
        </button>
      </div>
    </>
  );
}
