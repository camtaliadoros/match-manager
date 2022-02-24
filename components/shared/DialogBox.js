import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function DialogBox(props) {
  const closeButton = props.close;
  return (
    <div className='modalWrapper'>
      <div className='authModal'>
        <button className='close' onClick={() => closeButton()}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <div>{props.children}</div>
      </div>
    </div>
  );
}
