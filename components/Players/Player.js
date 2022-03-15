import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  playersIsLoading,
  selectPlayers,
} from '../../features/users/playersSlice';
import { selectCurrentUser } from '../../features/users/userSlice';
import ProfilePhoto from '../shared/profilePhoto/ProfilePhoto';
import classes from './players.module.scss';

export default function Player({ id, status, adminView }) {
  const currentUser = useSelector(selectCurrentUser);
  const playersData = useSelector(selectPlayers);
  const isLoading = useSelector(playersIsLoading);

  const [playerUsername, setPlayerUsername] = useState('');
  const [playerPhoto, setPlayerPhoto] = useState();

  useEffect(() => {
    if (id === currentUser.id) {
      setPlayerUsername(currentUser.username);
      setPlayerPhoto(currentUser.photo);
    } else {
      if (playersData[id]) {
        const player = playersData[id];

        setPlayerUsername(player.username);
        setPlayerPhoto(player.photo);
      }
    }
  }, [isLoading]);

  if (!adminView) {
    return (
      <div className={classes.playerRow}>
        <div>
          <div className={classes.profileIcon}>
            <ProfilePhoto username={playerUsername} userPhoto={playerPhoto} />
          </div>
          <p>
            {playerUsername}
            {id === currentUser.id ? '- YOU' : null}
          </p>
        </div>
        <div>
          {status === 'reserve' ? <p>RESERVE</p> : null}
          {status === 'admin' ? <p>ADMIN</p> : null}
        </div>
      </div>
    );
  }

  if (adminView) {
    return (
      <div className={classes.playerRow}>
        <div>
          <div className={classes.profileIcon}>
            <ProfilePhoto username={playerUsername} userPhoto={playerPhoto} />
          </div>
          <p>
            {playerUsername}
            {id === currentUser.id ? '- YOU' : null}
          </p>
        </div>
        <div>
          {status !== 'requested' ? (
            <div>
              <div>
                {status === 'core' ? (
                  <button className={classes.coreButton}>RESERVE</button>
                ) : null}
                {status === 'reserve' ? (
                  <button className={classes.reserveButton}>RESERVE</button>
                ) : null}
              </div>
              <button className='link-style'>
                <FontAwesomeIcon icon={faCircleXmark} />
              </button>
            </div>
          ) : (
            <div>
              <button>CONFIRM</button>
              <button>DELETE</button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
