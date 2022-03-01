import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../features/usersSlice';
import classes from './profilePhoto.module.scss';
import { useState, useEffect } from 'react';

export default function ProfilePhoto({ username }) {
  const user = useSelector(selectCurrentUser);
  const currentPhoto = user.photo;

  const [photo, setPhoto] = useState();
  const [letterDisplay, setLetterDisplay] = useState(user.username[0]);

  useEffect(() => {
    if (currentPhoto) {
      getDownloadURL(ref(storage, currentPhoto)).then((url) => setPhoto(url));
    }
  }, []);

  useEffect(() => {
    username ? setLetterDisplay(username[0]) : setLetterDisplay('?');
  }, [username]);

  useEffect(() => {
    if (currentPhoto) {
      getDownloadURL(ref(storage, currentPhoto)).then((url) => setPhoto(url));
    }
  }, []);

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
