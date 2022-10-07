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

export default function GroupPlayerActions({
  playerId,
  playerStatus,
  adminView,
}) {
  const dispatch = useDispatch();

  const group = useSelector(selectGroup);

  const [needsNewAdmin, setNeedsNewAdmin] = useState(false);

  const handleStatusChange = () => {
    dispatch(
      updatePlayerStatus({
        groupId: group.id,
        playerId,
        playerStatus: playerStatus === 'reserve' ? 'core' : 'reserve',
      })
    );
  };

  const handleDelete = () => {
    const groupId = group.id;
    if (playerStatus === 'admin') {
      setNeedsNewAdmin(true);
    } else {
      dispatch(removeGroupPlayer({ playerId, groupId }));
    }
  };

  const handleRequestChange = () => {
    const groupId = group.id;
    dispatch(updatePlayerStatus({ playerId, groupId, playerStatus: 'core' }));
  };

  // const group = useSelector(selectGroup);
  // const dispatch = useDispatch();
  // const [needsNewAdmin, setNeedsNewAdmin] = useState(false);
  // const handleStatusChange = () => {
  //   const groupId = group.id;
  //   const newStatus = status === 'reserve' ? 'core' : 'reserve';
  //   dispatch(
  //     updatePlayerStatus({
  //       playerId,
  //       groupId,
  //       playerStatus: newStatus,
  //     })
  //   );
  // };
  // const handleRequestChange = () => {
  //   const groupId = group.id;
  //   dispatch(updatePlayerStatus({ playerId, groupId, playerStatus: 'core' }));
  // };
  // const handleDelete = () => {
  //   const groupId = group.id;
  //   if (status === 'admin') {
  //     setNeedsNewAdmin(true);
  //   } else {
  //     dispatch(removeGroupPlayer({ playerId, groupId }));
  //   }
  // };

  if (adminView) {
    return (
      <div className={classes.playerRow}>
        <PlayerDetails playerId={playerId} />
        <div>
          {playerStatus !== 'requested' ? (
            <div className={classes.actionButtons}>
              {playerStatus !== 'admin' ? (
                <div className={classes.actionContainer}>
                  <input
                    id={`status-chage-${playerId}`}
                    type='checkbox'
                    checked={playerStatus === 'reserve'}
                    onChange={handleStatusChange}
                  />
                  <label
                    htmlFor={`status-chage-${playerId}`}
                    className='checkbox'
                  >
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
          <AddAdmin needsNewAdmin={setNeedsNewAdmin} currentPlayer={playerId} />
        ) : null}
      </div>
    );
  } else {
    return (
      <div className={classes.playerRow}>
        <PlayerDetails playerId={playerId} />
        {(playerStatus === 'reserve' || playerStatus === 'admin') && (
          <div>
            {playerStatus === 'reserve' ? <p>RESERVE</p> : <p>ADMIN</p>}
          </div>
        )}
      </div>
    );
  }
}
