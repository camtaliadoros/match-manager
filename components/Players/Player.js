import classes from './players.module.scss';
import { auth } from '../../firebase/clientApp';
import { useSelector } from 'react-redux';
import { selectPlayers } from '../../features/users/playersSlice';
import { selectCurrentUser } from '../../features/users/userSlice';
import { useEffect, useState } from 'react';

export default function Player({ id, status }) {
  const [playerUsername, setPlayerUsername] = useState('');
  const currentUser = useSelector(selectCurrentUser);
  const playersData = useSelector(selectPlayers);

  useEffect(() => {
    if (id === auth.currentUser.uid) {
      setPlayerUsername(currentUser.username);
    } else {
      const currentPlayer = playersData.id;

      setPlayerUsername(currentPlayer.username);
    }
  }, []);

  return (
    <div>
      <div className={classes.profileIcon}>{/* <img src={photoURL} /> */}</div>
      <p>{playerUsername}</p>
    </div>
  );
}
