import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  playersIsLoading,
  selectPlayers,
} from '../../features/users/playersSlice';
import { selectCurrentUserDetails } from '../../features/users/userSlice';
import ProfilePhoto from '../shared/profilePhoto/ProfilePhoto';
import classes from './players.module.scss';

export default function PlayerDetails({ playerId }) {
  const currentUser = useSelector(selectCurrentUserDetails);
  const playersData = useSelector(selectPlayers);
  const isLoading = useSelector(playersIsLoading);

  const [playerUsername, setPlayerUsername] = useState('');
  const [playerPhoto, setPlayerPhoto] = useState();

  useEffect(() => {
    if (playerId === currentUser.id) {
      setPlayerUsername(currentUser.username);
      setPlayerPhoto(currentUser.photo);
    } else {
      if (playersData[playerId]) {
        const player = playersData[playerId];

        setPlayerUsername(player.username);
        setPlayerPhoto(player.photo);
      }
    }
  }, [isLoading]);

  return (
    <div className={classes.playerProfileWrapper}>
      <div className={classes.profileIcon}>
        <ProfilePhoto username={playerUsername} userPhoto={playerPhoto} />
      </div>
      <p>
        {playerUsername}
        <span className={classes.highlight}>
          {playerId === currentUser.id ? ' - YOU' : null}
        </span>
      </p>
    </div>
  );
}
