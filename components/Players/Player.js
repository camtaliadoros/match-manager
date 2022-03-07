import classes from './players.module.scss';
import { auth } from '../../firebase/clientApp';
import { useSelector } from 'react-redux';
import {
  playersIsLoading,
  selectPlayers,
} from '../../features/users/playersSlice';
import { selectCurrentUser } from '../../features/users/userSlice';
import { useEffect, useState } from 'react';
import ProfilePhoto from '../shared/profilePhoto/ProfilePhoto';

export default function Player({ id, status }) {
  const currentUser = useSelector(selectCurrentUser);
  const playersData = useSelector(selectPlayers);
  const isLoading = useSelector(playersIsLoading);

  const [playerUsername, setPlayerUsername] = useState('');
  const [playerPhoto, setPlayerPhoto] = useState();

  useEffect(() => {
    if (id === auth.currentUser.uid) {
      setPlayerUsername(currentUser.username);
    } else {
      if (playersData[id]) {
        const player = playersData[id];

        setPlayerUsername(player.username);
      }
    }
  }, [isLoading]);

  return (
    <div>
      <div className={classes.profileIcon}>
        <ProfilePhoto username={playerUsername} userPhoto={playerPhoto} />
      </div>
      <p>{playerUsername}</p>
    </div>
  );
}
