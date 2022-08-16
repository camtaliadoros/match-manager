import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentMatch,
  selectMatchPlayers,
  updatePlayerMatchStatus,
} from '../../features/matches/matchSlice';
import { selectCurrentUser, setUser } from '../../features/users/userSlice';

export default function MatchPlayerStatus() {
  const currentUser = useSelector(selectCurrentUser);
  const matchPlayers = useSelector(selectMatchPlayers);
  const currentMatch = useSelector(selectCurrentMatch);

  const dispatch = useDispatch();

  const [userStatus, setUserStatus] = useState();
  const [statusTitle, setstatusTitle] = useState();
  const [actionButtonTitle, setActionButtonTitle] = useState();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (matchPlayers) {
      const playing = matchPlayers.playing.find(
        (player) => player.playerId === currentUser.id
      );
      const notPlaying = matchPlayers.notPlaying.find(
        (player) => player.playerId === currentUser.id
      );
      const waitlist = matchPlayers.waitlist.find(
        (player) => player.playerId === currentUser.id
      );
      const requested = matchPlayers.requested.find(
        (player) => player.playerId === currentUser.id
      );
      const invited = matchPlayers.invited.find(
        (player) => player.playerId === currentUser.id
      );
      if (playing) {
        setUserStatus('playing');
        setstatusTitle(`You're in!`);
      } else if (notPlaying) {
        setUserStatus('notPlaying');
        setstatusTitle(`You're out!`);
      } else if (waitlist) {
        setUserStatus('waitlist');
        setstatusTitle('On waitlist');
      } else if (requested) {
        setUserStatus('requested');
        setstatusTitle('Request pending');
      } else if (invited) {
        setUserStatus('invited');
      }

      if (matchPlayers.playing.length >= currentMatch.numOfPlayers) {
        setActionButtonTitle('WL');
      } else {
        setActionButtonTitle('IN');
      }
    }
  }, [matchPlayers]);

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
