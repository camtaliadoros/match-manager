import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentMatch,
  selectMatchPlayers,
  selectMatchPlayersByStatus,
  updatePlayerMatchStatus,
} from '../../features/matches/matchSlice';
import { selectCurrentUser } from '../../features/users/userSlice';
import classes from './match.module.scss';
export default function MatchPlayerStatus() {
  const currentUser = useSelector(selectCurrentUser);
  const matchPlayersData = useSelector(selectMatchPlayers);
  const currentMatch = useSelector(selectCurrentMatch);
  const matchPlayersByStatus = useSelector(selectMatchPlayersByStatus);

  const dispatch = useDispatch();

  const [userStatus, setUserStatus] = useState();
  const [actionButtonTitle, setActionButtonTitle] = useState();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (matchPlayersData?.length) {
      const player = matchPlayersData.find(
        (p) => p.playerId === currentUser.id
      );
      setUserStatus(player.playerStatus);
    }
  }, [matchPlayersData]);

  useEffect(() => {
    if (matchPlayersByStatus?.playing.length >= currentMatch.numOfPlayers) {
      setActionButtonTitle('WL');
    } else {
      setActionButtonTitle('IN');
    }
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInClick = () => {
    const dataToUpdate = {
      playerId: currentUser.id,
      matchId: currentMatch.id,
      currentStatus: userStatus,
    };
    if (actionButtonTitle === 'WL') {
      dispatch(
        updatePlayerMatchStatus({
          ...dataToUpdate,
          newStatus: 'waitlist',
        })
      );
    } else {
      dispatch(
        updatePlayerMatchStatus({
          ...dataToUpdate,
          newStatus: 'playing',
        })
      );
    }
    setIsEditing(false);
  };

  const handleOutClick = () => {
    dispatch(
      updatePlayerMatchStatus({
        playerId: currentUser.id,
        matchId: currentMatch.id,
        currentStatus: userStatus,
        newStatus: 'notPlaying',
      })
    );
    if (
      matchPlayersByStatus?.playing.length <= currentMatch.numOfPlayers &&
      matchPlayersByStatus?.waitlist.length > 0 &&
      userStatus === 'playing'
    ) {
      dispatch(
        updatePlayerMatchStatus({
          playerId: matchPlayersByStatus.waitlist[0].playerId,
          matchId: currentMatch.id,
          currentStatus: 'waitlist',
          newStatus: 'playing',
        })
      );
    }
    setIsEditing(false);
  };

  if (userStatus === 'invited' || isEditing === true) {
    return (
      <div className={classes.playerStatusWrapper}>
        <button
          type='button'
          onClick={handleInClick}
          disabled={userStatus === 'playing' || userStatus === 'waitlist'}
          className={`${classes.playerStatusButton} ${
            actionButtonTitle === 'WL' ? classes.waitlistBtn : null
          }`}
        >
          {actionButtonTitle}
        </button>
        <button
          type='button'
          onClick={handleOutClick}
          disabled={userStatus === 'notPlaying'}
          className={`${classes.playerStatusButton} ${classes.outBtn}`}
        >
          OUT
        </button>
      </div>
    );
  } else {
    return (
      <div className={classes.playerStatusWrapper}>
        {userStatus === 'playing' && <p>You're in!</p>}
        {userStatus === 'notPlaying' && <p>You're out!</p>}
        {userStatus === 'waitlist' && <p>On waitlist</p>}
        {userStatus === 'requested' && <p>Request pending</p>}
        <button type='button' className='link-style' onClick={handleEditClick}>
          <FontAwesomeIcon icon={faPencil} className='icon' />
        </button>
      </div>
    );
  }
}
