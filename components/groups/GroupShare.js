import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

export default function GroupShare() {
  return (
    <>
      <h3 className='title'>Invite New Players</h3>
      <div>
        <FontAwesomeIcon icon={faWhatsapp} />
        <FontAwesomeIcon icon={faEnvelope} />
        <FontAwesomeIcon icon={faClone} />
      </div>
    </>
  );
}
