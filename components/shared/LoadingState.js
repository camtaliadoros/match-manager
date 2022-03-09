import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFutbol } from '@fortawesome/free-solid-svg-icons';

export default function LoadingState() {
  return (
    <div className='loading-wrapper'>
      <FontAwesomeIcon icon={faFutbol} className='loading-icon' />
    </div>
  );
}
