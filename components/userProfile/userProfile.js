import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateUserProfile,
  selectCurrentUser,
} from '../../features/usersSlice';
import classes from './styles/userProfile.module.scss';
import Image from 'next/image';
import { auth } from '../../firebase/AuthState';
import { updateProfile } from 'firebase/auth';

// To Do
// - Connect to database
// - Photo upload functionality
// - Check if username is already taken

export default function UserProfile() {
  const currentUser = useSelector(selectCurrentUser);
  const userPhoto = currentUser.profileDetails.photo;
  const userAddress = currentUser.emailAddress;
  const emailUsername = userAddress.split('@')[0];

  const [username, setUsername] = useState(
    currentUser.profileDetails.displayName
      ? currentUser.profileDetails.displayName
      : emailUsername
  );
  const [imgDisplay, setImgDisplay] = useState(userPhoto);

  useEffect(() => {
    if (!userPhoto) {
      if (username) {
        const initials = username[0];
        setImgDisplay(initials);
      } else {
        setImgDisplay('?');
      }
    }
  }, [userPhoto][username]);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      updateUserProfile({
        username,
        // photo
      })
    );
  };

  return (
    <div className='wrapper'>
      <h1>Create your profile</h1>
      <div className={classes.profilePhoto}>
        {userPhoto ? (
          <Image src={imgDisplay} layout='fill' />
        ) : (
          <p>{imgDisplay}</p>
        )}
      </div>
      <input
        className={classes.fileInput}
        type='file'
        id='avatar'
        name='avatar'
        accept='image/png, image/jpeg'
        onChange={(e) => setImgDisplay(e.target.value)}
      />
      <form onSubmit={handleSubmit}>
        <label htmlFor='display-name'>Username</label>
        <input
          type='text'
          name='display-name'
          id='display-name'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button className='full-width'>Save</button>
      </form>
    </div>
  );
}
