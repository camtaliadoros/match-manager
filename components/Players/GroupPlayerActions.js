import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
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

    dispatch(
      updatePlayerStatus({
        playerId: id,
        groupId,
        playerStatus: playerStatus === 'reserve' ? 'core' : 'reserve',
      })
    );
  };

  const handleRequestChange = () => {
    const groupId = group.id;
    dispatch(
      updatePlayerStatus({ playerId: id, groupId, playerStatus: 'core' })
    );
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
        {(status === 'reserve' || status === 'admin') && (
          <div>{status === 'reserve' ? <p>RESERVE</p> : <p>ADMIN</p>}</div>
        )}
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
            <div className={classes.actionButtons}>
              <button onClick={handleRequestChange} className='small-btn'>
                <FontAwesomeIcon icon={faCheck} className='btn-icon' />
              </button>
              <button onClick={handleDelete} className='small-btn red-btn'>
                <FontAwesomeIcon icon={faXmark} className='btn-icon' />
              </button>
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
