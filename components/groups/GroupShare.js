import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function GroupShare() {
  const router = useRouter();
  const currentRoute = router.asPath;
  const [textCopied, setTextCopied] = useState(false);
  // Add links
  return (
    <>
      <h3 className='title'>Invite New Players</h3>
      <div>
        <a
          href={`https://wa.me/?text=Join%20my%20football%20group: https://matcher.com${currentRoute}`}
          target='_blank'
        >
          <FontAwesomeIcon icon={faWhatsapp} />
        </a>
        <a
          href={`mailto:?subject=Join my football group&body=Join my football group: https://matcher.com${currentRoute}`}
        >
          <FontAwesomeIcon icon={faEnvelope} />
        </a>
        <button
          onClick={() => {
            navigator.clipboard.writeText(
              `Join my football group: https://matcher.com${currentRoute}`
            );
            setTextCopied(true);
            setTimeout(() => setTextCopied(false), 3000);
          }}
        >
          {textCopied ? <p>Copied</p> : <FontAwesomeIcon icon={faClone} />}
        </button>
      </div>
    </>
  );
}
