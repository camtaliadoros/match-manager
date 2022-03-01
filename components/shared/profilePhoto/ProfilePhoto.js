import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../features/usersSlice';
import classes from './profilePhoto.module.scss';
import { useState, useEffect } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../../firebase/clientApp';

export default function ProfilePhoto({ username, formPhoto }) {
  const user = useSelector(selectCurrentUser);
  const currentPhoto = user.photo;

  const [photo, setPhoto] = useState();
  const [letterDisplay, setLetterDisplay] = useState(
    formPhoto ? formPhoto : null
  );

  useEffect(() => {
    if (user.photo) {
      getDownloadURL(ref(storage, currentPhoto)).then((url) => setPhoto(url));
    }
  }, [user.photo]);

  useEffect(() => {
    username ? setLetterDisplay(username[0]) : setLetterDisplay('?');
  }, [username]);

  useEffect(() => {
    if (formPhoto) {
      setPhoto(formPhoto);
    }
  }, [formPhoto]);

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
