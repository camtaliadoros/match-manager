import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeGroupPlayer,
  selectGroup,
  updatePlayerStatus,
} from '../../features/group/groupSlice';
import AddAdmin from '../groups/AddAdmin';
import PlayerDetails from './PlayerDetails';
import classes from './players.module.scss';

export default function GroupPlayerActions({ id, status, adminView }) {
  const group = useSelector(selectGroup);

  const dispatch = useDispatch();

  const [playerStatus, setPlayerStatus] = useState(status);
  const [needsNewAdmin, setNeedsNewAdmin] = useState(false);

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
        <PlayerDetails id={id} />
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
        <PlayerDetails id={id} />
        <div>
          {status !== 'requested' ? (
            <div className={classes.actionButtons}>
              {status !== 'admin' ? (
                <div className={classes.actionContainer}>
                  <label htmlFor='status-change' className='checkbox'>
                    <input
                      type='checkbox'
                      id='status-change'
                      checked={playerStatus === 'reserve'}
                      onChange={handleStatusChange}
                    />
                    <div className='checkbox-box'>
                      <FontAwesomeIcon icon={faCheck} />
                    </div>
                    <p className={classes.playerStatus}>RESERVE</p>
                  </label>
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
