import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../features/users/userSlice';
import classes from './profilePhoto.module.scss';
import { useState, useEffect } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../../firebase/clientApp';

export default function ProfilePhoto({ username, userPhoto }) {
  const [photo, setPhoto] = useState();
  const [letterDisplay, setLetterDisplay] = useState();

  useEffect(() => {
    username ? setLetterDisplay(username[0]) : setLetterDisplay('?');
  }, [username]);

  useEffect(() => {
    if (userPhoto) {
      getDownloadURL(ref(storage, userPhoto)).then((url) => setPhoto(url));
    }
  }, [userPhoto]);

  return (
    <div className={classes.imageContainer}>
      {photo ? (
        <div
          className={classes.profilePhoto}
          style={{ backgroundImage: `url('${photo}')` }}
        ></div>
      ) : (
        <p>{letterDisplay}</p>
      )}
    </div>
  );
}
