import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentMatch,
  selectMatchPlayers,
  selectMatchPlayersByStatus,
  updatePlayerMatchStatus,
} from '../../features/matches/matchSlice';
import { selectCurrentUser, setUser } from '../../features/users/userSlice';

export default function MatchPlayerStatus() {
  const currentUser = useSelector(selectCurrentUser);
  const matchPlayersData = useSelector(selectMatchPlayers);
  const currentMatch = useSelector(selectCurrentMatch);
  const matchPlayersStatus = useSelector(selectMatchPlayersByStatus);

  const dispatch = useDispatch();

  const [userStatus, setUserStatus] = useState();
  const [statusTitle, setstatusTitle] = useState();
  const [actionButtonTitle, setActionButtonTitle] = useState();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (matchPlayersData) {
      if (matchPlayersStatus.playing.includes(currentUser.id)) {
        setUserStatus('playing');
        setstatusTitle(`You're in!`);
      } else if (matchPlayersStatus.notPlaying.includes(currentUser.id)) {
        setUserStatus('notPlaying');
        setstatusTitle(`You're out!`);
      } else if (matchPlayersStatus.waitlist.includes(currentUser.id)) {
        setUserStatus('waitlist');
        setstatusTitle('On waitlist');
      } else if (matchPlayersStatus.requested.includes(currentUser.id)) {
        setUserStatus('requested');
        setstatusTitle('Request pending');
      } else if (matchPlayersStatus.invited.includes(currentUser.id)) {
        setUserStatus('invited');
      }

      if (matchPlayersStatus.playing.length >= currentMatch.numOfPlayers) {
        setActionButtonTitle('WL');
      } else {
        setActionButtonTitle('IN');
      }
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
        <p>{statusTitle}</p>
        <button type='button' onClick={handleEditClick}>
          edit
        </button>
      </>
    );
  }
}
