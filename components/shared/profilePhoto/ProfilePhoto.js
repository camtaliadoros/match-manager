import { getDownloadURL, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { storage } from '../../../firebase/clientApp';
import classes from './profilePhoto.module.scss';

export default function ProfilePhoto({ username, userPhoto }) {
  const [photo, setPhoto] = useState();
  const [letterDisplay, setLetterDisplay] = useState();

  useEffect(() => {
    username ? setLetterDisplay(username[0]) : setLetterDisplay('?');
  }, [username]);

  useEffect(() => {
    if (userPhoto) {
      if (userPhoto.includes('profile-photo')) {
        getDownloadURL(ref(storage, userPhoto)).then((url) => setPhoto(url));
      } else {
        setPhoto(userPhoto);
      }
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
        <div>{letterDisplay}</div>
      )}
    </div>
  );
}
