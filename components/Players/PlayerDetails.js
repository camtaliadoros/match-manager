import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  playersIsLoading,
  selectPlayers,
} from '../../features/users/playersSlice';
import { selectCurrentUser } from '../../features/users/userSlice';
import ProfilePhoto from '../shared/profilePhoto/ProfilePhoto';
import classes from './players.module.scss';

export default function PlayerDetails({ id }) {
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
  }, [id, isLoading]);

  return (
    <div>
      <div className={classes.profileIcon}>
        <ProfilePhoto username={playerUsername} userPhoto={playerPhoto} />
      </div>
      <p>
        {playerUsername}
        {id === currentUser.id ? '- YOU' : null}
      </p>
    </div>
  );
}
