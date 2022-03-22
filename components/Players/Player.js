import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeGroupPlayer,
  selectGroup,
  updatePlayerStatus,
} from '../../features/group/groupSlice';
import {
  playersIsLoading,
  selectPlayers,
} from '../../features/users/playersSlice';
import { selectCurrentUser } from '../../features/users/userSlice';
import AddAdmin from '../groups/AddAdmin';
import ProfilePhoto from '../shared/profilePhoto/ProfilePhoto';
import classes from './players.module.scss';

export default function Player({ id, status, adminView }) {
  const currentUser = useSelector(selectCurrentUser);
  const playersData = useSelector(selectPlayers);
  const isLoading = useSelector(playersIsLoading);
  const group = useSelector(selectGroup);

  const dispatch = useDispatch();

  const [playerUsername, setPlayerUsername] = useState('');
  const [playerPhoto, setPlayerPhoto] = useState();
  const [playerStatus, setPlayerStatus] = useState(status);
  const [needsNewAdmin, setNeedsNewAdmin] = useState(false);

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
  }, [id, isLoading]);

  const handleStatusChange = () => {
    const groupId = group.id;
    if (playerStatus === 'reserve') {
      dispatch(
        updatePlayerStatus({ playerId: id, groupId, playerStatus: 'core' })
      );
    }
    if (playerStatus === 'core') {
      dispatch(
        updatePlayerStatus({ playerId: id, groupId, playerStatus: 'reserve' })
      );
    }
  };

  const handleRequestChange = () => {
    const groupId = group.id;
    dispatch(
      updatePlayerStatus({ playerId: id, groupId, playerStatus: 'core' })
    );
    setPlayerStatus('core');
  };

  const handleDelete = () => {
    const groupId = group.id;
    if (status === 'admin') {
      setNeedsNewAdmin(true);
    } else {
      dispatch(removeGroupPlayer({ playerId: id, groupId }));
    }
  };

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
              {status !== 'admin' ? (
                <div>
                  <input
                    type='checkbox'
                    id='status-change'
                    checked={playerStatus === 'reserve'}
                    onChange={handleStatusChange}
                  />
                  <label htmlFor='status-change'>RESERVE</label>
                </div>
              ) : null}

              <button className='link-style' onClick={handleDelete}>
                <FontAwesomeIcon icon={faCircleXmark} />
              </button>
            </div>
          ) : (
            <div>
              <button onClick={handleRequestChange}>CONFIRM</button>
              <button onClick={handleDelete}>DELETE</button>
            </div>
          )}
        </div>
        {needsNewAdmin ? (
          <AddAdmin needsNewAdmin={setNeedsNewAdmin} currentPlayer={id} />
        ) : null}
      </div>
    );
  }
}
