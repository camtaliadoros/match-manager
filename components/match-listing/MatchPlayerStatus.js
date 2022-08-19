import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentMatch,
  selectMatchPlayers,
  updatePlayerMatchStatus,
} from '../../features/matches/matchSlice';
import { selectCurrentUser } from '../../features/users/userSlice';

export default function MatchPlayerStatus() {
  const currentUser = useSelector(selectCurrentUser);
  const matchPlayersData = useSelector(selectMatchPlayers);
  const currentMatch = useSelector(selectCurrentMatch);

  console.log(matchPlayersData);

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
          newStatus: 'waitlist',
        })
      );
    }
    // setUserStatus('playing');
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
    // setUserStatus('notPlaying');
    setIsEditing(false);
  };

  if (userStatus === 'invited' || isEditing === true) {
    return (
      <>
        <button
          type='button'
          onClick={handleInClick}
          disabled={userStatus === 'playing'}
        >
          {actionButtonTitle}
        </button>
        <button
          type='button'
          onClick={handleOutClick}
          disabled={userStatus === 'notPlaying'}
        >
          OUT
        </button>
      </>
    );
  } else {
    return (
      <>
        <p>{userStatus === 'playing' && `You're in!`}</p>
        <button type='button' onClick={handleEditClick}>
          edit
        </button>
      </>
    );
  }
}
