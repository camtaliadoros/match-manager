import classes from './players.module.scss';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/clientApp';
import { useEffect, useState } from 'react';

export default function Player({ id, status }) {
  const [playerUsername, setPlayerUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  let playerData;

  useEffect(async () => {
    try {
      const q = query(collection(db, 'users'), where('id', '==', id));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        playerData = doc.data();
      });
    } catch (error) {
      setErrorMessage('Something wrong happened.');
    }
  }, []);

  useEffect(() => {
    if (playerData) {
      setPlayerUsername(playerData.username);
    }
  });

  const photoURL = '';
  return (
    <div>
      <div className={classes.profileIcon}>
        <img src={photoURL} />
      </div>
      <p>{playerUsername}</p>
    </div>
  );
}
